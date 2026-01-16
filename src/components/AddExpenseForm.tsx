import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select } from './ui/select';
import { type ExpenseCategory, type PaymentMethod } from '../types';
import { useAppSettings } from '../hooks/useAppSettings';
import { LLMService } from '../services/llm';
import { Loader2, Sparkles, Check } from 'lucide-react';

interface AddExpenseFormProps {
    onAdd: (data: any) => Promise<any>;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAdd }) => {
    const { settings } = useAppSettings();
    const [amount, setAmount] = useState('');
    const [whatFor, setWhatFor] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
    const [category, setCategory] = useState<ExpenseCategory | ''>('');
    const [remarks, setRemarks] = useState('');

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiExplanation, setAiExplanation] = useState('');
    const [autoCategorizeDone, setAutoCategorizeDone] = useState(false);

    // Debounced auto-categorization when user stops typing
    const autoCategorize = useCallback(async (description: string, amountVal: number) => {
        if (!description || description.length < 3) return;

        setIsAnalyzing(true);
        setAiExplanation('');
        setAutoCategorizeDone(false);

        try {
            const result = await LLMService.categorize(description, amountVal, settings?.llmApiKey);
            setCategory(result.category);
            setAiExplanation(result.explanation);
            setAutoCategorizeDone(true);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    }, [settings?.llmApiKey]);

    // Auto-categorize when user stops typing (debounced)
    useEffect(() => {
        if (!whatFor || whatFor.length < 3) return;

        const timer = setTimeout(() => {
            autoCategorize(whatFor, parseFloat(amount || '0'));
        }, 800); // Wait 800ms after user stops typing

        return () => clearTimeout(timer);
    }, [whatFor, amount, autoCategorize]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !whatFor) return;

        // Auto-set current date/time
        const now = new Date().toISOString();
        const finalCategory = category || 'Others';

        await onAdd({
            amount: parseFloat(amount),
            date: now,
            whatFor,
            category: finalCategory,
            paymentMethod,
            remarks
        });

        // Reset form
        setAmount('');
        setWhatFor('');
        setCategory('');
        setRemarks('');
        setAiExplanation('');
        setAutoCategorizeDone(false);
    };

    return (
        <Card className="border-2 border-primary/20">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Quick Add Expense
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Amount - Large and prominent */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount ({settings?.currency || 'INR'})</label>
                        <Input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            placeholder="0.00"
                            className="text-2xl h-14 font-bold text-center"
                            inputMode="decimal"
                        />
                    </div>

                    {/* What for - with AI indicator */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                            What for?
                            {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin text-purple-500" />}
                            {autoCategorizeDone && !isAnalyzing && <Check className="h-4 w-4 text-green-500" />}
                        </label>
                        <Input
                            value={whatFor}
                            onChange={e => setWhatFor(e.target.value)}
                            placeholder="e.g. Lunch at Subway, Uber ride..."
                            required
                            className="text-lg"
                        />
                        {aiExplanation && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                <Sparkles className="h-3 w-3 text-purple-500 flex-shrink-0" />
                                <span>{aiExplanation}</span>
                            </div>
                        )}
                    </div>

                    {/* Category - Auto-filled but editable */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category {category && <span className="text-green-500 text-xs">(AI)</span>}</label>
                            <Select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)}>
                                <option value="">Auto-detect</option>
                                {['Food', 'Groceries', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Subscriptions', 'Rent', 'Education', 'Shopping', 'Others'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment</label>
                            <Select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}>
                                {['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'Other'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    {/* Remarks - Optional */}
                    <div className="space-y-2">
                        <Input
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            placeholder="Notes (optional)"
                        />
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg font-semibold" disabled={!amount || !whatFor}>
                        Add Expense
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
