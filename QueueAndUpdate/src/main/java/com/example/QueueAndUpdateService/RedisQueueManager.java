package com.example.QueueAndUpdateService;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.*;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.*;
import java.util.stream.IntStream;

@Component
public class RedisQueueManager {

    private final StringRedisTemplate stringRedis;
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper mapper = new ObjectMapper();

    public RedisQueueManager(RedisConnectionFactory redisConnectionFactory) {
        this.stringRedis = new StringRedisTemplate(redisConnectionFactory);
        this.redisTemplate = new RedisTemplate<>();
        this.redisTemplate.setConnectionFactory(redisConnectionFactory);
        this.redisTemplate.afterPropertiesSet();
    }

    private String queueKey(String serviceId, String locationId) {
        return String.format("queue:%s:%s", serviceId, locationId);
    }

    private String positionsKey(String serviceId, String locationId) {
        return String.format("queue:%s:%s:positions", serviceId, locationId);
    }

    private String statsKey(String serviceId, String locationId) {
        return String.format("queue:%s:%s:stats", serviceId, locationId);
    }

    private String channelName(String serviceId, String locationId) {
        return String.format("channel:queue-updates:%s:%s", serviceId, locationId);
    }

    // Enqueue user and return their position (1-based)
    public synchronized int joinQueue(String serviceId, String locationId, String userId) {
        String qKey = queueKey(serviceId, locationId);
        ListOperations<String, String> listOps = stringRedis.opsForList();

        // avoid duplicates: if user already in queue, return their position
        String positionsKey = positionsKey(serviceId, locationId);
        String existing = stringRedis.opsForHash().get(positionsKey, userId) == null ? null : stringRedis.opsForHash().get(positionsKey, userId).toString();
        if (existing != null) {
            try { return Integer.parseInt(existing); } catch (NumberFormatException ignored) {}
        }

        listOps.rightPush(qKey, userId); // RPUSH -> end of queue

        // recompute positions and stats
        recomputePositionsAndStats(serviceId, locationId);

        // publish update
        publishEvent(serviceId, locationId, userId, "joined", "User joined the queue");
        // return new position
        int pos = getPosition(serviceId, locationId, userId);
        return pos;
    }

    // Remove user from queue (cancellation). returns true if removed
    public synchronized boolean leaveQueue(String serviceId, String locationId, String userId) {
        String qKey = queueKey(serviceId, locationId);
        ListOperations<String, String> listOps = stringRedis.opsForList();

        // LREM count=0 removes all occurrences
        Long removed = listOps.remove(qKey, 0, userId);
        if (removed != null && removed > 0) {
            recomputePositionsAndStats(serviceId, locationId);
            publishEvent(serviceId, locationId, userId, "left", "User left/cancelled queue");
            return true;
        }
        return false;
    }

    // Serve next person (pop from front)
    public synchronized Optional<String> serveNext(String serviceId, String locationId) {
        String qKey = queueKey(serviceId, locationId);
        ListOperations<String, String> listOps = stringRedis.opsForList();
        String served = listOps.leftPop(qKey); // LPOP -> served
        if (served != null) {
            recomputePositionsAndStats(serviceId, locationId);
            publishEvent(serviceId, locationId, served, "served", "User served and removed from queue");
            return Optional.of(served);
        }
        return Optional.empty();
    }

    // Get user's 1-based position. Returns -1 if not in queue.
    public int getPosition(String serviceId, String locationId, String userId) {
        String posKey = positionsKey(serviceId, locationId);
        Object o = stringRedis.opsForHash().get(posKey, userId);
        if (o != null) {
            try { return Integer.parseInt(o.toString()); } catch (NumberFormatException ignored) {}
        }
        // fallback: scan list (O(n)) - rarely happens since we maintain hash
        List<String> all = stringRedis.opsForList().range(queueKey(serviceId, locationId), 0, -1);
        if (all != null) {
            int idx = all.indexOf(userId);
            return idx >= 0 ? idx + 1 : -1;
        }
        return -1;
    }

    public Map<String, String> getStats(String serviceId, String locationId) {
        Map<String, String> stats = new HashMap<>();
        HashOperations<String, String, String> hashOps = stringRedis.opsForHash();

        String statsKey = statsKey(serviceId, locationId);
        Map<String, String> m = hashOps.entries(statsKey);
        if (m != null) stats.putAll(m);
        // ensure waiting count is authoritative
        Long waiting = stringRedis.opsForList().size(queueKey(serviceId, locationId));
        stats.put("waiting", waiting == null ? "0" : waiting.toString());
        stats.putIfAbsent("currentServing", "");
        stats.putIfAbsent("estimatedWaitSeconds", "0");
        stats.put("lastUpdate", Instant.now().toString());
        return stats;
    }

    // recompute positions hash and stats hash
    private void recomputePositionsAndStats(String serviceId, String locationId) {
        String qKey = queueKey(serviceId, locationId);
        String positionsKey = positionsKey(serviceId, locationId);
        String statsKey = statsKey(serviceId, locationId);

        List<String> list = stringRedis.opsForList().range(qKey, 0, -1);
        HashOperations<String, Object, Object> hashOps = redisTemplate.opsForHash();

        // Clear positions hash
        stringRedis.delete(positionsKey);
        if (list != null && !list.isEmpty()) {
            IntStream.range(0, list.size()).forEach(i -> {
                String uid = list.get(i);
                stringRedis.opsForHash().put(positionsKey, uid, String.valueOf(i + 1));
            });

            // current serving is first element
            String currentServing = list.get(0);
            Map<String, String> stats = new HashMap<>();
            stats.put("waiting", String.valueOf(list.size()));
            stats.put("currentServing", currentServing);
            // crude estimate: assume averageServiceSeconds (could be per-service metric)
            int avgSecondsPerPerson = 600; // default 10 minutes - you can make this dynamic
            stats.put("estimatedWaitSeconds", String.valueOf((list.size() - 1) * avgSecondsPerPerson));
            stats.put("lastUpdate", Instant.now().toString());
            // set stats hash
            stringRedis.delete(statsKey);
            stringRedis.opsForHash().putAll(statsKey, stats);
        } else {
            // empty queue
            stringRedis.delete(statsKey);
            stringRedis.opsForHash().put(statsKey, "waiting", "0");
            stringRedis.opsForHash().put(statsKey, "currentServing", "");
            stringRedis.opsForHash().put(statsKey, "estimatedWaitSeconds", "0");
            stringRedis.opsForHash().put(statsKey, "lastUpdate", Instant.now().toString());
        }
    }

    // publish a JSON message on channel
    private void publishEvent(String serviceId, String locationId, String userId, String event, String detail) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("serviceId", serviceId);
        payload.put("locationId", locationId);
        payload.put("userId", userId);
        payload.put("event", event);
        payload.put("detail", detail);
        payload.put("updatedAt", Instant.now().toString());
        payload.put("position", getPosition(serviceId, locationId, userId));
        payload.put("waiting", Optional.ofNullable(stringRedis.opsForList().size(queueKey(serviceId, locationId))).orElse(0L));

        try {
            String body = mapper.writeValueAsString(payload);
            stringRedis.convertAndSend(channelName(serviceId, locationId), body);
        } catch (JsonProcessingException e) {
            // log and ignore publish failure
            e.printStackTrace();
        }
    }

}

