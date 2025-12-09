# Use locally available image
FROM admin-requests:latest

WORKDIR /app

# Copy pre-built JAR (should be repackaged by Spring Boot)
COPY AdministrativeRequests/target/AdministrativeRequests-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
