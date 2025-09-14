require('dotenv').config();
const connectDB = require('../config/database');
const Role = require('../models/Role');
const User = require('../models/User');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Role.deleteMany({});

    // Create roles
    const roles = [
      {
        name: 'admin',
        description: 'Full system access with all permissions',
        permissions: [
          'user:read',
          'user:write',
          'user:delete',
          'role:read',
          'role:write',
          'role:delete',
          'dashboard:read',
          'admin:access'
        ]
      },
      {
        name: 'editor',
        description: 'Can read and write users, read roles',
        permissions: [
          'user:read',
          'user:write',
          'role:read',
          'dashboard:read'
        ]
      },
      {
        name: 'viewer',
        description: 'Read-only access to users and dashboard',
        permissions: [
          'user:read',
          'dashboard:read'
        ]
      },
      {
        name: 'manager',
        description: 'Can manage users and view roles',
        permissions: [
          'user:read',
          'user:write',
          'user:delete',
          'role:read',
          'dashboard:read'
        ]
      }
    ];

    const createdRoles = await Role.insertMany(roles);
    console.log(`✅ Created ${createdRoles.length} roles`);

    // Create users
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'Admin123!',
        role: createdRoles.find(role => role.name === 'admin')._id
      },
      {
        firstName: 'John',
        lastName: 'Editor',
        email: 'editor@example.com',
        password: 'Editor123!',
        role: createdRoles.find(role => role.name === 'editor')._id
      },
      {
        firstName: 'Jane',
        lastName: 'Viewer',
        email: 'viewer@example.com',
        password: 'Viewer123!',
        role: createdRoles.find(role => role.name === 'viewer')._id
      },
      {
        firstName: 'Mike',
        lastName: 'Manager',
        email: 'manager@example.com',
        password: 'Manager123!',
        role: createdRoles.find(role => role.name === 'manager')._id
      }
    ];

    // Create users individually to ensure password hashing middleware runs
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('Admin: admin@example.com / Admin123!');
    console.log('Editor: editor@example.com / Editor123!');
    console.log('Viewer: viewer@example.com / Viewer123!');
    console.log('Manager: manager@example.com / Manager123!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
