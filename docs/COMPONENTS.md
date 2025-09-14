# RBAC Application Components Documentation

## Frontend Components

### 1. ProtectedRoute Component

**File**: `frontend/src/components/ProtectedRoute.js`

**Purpose**: Provides route-level protection based on authentication status and user permissions.

**Props**:
- `children` (ReactNode): The component to render if access is granted
- `requiredPermission` (string, optional): Single permission required to access the route
- `requiredPermissions` (array, optional): Multiple permissions (user needs any one)
- `requiredRole` (string, optional): Single role required to access the route
- `requiredRoles` (array, optional): Multiple roles (user needs any one)
- `fallback` (string, default: '/login'): Route to redirect to if not authenticated

**Functionality**:
1. Checks if user is authenticated
2. Validates required permissions using permission utility functions
3. Validates required roles using role utility functions
4. Redirects to appropriate page based on validation results

**Dependencies**:
- React Router (Navigate, useLocation)
- Redux (useSelector)
- Permission utilities (hasPermission, hasAnyPermission, hasRole, hasAnyRole)

**Usage Example**:
```jsx
<ProtectedRoute requiredPermission="user:read">
  <UserManagement />
</ProtectedRoute>
```

---

### 2. Layout Component

**File**: `frontend/src/components/Layout.js`

**Purpose**: Provides common layout structure for authenticated pages including navigation and sidebar.

**Features**:
- Responsive navigation bar
- Sidebar with role-based menu items
- User information display
- Logout functionality
- Mobile-responsive design

**State Management**:
- Uses Redux to access user authentication state
- Displays user information and role
- Manages navigation state

**Responsive Design**:
- Mobile-first approach
- Collapsible sidebar for mobile devices
- Touch-friendly navigation

---

### 3. PermissionGate Component

**File**: `frontend/src/components/PermissionGate.js`

**Purpose**: Conditionally renders content based on user permissions.

**Props**:
- `permission` (string): Required permission
- `permissions` (array): Multiple permissions (user needs any one)
- `role` (string): Required role
- `roles` (array): Multiple roles (user needs any one)
- `children` (ReactNode): Content to render if permission is granted
- `fallback` (ReactNode, optional): Content to render if permission is denied

**Functionality**:
1. Checks user permissions/roles
2. Renders children if permission is granted
3. Renders fallback content if permission is denied
4. Returns null if no fallback is provided

**Usage Example**:
```jsx
<PermissionGate permission="user:write">
  <button>Edit User</button>
</PermissionGate>
```

---

## Page Components

### 1. Login Component

**File**: `frontend/src/pages/Login.js`

**Purpose**: Handles user authentication with email and password.

**Features**:
- Email and password input fields
- Form validation
- Loading states during authentication
- Error message display
- Demo account information
- Automatic redirect after successful login

**State Management**:
- Local state for form data
- Redux state for authentication status
- Automatic navigation on successful login

**Form Validation**:
- Required field validation
- Email format validation
- Password requirements

**Demo Accounts Display**:
- Shows available demo accounts
- Includes credentials for testing

---

### 2. Dashboard Component

**File**: `frontend/src/pages/Dashboard.js`

**Purpose**: Main dashboard displaying user statistics and system overview.

**Features**:
- User statistics cards
- Role-based content display
- Recent activity feed
- Quick action buttons
- Responsive grid layout

**Data Display**:
- Total users count
- Total roles count
- User role distribution
- Recent user registrations

**Permission-based Content**:
- Different content based on user role
- Admin-specific statistics
- Role-based quick actions

---

### 3. UserManagement Component

**File**: `frontend/src/pages/UserManagement.js`

**Purpose**: Comprehensive user management interface with CRUD operations.

**Features**:
- User list with search and filtering
- Create new user form
- Edit user functionality
- Delete user with confirmation
- Role assignment
- User status management

**CRUD Operations**:
- **Create**: Add new users with role assignment
- **Read**: Display users with pagination and search
- **Update**: Edit user information and roles
- **Delete**: Remove users with confirmation dialog

**Form Features**:
- Input validation
- Role selection dropdown
- Password generation
- Status toggle

**Data Management**:
- Real-time updates
- Optimistic UI updates
- Error handling and rollback

