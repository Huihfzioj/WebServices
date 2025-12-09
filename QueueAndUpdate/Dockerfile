# Use locally available image
FROM admin-requests:latest

WORKDIR /app

# Copy pre-built JAR (should be repackaged by Spring Boot)
COPY QueueAndUpdate/target/QueueAndUpdate-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085 9090
ENTRYPOINT ["java", "-jar", "app.jar"]
