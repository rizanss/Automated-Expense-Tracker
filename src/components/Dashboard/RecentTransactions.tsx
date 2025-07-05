import React from 'react';
import { Clock, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { useTransaction } from '../../context/TransactionContext';
import { formatCurrency, formatDate, getRecentTransactions, getCategoryById } from '../../utils/helpers';
import { Category } from '../../types';

const RecentTransactions: React.FC = () => {
  const { state } = useTransaction();
  const recentTransactions = getRecentTransactions(state.transactions, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="financial-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-100 flex items-center">
            <Clock className="w-6 h-6 text-sky-400 mr-3" />
            Recent Transactions
          </h3>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No transactions yet</p>
          <p className="text-sm text-slate-500 mt-2">Start by adding your first transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-100 flex items-center">
          <Clock className="w-6 h-6 text-sky-400 mr-3" />
          Recent Transactions
        </h3>
      </div>
      
      <div className="space-y-4">
        {recentTransactions.map((transaction, index) => {
          const category = getCategoryById(state.categories, transaction.category) as Category;
          const isIncome = transaction.type === 'income';
          
          return (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 rounded-xl transition-all duration-200 transform hover:scale-[1.02] border border-slate-600/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-lg ${category?.color || 'bg-slate-600'}`}>
                  {isIncome ? (
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-100">{transaction.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-slate-400">{formatDate(transaction.date)}</p>
                    <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                    <p className="text-xs text-slate-500 font-medium">{category?.name}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-lg ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;