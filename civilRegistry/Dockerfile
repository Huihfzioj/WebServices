# Use locally available image
FROM admin-requests:latest

WORKDIR /app

# Copy pre-built JAR (should be repackaged by Spring Boot)
COPY civilRegistry/target/CivilRegistry-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8084
EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"]
