# RBAC Application Testing Guide

## Overview

This guide provides comprehensive testing strategies, test cases, and implementation examples for the RBAC application, covering unit tests, integration tests, end-to-end tests, and security testing.

## Testing Strategy

### Testing Pyramid
```
                    /\
                   /  \
                  / E2E \     (Few, High-level)
                 /______\
                /        \
               /Integration\  (Some, Medium-level)
              /____________\
             /              \
            /   Unit Tests   \  (Many, Low-level)
           /__________________\
```

### Test Types
1. **Unit Tests**: Individual components and functions
2. **Integration Tests**: API endpoints and database interactions
3. **End-to-End Tests**: Complete user workflows
4. **Security Tests**: Authentication and authorization
5. **Performance Tests**: Load and stress testing

## Frontend Testing

### 1. Unit Testing with Jest and React Testing Library

#### Setup
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

#### Test Configuration
Create `frontend/src/setupTests.js`:
```javascript
import '@testing-library/jest-dom';
```

Create `frontend/jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
};
```

#### Component Tests

**Login Component Test:**
```javascript
// frontend/src/pages/__tests__/Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Login from '../Login';
import authSlice from '../../store/slices/authSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        loading: false,
        error: null,
        isAuthenticated: false,
        user: null,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (component, { store = createTestStore() } = {}) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('displays demo accounts information', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByText(/demo accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    const user = userEvent.setup();
    const store = createTestStore();
    
    renderWithProviders(<Login />, { store });
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'Admin123!');
    await user.click(submitButton);
    
    // Verify that login action was dispatched
    const actions = store.getState();
    expect(actions.auth.loading).toBe(true);
  });
});
```

**ProtectedRoute Component Test:**
```javascript
// frontend/src/components/__tests__/ProtectedRoute.test.js
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProtectedRoute from '../ProtectedRoute';
import authSlice from '../../store/slices/authSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    preloadedState: {
      auth: {
        loading: false,
        error: null,
        isAuthenticated: false,
        user: null,
        ...initialState,
      },
    },
  });
};

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute Component', () => {
  test('redirects to login when not authenticated', () => {
    const store = createTestStore();
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );
    
    // Should redirect to login, so protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders children when authenticated', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: {
        _id: '1',
        email: 'test@example.com',
        role: {
          permissions: ['dashboard:read']
        }
      }
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to unauthorized when permission denied', () => {
    const store = createTestStore({
      isAuthenticated: true,
      user: {
        _id: '1',
        email: 'test@example.com',
        role: {
          permissions: ['user:read']
        }
      }
    });
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProtectedRoute requiredPermission="admin:access">
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      </Provider>
    );
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
```

#### Redux Store Tests

**Auth Slice Test:**
```javascript
// frontend/src/store/slices/__tests__/authSlice.test.js
import authSlice, { login, logout, getMe } from '../authSlice';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  test('should return initial state', () => {
    expect(authSlice(undefined, {})).toEqual(initialState);
  });

  test('should handle login pending', () => {
    const action = { type: login.pending.type };
    const state = authSlice(initialState, action);
    
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('should handle login fulfilled', () => {
    const mockUser = {
      _id: '1',
      email: 'test@example.com',
      role: { name: 'admin' }
    };
    const mockToken = 'mock-token';
    
    const action = {
      type: login.fulfilled.type,
      payload: {
        user: mockUser,
        token: mockToken,
        refreshToken: 'mock-refresh-token'
      }
    };
    
    const state = authSlice(initialState, action);
    
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  test('should handle login rejected', () => {
    const errorMessage = 'Invalid credentials';
    const action = {
      type: login.rejected.type,
      payload: errorMessage
    };
    
    const state = authSlice(initialState, action);
    
    expect(state.error).toBe(errorMessage);
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
  });
});
```

### 2. Integration Testing

**API Service Tests:**
```javascript
// frontend/src/services/__tests__/authService.test.js
import { authService } from '../authService';
import api from '../api';

// Mock the API module
jest.mock('../api');

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login should call API with correct parameters', async () => {
    const mockResponse = {
      data: {
        user: { _id: '1', email: 'test@example.com' },
        token: 'mock-token'
      }
    };
    
    api.post.mockResolvedValue(mockResponse);
    
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const result = await authService.login(credentials);
    
    expect(api.post).toHaveBeenCalledWith('/auth/login', credentials);
    expect(result).toEqual(mockResponse.data);
  });

  test('login should handle API errors', async () => {
    const mockError = new Error('Network error');
    api.post.mockRejectedValue(mockError);
    
    const credentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };
    
    await expect(authService.login(credentials)).rejects.toThrow('Network error');
  });
});
```

