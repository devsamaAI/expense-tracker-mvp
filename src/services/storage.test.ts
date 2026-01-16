import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService } from './storage';
import { Expense } from '../types';

describe('StorageService', () => {
    beforeEach(async () => {
        await StorageService.clearAllExpenses();
    });

    it('should add and retrieve an expense', async () => {
        const expenseData = {
            amount: 100,
            date: '2023-01-01',
            whatFor: 'Test Expense',
            category: 'Food' as const,
            paymentMethod: 'Cash' as const
        };

        const newExpense = await StorageService.addExpense(expenseData);
        expect(newExpense.id).toBeDefined();
        expect(newExpense.amount).toBe(100);

        const all = await StorageService.getAllExpenses();
        expect(all).toHaveLength(1);
        expect(all[0].id).toBe(newExpense.id);
    });

    it('should delete an expense', async () => {
        const expenseData = {
            amount: 50,
            date: '2023-01-02',
            whatFor: 'Delete Me',
            category: 'Transport' as const,
            paymentMethod: 'UPI' as const
        };

        const newExpense = await StorageService.addExpense(expenseData);
        await StorageService.deleteExpense(newExpense.id);

        const all = await StorageService.getAllExpenses();
        expect(all).toHaveLength(0);
    });
});
