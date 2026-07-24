#!/bin/bash

echo "🚀 Hadescore Apex and Technology - Setup Script"
echo "=============================================="
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python -m venv .venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source .venv/Scripts/activate
else
    source .venv/bin/activate
fi

# Install dependencies
echo "Installing backend dependencies..."
pip install django djangorestframework django-cors-headers pillow

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo "1. Backend:  cd backend && python manage.py runserver"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Backend will run on: http://localhost:8000"
echo "Frontend will run on: http://localhost:5173"
