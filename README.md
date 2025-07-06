# Genovation AI - Full-Stack Developer Assignment: Task Management System

This repository contains a full-stack Task Management System built as part of the Genovation AI Full-Stack Developer Assignment. The application allows users to manage tasks, with role-based access control for both tasks and user management.

## Table of Contents

- [Features](#features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Setup and Running the Application](#setup-and-running-the-application)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Testing](#testing)
  - [Backend Unit Tests](#backend-unit-tests)
  - [Frontend Testing](#frontend-testing)
- [API Documentation (Swagger)](#api-documentation-swagger)
- [Database Seeding](#database-seeding)
- [Authentication and Roles](#authentication-and-roles)
- [Responsive Design](#responsive-design)
- [Error Handling](#error-handling)
- [Contact](#contact)

## Features

This application implements the following core functionalities:

### User Management (Admin Only)
- **Create User:** Admins can create new user accounts with specified usernames, passwords, and roles (Admin/User).
- **Retrieve User:** View details of a specific user.
- **List All Users:** Admins can view a paginated list of all users in the system.
- **Update User Details:** Admins can modify existing user information (username, password, role).
- **Delete User:** Admins can delete user accounts (with restrictions to prevent deleting core admin or currently logged-in user).

### Task Management
- **Create Task (Admin Only):** Admins can create new tasks, assigning them a title, description, status, and optionally assigning them to a specific user.
- **Retrieve Task:**
    - **Admin:** Can view any task.
    - **Regular User:** Can only view tasks assigned to themselves.
- **Update Task Details:**
    - **Admin:** Can update all fields of any task.
    - **Regular User:** Can only update the `Status` of tasks assigned to them.
- **Delete Task (Admin Only):** Admins can delete tasks.
- **List All Tasks:**
    - **Admin:** Can view and filter all tasks.
    - **Regular User:** Can only view and filter tasks assigned to them.

### Frontend (Angular)
- **User-friendly Dashboard:** Intuitive navigation and layout for task and user management.
- **Form Validation:** Client-side validation for all input fields (e.g., required fields, password min-length).
- **Role-based Navigation:** Sidebar and features are restricted based on the logged-in user's role.
- **Login Form and Authentication:** Secure user authentication using JWT tokens.
- **Responsive Design:** Optimized for various screen sizes (desktop, tablet, mobile).
- **Error Handling:** Meaningful feedback messages for API failures and other issues.
- **HTTP Interceptors:** Automatically attaches authorization tokens to outgoing API requests.

## Technical Stack

### Backend (.NET 7/8)
- **Framework:** ASP.NET Core Web API (e.g., .NET 7.0)
- **Database:** Entity Framework Core with In-Memory Database (for testing/demonstration)
- **Authentication:** JWT Bearer Token Authentication
- **Data Serialization:** Newtonsoft.Json (for JSON Patch support)
- **API Documentation:** Swagger/OpenAPI
- **Dependency Injection:** Built-in .NET Core DI

### Frontend (Angular 18)
- **Framework:** Angular (e.g., Angular 18)
- **Styling:** SCSS (Sass)
- **HTTP Client:** Angular's `HttpClient` for API interaction
- **Routing:** Angular Router
- **State Management:** (Mention if you used Ngrx, RxJS, or simple service-based management)

## Project Structure

The repository is organized into two main folders:

-   `Backend/`: Contains the ASP.NET Core Web API project.
    -   `TaskManagerApi/`: The main API project.
        -   `Controllers/`: API endpoints for Users and Tasks.
        -   `Services/`: Business logic and data operations (e.g., `UserService`, `TaskService`).
        -   `Repositories/`: Abstraction for data access (e.g., `UserRepository`, `TaskRepository`).
        -   `Models/`: DTOs, Enums, and Entity Framework Core entities.
        -   `Guards/`: (If you have custom auth guards)
        -   `Program.cs`: Application entry point, dependency injection, and middleware configuration.
-   `Frontend/`: Contains the Angular application.
    -   `task-manager-app/`: The main Angular project.
        -   `src/app/`: Application source code.
            -   `guards/`: Angular route guards and authentication service.
            -   `models/`: TypeScript interfaces for DTOs and entities.
            -   `pages/`: Angular components for different views (Login, Dashboard, User Management, Task List, Create/Edit Forms).
            -   `services/`: Angular services for API communication.
            -   `interceptors/`: HTTP Interceptors for token handling.
            -   `app-routing.module.ts`: Defines application routes.

## Setup and Running the Application

### Prerequisites

Make sure you have the following installed:

-   [.NET SDK](https://dotnet.microsoft.com/download) (Version X.Y, e.g., .NET 7.0)
-   [Node.js](https://nodejs.org/en/download/) (LTS version, includes npm)
-   [Angular CLI](https://angular.io/cli) (Install globally: `npm install -g @angular/cli`)

### Backend Setup

1.  **Navigate to the Backend Directory:**
    ```bash
    cd Backend/TaskManagerApi
    ```
2.  **Restore Dependencies:**
    ```bash
    dotnet restore
    ```
3.  **Run the Backend API:**
    ```bash
    dotnet run
    ```
    The API will typically start on `https://localhost:7092` (check your `launchSettings.json` for exact ports). Swagger UI will be available at `https://localhost:7092/swagger/index.html`.

### Frontend Setup

1.  **Navigate to the Frontend Directory:**
    ```bash
    cd Frontend/task-manager-app
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run the Angular Application:**
    ```bash
    ng serve -o
    ```
    This will compile the Angular application and open it in your default web browser at `http://localhost:4200`.

## Testing

### Backend Unit Tests

1.  **Navigate to the Test Project Directory:**
    Assuming you have a separate test project (e.g., `Backend/TaskManagerApi.Tests/`).
    ```bash
    cd Backend/TaskManagerApi.Tests/
    ```
2.  **Run Tests:**
    ```bash
    dotnet test
    ```
    (Briefly mention what aspects are covered by unit tests, e.g., "Unit tests cover key service layer methods for user and task business logic, and a controller action for authentication.")

### Frontend Testing

(If you implemented E2E or other specific frontend tests, describe how to run them. Otherwise, state that testing was primarily done manually.)

-   Frontend testing was primarily conducted manually to verify UI functionality, form validations, and role-based access control flows.

## API Documentation (Swagger)

Once the backend API is running, you can access the interactive API documentation at:

-   `https://localhost:70XX/swagger` (Replace `70XX` with your actual HTTPS port, found in `Backend/TaskManagerApi/Properties/launchSettings.json`).

This interface allows you to explore all available endpoints, their request/response schemas, and even send test requests.

## Database Seeding

The application uses an in-memory database and is seeded upon startup with the following data:

-   **Users:**
    -   **Admin User:**
        -   Username: `admin`
        -   Password: `AdminPassword123` (or specify the actual seeded password, min 8 chars)
        -   Role: `Admin`
    -   **Regular User:**
        -   Username: `user`
        -   Password: `UserPassword123` (or specify the actual seeded password, min 8 chars)
        -   Role: `User`
-   **Tasks:**
    -   3 sample tasks with varying statuses (e.g., `Pending`, `InProgress`, `Done`) and assigned to different users (including unassigned).

## Authentication and Roles

-   Users must log in to access the dashboard.
-   **Admin Role:**
    -   Full access to User Management (Create, View, Update, Delete all users).
    -   Full access to Task Management (Create, View, Update, Delete all tasks).
-   **Regular User Role:**
    -   Can only view and update the status of tasks assigned to them.
    -   Cannot access User Management.
-   JWT tokens are used for authentication and authorization.

## Responsive Design

The frontend application is designed to be responsive, adapting its layout and styling for optimal viewing on various devices including desktops, tablets, and mobile phones.

## Error Handling

The application provides user-friendly error messages and feedback for various scenarios, including:

-   API request failures (network issues, server errors).
-   Client-side form validation errors.
-   Unauthorized access attempts.
-   Loading states for data retrieval.

## Contact

Feel free to reach out if you have any questions or feedback.

-   **[Diya Turk]**
-   **[turkdeaa97@gmail.com]**

---