## Backend Testing

### 1. Unit Testing with Jest

#### Setup
```bash
cd backend
npm install --save-dev jest supertest mongodb-memory-server
```

#### Test Configuration
Create `backend/jest.config.js`:
```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js']
};
```

#### Controller Tests

**Auth Controller Test:**
```javascript
// backend/src/controllers/__tests__/authController.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../index');
const User = require('../../models/User');
const Role = require('../../models/Role');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Role.deleteMany({});
});

describe('Auth Controller', () => {
  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      // Create test role
      const role = await Role.create({
        name: 'test-role',
        description: 'Test role',
        permissions: ['user:read']
      });

      // Create test user
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: role._id
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.token).toBeDefined();
    });

    test('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should require email and password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/register', () => {
    test('should register new user', async () => {
      const role = await Role.create({
        name: 'viewer',
        description: 'Viewer role',
        permissions: ['user:read']
      });

      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
        role: role._id
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('newuser@example.com');
    });

    test('should reject duplicate email', async () => {
      const role = await Role.create({
        name: 'viewer',
        description: 'Viewer role',
        permissions: ['user:read']
      });

      await User.create({
        firstName: 'Existing',
        lastName: 'User',
        email: 'existing@example.com',
        password: 'password123',
        role: role._id
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'New',
          lastName: 'User',
          email: 'existing@example.com',
          password: 'password123',
          role: role._id
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists with this email');
    });
  });
});
```

