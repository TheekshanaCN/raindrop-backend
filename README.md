# SaaS Idea Processor API

## 🚀 Overview

The SaaS Idea Processor is an advanced AI-powered service that transforms raw SaaS ideas into comprehensive architectural maps, tech stack recommendations, MVP roadmaps, and detailed development prompts. Built on the Raindrop framework with Llama 3.3 70B AI model, this service provides end-to-end SaaS ideation and planning capabilities.

## 🏗️ Architecture

### Technology Stack
- **Framework**: Raindrop Framework with Hono.js
- **AI Model**: Llama 3.3 70B (via Raindrop AI)
- **Language**: TypeScript
- **Database**: MongoDB Atlas (ready - currently using in-memory cache)
- **Memory**: Raindrop SmartMemory (for AI context retention)
- **Validation**: Zod schemas
- **API**: RESTful with CORS support

### Infrastructure Components
- **Service**: HTTP API service for public access
- **SmartMemory**: AI context and memory management
- **Database**: MongoDB Atlas for persistent storage
- **In-Memory Cache**: Temporary storage for active sessions

## 📡 API Endpoints

### Base URL
```
https://saas-processor.01kbdpscga0zef6c3hshmw5swq.lmapp.run
```

---

### 1. Process New SaaS Idea
**POST** `/process`

Processes a raw SaaS idea and generates a structured architectural map.

#### Request Body
```json
{
  "text": "A SaaS that stores dreams and converts them into videos using AI video generation",
  "memoryContext": "Previous ideas were about content creation platforms"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "idea_1234567890_abc123",
    "root": {
      "label": "DreamWeaver",
      "branches": [
        {
          "label": "User Journey",
          "children": ["Sign up and connect dream journaling method", "Onboarding flow", "Dashboard view"]
        },
        {
          "label": "Core Functions", 
          "children": ["Dream recording and transcription", "AI-powered video generation", "Emotion analysis"]
        },
        {
          "label": "Data Output",
          "children": ["Generated videos", "Dream analytics", "Progress reports"]
        },
        {
          "label": "Internal Engine",
          "children": ["AI video generation models", "NLP processing", "Cloud storage"]
        },
        {
          "label": "Automation & Logic",
          "children": ["Daily dream reminders", "Auto-categorization", "Smart notifications"]
        }
      ]
    },
    "insight": {
      "summary": "DreamWeaver is a SaaS that leverages AI to convert user-recorded dreams into immersive videos...",
      "themes": ["AI-powered content creation", "Personalized analytics"],
      "nextSteps": ["Conduct market research", "Develop MVP"]
    },
    "generatedAt": "2025-12-11T09:21:42.199Z"
  }
}
```

#### Features Generated
- ✅ **Catchy SaaS Name**: AI-generated brandable name
- ✅ **5 Core Branches**: User Journey, Core Functions, Data Output, Internal Engine, Automation & Logic
- ✅ **3-5 Child Nodes**: Specific implementation details per branch
- ✅ **Business Insights**: Summary, themes, and next steps
- ✅ **Unique ID**: For accessing generated content

---

### 2. Get Tech Stack Recommendations
**GET** `/tech-stack/{ideaId}`

Generates technology stack recommendations for a specific SaaS idea.

#### Response Format
```json
[
  {
    "name": "Next.js",
    "category": "Frontend",
    "reason": "SEO & Performance"
  },
  {
    "name": "Tailwind CSS",
    "category": "Styling", 
    "reason": "Rapid UI dev"
  },
  {
    "name": "Supabase",
    "category": "Backend",
    "reason": "Full-stack solution"
  },
  {
    "name": "Prisma",
    "category": "Database",
    "reason": "Type-safe DB"
  },
  {
    "name": "Vercel",
    "category": "Deployment",
    "reason": "Easy deployment"
  }
]
```

#### Specifications
- **5-7 Technologies**: Comprehensive stack coverage
- **Categories**: Frontend, Backend, Database, Auth, Deployment, AI/ML
- **Punchy Reasons**: Max 5 words per technology
- **Modern Stack**: Current, scalable technologies

---

### 3. Get MVP To-Do List
**GET** `/mvp/{ideaId}`

Creates a comprehensive MVP roadmap with task status tracking.

