# Job Application System

A comprehensive system for managing job applications, featuring a frontend client built with React, a backend server, and a database managed via phpMyAdmin.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Using Makefile](#using-makefile)
- [Apps](#apps)
- [License](#license)

## Project Overview

The Job Application System is designed to streamline the process of handling job applications. It includes a frontend client, backend server, and database management with phpMyAdmin.

## Features

- **Frontend**: Built with React, Ant Design, and Vite for fast development and modern UI.
- **Backend**: Handles API requests for job positions, application management, and user authentication.
- **Database**: Managed with phpMyAdmin and Docker.
- **Proxy Support**: Configured for seamless interaction between frontend and backend services.

## Tech Stack

- **Frontend**:
  - React
  - Ant Design
  - Vite
  - Redux (for state management)
- **Backend**:
  - Node.js
  - Express
- **Database**: MySQL (managed via phpMyAdmin)
- **DevOps**:
  - Docker
  - Docker Compose
- **Additional Tools**:
  - phpMyAdmin (for database management)

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16.x or higher)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Cloning the Repository

```bash
git clone https://github.com/yourusername/job-application-system.git
cd job-application-system
```
## Using Makefile

The Makefile simplifies the process of building and running the entire project. Use the following commands:

1. **Build and start the project**:

   ```bash
   cd client
   ```
   ```bash
   npm install
   ```
   ```bash
   cd ..
   ```
   ```bash
   cd server
   ```
   ```bash
   npm install
   ```
   ```bash
   make dev-first-run
   ```
   This command installs package dependencies for the server and client, then builds and starts the server, client, phpMyAdmin, and the database. It sets up all necessary services and configurations for development.


2. **Start the project (after the first run)**:

   ```bash
   make dev-run
   ```
   This command starts the server and client without rebuilding the entire setup. Use this for subsequent runs after the initial setup.

3. **Stop the project**:

   ```bash
   make stop
   ```
   This command stops all running services without removing the containers.

4. **Clean**:
   ```bash
   make clean
   ```
  This command removes all containers, networks, and volumes associated with the project.


## Apps

    Frontend:
        - Host: http://localhost:3000
        - Admin User
          - Username: admin
          - Password: password
        - Editor User
          - Username: editor
          - Password: password
        - Viewer User
          - Username: viewer
          - Password: password
    Note: you can create new user and password using bycrpyt generator.

    Backend:
        - Host: http://localhost:5000

    MySQL:
        - Host:
            - Docker: database (check docker-compose.yml)
            - Host Machine: http://localhost:3306
        - Username: root
        - Password: password
        - Port: 3306
        - Database: job_application_system
        - User Database: user

    PhpMyAdmin:
        - Host: http://localhost:8080
        - Username: user
        - Password: password

## License

Copyright © 2024 Selin Sezer. All rights reserved.
