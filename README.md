# Simple Rails and React Application

This is a simple application with a Rails backend and React frontend.

## Features

- Rails backend running on port 5000 with no database dependency
- React frontend using Vite
- API endpoint that returns a greeting message
- Frontend that fetches and displays the message from the API

## Running the Application

### Backend (Rails)

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   bundle install
   ```

3. Start the Rails server:
   ```
   rails server
   ```

   The server will start on your local IP address on port 5000, and the URL will be printed to the console.

### Frontend (React)

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The React application will start on port 3000 and automatically open in your browser.

## How It Works

- The Rails backend is configured to skip database configuration and bind to your local IP address on port 5000.
- The React frontend fetches data from the Rails API and displays it.
- CORS is configured to allow the frontend to communicate with the backend.
