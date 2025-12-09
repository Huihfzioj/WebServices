# ProjetSOC Docker Setup Guide

## Overview

This Docker setup containerizes all ProjetSOC microservices with the API Gateway acting as the central orchestrator.

### Architecture

```
┌──────────────────────────────────────────┐
│  API Gateway (Port 8086) - Orchestrator  │
│  Routes all traffic to microservices     │
└────────────┬──────────────────────────────┘
             │
    ┌────────┼────────┬──────────────┐
    │        │        │              │
    ▼        ▼        ▼              ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│Admin   │ │Public  │ │Civil   │ │Queue &   │
│Requests│ │Services│ │Registry│ │Update    │
│:8081   │ │:8082   │ │:8084   │ │:8085     │
└────┬───┘ └───┬────┘ └───┬────┘ └────┬─────┘
     │         │          │           │
     ▼         ▼          ▼           ▼
   MySQL    MongoDB     MySQL       Redis
   :3306    :27017      :3306       :6379
```

## Quick Start

### Build and Start All Services

```powershell
docker compose up --build
```

This command will:
1. Build all microservice Docker images
2. Start all infrastructure services (MySQL, MongoDB, Redis)
3. Start all microservices
4. Configure the API Gateway to route traffic

### Access Services

Once running, access services through the Gateway or directly:

| Service | Gateway URL | Direct URL |
|---------|-------------|-----------|
| Admin Requests | `http://localhost:8086/api/requests/**` | `http://localhost:8081` |
| Public Services (GraphQL) | `http://localhost:8086/graphql` | `http://localhost:8082` |
| Civil Registry | `http://localhost:8086/CivilRegistry` | `http://localhost:8084` |
| Queue & Update | `http://localhost:8086/queue/**` | `http://localhost:8085` |
| Swagger UI (Admin) | - | `http://localhost:8081/swagger-ui.html` |

## Services Details

### 1. API Gateway (Port 8086)
- **Type**: Spring Cloud Reactive Gateway
- **Role**: Orchestrator - routes all traffic to microservices
- **Routes**:
  - `/api/requests/**` → AdministrativeRequests (8081)
  - `/graphql` → PublicServices (8082)
  - `/CivilRegistry` → CivilRegistry (8084)
  - `/queue/**` → QueueAndUpdate (8085)

### 2. AdministrativeRequests (Port 8081)
- **Type**: REST API
- **Database**: MySQL (database: `administration`)
- **Features**: Swagger UI, REST endpoints

### 3. PublicServices (Port 8082)
- **Type**: GraphQL Service
- **Database**: MongoDB (database: `public_services_db`)
- **Endpoint**: `/graphql`

### 4. CivilRegistry (Port 8084)
- **Type**: SOAP/Jersey Service
- **Database**: MySQL (database: `civil_registry`)

### 5. QueueAndUpdate (Port 8085)
- **Type**: gRPC Service
- **Cache**: Redis
- **gRPC Port**: 9090
- **Protocols**: HTTP/2, gRPC

### Infrastructure Services

- **MySQL (3306)**: Relational database for REST and SOAP services
- **MongoDB (27017)**: Document database for GraphQL service
- **Redis (6379)**: Cache for gRPC service

## Common Commands

### Start all services
```powershell
docker compose up --build
```

### Start services in background
```powershell
docker compose up --build -d
```

### View logs
```powershell
# All services
docker compose logs -f

# Specific service
docker compose logs -f gateway
docker compose logs -f administrativerequests
```

### Check status
```powershell
docker compose ps
```

### Stop services
```powershell
docker compose down
```

### Stop and remove volumes (WARNING: deletes all data)
```powershell
docker compose down -v
```

### Rebuild specific service
```powershell
docker compose build gateway
```

### Execute command in container
```powershell
docker compose exec gateway /bin/sh
docker compose exec mysql mysql -u root -p0000
```

## Environment Configuration

All services use environment variables for configuration. Key variables:

- `SERVER_PORT`: Service port
- `SPRING_DATASOURCE_URL`: Database connection string
- `SPRING_DATASOURCE_USERNAME`: Database user
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_DATA_MONGODB_URI`: MongoDB connection
- `SPRING_REDIS_HOST`: Redis hostname

See `docker-compose.yml` for complete environment configuration.

## Troubleshooting

### Container fails to start
```powershell
docker compose logs <service_name>
```

### Database connection errors
- Ensure MySQL/MongoDB containers are healthy: `docker compose ps`
- Wait 30+ seconds for databases to fully initialize
- Check connection strings in environment variables

### Gateway routing not working
- Verify all backend services are running: `docker compose ps`
- Check gateway logs: `docker compose logs gateway`
- Ensure service hostnames in routes match container names

### Port conflicts
Modify ports in `docker-compose.yml`:
```yaml
ports:
  - "9086:8086"  # external:internal
```

### Out of memory/storage
- Check Docker Desktop resources (Preferences → Resources)
- Free up disk space
- Prune Docker system: `docker system prune`

## Network

All services communicate via the `projetsoc_network` Docker bridge network:
- Services reach each other by container name (e.g., `mysql:3306`)
- External access uses mapped ports (e.g., `localhost:3306`)

## Production Notes

For production deployment:
1. Use environment files instead of embedding credentials
2. Configure logging centralization (ELK, Splunk)
3. Set up monitoring (Prometheus + Grafana)
4. Use Docker Swarm or Kubernetes for orchestration
5. Add reverse proxy with SSL/TLS (nginx)
6. Configure database backups
7. Set resource limits per container

## File Structure

```
ProjetSOC/
├── docker-compose.yml              # Main compose configuration
├── docker/
│   └── mysql/
│       └── init.sql                # MySQL initialization
├── AdministrativeRequests/
│   └── Dockerfile                  # Build REST service
├── PublicServices/
│   └── Dockerfile                  # Build GraphQL service
├── CivilRegistry/
│   └── Dockerfile                  # Build SOAP service
├── QueueAndUpdate/
│   └── Dockerfile                  # Build gRPC service
└── Gateway/
    └── Dockerfile                  # Build API Gateway
```
