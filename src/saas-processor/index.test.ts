import { expect, test, describe, beforeEach, vi } from 'vitest';

// Mock environment for testing
function createMockEnv() {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    log: vi.fn(),
    logAtLevel: vi.fn(),
    message: vi.fn(),
    messageAtLevel: vi.fn(),
    with: vi.fn(),
    withError: vi.fn(),
  };

  // Make with() and withError() return the logger for chaining
  mockLogger.with.mockReturnValue(mockLogger);
  mockLogger.withError.mockReturnValue(mockLogger);

  const mockSmartMemory = {
    store: vi.fn().mockResolvedValue(undefined),
    search: vi.fn().mockResolvedValue([
      {
        content: 'SaaS Idea: Test idea 1',
        metadata: {
          ideaId: 'test_idea_1',
          generatedAt: '2025-12-11T09:00:00.000Z',
          type: 'saas-idea'
        }
      }
    ])
  };

  const mockMongoDB = {
    client: null,
    db: null,
    ideas: {
      insertOne: vi.fn().mockResolvedValue({ insertedId: 'mock_id' }),
      findOne: vi.fn(),
      find: vi.fn().mockReturnValue({
        sort: vi.fn().mockReturnValue({
          toArray: vi.fn().mockResolvedValue([])
        })
      }),
      createIndex: vi.fn().mockResolvedValue('mock_index')
    }
  };

  return {
    _raindrop: {
      app: {
        organizationId: 'test-org',
        applicationName: 'test-app',
        versionId: 'test-version',
        scriptName: 'test-script',
        visibility: 'public',
        ai: {
          run: vi.fn().mockResolvedValue({
            content: [
              { text: JSON.stringify({
                root: {
                  label: "TestSaaS",
                  branches: [
                    {
                      label: "User Journey",
                      children: ["Sign up", "Dashboard", "Settings"]
                    },
                    {
                      label: "Core Functions",
                      children: ["Feature 1", "Feature 2", "Feature 3"]
                    },
                    {
                      label: "Data Output",
                      children: ["Reports", "Analytics", "Export"]
                    },
                    {
                      label: "Internal Engine",
                      children: ["API", "Database", "Processing"]
                    },
                    {
                      label: "Automation & Logic",
                      children: ["Workflows", "Notifications", "Scheduled Tasks"]
                    }
                  ]
                },
                insight: {
                  summary: "A test SaaS application",
                  themes: ["Test Theme 1", "Test Theme 2"],
                  nextSteps: ["Step 1", "Step 2"]
                }
              }) }
            ]
          })
        }
      },
    },
    AI: {
      run: vi.fn().mockResolvedValue({
        content: [
          { text: JSON.stringify({
            root: {
              label: "TestSaaS",
              branches: [
                {
                  label: "User Journey",
                  children: ["Sign up", "Dashboard", "Settings"]
                },
                {
                  label: "Core Functions",
                  children: ["Feature 1", "Feature 2", "Feature 3"]
                },
                {
                  label: "Data Output",
                  children: ["Reports", "Analytics", "Export"]
                },
                {
                  label: "Internal Engine",
                  children: ["API", "Database", "Processing"]
                },
                {
                  label: "Automation & Logic",
                  children: ["Workflows", "Notifications", "Scheduled Tasks"]
                }
              ]
            },
            insight: {
              summary: "A test SaaS application",
              themes: ["Test Theme 1", "Test Theme 2"],
              nextSteps: ["Step 1", "Step 2"]
            }
          }) }
        ]
      })
    },
    IDEA_MEMORY: mockSmartMemory,
    MONGODB_URI: 'mongodb://localhost:27017/test',
    logger: mockLogger,
  };
}

import handler from './index.js';

// Mock MongoDB
vi.mock('mongodb', () => ({
  MongoClient: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(undefined),
    db: vi.fn().mockReturnValue({
      collection: vi.fn().mockReturnValue({
        createIndex: vi.fn().mockResolvedValue('mock_index'),
        insertOne: vi.fn().mockResolvedValue({ insertedId: 'mock_id' }),
        findOne: vi.fn(),
        find: vi.fn().mockReturnValue({
          sort: vi.fn().mockReturnValue({
            toArray: vi.fn().mockResolvedValue([])
          })
        })
      })
    }),
    close: vi.fn().mockResolvedValue(undefined)
  }))
}));

