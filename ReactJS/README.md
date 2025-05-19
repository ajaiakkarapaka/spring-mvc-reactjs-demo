# React User Management Frontend

This is a React.js app for user management, designed to work with a Spring Boot backend using HTTP Basic Auth.

## Features
- Login form (username/password, stored in memory)
- User list (GET /api/users)
- Admin-only create, edit, delete user (POST/PUT/DELETE /api/users)
- Clean, modern UI using Material-UI and functional components
- All API calls use HTTP Basic Auth with credentials from the login form

## Setup

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the app:
   ```powershell
   npm run dev
   ```
3. The app will run at [http://localhost:5173](http://localhost:5173) by default.

## Configuration
- The backend API is expected at `http://localhost:8080/api/users`.
- Make sure the Spring Boot backend is running and CORS is enabled for `http://localhost:5173`.

## Usage
- Login as `admin`/`admin123` for full access, or `user`/`user123` for read-only.
- Admins can create, edit, and delete users. Users can only view the user list.
