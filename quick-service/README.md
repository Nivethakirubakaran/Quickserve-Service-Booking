# Quick-Service (backend)

This is the backend service for the Quickserve localized booking application.

## Folder structure

- `src/main/java/com/example/quick_service` - application source
  - `model` - JPA entities (`User`, `ServiceItem`)
  - `dto` - request/response DTOs (`SignupRequest`, `LoginRequest`, `ServiceDTO`, `AuthResponse`)
  - `repository` - Spring Data JPA repositories (`UserRepository`, `ServiceRepository`)
  - `service` - business logic services (`UserService`, `ServiceListingService`)
  - `controller` - REST controllers (`AuthController`, `ServiceController`)
  - `config` - Spring configuration (`AppConfig`)

- `src/main/resources` - application properties and static resources
- `pom.xml` - Maven build file

## Setup

Prerequisites
- Java 17+ (project configured for Java 21)
- Maven
- PostgreSQL database with credentials configured in `src/main/resources/application.properties`

Build & Run

```powershell
cd quick-service
./mvnw spring-boot:run
```

If you prefer running from your IDE, import the project as a Maven project and run `QuickServiceApplication`.

Database
- The project uses Spring Data JPA and PostgreSQL. Configure `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` in `src/main/resources/application.properties`.
- The application sets connection timezone via `spring.datasource.hikari.connection-init-sql=SET TIME ZONE 'UTC'` to avoid invalid timezone parameter errors.

## API endpoints

- POST `/api/auth/signup` - body: `{ "name":"...", "email":"...", "password":"..." }` -> returns `{ "token": "...", "expiresAt": "..." }`
- POST `/api/auth/login` - body: `{ "email":"...", "password":"..." }` -> returns auth token
- GET `/api/services/nearby?lat={lat}&lng={lng}&radiusKm={km}` - returns list of nearby services

- Passwordless OTP login:
  - POST `/api/auth/request-otp?email={email}` - requests an OTP (dev: OTP is printed to app logs)
  - POST `/api/auth/verify-otp?email={email}&code={otp}` - verify OTP and receive JWT
- Place-based service search:
  - GET `/api/services/search?place={city|postalCode|name}` - search services by city, postal code, or name/provider
  - GET `/api/services/home` - returns top services for home page

## Swagger / OpenAPI

This project includes Springdoc OpenAPI. When the application is running, the OpenAPI UI (Swagger UI) is available at:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

Notes
- Passwords are hashed with BCrypt. The current simple auth stores a UUID token on the `users` table. For production, replace with JWT and secure token storage.
- The `ServiceRepository` contains a native query to find nearby services using a Haversine formula; ensure your `service_item` table has numeric `latitude` and `longitude` columns.

If you want, I can:
- Add JWT authentication and secure the endpoints
- Add integration tests and sample DB seed data
- Add Docker compose for local Postgres and app
