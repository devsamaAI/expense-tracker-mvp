import type { ExpenseCategory, LLMResponse } from '../types';

// Groq API endpoint
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Local fallback dictionary
const KEYWORD_MAP: Record<string, ExpenseCategory> = {
    'food': 'Food', 'lunch': 'Food', 'dinner': 'Food', 'breakfast': 'Food', 'restaurant': 'Food', 'cafe': 'Food', 'biryani': 'Food', 'pizza': 'Food', 'burger': 'Food', 'coffee': 'Food', 'tea': 'Food', 'snack': 'Food',
    'groceries': 'Groceries', 'vegetables': 'Groceries', 'fruits': 'Groceries', 'supermarket': 'Groceries', 'milk': 'Groceries', 'eggs': 'Groceries', 'bread': 'Groceries',
    'uber': 'Transport', 'ola': 'Transport', 'taxi': 'Transport', 'bus': 'Transport', 'train': 'Transport', 'fuel': 'Transport', 'petrol': 'Transport', 'diesel': 'Transport', 'metro': 'Transport', 'auto': 'Transport', 'rickshaw': 'Transport',
    'electricity': 'Utilities', 'water': 'Utilities', 'gas': 'Utilities', 'internet': 'Utilities', 'bill': 'Utilities', 'wifi': 'Utilities', 'broadband': 'Utilities',
    'movie': 'Entertainment', 'cinema': 'Entertainment', 'netflix': 'Subscriptions', 'spotify': 'Subscriptions', 'prime': 'Subscriptions', 'hotstar': 'Subscriptions', 'youtube': 'Subscriptions',
    'medicine': 'Health', 'doctor': 'Health', 'pharmacy': 'Health', 'gym': 'Health', 'hospital': 'Health', 'clinic': 'Health',
    'rent': 'Rent', 'house': 'Rent', 'apartment': 'Rent',
    'book': 'Education', 'course': 'Education', 'tuition': 'Education', 'school': 'Education', 'college': 'Education',
    'amazon': 'Shopping', 'flipkart': 'Shopping', 'clothes': 'Shopping', 'shoes': 'Shopping', 'shopping': 'Shopping',
};

export const LLMService = {
    async categorize(description: string, amount: number, apiKey?: string): Promise<LLMResponse> {
        if (!apiKey) {
            console.warn("No API key provided, using local fallback.");
            return this.localFallback(description);
        }

        const prompt = `You are an intelligent expense categorization assistant. Categorize the following expense into exactly one of these categories:
[Food, Groceries, Transport, Utilities, Entertainment, Health, Subscriptions, Rent, Education, Shopping, Others]

Expense Description: "${description}"
Amount: ₹${amount}

Return ONLY a valid JSON object in this exact format (no markdown, no extra text):
{"category": "CategoryName", "confidence": 0.95, "explanation": "Brief reason"}`;

        try {
            const response = await fetch(GROQ_API_URL, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: "You are a helpful expense categorization assistant. Always respond with valid JSON only." },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.1,
                    max_tokens: 150,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Groq API Error:", errorText);
                throw new Error(`API Error: ${response.statusText}`);
            }

            const result = await response.json();
            const generatedText = result.choices?.[0]?.message?.content || '';

            // Parse JSON from the text
            const jsonMatch = generatedText.match(/\{[\s\S]*?\}/);
            if (jsonMatch) {
                const json = JSON.parse(jsonMatch[0]);
                return {
                    category: json.category || 'Others',
                    confidence: json.confidence || 0.8,
                    explanation: json.explanation || 'Categorized by AI',
                    suggestedAction: json.suggested_action
                };
            } else {
                throw new Error("Failed to parse JSON from LLM response");
            }

        } catch (error) {
            console.error("LLM Categorization failed:", error);
            return this.localFallback(description);
        }
    },

    localFallback(description: string): LLMResponse {
        const lowerDesc = description.toLowerCase();
        let category: ExpenseCategory = 'Others';
        let matchWord = '';

        for (const [keyword, cat] of Object.entries(KEYWORD_MAP)) {
            if (lowerDesc.includes(keyword)) {
                category = cat;
                matchWord = keyword;
                break;
            }
        }

        return {
            category,
            confidence: matchWord ? 0.75 : 0.3,
            explanation: matchWord
                ? `Matched keyword '${matchWord}' in description.`
                : 'Could not confidently categorize, defaulted to Others.',
            suggestedAction: matchWord ? undefined : 'Check if this fits a specific category.'
        };
    }
};
