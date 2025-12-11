# SaaS Idea Processor

A Raindrop AI-powered service that transforms SaaS ideas into structured architectural maps using Llama 3.3 70B model.

## Overview

This service takes raw SaaS ideas as input and generates structured visual maps with the following components:

- **Root Node**: A catchy name for the SaaS idea
- **5 Main Branches**:
  - User Journey: User's path inside the product
  - Core Functions: Main value-creating features  
  - Data Output: Reports and data users receive
  - Internal Engine: Backend logic and AI models
  - Automation & Logic: Scheduled actions and smart workflows

## API Endpoints

### POST `/process`
Processes a SaaS idea and generates structured analysis.

**Request Body:**
```json
{
  "text": "A SaaS that stores dreams and converts them into videos using AI video generation",
  "memoryContext": "Previous ideas were about content creation platforms"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "root": {
      "label": "DreamWeaver",
      "branches": [
        {
          "label": "User Journey",
          "children": ["Sign up and connect a dream journaling method", "Onboarding flow", "Dashboard view"]
        },
        {
          "label": "Core Functions", 
          "children": ["Dream recording and transcription", "AI-powered video generation", "Emotion analysis"]
        },
        // ... more branches
      ]
    },
    "insight": {
      "summary": "DreamWeaver is a SaaS that leverages AI to convert user-recorded dreams into immersive videos...",
      "themes": ["AI-powered content creation", "Personalized analytics"],
      "nextSteps": ["Conduct market research", "Develop MVP"]
    }
  }
}
```

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "saas-processor",
  "timestamp": "2025-12-11T09:21:42.199Z"
}
```

### GET `/`
Service information endpoint.

## Features

- ✅ No authentication required (public API)
- ✅ Uses Raindrop AI Model (Llama 3.3 70B)
- ✅ Structured JSON response with validation
- ✅ CORS enabled for web applications
- ✅ Comprehensive error handling
- ✅ Markdown code block parsing
- ✅ Input validation with Zod schemas

## Deployment

The service is deployed at:
- **Primary URL**: https://saas-processor.01kbdpscga0zef6c3hshmw5swq.lmapp.run
- **Service URL**: https://svc-01kc6b0zedga5cp9qzx9jw2zwa.01kbdpscga0zef6c3hshmw5swq.lmapp.run

## Usage Examples

### Example 1: Dream to Video SaaS
```bash
curl -X POST https://saas-processor.01kbdpscga0zef6c3hshmw5swq.lmapp.run/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "A SaaS that stores dreams and converts them into videos using AI video generation",
    "memoryContext": "Previous ideas were about content creation platforms"
  }'
```

### Example 2: Freelancer Finance Tool
```bash
curl -X POST https://saas-processor.01kbdpscga0zef6c3hshmw5swq.lmapp.run/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "A platform for freelancers to manage invoices and track payments",
    "memoryContext": "User is interested in financial tools"
  }'
```

## Technical Details

- **Framework**: Raindrop Framework with Hono.js
- **AI Model**: Llama 3.3 70B via Raindrop AI
- **Validation**: Zod schemas for request/response validation
- **Language**: TypeScript
- **CORS**: Enabled for all origins (configure for production)

## Error Handling

The service provides detailed error messages for:
- Missing or invalid input fields
- AI service failures
- JSON parsing errors
- Response validation failures

## Next Steps

- Add rate limiting
- Implement user authentication
- Add request/response logging
- Configure CORS for specific domains
- Add caching for repeated requests
- Create web dashboard for easier usage