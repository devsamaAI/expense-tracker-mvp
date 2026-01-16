import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { Expense } from '../types';

interface ChartProps {
    expenses: Expense[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export const CategoryPieChart: React.FC<ChartProps> = ({ expenses }) => {
    const data = useMemo(() => {
        const map = new Map<string, number>();
        expenses.forEach(e => {
            map.set(e.category, (map.get(e.category) || 0) + e.amount);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    if (data.length === 0) return <div className="p-4 text-center text-muted-foreground">No data to display</div>;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <ReTooltip formatter={(value: any) => `₹${Number(value).toFixed(2)}`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export const MonthlyBarChart: React.FC<ChartProps> = ({ expenses }) => {
    const data = useMemo(() => {
        const map = new Map<string, number>();
        // Sort expenses by date
        const sorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sorted.forEach(e => {
            const month = e.date.substring(0, 7); // YYYY-MM
            map.set(month, (map.get(month) || 0) + e.amount);
        });

        // Limits bars to last 6 months usually, but for now show all available
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [expenses]);

    if (data.length === 0) return <div className="p-4 text-center text-muted-foreground">No data to display</div>;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ReTooltip formatter={(value: any) => `₹${Number(value).toFixed(2)}`} />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
