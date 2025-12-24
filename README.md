
<h1 align=center>Day Note - Todo Application</h1> 

A full-stack Todo application built with **React** (Frontend) and **Spring Boot** (Backend).

## 📋 Overview

Day Note is a modern task management application that allows users to create, view, and complete tasks. The application features a sleek, responsive UI with a gradient theme and provides a seamless user experience for managing daily tasks.

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **TypeScript** - Type-safe JavaScript
- **Vite 7** - Build tool and development server
- **Tailwind CSS 3** - Utility-first CSS framework
- **Vitest** - Testing framework
- **ESLint** - Code linting

### Backend
- **Java 21** - Programming language
- **Spring Boot 4** - Application framework
- **Spring Data JPA** - Data persistence
- **MySQL** - Production database
- **H2** - Test database
- **Lombok** - Boilerplate code reduction
- **ModelMapper** - Object mapping

## 📁 Project Structure

```
Todo/
├── frontend/                    # React Frontend Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   └── TaskCard.tsx     # Task display component
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useTasks.ts      # Task management hook
│   │   ├── services/            # API services
│   │   │   └── api.ts           # Backend API calls
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── task.ts          # Task interface
│   │   ├── __tests__/           # Test files
│   │   ├── App.tsx              # Main application component
│   │   ├── main.tsx             # Application entry point
│   │   └── index.css            # Global styles
│   ├── Dockerfile               # Docker configuration
│   ├── package.json             # Dependencies and scripts
│   ├── vite.config.ts           # Vite configuration
│   ├── tsconfig.json            # TypeScript configuration
│   └── eslint.config.js         # ESLint configuration
│
├── backend/
│   └── backend/                 # Spring Boot Backend Application
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/coveragex/backend/
│       │   │   │   ├── config/          # Configuration classes
│       │   │   │   ├── controller/      # REST controllers
│       │   │   │   │   └── TaskController.java
│       │   │   │   ├── dto/             # Data Transfer Objects
│       │   │   │   ├── entity/          # JPA entities
│       │   │   │   │   └── TaskEntity.java
│       │   │   │   ├── repository/      # Data repositories
│       │   │   │   ├── service/         # Business logic
│       │   │   │   └── Main.java        # Application entry point
│       │   │   └── resources/
│       │   │       └── application.yaml # Application configuration
│       │   └── test/                    # Test files
│       ├── Dockerfile                   # Docker configuration
│       ├── pom.xml                      # Maven dependencies
│       └── target/                      # Build output
│
└── .gitignore                   # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Java 21** (JDK)
- **Maven** (v3.8 or higher)
- **MySQL** (v8.0 or higher)

### Database Setup

1. Install and start MySQL server
2. Create the database (optional - auto-created by app):
   ```sql
   CREATE DATABASE todo;
   ```
3. Default credentials (can be changed via environment variables):
   - **Host:** localhost
   - **Port:** 3306
   - **Username:** root
   - **Password:** 1234

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/backend
   ```

2. Configure database connection (optional):
   
   Set environment variables or modify `application.yaml`:
   ```bash
   # Windows PowerShell
   $env:DB_URL="jdbc:mysql://localhost:3306/todo?createDatabaseIfNotExist=true"
   $env:DB_USERNAME="root"
   $env:DB_PASSWORD="your_password"
   $env:SERVER_PORT="8080"
   ```

3. Build the application:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   
   Or run the JAR directly:
   ```bash
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

The backend server will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure API URL (optional):
   
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 📜 Available Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |

### Backend

| Command | Description |
|---------|-------------|
| `mvn clean install` | Build the project |
| `mvn spring-boot:run` | Run the application |
| `mvn test` | Run tests |
| `mvn package` | Package as JAR |

## 🐳 Docker

### Setup Docker Files

Since Docker files are not included in the repository, you need to create them first.

#### 1. Create Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
```

#### 2. Create Backend Dockerfile

