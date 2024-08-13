# Secure DL Request System

Secure DL Request System is a full-stack application designed to handle prompt requests to a simulated deep learning model. It is built with a NestJS backend and a Vite-React frontend, using TailwindCSS for styling.

https://github.com/user-attachments/assets/0ad9a2fe-c9b5-47ba-befd-e07bb83973a5


## Table of Contents

- [Project Overview](#project-overview)
- [Backend](#backend)
  - [Technologies Used](#technologies-used)
  - [Core Features](#core-features)
  - [Endpoints](#endpoints)
  - [Detailed documentations](#detailed-documentations)
- [Frontend](#frontend)
  - [Technologies Used](#technologies-used-1)
  - [Demo images](#demo-images)
- [Installation](#installation)
- [Usage](#usage)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Client Request Endpoints](#client-request-endpoints)
  - [Model Request Endpoints](#model-request-endpoints)
- [Docker](#docker)
- [Contributing](#contributing)
- [Author](#author)

## Project Overview

The Secure DL Request System consists of two main components:

1. **Backend**: A NestJS-based server that manages user authentication, prompt request processing, and interaction with a simulated deep learning model.
2. **Frontend**: A Vite-React client that provides a user interface for interacting with the backend services.

## Backend

### Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **SQLite**: A lightweight, disk-based database to store user information and requests.
- **RabbitMQ**: A message broker used for advanced queue management to handle request processing asynchronously.
- **JWT (JSON Web Tokens)**: Used to secure endpoints and manage user authentication.
- **Google OAuth2**: Provides OAuth2 authentication for users who prefer signing in with Google.

### Core Features

- **Advanced Queue Management**: Handles prompt requests efficiently using RabbitMQ.
- **User Management**: Supports user signup, login, and authentication through JWT and Google OAuth2.
- **Prompt Handling**: Processes prompt requests through a simulated deep learning model, managing the queue and storing results.
- **Security**: All endpoints are secured using JWT tokens.
- **Dockerized**: Both the backend and frontend are containerized using Docker, enabling easy deployment and consistent environment setup across different systems.
- **Advanced Logging System**: Implements a structured logging system that records access, errors, info, and debug logs. Logs are automatically zipped daily to optimize storage, with a clear and organized log structure.

### Endpoints

The backend provides several endpoints for user authentication and managing prompt requests.

#### Authentication Endpoints

- **Login using credentials**
  - `POST /v1/auth/login`
- **Google OAuth2 flow**
  - `GET /v1/auth/google`
- **Validate token**
  - `POST /v1/auth/validate`
- **Signup using username and password**
  - `POST /v1/auth/signup`

#### Client Request Endpoints

- **Submit a new request**
  - `POST /v1/requests/submit-request`
- **Get result of a request**
  - `GET /v1/requests/get-result/{requestId}`
- **Get all user's requests**
  - `GET /v1/requests/user-requests`

#### Model Request Endpoints

- **Get next request**
  - `GET /v1/requests/fetch-requests`
- **Submit request result**
  - `POST /v1/requests/submit-result`

### Detailed documentations:

### OpenAPI

##### [SecureDLRequestSystem.openapi.json](https://github.com/user-attachments/files/16592581/SecureDLRequestSystem.openapi.json)

### Swagger

##### [SecureDLRequestSystem.swagger.json](https://github.com/user-attachments/files/16592587/SecureDLRequestSystem.swagger.json)

### Apidog

##### [SecureDLRequestSystem.apidog.json](https://github.com/user-attachments/files/16592591/SecureDLRequestSystem.apidog.json)

## Frontend

### Technologies Used

- **Vite**: A fast build tool and development server for modern web projects.
- **React**: A JavaScript library for building user interfaces.
- **TailwindCSS**: A utility-first CSS framework for styling the frontend.

## Demo images

### Login page

![image](https://github.com/user-attachments/assets/b7654865-58b6-4dad-8c48-9fb74ee642f1)

### Signup page

![image](https://github.com/user-attachments/assets/33fe8c48-7149-4747-928a-dc105d1a43d2)

### Dashboard page

![image](https://github.com/user-attachments/assets/383b4ea0-4e83-4039-9bd1-0379415790f7)

## Installation

To set up the project locally, follow these steps:

### Backend

1. Clone the repository.
2. Navigate to the backend directory.
3. Set .env file:

```
GOOGLE_CLIENT_ID=<google client id>
GOOGLE_CLIENT_SECRET=<google secret>
JWT_SECRET=<strong JWT secret>
RABBITMQ_URL=<rabbitmq url amqp://localhost>
AI_SECRET=<strong secret that both DL and backend have it>
FRONTEND_URL=<client_url>
HTTPS_ENABLED=<true/false>
SSL_KEY_PATH=<key.pm path if https enabled>
SSL_CERT_PATH=<cert.pem path if https enabled>
AVAILABLE_LOGS=error,access,debug,info  #error,access,debug,info
LOGGER_CONSOLE_ENB=true   #true/false to log in the console
LOG_PATH=logs/  #path to save the logs
```

4. Install the dependencies using `npm install`.
5. Start the backend server using `npm run start:dev`.

### Frontend

1. Navigate to the frontend directory.
2. Install the dependencies using `npm install`.
3. Set .env file:

```
VITE_BACKEND_URL=<backend url like http://localhost:3000>
VITE_HTTPS_ENABLED=<true/false>
SSL_KEY_PATH=<key.pm path if https enabled>
SSL_CERT_PATH=<cert.pem path if https enabled>

```

4. Start the frontend server using `npm run dev`.

## Usage

### Authentication Endpoints

- **Login**: Users can log in using their credentials to receive a JWT token.
- **Signup**: Users can create an account using a username, password, and optionally email.
- **Google OAuth2**: Users can log in or sign up using their Google account.

### Client Request Endpoints

- **Submit a Request**: Users can submit a prompt request to the backend.
- **Fetch Results**: Users can retrieve the results of their submitted requests.

### Model Request Endpoints

- **Fetch Next Request**: The simulated deep learning model can fetch the next prompt request from the queue.
- **Submit Result**: After processing a prompt, the model submits the result back to the backend.

## Docker

To simplify deployment and ensure consistency across different environments, the Secure DL Request System is fully containerized. This section explains how to build Docker images for both the backend and frontend, and how to run the entire system using Docker Compose.

### Building Docker Images

First, navigate to the root directory of the project where your Dockerfiles are located.

#### Backend

Build the Docker image for the backend:

```bash
docker build -t secure-dl-backend -f ./backend/Dockerfile .
```

#### Frontend

Build the Docker image for the frontend:

```bash
docker build -t secure-dl-frontend -f ./frontend/Dockerfile .
```

### Running with Docker Compose

To manage both the backend and frontend services together, you can use Docker Compose. Below is the docker-compose.yml configuration file.

```yml
version: "3.8"

services:
  backend:
    image: secure-dl-backend
    ports:
      - "3000:3000"
    volumes:
      - ./backend/db.sqlite:/app/db.sqlite
      - ./secrets:/app/secrets
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - RABBITMQ_URL=${RABBITMQ_URL}
      - AI_SECRET=${AI_SECRET}
      - FRONTEND_URL=http://localhost:4173
      - HTTPS_ENABLED=${HTTPS_ENABLED}
      - SSL_KEY_PATH=${SSL_KEY_PATH}
      - SSL_CERT_PATH=${SSL_CERT_PATH}
      - AVAILABLE_LOGS=${AVAILABLE_LOGS}
      - LOGGER_CONSOLE_ENB=${LOGGER_CONSOLE_ENB}
      - LOG_PATH=/app/logs
    depends_on:
      - rabbitmq

  frontend:
    image: secure-dl-frontend
    ports:
      - "4173:4173"
    environment:
      - VITE_BACKEND_URL=http://localhost:3000
      - VITE_HTTPS_ENABLED=${HTTPS_ENABLED}
      - SSL_KEY_PATH=${SSL_KEY_PATH}
      - SSL_CERT_PATH=${SSL_CERT_PATH}

  rabbitmq:
    image: "rabbitmq:3-management"
    ports:
      - "5672:5672"
      - "15672:15672"
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Author

- [@Nimabht](https://github.com/Nimabht)
