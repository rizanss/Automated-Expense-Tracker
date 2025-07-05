import React from 'react';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import { useTransaction } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/helpers';
import StatsCard from './StatsCard';
import RecentTransactions from './RecentTransactions';

const Dashboard: React.FC = () => {
  const { state } = useTransaction();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Balance"
          value={formatCurrency(state.stats.balance)}
          icon={Wallet}
          color="financial-gradient-primary financial-glow"
        />
        <StatsCard
          title="Total Income"
          value={formatCurrency(state.stats.totalIncome)}
          icon={TrendingUp}
          color="financial-gradient-success financial-glow-success"
        />
        <StatsCard
          title="Total Expenses"
          value={formatCurrency(state.stats.totalExpenses)}
          icon={TrendingDown}
          color="financial-gradient-danger financial-glow-danger"
        />
        <StatsCard
          title="Transactions"
          value={state.stats.transactionCount.toString()}
          icon={BarChart3}
          color="financial-gradient-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentTransactions />
        <div className="financial-card p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 text-sky-400 mr-3" />
            Financial Overview
          </h3>
          <div className="space-y-6">
            {state.stats.totalIncome > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Income vs Expenses</span>
                  <span className="text-sm font-bold text-slate-100">
                    {((state.stats.totalIncome / (state.stats.totalIncome + state.stats.totalExpenses)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full financial-gradient-success rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${Math.min(100, (state.stats.totalIncome / (state.stats.totalIncome + state.stats.totalExpenses)) * 100)}%` 
                    }}
                  />
                </div>
              </div>
            )}
            
            {state.stats.balance >= 0 ? (
              <div className="financial-card-elevated p-4 border-emerald-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-emerald-400 font-bold">Excellent Financial Health!</p>
                    <p className="text-emerald-300 text-sm mt-1">Your income exceeds your expenses. Keep it up!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="financial-card-elevated p-4 border-red-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-red-400 font-bold">Budget Alert</p>
                    <p className="text-red-300 text-sm mt-1">Your expenses exceed your income. Consider reviewing your spending.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;