#### Response Format
```json
{
  "todo": [
    "User Authentication System",
    "Main Dashboard UI",
    "Core Feature Implementation",
    "Database Schema Design",
    "API Integration",
    "Basic Analytics"
  ],
  "inProgress": [
    "Project Setup",
    "Design System"
  ],
  "done": [
    "Repository Initialization",
    "Requirements Gathering"
  ]
}
```

#### Task Categories
- **Todo**: 4-6 tasks to start (4-6 items)
- **In Progress**: Current work items (2-3 items)
- **Done**: Completed items (1-2 items)

---

### 4. Generate Development Prompt
**GET** `/prompt/{ideaId}`

Creates a detailed, comprehensive prompt for AI coding assistants (Cursor, GitHub Copilot, etc.) to build the entire SaaS application.

#### Response Format
```json
{
  "prompt": "Create a comprehensive SaaS application called 'DreamWeaver' that transforms user dreams into AI-generated videos...\n\n## Architecture Overview\n...\n\n## Technology Stack\n...\n\n## Implementation Details\n...\n\n[Complete development guidance - 2000+ words]"
}
```

#### Prompt Contents
1. **Project Overview & Architecture**
2. **Technology Stack Recommendations**
3. **Feature Implementation Details**
4. **Database Schema**
5. **API Endpoints Specification**
6. **Frontend Components Structure**
7. **Authentication & Security**
8. **Deployment Instructions**
9. **Testing Approach**
10. **Timeline & Development Phases**

---

### 5. List All Ideas
**GET** `/ideas`

Retrieves a summary list of all processed SaaS ideas.

#### Response Format
```json
{
  "success": true,
  "data": [
    {
      "id": "idea_1234567890_abc123",
      "name": "DreamWeaver",
      "summary": "AI-powered dream-to-video transformation platform",
      "generatedAt": "2025-12-11T09:21:42.199Z"
    },
    {
      "id": "idea_1234567891_def456", 
      "name": "FreelanceFlow",
      "summary": "Financial management platform for freelancers",
      "generatedAt": "2025-12-11T09:25:15.123Z"
    }
  ],
  "count": 2
}
```

---

### 6. Get Full Idea Details
**GET** `/idea/{ideaId}`

Retrieves complete details of a specific SaaS idea including all generated content.

#### Response
Returns the complete idea object with all branches, insights, and metadata.

---

### 7. Health Check
**GET** `/health`

Service health and feature status monitoring.

#### Response
```json
{
  "status": "ok",
  "service": "saas-processor",
  "timestamp": "2025-12-11T09:21:42.199Z",
  "features": [
    "Idea Processing",
    "In-Memory Cache", 
    "Tech Stack Recommendations",
    "MVP Generation",
    "Development Prompts"
  ]
}
```

---

### 8. Service Information
**GET** `/`

General service information and available endpoints.

## 🧠 AI Memory & Context

### SmartMemory Integration
- **Context Retention**: Remembers previous ideas for better context
- **Learning**: Improves recommendations based on processed ideas
- **Personalization**: Adapts to user patterns and preferences

### Memory Features
- **Idea History**: Access to previously processed concepts
- **Pattern Recognition**: Identifies common SaaS patterns
- **Contextual AI**: Enhanced responses with historical context

## 💾 Database Architecture

### Current Implementation
- **In-Memory Cache**: Temporary storage for active sessions
- **MongoDB Atlas**: Ready for persistent storage integration
- **SmartMemory**: AI-powered semantic memory

### Planned Database Schema
```javascript
{
  _id: ObjectId,
  id: "idea_1234567890_abc123",
  originalText: "Raw SaaS idea description",
  memoryContext: "Previous context and user input",
  generatedAt: ISODate,
  root: {
    label: "Generated SaaS Name",
    branches: [...]
  },
  insight: {
    summary: "Business summary",
    themes: ["Theme1", "Theme2"],
    nextSteps: ["Step1", "Step2"]
  }
}
```

### Database Features
- **Indexing**: Optimized for ID and timestamp queries
- **Search**: Full-text search on idea content
- **Scalability**: MongoDB Atlas for global distribution

## 🔄 Workflow Integration

### Complete Idea-to-Code Workflow

1. **Input**: Raw SaaS idea → `POST /process`
2. **Analysis**: AI generates structured architecture
3. **Planning**: Get MVP roadmap → `GET /mvp/{id}`
4. **Technology**: Stack recommendations → `GET /tech-stack/{id}`
5. **Development**: Complete coding prompt → `GET /prompt/{id}`
6. **Build**: Use prompt with AI coding tools
7. **Deploy**: Full-stack SaaS application

