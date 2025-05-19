**USERMANAGEMENT Spring Boot App**

### Backend Setup (Spring Boot)

1. Create a MySQL database:
   ```sql
   CREATE DATABASE employmentdb;
   ```

2. Update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/employmentdb
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

3. Build and run the Spring Boot application:
   ```powershell
   cd SpringMVC
   ./mvnw.cmd clean install
   ./mvnw.cmd spring-boot:run
   ```

   The backend will start at http://localhost:8080

### Frontend Setup (React)

1. Install dependencies:
   ```powershell
   cd ReactJS
   npm install
   ```

2. Start the development server:
   ```powershell
   npm run dev
   ```

   The frontend will start at http://localhost:5173

## Using the Application

### Default Users
- **Admin**: `admin` / `admin123` (role: ADMIN)
- **User**: `user` / `user123` (role: USER)

### Role-Based Access
- Admin users can perform all operations (create, read, update, delete)
- Regular users can only view their own user details

## API Documentation

All endpoints require HTTP Basic Authentication. Replace `<credentials>` with Base64 encoded `username:password`.

### 1. List All Users (Admin Only)
```powershell
# Get all users
curl -Uri http://localhost:8080/api/users `
     -Method GET `
     -Headers @{ 
         "Authorization" = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('admin:admin123')))"
     }
```

### 2. Get Current User (Any Authenticated User)
```powershell
# Get current user details
curl -Uri http://localhost:8080/api/users/me `
     -Method GET `
     -Headers @{ 
         "Authorization" = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('user:user123')))"
     }
```

### 3. Create User (Admin Only)
```powershell
# Create a new user
curl -Uri http://localhost:8080/api/users `
     -Method POST `
     -Headers @{
         "Authorization" = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('admin:admin123')))"
         "Content-Type" = "application/json"
     } `
     -Body '{
         "username": "newuser",
         "password": "password123",
         "role": "USER"
     }'
```

### 4. Update User (Admin Only)
```powershell
# Update user with ID 2
curl -Uri http://localhost:8080/api/users/2 `
     -Method PUT `
     -Headers @{
         "Authorization" = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('admin:admin123')))"
         "Content-Type" = "application/json"
     } `
     -Body '{
         "username": "updateduser",
         "password": "newpassword123",
         "role": "USER"
     }'
```

### 5. Delete User (Admin Only)
```powershell
# Delete user with ID 2
curl -Uri http://localhost:8080/api/users/2 `
     -Method DELETE `
     -Headers @{
         "Authorization" = "Basic $([Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes('admin:admin123')))"
     }
```

## React Frontend Features

1. **Login Page**
   - Login form with username/password
   - Error handling for invalid credentials

2. **User List (Admin View)**
   - Table of all users
   - Create, edit, and delete buttons
   - Role-based access control

3. **User Management**
   - Create new users
   - Edit existing users
   - Delete users
   - Role assignment

## Security Features

- HTTP Basic Authentication
- Role-based access control (ADMIN/USER)
- CORS configuration for frontend
- Stateless session management
- Protected API endpoints

## Troubleshooting

1. If the backend fails to start:
   - Verify MySQL is running
   - Check database credentials
   - Ensure port 8080 is available

2. If the frontend fails to start:
   - Verify Node.js is installed
   - Check for port conflicts on 5173
   - Run `npm install` to update dependencies

## License
MIT
