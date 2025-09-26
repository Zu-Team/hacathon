# Nexus AI Platform

A modern web application built with Next.js frontend and PHP backend, integrated with Google Gemini AI.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: PHP 8.0+, cURL for API calls
- **AI**: Google Gemini 2.5 Flash API
- **Development**: Hot reload, TypeScript support

## Project Structure

```
nexus/
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   └── lib/       # API service utilities
│   └── package.json
├── backend/           # PHP API server
│   ├── index.php      # Main API endpoint
│   ├── composer.json  # PHP dependencies
│   └── .env          # Environment variables
├── start-dev.bat     # Windows development script
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PHP 8.0+
- Google Gemini API key

### Setup

1. **Clone and navigate to project**:
   ```bash
   cd nexus
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   # Edit .env file with your Gemini API key
   # GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   ```

4. **Start Development Servers**:
   
   **Option A: Use the batch script (Windows)**:
   ```bash
   ./start-dev.bat
   ```
   
   **Option B: Start manually**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   php -S localhost:8000 index.php
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health

## API Endpoints

### Backend (PHP)

- `GET /api/health` - Health check and API key status
- `POST /api/generate` - Generate content using Gemini AI

#### Example API Usage:
```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Features

- ✅ **Modern UI**: Responsive design with Tailwind CSS
- ✅ **Type Safety**: Full TypeScript support
- ✅ **AI Integration**: Google Gemini 2.5 Flash
- ✅ **Real-time**: Hot reload development
- ✅ **CORS Enabled**: Cross-origin requests supported
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Health Monitoring**: API status checking

## Development

The application uses a clean separation between frontend and backend:

- **Frontend** handles UI, user interactions, and API calls
- **Backend** manages Gemini API integration and business logic
- **API Service** provides a clean interface between frontend and backend

## Deployment

For production deployment:

1. Set up a web server (Apache/Nginx) for PHP backend
2. Build Next.js frontend: `npm run build`
3. Configure environment variables for production
4. Set up proper CORS policies
5. Use HTTPS for API key security

## License

MIT License