### Example Usage Sequence
```bash
# 1. Process idea
curl -X POST https://saas-processor.../process \
  -H "Content-Type: application/json" \
  -d '{"text": "AI-powered recipe planner", "memoryContext": "Food tech startup"}'

# Response: {"success": true, "data": {"id": "idea_123...", ...}}

# 2. Get tech stack
curl https://saas-processor.../tech-stack/idea_123

# 3. Get MVP roadmap  
curl https://saas-processor.../mvp/idea_123

# 4. Get development prompt
curl https://saas-processor.../prompt/idea_123

# 5. Build with AI coding tool using the generated prompt
```

## 🛠️ Development & Deployment

### Local Development
```bash
# Clone and setup
git clone <repository>
cd saas-idea-processor
npm install

# Build
npm run build

# Deploy to Raindrop
raindrop build deploy
```

### Environment Variables
- `MONGODB_URI`: MongoDB Atlas connection string
- `AI_MODEL`: Llama 3.3 70B (configured in Raindrop)

### Deployment Architecture
- **Platform**: Raindrop Cloud
- **Regions**: Global distribution
- **Scaling**: Automatic scaling with load
- **Monitoring**: Built-in logs and metrics

## 📊 Usage Examples

### Example 1: Dream-to-Video SaaS
```bash
curl -X POST https://saas-processor.01kbdpscga0zef6c3hshmw5swq.lmapp.run/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "A SaaS that stores dreams and converts them into videos using AI video generation",
    "memoryContext": "Focus on creative AI applications"
  }'
```

**Generated Output**:
- **Name**: DreamWeaver
- **Tech Stack**: Next.js, OpenAI API, Prisma, Vercel
- **MVP**: User Auth, Dream Journal, Video Generation API
- **Prompt**: 2000+ word development guide

### Example 2: Freelancer Finance Tool
```bash
curl -X POST https://saas-processor.01kbdpscga0zef6c3hshmw5swq.lmapp.run/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "A platform for freelancers to manage invoices and track payments",
    "memoryContext": "Financial tools for independent workers"
  }'
```

**Generated Output**:
- **Name**: FreelanceFlow
- **Tech Stack**: React, Node.js, Stripe API, PostgreSQL
- **MVP**: Invoice System, Payment Integration, Dashboard
- **Prompt**: Complete fintech development guide

## 🔒 Security & Reliability

### Security Features
- **CORS**: Configurable cross-origin access
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: Ready for implementation

### Reliability Features
- **Error Recovery**: Graceful failure handling
- **Response Validation**: AI output validation
- **Monitoring**: Health checks and logging
- **Caching**: In-memory performance optimization

## 🚀 Future Enhancements

### Planned Features
- [ ] **User Authentication**: Personal idea management
- [ ] **Real Database**: MongoDB Atlas integration
- [ ] **Rate Limiting**: API usage controls
- [ ] **Export Formats**: PDF, Word, Markdown
- [ ] **Collaboration**: Team idea sharing
- [ ] **Analytics**: Usage insights and trends

### Scalability Roadmap
- [ ] **Multi-region**: Global deployment
- [ ] **Load Balancing**: High availability
- [ ] **Caching Layer**: Redis integration
- [ ] **Background Processing**: Async AI processing

## 📝 API Documentation Standards

### Response Standards
- **Success**: `200 OK` with structured data
- **Errors**: `4xx/5xx` with error messages
- **Formats**: Consistent JSON responses
- **Validation**: Input validation with clear errors

### Error Handling
```json
{
  "error": "Failed to process AI response",
  "message": "Invalid JSON format from AI model",
  "code": "AI_PARSE_ERROR"
}
```

## 🤝 Support & Contributing

### Getting Help
- **Documentation**: This README file
- **Health Check**: `/health` endpoint
- **Issues**: Create GitHub issues for bugs
- **Features**: Request features via issues

### Contributing
1. Fork the repository
2. Create feature branch
3. Implement with tests
4. Submit pull request
5. Code review and merge

---

## 📞 Contact

- **Service**: SaaS Idea Processor v2.0.0
- **Base URL**: https://saas-processor.01kbdpscga0zef6c3hshmw5swq.lmapp.run
- **Framework**: Raindrop + Llama 3.3 70B
- **Status**: Production Ready 🚀

---

*Built with ❤️ using Raindrop Framework and AI-powered innovation*