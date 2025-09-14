# RBAC Application Documentation

## Overview

This directory contains comprehensive documentation for the RBAC (Role-Based Access Control) application. The documentation covers all aspects of the application including architecture, components, API, deployment, and testing.

## Documentation Structure

### 📋 Core Documentation

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)**
   - System architecture overview
   - Technology stack details
   - Component relationships
   - Security architecture
   - Scalability considerations

2. **[DATA_FLOW.md](./DATA_FLOW.md)**
   - Authentication flow diagrams
   - Authorization flow patterns
   - CRUD operations flow
   - State management flow
   - Error handling flow

3. **[COMPONENTS.md](./COMPONENTS.md)**
   - Frontend component documentation
   - Backend module documentation
   - Data model specifications
   - Service layer documentation
   - Utility function documentation

4. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**
   - Complete API endpoint reference
   - Request/response examples
   - Authentication requirements
   - Error codes and handling
   - Rate limiting information

### 🚀 Deployment & Operations

5. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**
   - Development environment setup
   - Production deployment strategies
   - Docker containerization
   - Cloud platform deployment
   - Security configuration
   - Monitoring and logging

6. **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**
   - Testing strategy and pyramid
   - Unit testing examples
   - Integration testing
   - End-to-end testing
   - Security testing
   - Performance testing
   - Test automation

## Quick Start

### For Developers
1. Start with [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design
2. Review [COMPONENTS.md](./COMPONENTS.md) for detailed component information
3. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API usage
4. Follow [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing implementation

### For DevOps/Deployment
1. Begin with [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment instructions
2. Review security configurations in the deployment guide
3. Set up monitoring and logging as described

### For API Integration
1. Start with [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. Review authentication flow in [DATA_FLOW.md](./DATA_FLOW.md)
3. Check error handling patterns

## Application Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Permission-based route protection
- Secure password hashing

### 👥 User Management
- User CRUD operations
- Role assignment
- User status management
- Profile management

### 🛡️ Role Management
- Role creation and editing
- Permission assignment
- Role hierarchy
- Usage tracking

### 📊 Dashboard & Analytics
- User statistics
- Role distribution
- System overview
- Activity monitoring

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Security headers
- Input validation
- Role-based permissions

## Demo Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| Admin | admin@example.com | Admin123! | Full access |
| Editor | editor@example.com | Editor123! | User read/write, role read |
| Viewer | viewer@example.com | Viewer123! | Read-only access |
| Manager | manager@example.com | Manager123! | User management, role read |

## Getting Started

### Prerequisites
- Node.js v14+
- MongoDB v4.4+
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/riyajuddin/fullstackrolebaseaccessapp.git
cd fullstackrolebaseaccessapp

# Install dependencies
npm run install:all

# Set up environment variables
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

# Start MongoDB
mongod

# Seed database
npm run seed

# Start development servers
npm run dev
```

### Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/health

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Support

For questions or issues:
1. Check the documentation in this directory
2. Review the main [README.md](../README.md)
3. Create an issue on GitHub
4. Contact the development team

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
