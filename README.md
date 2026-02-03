# Auth CRUD App 🚀

A full-stack authentication and task management application built with Node.js/Express backend and Next.js frontend. Features user authentication, role-based access control (admin & user roles), and a complete task CRUD system.

## What This Project Does

This is basically a task management app where:
- Users can **register** and **login** with a password
- Users can **create, read, update, and delete** their own tasks
- **Admins** have special powers: they can see ALL tasks from all users, delete any task, and assign tasks to other users
- Everything is secured with **JWT tokens** so only logged-in users can access their stuff

Think of it like a shared task board where admins are the managers 👨‍💼

---

## Tech Stack

### Backend
- **Node.js** with **Express.js** - the server framework
- **MongoDB** - the database where we store users and tasks
- **Mongoose** - makes working with MongoDB easier
- **JWT (jsonwebtoken)** - for secure authentication tokens
- **bcrypt** - for hashing passwords so they're actually safe
- **Swagger UI** - interactive API documentation
- **dotenv** - for managing environment variables

### Frontend
- **Next.js 16.1.6** - React framework for the UI
- **React 19.2.3** - building the components
- Client-side routing and form handling

---

## Getting Started

### Prerequisites
Before you start, make sure you have:
- **Node.js** installed (v16 or higher)
- **MongoDB** running locally on `mongodb://localhost:27017`
- A code editor (VS Code is cool)

### Installation

1. **Clone the repo** (or extract the project folder)
```bash
cd auth-crud-app
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Create a `.env` file in the backend folder** with these values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth_crud_app
JWT_SECRET=supersecret123
JWT_EXPIRES_IN=1d
ADMIN_SECRET=password123
```

4. **Start the backend server**
```bash
npm run dev
```
The backend will run on `http://localhost:5000`

5. **In a NEW terminal, go to the frontend folder**
```bash
cd frontend
npm install
```

6. **Start the frontend dev server**
```bash
npm run dev
```
The frontend will run on `http://localhost:3001`

---

## How to Use It

⚠️ **IMPORTANT**: This app only runs on your local computer - it's not deployed online. To test it, you need to:
1. Start the backend server (`npm run dev` in the backend folder)
2. Start the frontend server (`npm run dev` in the frontend folder)
3. Then visit `http://localhost:3001` in your browser

Anyone who wants to test this app needs to do the same setup on their machine.

### 1. **Register a New User**
- Go to `http://localhost:3001`
- Click "Register User"
- Fill in your name, email, and password
- You'll get logged in automatically

### 2. **Create a Task**
- After login, you'll see the dashboard
- Fill in task title and optional description
- Click "Add Task"
- Your task appears in the list

### 3. **Manage Your Tasks**
- Change status from "Pending" to "Completed" using the dropdown
- Tasks show when they were created and your name

### 4. **Register as an Admin** (For Testing)
- Go to `http://localhost:3001`
- Click "Register Admin"
- Use admin secret: `password123`
- Fill in your details and submit
- Now you have admin powers! 

