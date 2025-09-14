# RBAC Application API Documentation

## Base URL
```
Development: http://localhost:5001/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Array of specific errors (optional)
  ]
}
```

## Authentication Endpoints

### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": {
        "_id": "role_id",
        "name": "admin",
        "permissions": ["user:read", "user:write"]
      },
      "isActive": true,
      "lastLogin": "2025-01-01T00:00:00.000Z"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing or invalid input

---

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "role_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": {
        "_id": "role_id",
        "name": "viewer",
        "permissions": ["user:read"]
      },
      "isActive": true
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Error Responses:**
- `400 Bad Request`: User already exists or invalid input
- `400 Bad Request`: Invalid role ID

---

### GET /auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com",
      "role": {
        "_id": "role_id",
        "name": "admin",
        "permissions": ["user:read", "user:write", "role:read"]
      },
      "isActive": true,
      "lastLogin": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired token

---

### POST /auth/logout
Logout current user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Management Endpoints

### GET /users
Get all users with pagination and filtering.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)
- `search` (string, optional): Search term for name or email
- `role` (string, optional): Filter by role ID
- `isActive` (boolean, optional): Filter by active status

**Example Request:**
```
GET /users?page=1&limit=10&search=john&role=role_id&isActive=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user_id",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": {
          "_id": "role_id",
          "name": "admin",
          "permissions": ["user:read", "user:write"]
        },
        "isActive": true,
        "lastLogin": "2025-01-01T00:00:00.000Z",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Required Permission:** `user:read`

---

### GET /users/:id
Get user by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": {
        "_id": "role_id",
        "name": "admin",
        "permissions": ["user:read", "user:write"]
      },
      "isActive": true,
      "lastLogin": "2025-01-01T00:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Required Permission:** `user:read`

---

### POST /users
Create a new user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "role_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "new_user_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "role": {
        "_id": "role_id",
        "name": "editor",
        "permissions": ["user:read", "user:write"]
      },
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Required Permission:** `user:write`

**Error Responses:**
- `400 Bad Request`: User already exists or invalid input
- `400 Bad Request`: Invalid role ID

---

### PUT /users/:id
Update user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "role": "new_role_id",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "role": {
        "_id": "new_role_id",
        "name": "manager",
        "permissions": ["user:read", "user:write", "user:delete"]
      },
      "isActive": true,
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Required Permission:** `user:write`

---

### DELETE /users/:id
Delete a user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Required Permission:** `user:delete`

**Error Responses:**
- `404 Not Found`: User not found
- `400 Bad Request`: Cannot delete user (e.g., last admin user)

---

## Role Management Endpoints

### GET /roles
Get all roles.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "roles": [
      {
        "_id": "role_id",
        "name": "admin",
        "description": "Full system access with all permissions",
        "permissions": [
          "user:read",
          "user:write",
          "user:delete",
          "role:read",
          "role:write",
          "role:delete",
          "dashboard:read",
          "admin:access"
        ],
        "isActive": true,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

**Required Permission:** `role:read`

---

### GET /roles/:id
Get role by ID.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "role": {
      "_id": "role_id",
      "name": "admin",
      "description": "Full system access with all permissions",
      "permissions": [
        "user:read",
        "user:write",
        "user:delete",
        "role:read",
        "role:write",
        "role:delete",
        "dashboard:read",
        "admin:access"
      ],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Required Permission:** `role:read`

---

### POST /roles
Create a new role.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "custom_role",
  "description": "Custom role with specific permissions",
  "permissions": [
    "user:read",
    "dashboard:read"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "role": {
      "_id": "new_role_id",
      "name": "custom_role",
      "description": "Custom role with specific permissions",
      "permissions": [
        "user:read",
        "dashboard:read"
      ],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Required Permission:** `role:write`

**Error Responses:**
- `400 Bad Request`: Role name already exists
- `400 Bad Request`: Invalid permissions

---

### PUT /roles/:id
Update role information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "updated_role",
  "description": "Updated role description",
  "permissions": [
    "user:read",
    "user:write",
    "dashboard:read"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "role": {
      "_id": "role_id",
      "name": "updated_role",
      "description": "Updated role description",
      "permissions": [
        "user:read",
        "user:write",
        "dashboard:read"
      ],
      "isActive": true,
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Required Permission:** `role:write`

---

### DELETE /roles/:id
Delete a role.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**Required Permission:** `role:delete`

**Error Responses:**
- `404 Not Found`: Role not found
- `400 Bad Request`: Cannot delete role (e.g., role is in use)

---

## System Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## Error Codes

### HTTP Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Application Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_FAILED`: Invalid credentials
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `RESOURCE_ALREADY_EXISTS`: Resource with same identifier exists
- `DATABASE_ERROR`: Database operation failed
- `TOKEN_EXPIRED`: JWT token has expired
- `TOKEN_INVALID`: JWT token is invalid

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **General API endpoints**: 100 requests per 15 minutes per IP
- **Headers included in response**:
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Time when the rate limit resets

---

## Permissions

### Permission Format
Permissions follow the format: `resource:action`

### Available Permissions
- `user:read` - View users
- `user:write` - Create and update users
- `user:delete` - Delete users
- `role:read` - View roles
- `role:write` - Create and update roles
- `role:delete` - Delete roles
- `dashboard:read` - Access dashboard
- `admin:access` - Access admin panel

### Role Hierarchy
1. **Admin**: All permissions
2. **Manager**: User management + role viewing
3. **Editor**: User read/write + role viewing
4. **Viewer**: Read-only access

---

## Examples

### Complete Authentication Flow

1. **Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}'
```

2. **Use token for protected request:**
```bash
curl -X GET http://localhost:5001/api/users \
  -H "Authorization: Bearer <jwt_token>"
```

3. **Logout:**
```bash
curl -X POST http://localhost:5001/api/auth/logout \
  -H "Authorization: Bearer <jwt_token>"
```

### User Management Example

1. **Create user:**
```bash
curl -X POST http://localhost:5001/api/users \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "role_id"
  }'
```

2. **Get users with pagination:**
```bash
curl -X GET "http://localhost:5001/api/users?page=1&limit=10&search=john" \
  -H "Authorization: Bearer <jwt_token>"
```

This comprehensive API documentation provides all the information needed to interact with the RBAC application's backend services.
