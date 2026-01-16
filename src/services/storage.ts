import localforage from 'localforage';
import type { Expense, AppSettings } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Initialize stores
const expenseStore = localforage.createInstance({
    name: 'expense-tracker',
    storeName: 'expenses'
});

const settingsStore = localforage.createInstance({
    name: 'expense-tracker',
    storeName: 'settings'
});

const DEFAULT_SETTINGS: AppSettings = {
    currency: 'INR',
    llmProvider: 'groq',
    theme: 'system'
};

export const StorageService = {
    // Expense Operations
    async getAllExpenses(): Promise<Expense[]> {
        const expenses: Expense[] = [];
        await expenseStore.iterate((value: Expense) => {
            expenses.push(value);
        });
        // Sort by date descending
        return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },

    async addExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
        const newExpense: Expense = {
            ...expenseData,
            id: uuidv4(),
            createdAt: Date.now()
        };
        await expenseStore.setItem(newExpense.id, newExpense);
        return newExpense;
    },

    async updateExpense(expense: Expense): Promise<Expense> {
        await expenseStore.setItem(expense.id, expense);
        return expense;
    },

    async deleteExpense(id: string): Promise<void> {
        await expenseStore.removeItem(id);
    },

    async clearAllExpenses(): Promise<void> {
        await expenseStore.clear();
    },

    // Settings Operations
    async getSettings(): Promise<AppSettings> {
        const settings = await settingsStore.getItem<AppSettings>('user-settings');
        return { ...DEFAULT_SETTINGS, ...settings };
    },

    async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
        const current = await this.getSettings();
        const updated = { ...current, ...settings };
        await settingsStore.setItem('user-settings', updated);
        return updated;
    },

    // Export/Import (Basic)
    async exportData(): Promise<string> {
        const expenses = await this.getAllExpenses();
        return JSON.stringify(expenses, null, 2);
    }
};
