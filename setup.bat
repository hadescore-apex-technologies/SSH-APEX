@echo off
echo 🚀 Hadescore Apex and Technology - Setup Script
echo ==============================================
echo.

REM Backend Setup
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
echo Creating virtual environment...
python -m venv .venv

REM Activate virtual environment
call .venv\Scripts\activate

REM Install dependencies
echo Installing backend dependencies...
pip install django djangorestframework django-cors-headers pillow

REM Run migrations
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

echo ✅ Backend setup complete!
echo.

REM Frontend Setup
echo 📦 Setting up Frontend...
cd ..\frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

echo ✅ Frontend setup complete!
echo.

echo 🎉 Setup Complete!
echo.
echo To start the application:
echo 1. Backend:  cd backend && python manage.py runserver
echo 2. Frontend: cd frontend && npm run dev
echo.
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:5173

pause