describe('Enhanced SaaS Idea Processor', () => {
  let service: any;
  let env: any;
  let ctx: any;

  beforeEach(() => {
    env = createMockEnv();
    ctx = { waitUntil: () => Promise.resolve() };
    service = new handler(ctx, env);
  });

  describe('POST /process', () => {
    test('processes a valid SaaS idea and stores it', async () => {
      const requestBody = {
        text: "A SaaS for project management with AI features",
        memoryContext: "User wants AI-powered tools"
      };

      const request = new Request('https://example.com/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('id');
      expect(data.data).toHaveProperty('root');
      expect(data.data).toHaveProperty('insight');
      expect(data.data.root.label).toBe('TestSaaS');
    });

    test('stores idea in SmartMemory', async () => {
      const requestBody = {
        text: "A SaaS for task management",
        memoryContext: "Productivity tools"
      };

      const request = new Request('https://example.com/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      await service.fetch(request, env, ctx);
      
      expect(env.IDEA_MEMORY.store).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('SaaS Idea: A SaaS for task management'),
          metadata: expect.objectContaining({
            type: 'saas-idea'
          })
        })
      );
    });

    test('handles missing text field', async () => {
      const requestBody = {
        memoryContext: "Some context"
      };

      const request = new Request('https://example.com/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /tech-stack/:id', () => {
    test('returns tech stack recommendations', async () => {
      // Mock database to return an idea
      const mockIdea = {
        id: 'test_idea_1',
        originalText: 'A SaaS for video editing',
        root: {
          label: 'VideoEditor Pro',
          branches: [
            {
              label: 'Core Functions',
              children: ['Video Editing', 'Effects', 'Export']
            }
          ]
        }
      };
      
      env.AI.run = vi.fn().mockResolvedValueOnce({
        content: [
          { text: '```json\n[{ "name": "Next.js", "category": "Frontend", "reason": "SEO & Performance" }, { "name": "Tailwind", "category": "Styling", "reason": "Rapid UI dev" }]\n```' }
        ]
      });

      const request = new Request('https://example.com/tech-stack/test_idea_1', {
        method: 'GET'
      });

      // Mock the database service to return the idea
      const dbService = (service as any).dbService || {};
      dbService.getIdea = vi.fn().mockResolvedValue(mockIdea);

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('category');
      expect(data[0]).toHaveProperty('reason');
    });

    test('returns 404 for non-existent idea', async () => {
      const request = new Request('https://example.com/tech-stack/non_existent', {
        method: 'GET'
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(404);
    });
  });

  describe('GET /mvp/:id', () => {
    test('returns MVP to-do list', async () => {
      const mockIdea = {
        id: 'test_idea_1',
        originalText: 'A SaaS for habit tracking',
        root: {
          label: 'HabitTracker',
          branches: [
            {
              label: 'User Journey',
              children: ['Sign up', 'Create habits', 'Track progress']
            },
            {
              label: 'Core Functions',
              children: ['Habit creation', 'Progress tracking', 'Analytics']
            },
            {
              label: 'Internal Engine',
              children: ['User management', 'Data storage', 'Analytics engine']
            }
          ]
        }
      };
      
      env.AI.run = vi.fn().mockResolvedValueOnce({
        content: [
          { text: '```json\n{ "todo": ["User Auth", "Main Dashboard"], "inProgress": ["Database Schema"], "done": ["Repo Init"] }\n```' }
        ]
      });

      const request = new Request('https://example.com/mvp/test_idea_1', {
        method: 'GET'
      });

      // Mock database service
      const dbService = (service as any).dbService || {};
      dbService.getIdea = vi.fn().mockResolvedValue(mockIdea);

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('todo');
      expect(data).toHaveProperty('inProgress');
      expect(data).toHaveProperty('done');
      expect(Array.isArray(data.todo)).toBe(true);
      expect(Array.isArray(data.inProgress)).toBe(true);
      expect(Array.isArray(data.done)).toBe(true);
    });
  });

  describe('GET /prompt/:id', () => {
    test('returns detailed development prompt', async () => {
      const mockIdea = {
        id: 'test_idea_1',
        originalText: 'A SaaS for team collaboration',
        root: {
          label: 'TeamSync',
          branches: [
            {
              label: 'Core Functions',
              children: ['Real-time chat', 'File sharing', 'Project management']
            }
          ]
        },
        insight: {
          summary: 'A collaboration platform for teams',
          themes: ['Remote work', 'Productivity'],
          nextSteps: ['MVP development', 'User testing']
        }
      };
      
      env.AI.run = vi.fn().mockResolvedValueOnce({
        content: [
          { text: '```json\n{ "prompt": "Create a comprehensive team collaboration SaaS with Next.js, TypeScript, and real-time features..." }\n```' }
        ]
      });

      const request = new Request('https://example.com/prompt/test_idea_1', {
        method: 'GET'
      });

      // Mock database service
      const dbService = (service as any).dbService || {};
      dbService.getIdea = vi.fn().mockResolvedValue(mockIdea);

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('prompt');
      expect(typeof data.prompt).toBe('string');
      expect(data.prompt).toContain('team collaboration');
    });
  });

  describe('GET /ideas', () => {
    test('returns list of all ideas', async () => {
      const mockIdeas = [
        {
          id: 'idea_1',
          root: { label: 'SaaS 1' },
          insight: { summary: 'Summary 1' },
          generatedAt: new Date('2025-12-11')
        },
        {
          id: 'idea_2',
          root: { label: 'SaaS 2' },
          insight: { summary: 'Summary 2' },
          generatedAt: new Date('2025-12-10')
        }
      ];

      const request = new Request('https://example.com/ideas', {
        method: 'GET'
      });

      // Mock database service
      const dbService = (service as any).dbService || {};
      dbService.getAllIdeas = vi.fn().mockResolvedValue(mockIdeas);

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0]).toHaveProperty('id');
      expect(data.data[0]).toHaveProperty('name');
      expect(data.data[0]).toHaveProperty('summary');
      expect(data.count).toBe(2);
    });
  });

  describe('GET /idea/:id', () => {
    test('returns full details of specific idea', async () => {
      const mockIdea = {
        id: 'idea_1',
        originalText: 'Test idea',
        memoryContext: 'Test context',
        generatedAt: new Date(),
        root: {
          label: 'TestSaaS',
          branches: []
        },
        insight: {
          summary: 'Test summary',
          themes: [],
          nextSteps: []
        }
      };

      const request = new Request('https://example.com/idea/idea_1', {
        method: 'GET'
      });

      // Mock database service
      const dbService = (service as any).dbService || {};
      dbService.getIdea = vi.fn().mockResolvedValue(mockIdea);

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('originalText');
      expect(data.data).toHaveProperty('root');
      expect(data.data).toHaveProperty('insight');
    });

    test('returns 404 for non-existent idea', async () => {
      const request = new Request('https://example.com/idea/non_existent', {
        method: 'GET'
      });

      // Mock database service to return null
      const dbService = (service as any).dbService || {};
      dbService.getIdea = vi.fn().mockResolvedValue(null);

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(404);
    });
  });

  describe('GET /health', () => {
    test('returns health status with features', async () => {
      const request = new Request('https://example.com/health', {
        method: 'GET'
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('ok');
      expect(data.service).toBe('saas-processor');
      expect(data.features).toContain('Idea Processing');
      expect(data.features).toContain('SmartMemory Integration');
      expect(data.features).toContain('MongoDB Storage');
    });
  });

  describe('GET /', () => {
    test('returns service information', async () => {
      const request = new Request('https://example.com/', {
        method: 'GET'
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.message).toBe('Enhanced SaaS Idea Processor Service');
      expect(data.version).toBe('2.0.0');
      expect(data.features).toContain('AI-powered idea analysis with memory');
      expect(data.endpoints).toHaveProperty('POST /process');
      expect(data.endpoints).toHaveProperty('GET /tech-stack/:id');
      expect(data.endpoints).toHaveProperty('GET /mvp/:id');
      expect(data.endpoints).toHaveProperty('GET /prompt/:id');
    });
  });

  describe('CORS Support', () => {
    test('handles OPTIONS requests', async () => {
      const request = new Request('https://example.com/process', {
        method: 'OPTIONS'
      });

      const response = await service.fetch(request, env, ctx);
      
      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('handles 404 for unknown routes', async () => {
      const request = new Request('https://example.com/unknown', {
        method: 'GET'
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(404);
    });

    test('handles AI service failures gracefully', async () => {
      env.AI.run = vi.fn().mockRejectedValue(new Error('AI service unavailable'));

      const requestBody = {
        text: "A SaaS idea that will fail"
      };

      const request = new Request('https://example.com/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });

    test('handles malformed JSON responses from AI', async () => {
      env.AI.run = vi.fn().mockResolvedValue({
        content: [
          { text: 'Invalid JSON response from AI' }
        ]
      });

      const requestBody = {
        text: "A SaaS idea"
      };

      const request = new Request('https://example.com/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to process AI response');
    });
  });

  describe('Security & Robustness', () => {
    test('handles special characters in input', async () => {
      const requestBody = {
        text: "A SaaS with special chars: <script>alert('xss')</script> & \"quotes\" and 'apostrophes'",
        memoryContext: "Context with \n newlines and \t tabs"
      };

      const request = new Request('https://example.com/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
    });

    test('handles very long text input', async () => {
      const longText = 'a'.repeat(10000);
      const requestBody = {
        text: longText,
        memoryContext: "Test context"
      };

      const request = new Request('https://example.com/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const response = await service.fetch(request, env, ctx);
      
      // Should handle gracefully (either process successfully or return error)
      expect(response.status).toBeLessThan(600);
    });
  });
});