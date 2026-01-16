import { useState } from 'react'
import { Download, Settings as SettingsIcon, LayoutDashboard, List as ListIcon } from 'lucide-react'
import { Button } from './components/ui/button'
import { useExpenses } from './hooks/useExpenses'
import { AddExpenseForm } from './components/AddExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { CategoryPieChart, MonthlyBarChart } from './components/Charts'
import { SettingsPanel } from './components/SettingsPanel'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { StorageService } from './services/storage'

function App() {
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState<'dashboard' | 'list'>('dashboard');

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthlySpent = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleExport = async () => {
    const json = await StorageService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString()}.json`;
    a.click();
  };

  const handleCSVExport = () => {
    const headers = ['Date', 'Amount', 'What For', 'Category', 'Payment Method', 'Remarks'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(e => [
        `"${e.date}"`,
        e.amount,
        `"${e.whatFor}"`,
        `"${e.category}"`,
        `"${e.paymentMethod}"`,
        `"${e.remarks || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-8">
      {/* Header - Sticky on mobile */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">Expense<span className="text-purple-500">Track</span></h1>
          </div>
          <div className="flex gap-1 md:gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="h-9 w-9">
              <SettingsIcon className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleCSVExport} className="hidden sm:flex">
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:flex">
              <Download className="h-4 w-4 mr-1" />
              JSON
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 py-4 space-y-4">
        {showSettings && <SettingsPanel />}

        {/* Summary Cards - Stack on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="col-span-1">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-xl md:text-2xl font-bold">₹{totalSpent.toFixed(0)}</div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="pb-1 pt-3 px-3">
              <CardTitle className="text-xs font-medium text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-xl md:text-2xl font-bold text-green-500">₹{monthlySpent.toFixed(0)}</div>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-2">
            <CardContent className="p-3">
              <div className="flex gap-2">
                <Button
                  variant={view === 'dashboard' ? 'default' : 'outline'}
                  className="flex-1 h-10"
                  onClick={() => setView('dashboard')}
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" /> Dashboard
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  className="flex-1 h-10"
                  onClick={() => setView('list')}
                >
                  <ListIcon className="h-4 w-4 mr-1" /> List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Mobile first layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form - Full width on mobile, sidebar on desktop */}
          <div className="lg:col-span-1 order-1">
            <AddExpenseForm onAdd={addExpense} />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-2 space-y-4 order-2">
            {view === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CategoryPieChart expenses={expenses} />
                  <MonthlyBarChart expenses={expenses} />
                </div>
                <ExpenseList expenses={expenses.slice(0, 5)} onDelete={deleteExpense} />
              </>
            )}

            {view === 'list' && (
              <ExpenseList expenses={expenses} onDelete={deleteExpense} />
            )}
          </div>
        </div>
      </main>

      {/* Mobile Export FAB */}
      <div className="fixed bottom-4 right-4 flex gap-2 sm:hidden z-40">
        <Button size="icon" variant="outline" onClick={handleCSVExport} className="h-12 w-12 rounded-full shadow-lg bg-background">
          <Download className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default App
