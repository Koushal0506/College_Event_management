# Build Stage
FROM maven:3.8.5-openjdk-17 AS build
ENV MAVEN_OPTS="-Xmx256m -Xms256m"
WORKDIR /app

# Copy the entire project
COPY . .

# Create directory for static resources
RUN mkdir -p backend/src/main/resources/static

# Copy frontend assets to backend resources
RUN cp -r frontend/* backend/src/main/resources/static/

# Build the backend
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# Runtime Stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/backend/target/eventapp-0.0.1-SNAPSHOT.jar app.jar

# Expose port (Render sets PORT env var, Spring Boot picks it up via server.port=${PORT:8080})
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