Create `backend/backend/Dockerfile`:
```dockerfile
FROM eclipse-temurin:21-jdk

COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
```

> **Note:** Before building the backend Docker image, you need to build the JAR file first:
> ```bash
> cd backend/backend
> mvn clean package -DskipTests
> ```

### Using Docker Compose (Recommended)

The easiest way to run the entire application stack is using Docker Compose. This will start MySQL, Backend, and Frontend services together.

1. Make sure Docker and Docker Compose are installed on your system

2. Create a `docker-compose.yml` file in the project root directory:
   ```yaml
   version: "3.8"

   services:
     mysql:
       image: mysql:8
       container_name: mysql_db
       environment:
         MYSQL_ROOT_PASSWORD: 1234
         MYSQL_DATABASE: todo_app
         MYSQL_USER: user  
         MYSQL_PASSWORD: 1234
       ports:
         - "3307:3306"

     backend:
       build: 
         context: ./backend/backend
         dockerfile: Dockerfile
       container_name: backend
       ports:
         - "8080:8080"
       depends_on:
         - mysql

     frontend:
       build: ./frontend
       container_name: frontend
       ports:
         - "5173:5173"
       depends_on:
         - backend
   ```

3. Run the application:
   ```bash
   docker-compose up --build
   ```

4. To run in detached mode (background):
   ```bash
   docker-compose up -d --build
   ```

5. Access the application:
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:8080
   - **MySQL:** localhost:3306

6. To stop all services:
   ```bash
   docker-compose down
   ```

7. To stop and remove all data (including database):
   ```bash
   docker-compose down -v
   ```

### Docker Compose Services

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| `mysql` | mysql_db | 3306 | MySQL 8 Database |
| `backend` | backend | 8080 | Spring Boot API |
| `frontend` | frontend | 5173 | React Application |

### Running Individual Containers

If you prefer to run containers individually:

#### Frontend
```bash
cd frontend
docker build -t todo-frontend .
docker run -p 5173:5173 todo-frontend
```

#### Backend
```bash
cd backend/backend
docker build -t todo-backend .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:mysql://host.docker.internal:3306/todo \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=1234 \
  todo-backend
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get latest 5 tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/{id}` | Mark task as completed |

### Request/Response Examples

**Create Task:**
```json
POST /api/tasks
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "createdAt": "2025-12-10T10:30:00"
}
```

## ✨ Features

- ✅ Create new tasks with title and description
- ✅ View latest 5 tasks
- ✅ Mark tasks as completed
- ✅ Responsive design with modern UI
- ✅ Real-time error handling
- ✅ Loading states

## 🔧 Configuration

### Backend Configuration (`application.yaml`)

Create or update `backend/backend/src/main/resources/application.yaml` with:

```yaml
server:
   port: ${SERVER_PORT:8080}

spring:
   datasource:
      url: ${DB_URL:jdbc:mysql://localhost:3306/todo?createDatabaseIfNotExist=true}
      username: ${DB_USERNAME:root}
      password: ${DB_PASSWORD:1234}
      driver-class-name: com.mysql.cj.jdbc.Driver

   jpa:
      hibernate:
         ddl-auto: update
      show-sql: true
```

- For local MySQL, keep `DB_URL` as `jdbc:mysql://localhost:3306/todo?createDatabaseIfNotExist=true`.
- For Docker Compose, set `DB_URL` to `jdbc:mysql://mysql:3306/todo?createDatabaseIfNotExist=true` (uses the service name `mysql`).

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | 8080 | Server port |
| `DB_URL` | jdbc:mysql://localhost:3306/todo | Database URL |
| `DB_USERNAME` | root | Database username |
| `DB_PASSWORD` | 1234 | Database password |

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:8080/api | Backend API URL |

## 📝 License

This project is private and not licensed for public use.

## 👥 Author

- **SandaruwanWeerawardhana** - [GitHub](https://github.com/SandaruwanWeerawardhana)
