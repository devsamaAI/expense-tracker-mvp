export type Currency = 'INR' | 'USD' | 'EUR';

export type PaymentMethod = 'UPI' | 'Cash' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Other';

export type ExpenseCategory =
    | 'Food'
    | 'Groceries'
    | 'Transport'
    | 'Utilities'
    | 'Entertainment'
    | 'Health'
    | 'Subscriptions'
    | 'Rent'
    | 'Education'
    | 'Shopping'
    | 'Others';

export interface Expense {
    id: string;
    amount: number;
    date: string; // ISO string
    whatFor: string;
    category: ExpenseCategory;
    paymentMethod: PaymentMethod;
    remarks?: string;
    createdAt: number;
}

export interface LLMResponse {
    category: ExpenseCategory;
    confidence: number;
    explanation: string;
    suggestedAction?: string;
}

export interface AppSettings {
    currency: Currency;
    llmApiKey?: string;
    llmProvider: 'groq' | 'huggingface' | 'local'; // default 'huggingface'
    theme: 'light' | 'dark' | 'system';
}

export interface MonthlyReport {
    month: string; // YYYY-MM
    total: number;
    categoryBreakdown: Record<ExpenseCategory, number>;
    paymentMethodBreakdown: Record<PaymentMethod, number>;
}
