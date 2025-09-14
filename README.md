# RBAC Application

A full-stack Role-Based Access Control (RBAC) application built with React, Node.js, Express, and MongoDB. This application demonstrates user authentication, authorization, and role management with different permission levels.

## 🚀 Features

- **User Authentication**: Secure login/logout with JWT tokens
- **Role-Based Access Control**: Different user roles with specific permissions
- **User Management**: Create, read, update, and delete users
- **Role Management**: Manage roles and their permissions
- **Protected Routes**: Route protection based on user permissions
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Live data updates using Redux

## 🏗️ Architecture

### Frontend
- **React 18** with functional components and hooks
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limit** for API protection
- **Helmet** for security headers

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd rbac-app
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   **Backend Environment** (`backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/rbac-app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=12
   ```

   **Frontend Environment** (`frontend/.env`):
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or start MongoDB service
   brew services start mongodb-community
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

## 🚀 Running the Application

### Development Mode

**Option 1: Run both frontend and backend together**
   ```bash
   npm run dev
   ```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### Production Mode

   ```bash
# Build frontend
npm run build

# Start backend
   npm start
   ```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000 (or 3001)
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## 👥 Demo Accounts

The application comes with pre-configured demo accounts:

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@example.com | Admin123! | Full system access |
| **Editor** | editor@example.com | Editor123! | Read/write users, read roles |
| **Viewer** | viewer@example.com | Viewer123! | Read-only access |
| **Manager** | manager@example.com | Manager123! | Manage users, view roles |

## 🔐 Role Permissions

### Admin
- `user:read`, `user:write`, `user:delete`
- `role:read`, `role:write`, `role:delete`
- `dashboard:read`, `admin:access`

### Editor
- `user:read`, `user:write`
- `role:read`, `dashboard:read`

### Viewer
- `user:read`, `dashboard:read`

### Manager
- `user:read`, `user:write`, `user:delete`
- `role:read`, `dashboard:read`

## 📁 Project Structure

```
rbac-app/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Server entry point
│   ├── .env                 # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── styles/          # CSS files
│   │   └── utils/           # Utility functions
│   ├── .env                 # Environment variables
│   └── package.json
├── .gitignore
├── package.json             # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Helmet**: Security headers for Express.js
- **Input Validation**: Request validation using express-validator

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 📦 Deployment

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment

1. **Build the frontend**
   ```bash
   cd frontend && npm run build
   ```

2. **Set production environment variables**
   ```bash
   # Backend
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   
   # Frontend
   REACT_APP_API_URL=your-production-api-url
   ```

3. **Deploy to your preferred platform**
   - **Backend**: Heroku, DigitalOcean, AWS, etc.
   - **Frontend**: Netlify, Vercel, AWS S3, etc.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port 5000 already in use**
   - The backend will automatically use port 5001
   - Update your frontend `.env` file accordingly

2. **MongoDB connection issues**
   - Ensure MongoDB is running
   - Check your `MONGODB_URI` in the backend `.env` file

3. **CORS errors**
   - Verify the frontend URL is included in the backend CORS configuration
   - Check that both applications are running on the correct ports

4. **Authentication not working**
   - Run `npm run seed` to ensure demo accounts are created
   - Check browser console for any JavaScript errors

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/your-username/rbac-app/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Happy Coding! 🎉**