## Microservices Overview
| Service                  | Port (HTTP) | gRPC Port | Database | Description                |
|--------------------------|-------------|-----------|----------|----------------------------|
| **User Service**         | 5087        | 7083      | MySQL | Management user with keycloak |
| **Post Service**         | 5270        | 5271      | MySQL | Management posts, tags, categories |
| **Notification Service** | 5074        | -         | MySQL | Email and system notifications |
| **Comment Service**      | 5214        | -         | MySQL | Comment of post            |     
| **File Service**         | 5091        | 5001      | MySQL | File management |
| **Gateway.API**          | 5225 | - | - | Gateway API for services |
