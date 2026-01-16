import { useState, useEffect } from 'react';
import type { Expense } from '../types';
import { StorageService } from '../services/storage';

export function useExpenses() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await StorageService.getAllExpenses();
            setExpenses(data);
        } catch (err) {
            setError('Failed to load expenses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadExpenses();
    }, []);

    const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
        try {
            const newExpense = await StorageService.addExpense(expenseData);
            setExpenses(prev => [newExpense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            return newExpense;
        } catch (err) {
            setError('Failed to add expense');
            throw err;
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            await StorageService.deleteExpense(id);
            setExpenses(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            setError('Failed to delete expense');
            throw err;
        }
    };

    return { expenses, loading, error, addExpense, deleteExpense, refresh: loadExpenses };
}