**User Controller Test:**
```javascript
// backend/src/controllers/__tests__/userController.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../index');
const User = require('../../models/User');
const Role = require('../../models/Role');
const { generateToken } = require('../../utils/jwt');

let mongoServer;
let authToken;
let testRole;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Role.deleteMany({});

  // Create test role
  testRole = await Role.create({
    name: 'admin',
    description: 'Admin role',
    permissions: ['user:read', 'user:write', 'user:delete']
  });

  // Create test user
  const testUser = await User.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'password123',
    role: testRole._id
  });

  // Generate auth token
  authToken = generateToken({ id: testUser._id });
});

describe('User Controller', () => {
  describe('GET /api/users', () => {
    test('should get all users with authentication', async () => {
      // Create additional test users
      await User.create({
        firstName: 'User1',
        lastName: 'Test',
        email: 'user1@example.com',
        password: 'password123',
        role: testRole._id
      });

      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(2);
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(1);
    });
  });

  describe('POST /api/users', () => {
    test('should create new user with valid data', async () => {
      const userData = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
        role: testRole._id
      };

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${authToken}`)
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('newuser@example.com');
    });

    test('should require user:write permission', async () => {
      // Create user with limited permissions
      const limitedRole = await Role.create({
        name: 'viewer',
        description: 'Viewer role',
        permissions: ['user:read']
      });

      const limitedUser = await User.create({
        firstName: 'Limited',
        lastName: 'User',
        email: 'limited@example.com',
        password: 'password123',
        role: limitedRole._id
      });

      const limitedToken = generateToken({ id: limitedUser._id });

      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${limitedToken}`)
        .send({
          firstName: 'New',
          lastName: 'User',
          email: 'newuser@example.com',
          password: 'password123',
          role: testRole._id
        });

      expect(response.status).toBe(403);
    });
  });
});
```

### 2. Model Tests

**User Model Test:**
```javascript
// backend/src/models/__tests__/User.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../User');
const Role = require('../Role');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Role.deleteMany({});
});

describe('User Model', () => {
  test('should create user with valid data', async () => {
    const role = await Role.create({
      name: 'test-role',
      description: 'Test role',
      permissions: ['user:read']
    });

    const userData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: role._id
    };

    const user = await User.create(userData);

    expect(user.firstName).toBe('Test');
    expect(user.lastName).toBe('User');
    expect(user.email).toBe('test@example.com');
    expect(user.password).not.toBe('password123'); // Should be hashed
    expect(user.role.toString()).toBe(role._id.toString());
  });

  test('should hash password before saving', async () => {
    const role = await Role.create({
      name: 'test-role',
      description: 'Test role',
      permissions: ['user:read']
    });

    const user = new User({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: role._id
    });

    await user.save();

    expect(user.password).not.toBe('password123');
    expect(user.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
  });

  test('should compare password correctly', async () => {
    const role = await Role.create({
      name: 'test-role',
      description: 'Test role',
      permissions: ['user:read']
    });

    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: role._id
    });

    const isValid = await user.comparePassword('password123');
    const isInvalid = await user.comparePassword('wrongpassword');

    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });

  test('should require unique email', async () => {
    const role = await Role.create({
      name: 'test-role',
      description: 'Test role',
      permissions: ['user:read']
    });

    await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: role._id
    });

    await expect(User.create({
      firstName: 'Another',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: role._id
    })).rejects.toThrow();
  });
});
```

## End-to-End Testing

### 1. Cypress Testing

#### Setup
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
```

#### E2E Test Examples

**Authentication Flow Test:**
```javascript
// cypress/e2e/auth.cy.js
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('contain', 'Admin User');
  });

  it('should show error for invalid credentials', () => {
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.url().should('include', '/login');
  });

  it('should logout successfully', () => {
    // Login first
    cy.get('input[name="email"]').type('admin@example.com');
    cy.get('input[name="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();

    // Logout
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();

    cy.url().should('include', '/login');
  });
});
```

**User Management Test:**
```javascript
// cypress/e2e/user-management.cy.js
describe('User Management', () => {
  beforeEach(() => {
    // Login as admin
    cy.login('admin@example.com', 'Admin123!');
    cy.visit('/users');
  });

  it('should display users list', () => {
    cy.get('[data-testid="users-table"]').should('be.visible');
    cy.get('[data-testid="user-row"]').should('have.length.at.least', 1);
  });

  it('should create new user', () => {
    cy.get('[data-testid="create-user-button"]').click();
    
    cy.get('input[name="firstName"]').type('New');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('newuser@example.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('select[name="role"]').select('editor');
    
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="user-row"]').should('contain', 'newuser@example.com');
  });

  it('should edit existing user', () => {
    cy.get('[data-testid="edit-user-button"]').first().click();
    
    cy.get('input[name="firstName"]').clear().type('Updated');
    cy.get('button[type="submit"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
    cy.get('[data-testid="user-row"]').should('contain', 'Updated');
  });

  it('should delete user with confirmation', () => {
    cy.get('[data-testid="delete-user-button"]').first().click();
    cy.get('[data-testid="confirm-delete"]').click();
    
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
```

**Permission Testing:**
```javascript
// cypress/e2e/permissions.cy.js
describe('Permission-based Access Control', () => {
  it('should restrict viewer from accessing user management', () => {
    cy.login('viewer@example.com', 'Viewer123!');
    
    // Try to access user management
    cy.visit('/users');
    
    // Should be redirected to unauthorized page
    cy.url().should('include', '/unauthorized');
  });

  it('should allow admin to access all features', () => {
    cy.login('admin@example.com', 'Admin123!');
    
    // Should be able to access all pages
    cy.visit('/dashboard');
    cy.url().should('include', '/dashboard');
    
    cy.visit('/users');
    cy.url().should('include', '/users');
    
    cy.visit('/roles');
    cy.url().should('include', '/roles');
    
    cy.visit('/admin');
    cy.url().should('include', '/admin');
  });

  it('should hide unauthorized buttons for limited users', () => {
    cy.login('viewer@example.com', 'Viewer123!');
    cy.visit('/dashboard');
    
    // Should not see create/edit/delete buttons
    cy.get('[data-testid="create-user-button"]').should('not.exist');
    cy.get('[data-testid="edit-user-button"]').should('not.exist');
    cy.get('[data-testid="delete-user-button"]').should('not.exist');
  });
});
```

## Security Testing

### 1. Authentication Security Tests

```javascript
// backend/src/__tests__/security.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');

describe('Security Tests', () => {
  test('should reject requests without authentication', async () => {
    const response = await request(app)
      .get('/api/users');

    expect(response.status).toBe(401);
  });

  test('should reject requests with invalid token', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });

  test('should implement rate limiting', async () => {
    const promises = [];
    
    // Make multiple requests quickly
    for (let i = 0; i < 10; i++) {
      promises.push(
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          })
      );
    }

    const responses = await Promise.all(promises);
    
    // Should eventually get rate limited
    const rateLimited = responses.some(res => res.status === 429);
    expect(rateLimited).toBe(true);
  });

  test('should validate input data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email',
        password: '123' // Too short
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });
});
```

### 2. Authorization Security Tests

```javascript
describe('Authorization Tests', () => {
  test('should prevent privilege escalation', async () => {
    // Create viewer user
    const viewerRole = await Role.create({
      name: 'viewer',
      description: 'Viewer role',
      permissions: ['user:read']
    });

    const viewer = await User.create({
      firstName: 'Viewer',
      lastName: 'User',
      email: 'viewer@example.com',
      password: 'password123',
      role: viewerRole._id
    });

    const viewerToken = generateToken({ id: viewer._id });

    // Try to create user (should fail)
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'password123',
        role: viewerRole._id
      });

    expect(response.status).toBe(403);
  });

  test('should prevent access to admin functions', async () => {
    const viewerRole = await Role.create({
      name: 'viewer',
      description: 'Viewer role',
      permissions: ['user:read']
    });

    const viewer = await User.create({
      firstName: 'Viewer',
      lastName: 'User',
      email: 'viewer@example.com',
      password: 'password123',
      role: viewerRole._id
    });

    const viewerToken = generateToken({ id: viewer._id });

    // Try to delete user (should fail)
    const response = await request(app)
      .delete('/api/users/some-user-id')
      .set('Authorization', `Bearer ${viewerToken}`);

    expect(response.status).toBe(403);
  });
});
```

## Performance Testing

### 1. Load Testing with Artillery

#### Setup
```bash
npm install -g artillery
```

#### Load Test Configuration
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:5001'
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Authorization: 'Bearer YOUR_JWT_TOKEN'

scenarios:
  - name: "User Management API"
    weight: 100
    flow:
      - get:
          url: "/api/users"
      - post:
          url: "/api/users"
          json:
            firstName: "Load"
            lastName: "Test"
            email: "loadtest{{ $randomInt() }}@example.com"
            password: "password123"
            role: "ROLE_ID"
```

