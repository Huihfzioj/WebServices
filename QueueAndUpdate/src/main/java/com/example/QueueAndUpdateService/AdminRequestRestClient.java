package com.example.QueueAndUpdateService;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class AdminRequestRestClient {

    private final WebClient webClient;

    public AdminRequestRestClient(WebClient.Builder builder) {
        this.webClient = builder.baseUrl("http://localhost:8081/api/requests").build();
    }

    public AdminRequestStatusDTO getRequestById(Long requestId) {
        return webClient.get()
                .uri("/{id}/status-summary", requestId)
                .retrieve()
                .bodyToMono(AdminRequestStatusDTO.class)
                .block();
    }
}

