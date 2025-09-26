# Nexus Backend - PHP API

A PHP backend API with Gemini AI integration for the Nexus project.

## Setup

1. Install dependencies:
```bash
composer install
```

2. Copy environment file:
```bash
cp env.example .env
```

3. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

4. Start the server:
```bash
php -S localhost:8000 index.php
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/generate` - Generate content using Gemini AI

## Example Usage

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?"}'
```
