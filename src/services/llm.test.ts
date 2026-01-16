import { describe, it, expect, vi, afterEach } from 'vitest';
import { LLMService } from './llm';

describe('LLMService', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
        vi.restoreAllMocks();
    });

    it('should use local fallback when no API key is provided', async () => {
        const result = await LLMService.categorize('lunch at mcdonalds', 500);
        expect(result.category).toBe('Food');
        expect(result.explanation).toContain('Matched keyword');
    });

    it('should use local fallback when API fails', async () => {
        global.fetch = vi.fn(() => Promise.resolve({
            ok: false,
            statusText: 'Server Error'
        } as Response));

        const result = await LLMService.categorize('uber ride', 200, 'fake-key');
        expect(result.category).toBe('Transport');
    });

    it('should parse JSON response from API', async () => {
        const mockResponse = {
            generated_text: 'Sure! Here is the JSON: { "category": "Utilities", "confidence": 0.99, "explanation": "It is a bill." }'
        };

        global.fetch = vi.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve([mockResponse]) // HF returns array for some models
        } as Response));

        const result = await LLMService.categorize('electricity bill', 1000, 'fake-key');
        expect(result.category).toBe('Utilities');
        expect(result.confidence).toBe(0.99);
    });
});
