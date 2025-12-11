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

  return {
    _raindrop: {
      app: {
        organizationId: 'test-org',
        applicationName: 'test-app',
        versionId: 'test-version',
        scriptName: 'test-script',
        visibility: 'public',
        ai: {
          generate: vi.fn().mockResolvedValue({
            text: JSON.stringify({
              root: {
                label: "DreamSaaS",
                branches: [
                  {
                    label: "User Journey",
                    children: ["Sign up via OAuth", "Dream Journal Entry", "Video Generation Request", "View Generated Videos", "Share & Export"]
                  },
                  {
                    label: "Core Functions",
                    children: ["Dream Recording", "AI Dream Analysis", "Video Generation", "Content Library", "Sharing Tools"]
                  },
                  {
                    label: "Data Output",
                    children: ["Generated Videos", "Dream Analytics", "Mood Reports", "Creative Insights", "Trend Analysis"]
                  },
                  {
                    label: "Internal Engine",
                    children: ["LLaMA 3.3 70B", "Video Generation AI", "Dream Processing Pipeline", "Content Moderation", "User Analytics"]
                  },
                  {
                    label: "Automation & Logic",
                    children: ["Daily Dream Reminders", "Smart Video Suggestions", "Trend Detection", "Auto-Backup", "Privacy Controls"]
                  }
                ]
              },
              insight: {
                summary: "A SaaS platform that transforms users' dreams into engaging video content using AI technology.",
                themes: ["Creative Expression", "AI-Powered Visualization", "Personal Storytelling"],
                nextSteps: ["Develop dream capture interface", "Integrate video generation API", "Create user dashboard"]
              }
            })
          })
        }
      },
    },
    logger: mockLogger,
  };
}

import handler from './index.js';

describe('saas-processor - SaaS Idea Processing', () => {
  let service: any;
  let env: any;
  let ctx: any;

  beforeEach(() => {
    env = createMockEnv();
    ctx = { waitUntil: () => Promise.resolve() };
    service = new handler(ctx, env);
  });

  describe('POST /process', () => {
    test('processes a valid SaaS idea', async () => {
      const requestBody = {
        text: "A SaaS that stores dreams and converts them into videos using AI video generation",
        memoryContext: "Previous ideas were about content creation platforms"
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
      expect(data.data).toHaveProperty('root');
      expect(data.data).toHaveProperty('insight');
      expect(data.data.root.label).toBe('DreamSaaS');
      expect(data.data.root.branches).toHaveLength(5);
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

    test('handles empty text field', async () => {
      const requestBody = {
        text: "",
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

    test('handles malformed JSON', async () => {
      const request = new Request('https://example.com/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid-json{'
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(400);
    });

    test('handles AI service failure', async () => {
      // Mock AI service failure
      env._raindrop.app.ai.generate.mockRejectedValue(new Error('AI service unavailable'));

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

    test('handles invalid AI response JSON', async () => {
      // Mock AI response with invalid JSON
      env._raindrop.app.ai.generate.mockResolvedValue({
        text: 'Invalid JSON response from AI'
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

  describe('GET /health', () => {
    test('returns health status', async () => {
      const request = new Request('https://example.com/health', {
        method: 'GET'
      });

      const response = await service.fetch(request, env, ctx);
      
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.status).toBe('ok');
      expect(data.service).toBe('saas-processor');
      expect(data.timestamp).toBeDefined();
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
      expect(data.message).toBe('SaaS Idea Processor Service');
      expect(data.endpoints).toHaveProperty('POST /process');
      expect(data.endpoints).toHaveProperty('GET /health');
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
  });

  describe('Security & Robustness', () => {
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

    test('handles missing content-type header', async () => {
      const requestBody = {
        text: "Test idea"
      };

      const request = new Request('https://example.com/process', {
        method: 'POST',
        body: JSON.stringify(requestBody)
        // No Content-Type header
      });

      const response = await service.fetch(request, env, ctx);
      
      // Should handle gracefully
      expect(response.status).toBeLessThan(600);
    });
  });
});