---

### 4. RoleManagement Component

**File**: `frontend/src/pages/RoleManagement.js`

**Purpose**: Role and permission management interface.

**Features**:
- Role list with permissions
- Create new roles
- Edit role permissions
- Delete roles
- Permission matrix display

**Permission Management**:
- Checkbox-based permission assignment
- Permission categories
- Bulk permission operations
- Permission validation

**Role Operations**:
- Create roles with custom permissions
- Edit existing role permissions
- Delete unused roles
- Role usage statistics

---

### 5. AdminPanel Component

**File**: `frontend/src/pages/AdminPanel.js`

**Purpose**: Administrative interface for system management.

**Features**:
- System statistics
- User management tools
- Role management tools
- System configuration
- Audit logs

**Admin Functions**:
- Bulk user operations
- System health monitoring
- Configuration management
- Data export/import

---

### 6. Unauthorized Component

**File**: `frontend/src/pages/Unauthorized.js`

**Purpose**: Displays access denied message for unauthorized users.

**Features**:
- Clear error message
- Navigation back to dashboard
- Contact information
- Helpful suggestions

---

## Backend Components

### 1. Server Entry Point

**File**: `backend/src/index.js`

**Purpose**: Main server configuration and startup.

**Features**:
- Express application setup
- Middleware configuration
- Route registration
- Error handling
- Security configuration

**Middleware Stack**:
- Helmet for security headers
- CORS configuration
- Rate limiting
- Body parsing
- Authentication middleware

**Security Features**:
- JWT token validation
- Rate limiting
- CORS protection
- Security headers

---

### 2. Database Configuration

**File**: `backend/src/config/database.js`

**Purpose**: MongoDB connection management.

**Features**:
- Connection establishment
- Connection error handling
- Connection status monitoring
- Environment-based configuration

**Configuration**:
- MongoDB URI from environment variables
- Connection options
- Error handling
- Connection events

---

### 3. Authentication Controller

**File**: `backend/src/controllers/authController.js`

**Purpose**: Handles authentication-related operations.

**Functions**:
- `register`: User registration with role assignment
- `login`: User authentication with JWT token generation
- `getMe`: Get current user information
- `logout`: User logout (token invalidation)

**Security Features**:
- Password hashing with bcrypt
- JWT token generation
- Input validation
- Error handling

---

### 4. User Controller

**File**: `backend/src/controllers/userController.js`

**Purpose**: Handles user management operations.

**Functions**:
- `getUsers`: Retrieve all users with pagination
- `getUser`: Get user by ID
- `createUser`: Create new user
- `updateUser`: Update user information
- `deleteUser`: Delete user

**Features**:
- Pagination support
- Search functionality
- Role validation
- Permission checking

---

### 5. Role Controller

**File**: `backend/src/controllers/roleController.js`

**Purpose**: Handles role management operations.

**Functions**:
- `getRoles`: Retrieve all roles
- `getRole`: Get role by ID
- `createRole`: Create new role
- `updateRole`: Update role permissions
- `deleteRole`: Delete role

**Features**:
- Permission management
- Role validation
- Usage tracking
- Conflict resolution

---

### 6. Authentication Middleware

**File**: `backend/src/middleware/auth.js`

**Purpose**: JWT token validation middleware.

**Features**:
- Token extraction from headers
- Token verification
- User information extraction
- Error handling

**Security**:
- JWT signature verification
- Token expiration checking
- User existence validation

---

### 7. Validation Middleware

**File**: `backend/src/middleware/validation.js`

**Purpose**: Input validation middleware.

**Features**:
- Request body validation
- Parameter validation
- Custom validation rules
- Error message formatting

**Validation Rules**:
- Email format validation
- Password strength validation
- Required field validation
- Data type validation

---

## Data Models

### 1. User Model

**File**: `backend/src/models/User.js`

**Purpose**: User data structure and methods.

**Schema Fields**:
- `firstName`: User's first name
- `lastName`: User's last name
- `email`: User's email (unique)
- `password`: Hashed password
- `role`: Reference to Role model
- `isActive`: User status
- `lastLogin`: Last login timestamp

**Methods**:
- `comparePassword`: Password comparison
- `fullName`: Virtual field for full name

