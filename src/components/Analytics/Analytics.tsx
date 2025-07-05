import React from 'react';
import { PieChart, TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';
import { useTransaction } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/helpers';

const Analytics: React.FC = () => {
  const { state } = useTransaction();

  const expensesByCategory = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = state.categories.find(c => c.id === transaction.category);
      if (category) {
        acc[category.name] = (acc[category.name] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

  const incomeByCategory = state.transactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      const category = state.categories.find(c => c.id === transaction.category);
      if (category) {
        acc[category.name] = (acc[category.name] || 0) + transaction.amount;
      }
      return acc;
    }, {} as Record<string, number>);

  const monthlyData = state.transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    acc[month][transaction.type] += transaction.amount;
    return acc;
  }, {} as Record<string, { income: number; expense: number }>);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Breakdown */}
        <div className="financial-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-100 flex items-center">
              <PieChart className="w-6 h-6 text-red-400 mr-3" />
              Expense Breakdown
            </h3>
          </div>
          
          {Object.keys(expensesByCategory).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, amount], index) => {
                  const percentage = (amount / state.stats.totalExpenses) * 100;
                  return (
                    <div 
                      key={category} 
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-red-400 rounded-full shadow-lg"></div>
                        <span className="text-sm font-semibold text-slate-200">{category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-100">{formatCurrency(amount)}</p>
                        <p className="text-xs text-slate-400 font-medium">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <PieChart className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">No expense data available</p>
            </div>
          )}
        </div>

        {/* Income Breakdown */}
        <div className="financial-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-100 flex items-center">
              <TrendingUp className="w-6 h-6 text-emerald-400 mr-3" />
              Income Sources
            </h3>
          </div>
          
          {Object.keys(incomeByCategory).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(incomeByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, amount], index) => {
                  const percentage = (amount / state.stats.totalIncome) * 100;
                  return (
                    <div 
                      key={category} 
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-emerald-400 rounded-full shadow-lg"></div>
                        <span className="text-sm font-semibold text-slate-200">{category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-100">{formatCurrency(amount)}</p>
                        <p className="text-xs text-slate-400 font-medium">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">No income data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="financial-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100 flex items-center">
            <Calendar className="w-6 h-6 text-sky-400 mr-3" />
            Monthly Trends
          </h3>
        </div>
        
        {Object.keys(monthlyData).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(monthlyData)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .slice(-6)
              .map(([month, data], index) => (
                <div 
                  key={month} 
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="font-bold text-slate-100">{month}</div>
                  <div className="flex items-center space-x-8">
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-400">+{formatCurrency(data.income)}</p>
                      <p className="text-xs text-slate-500 font-medium">Income</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-400">-{formatCurrency(data.expense)}</p>
                      <p className="text-xs text-slate-500 font-medium">Expenses</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${data.income - data.expense >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatCurrency(data.income - data.expense)}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">Net</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 font-medium">No monthly data available</p>
          </div>
        )}
      </div>

      {/* Financial Health */}
      <div className="financial-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100 flex items-center">
            <Target className="w-6 h-6 text-purple-400 mr-3" />
            Financial Health Metrics
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="financial-card-elevated p-6 border border-sky-500/30">
            <div className="flex items-center space-x-3 mb-3">
              <BarChart3 className="w-6 h-6 text-sky-400" />
              <p className="text-sky-400 font-bold">Savings Rate</p>
            </div>
            <p className="text-3xl font-bold text-slate-100">
              {state.stats.totalIncome > 0 ? ((state.stats.balance / state.stats.totalIncome) * 100).toFixed(1) : 0}%
            </p>
          </div>
          
          <div className="financial-card-elevated p-6 border border-emerald-500/30">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
              <p className="text-emerald-400 font-bold">Monthly Average</p>
            </div>
            <p className="text-3xl font-bold text-slate-100">
              {formatCurrency(state.stats.totalIncome / Math.max(1, Object.keys(monthlyData).length))}
            </p>
          </div>
          
          <div className="financial-card-elevated p-6 border border-purple-500/30">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-6 h-6 text-purple-400" />
              <p className="text-purple-400 font-bold">Expense Ratio</p>
            </div>
            <p className="text-3xl font-bold text-slate-100">
              {state.stats.totalIncome > 0 ? ((state.stats.totalExpenses / state.stats.totalIncome) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;