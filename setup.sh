#!/bin/bash

echo "🚀 Setting up RBAC Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: brew services start mongodb-community"
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔧 Setting up environment files..."
cd ../backend
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created backend/.env file. Please edit it with your configuration."
fi

cd ../frontend
if [ ! -f .env ]; then
    cp env.example .env
    echo "✅ Created frontend/.env file. Please edit it with your configuration."
fi

echo "🌱 Seeding database..."
cd ../backend
npm run seed

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: cd frontend && npm start"
echo ""
echo "Test accounts:"
echo "Admin: admin@example.com / Admin123!"
echo "Editor: editor@example.com / Editor123!"
echo "Viewer: viewer@example.com / Viewer123!"
echo "Manager: manager@example.com / Manager123!"