**Hooks**:
- Pre-save hook for password hashing
- Index creation for performance

---

### 2. Role Model

**File**: `backend/src/models/Role.js`

**Purpose**: Role data structure and methods.

**Schema Fields**:
- `name`: Role name (unique)
- `description`: Role description
- `permissions`: Array of permissions
- `isActive`: Role status

**Features**:
- Permission array management
- Role validation
- Index creation for performance

---

## Utility Functions

### 1. JWT Utilities

**File**: `backend/src/utils/jwt.js`

**Purpose**: JWT token generation and verification.

**Functions**:
- `generateToken`: Create JWT access token
- `generateRefreshToken`: Create JWT refresh token
- `verifyToken`: Verify JWT token

**Configuration**:
- Token expiration times
- Secret key management
- Token payload structure

---

### 2. Permission Utilities

**File**: `frontend/src/utils/permissions.js`

**Purpose**: Permission checking utilities.

**Functions**:
- `hasPermission`: Check single permission
- `hasAnyPermission`: Check multiple permissions
- `hasRole`: Check single role
- `hasAnyRole`: Check multiple roles

**Features**:
- Role-based permission checking
- Permission inheritance
- Flexible permission matching

---

### 3. Database Seeding

**File**: `backend/src/utils/seed.js`

**Purpose**: Database initialization with demo data.

**Features**:
- Role creation with permissions
- User creation with roles
- Data cleanup before seeding
- Demo account generation

**Demo Data**:
- Admin role with full permissions
- Editor role with limited permissions
- Viewer role with read-only permissions
- Manager role with user management permissions

---

## Service Layer

### 1. API Service

**File**: `frontend/src/services/api.js`

**Purpose**: HTTP client configuration and interceptors.

**Features**:
- Axios instance configuration
- Request/response interceptors
- Token management
- Error handling

**Interceptors**:
- Request interceptor for token attachment
- Response interceptor for error handling
- Automatic token refresh

---

### 2. Authentication Service

**File**: `frontend/src/services/authService.js`

**Purpose**: Authentication-related API calls.

**Functions**:
- `login`: User login
- `register`: User registration
- `getMe`: Get current user
- `logout`: User logout

---

### 3. User Service

**File**: `frontend/src/services/userService.js`

**Purpose**: User management API calls.

**Functions**:
- `getUsers`: Get all users
- `getUser`: Get user by ID
- `createUser`: Create user
- `updateUser`: Update user
- `deleteUser`: Delete user

---

### 4. Role Service

**File**: `frontend/src/services/roleService.js`

**Purpose**: Role management API calls.

**Functions**:
- `getRoles`: Get all roles
- `getRole`: Get role by ID
- `createRole`: Create role
- `updateRole`: Update role
- `deleteRole`: Delete role

---

## State Management

### 1. Redux Store

**File**: `frontend/src/store/index.js`

**Purpose**: Redux store configuration.

**Features**:
- Store creation with Redux Toolkit
- Reducer combination
- Middleware configuration
- DevTools integration

---

### 2. Authentication Slice

**File**: `frontend/src/store/slices/authSlice.js`

**Purpose**: Authentication state management.

**State**:
- User information
- Authentication status
- Tokens
- Loading states
- Error messages

**Actions**:
- `login`: User login
- `register`: User registration
- `getMe`: Get current user
- `logout`: User logout
- `clearError`: Clear error messages

---

### 3. User Slice

**File**: `frontend/src/store/slices/userSlice.js`

**Purpose**: User management state.

**State**:
- Users list
- Selected user
- Loading states
- Error messages

**Actions**:
- `getUsers`: Fetch users
- `createUser`: Create user
- `updateUser`: Update user
- `deleteUser`: Delete user

---

### 4. Role Slice

**File**: `frontend/src/store/slices/roleSlice.js`

**Purpose**: Role management state.

**State**:
- Roles list
- Selected role
- Loading states
- Error messages

**Actions**:
- `getRoles`: Fetch roles
- `createRole`: Create role
- `updateRole`: Update role
- `deleteRole`: Delete role

This comprehensive component documentation provides detailed information about each component, its purpose, functionality, and usage within the RBAC application.