### 5. **Admin Features**
As an admin, you can:
- **See all tasks** from all users (not just yours)
- **See who created each task** with their email and date
- **Delete any task** (regular users can't delete)
- **Create tasks for other users** by selecting them from the dropdown when creating a task
- **Create tasks for yourself** if you don't select a user

---

## API Documentation

All our API endpoints are documented with **Swagger UI**. Super helpful for testing!

### Access Swagger Docs
Open your browser and go to:
```
http://localhost:5000/api-docs
```

You'll see an interactive dashboard where you can:
- See all available endpoints
- Read what each endpoint does
- Test them directly in your browser
- See example requests and responses

### Main Endpoints Overview

**Authentication:**
- `POST /api/v1/auth/register` - Create a regular user account
- `POST /api/v1/auth/register-admin` - Create an admin account (needs secret)
- `POST /api/v1/auth/login` - Login and get JWT token
- `GET /api/v1/auth/users` - Get list of all users (admin only)

**Tasks:**
- `GET /api/v1/tasks` - Get your tasks (admins see all)
- `GET /api/v1/tasks/:id` - Get a specific task
- `POST /api/v1/tasks` - Create a new task
- `PUT /api/v1/tasks/:id` - Update a task's status
- `DELETE /api/v1/tasks/:id` - Delete a task (admin only)

### How Authentication Works

1. When you **login**, the server gives you a **JWT token** (a long encoded string)
2. The frontend saves this token in localStorage
3. Every API request includes this token in the `Authorization` header
4. The server checks the token to make sure it's you
5. If the token is invalid or expired, you get kicked back to login

Tokens last for **1 day** before they expire.

---

## Project Structure

```
auth-crud-app/
├── backend/                          # Express.js server
│   ├── src/
│   │   ├── app.js                   # Main app setup
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login, register, admin logic
│   │   │   └── taskController.js    # Task CRUD operations
│   │   ├── middleware/
│   │   │   └── authMiddleware.js    # JWT verification & role checks
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── Task.js              # Task schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   └── taskRoutes.js        # Task endpoints
│   │   └── utils/
│   │       └── db.js                # MongoDB connection
│   ├── .env                         # Environment variables (create this!)
│   └── package.json
│
├── frontend/                         # Next.js React app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.js              # Home page
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── admin-register/
│   │   │   └── dashboard/           # Main task management page
│   │   └── lib/
│   │       ├── api.js               # API client helper
│   │       └── auth.js              # Token management
│   └── package.json
│
└── README.md                         # This file!
```

---

## Role-Based Access Control

### Regular User 👤
- Register with email and password
- Create tasks (assigned to themselves)
- See only their own tasks
- Update their own task status
- Can't delete tasks
- Can't see other users' tasks

### Admin 
- Register with secret key (`password123`)
- See ALL tasks from ALL users
- See task creator information (name, email, creation date)
- Delete any task
- Create tasks for themselves
- Create tasks and assign them to other users
- Update any task status

The role checking happens in the backend with **middleware** - basically a bouncer that stops unauthorized requests.

---

## Troubleshooting

### "MongoDB connection failed"
- Make sure MongoDB is running
- Check if connection string in `.env` is correct
- Default: `mongodb://localhost:27017/auth_crud_app`

### "Cannot POST /api/v1/tasks"
- Make sure backend is running on port 5000
- Check that your JWT token is valid (maybe it expired?)
- Login again to get a fresh token

### "Token not found"
- Your localStorage was cleared
- You need to login again
- Tokens last 1 day, so login again after that

### "Admin secret is wrong"
- The secret is `password123`
- Make sure you typed it exactly right
- Check your `.env` file has the right value

### Frontend not connecting to backend
- Make sure backend is running (`npm run dev` in backend folder)
- Check the API calls in `frontend/src/lib/api.js`
- Check browser console for network errors

---

## Testing the Features

### Quick Test Flow:
1. **Start both servers** (backend on 5000, frontend on 3001)
2. **Register as a regular user**
   - Name: John, Email: john@example.com, Password: password123
3. **Login and create a task**
   - Title: "Buy groceries"
4. **In a new browser/incognito tab, register as admin**
   - Use secret: `password123`
5. **Login as admin and check dashboard**
   - You should see John's task!
   - You can delete it or create a task for John

---

## Scalability Notes

Want to know how this would work if millions of people used it? Check out **SCALABILITY.md** for details on:
- Database scaling strategies
- Caching with Redis
- Load balancing
- Microservices architecture
- And more!

---

## Future Improvements

If I were to keep building this (and I might!):
- Add email verification for signup
- Add password reset functionality
- Add task categories/tags
- Add due dates and reminders
- Add task comments/collaboration
- Add UI improvements and better styling
- Add unit and integration tests
- Add task filtering and search
- Add pagination for large task lists

---

## Security Notes

### How Passwords Actually Work
You might be wondering: "Wait, we're sending passwords to the server?" Yeah, we are - and that's totally normal and necessary. Here's why it's secure:

- When you **register**: Your password gets sent to the server → it's immediately hashed with bcrypt (basically scrambled in a one-way way) → only the hash is stored in the database, never the real password
- When you **login**: Your password gets sent → the server compares it against the stored hash using `bcrypt.compare()` → if it matches, you're in
- This means even if hackers get into the database, they only see useless hashes, not actual passwords
- In production, we'd use HTTPS to encrypt the password during transmission too, for extra protection

### Everything Else
- **JWT tokens** are signed with a secret and expire after 1 day
- **Admin secret** should be kept safe - definitely change `password123` in production!
- **CORS** is enabled so the frontend can talk to the backend
- Environment variables keep sensitive stuff like secrets and database URLs out of the code

---

## Questions?

If something doesn't work or doesn't make sense:
1. Check the Swagger docs at `http://localhost:5000/api-docs`
2. Look at the browser console for error messages
3. Check terminal logs where the servers are running
4. Read the code comments (they're actually helpful!)

---



