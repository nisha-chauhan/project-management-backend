# Project Management Tool - Backend API

## 🚀 Overview

This repository contains the backend API for a simple yet powerful project management tool built with **Node.js**, **Express.js**, and **MongoDB**.  
It provides secure user authentication, comprehensive project and task management with CRUD operations, task filtering, and a seed script for quick database setup.

---

## ✨ Features

- **User Authentication** with JWT and secure password hashing (bcryptjs)
- **Project Management:** Create, update, delete, and list projects
- Projects include: `title`, `description`, and `status` (`active` | `completed`)
- **Task Management:** Full CRUD for tasks linked to projects
- Tasks include: `title`, `description`, `status` (`todo` | `in-progress` | `done`), and `dueDate`
- Filter tasks by status for efficient tracking
- Pagination and search support on project listings
- Seed script to quickly populate the database with sample data (user, projects, tasks)
- Robust error handling middleware

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js v16 or higher
- MongoDB (local installation or cloud service like MongoDB Atlas)
- Git

---

### Backend Setup

1. **Clone the repository:**

   ```bash
   git clone git@github.com:nisha-chauhan/project-management-backend.git
   cd project-management-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file from the example template:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your configuration (example):

   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/pm_db
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   ```

4. **Run the seed script** to populate the database with sample data:

   ```bash
   npm run seed
   ```

   This creates:

   - User: `test@example.com` / `Test@123`
   - 2 sample projects
   - 3 tasks per project

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   The API will be accessible at [http://localhost:4000](http://localhost:4000).

---

## 📚 API Endpoints

### User Register and Login

| Method | Endpoint             | Description       | Request Body          |
| ------ | -------------------- | ----------------- | --------------------- |
| POST   | `/api/auth/register` | Register new user | `{ email, password }` |
| POST   | `/api/auth/login`    | User login        | `{ email, password }` |

### Projects (Authentication Required - Bearer Token)

| Method | Endpoint               | Description                                                        | Request Body                     |
| ------ | ---------------------- | ------------------------------------------------------------------ | -------------------------------- |
| GET    | `/api/projects`        | List projects (supports pagination and search: `?page=&limit=&q=`) | N/A                              |
| POST   | `/api/projects/create` | Create a new project                                               | `{ title, description, status }` |
| GET    | `/api/projects/:id`    | Get project details including tasks                                | N/A                              |
| PUT    | `/api/projects/:id`    | Update an existing project                                         | Partial project fields           |
| DELETE | `/api/projects/:id`    | Delete a project and all its tasks                                 | N/A                              |

### Tasks (Authentication Required - Bearer Token)

| Method | Endpoint                        | Description                                            | Request Body                                         |
| ------ | ------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| POST   | `/api/tasks/create`             | Create a task                                          | `{ projectId, title, description, status, dueDate }` |
| GET    | `/api/tasks/project/:projectId` | List tasks for a project (optional filter: `?status=`) | N/A                                                  |
| PUT    | `/api/tasks/:id`                | Update a task                                          | Partial task fields                                  |
| DELETE | `/api/tasks/:id`                | Delete a task                                          | N/A                                                  |

---

## ⚙️ Running the Seed Script

To quickly seed the database with test data, run:

```bash
npm run seed
```
