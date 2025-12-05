package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
        System.out.println("\nAPI Gateway is running at http://localhost:8086");
        System.out.println("   - Routing to REST Administrative Requests");
        System.out.println("   - Routing to GraphQL Public Services");
        System.out.println("   - Routing to SOAP Civil Registry");
        System.out.println("gRPC service (Queue & Update) is DIRECT, not behind gateway.\n");
    }
}