#### Run Load Test
```bash
artillery run artillery-config.yml
```

### 2. Stress Testing

```yaml
# stress-test.yml
config:
  target: 'http://localhost:5001'
  phases:
    - duration: 30
      arrivalRate: 1
    - duration: 60
      arrivalRate: 50
    - duration: 30
      arrivalRate: 100
```

## Test Automation

### 1. GitHub Actions CI/CD

Create `.github/workflows/test.yml`:
```yaml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run tests
        run: |
          cd frontend
          npm test -- --coverage --watchAll=false
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./frontend/coverage/lcov.info

  backend-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm test
        env:
          MONGODB_URI: mongodb://localhost:27017/rbac-test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm run install:all
      
      - name: Start services
        run: |
          npm run dev &
          sleep 30
      
      - name: Run E2E tests
        run: |
          cd frontend
          npx cypress run
```

### 2. Test Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test": "npm run test:frontend && npm run test:backend",
    "test:frontend": "cd frontend && npm test -- --watchAll=false",
    "test:backend": "cd backend && npm test",
    "test:e2e": "cd frontend && npx cypress run",
    "test:coverage": "npm run test:frontend -- --coverage && npm run test:backend -- --coverage"
  }
}
```

## Test Data Management

### 1. Test Database Setup

```javascript
// backend/src/__tests__/setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean database before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
```

### 2. Test Fixtures

```javascript
// backend/src/__tests__/fixtures.js
const Role = require('../models/Role');
const User = require('../models/User');

const createTestRole = async (overrides = {}) => {
  const defaultRole = {
    name: 'test-role',
    description: 'Test role',
    permissions: ['user:read'],
    ...overrides
  };
  
  return await Role.create(defaultRole);
};

const createTestUser = async (role, overrides = {}) => {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    role: role._id,
    ...overrides
  };
  
  return await User.create(defaultUser);
};

module.exports = {
  createTestRole,
  createTestUser
};
```

This comprehensive testing guide provides all the necessary information to implement a robust testing strategy for the RBAC application, covering unit tests, integration tests, end-to-end tests, security testing, and performance testing.
