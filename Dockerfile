FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY . .

# 👉 Rendi eseguibile lo script mvnw
RUN chmod +x mvnw

# 👉 Ora puoi eseguire il comando
RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/gestione.scuola-0.0.1-SNAPSHOT.jar"]
