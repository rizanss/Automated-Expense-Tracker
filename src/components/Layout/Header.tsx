import React from 'react';
import { TrendingUp, PlusCircle, Wallet } from 'lucide-react';
import { useTransaction } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/helpers';

interface HeaderProps {
  onAddTransaction: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTransaction }) => {
  const { state } = useTransaction();

  return (
    <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 financial-gradient-primary rounded-xl shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                FinanceTracker
              </h1>
              <p className="text-sm text-slate-400 font-medium">Professional Finance Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-6">
              <div className="financial-card px-6 py-3">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-5 h-5 text-sky-400" />
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Balance</p>
                    <p className={`text-xl font-bold ${
                      state.stats.balance >= 0 
                        ? 'text-emerald-400 financial-glow-success' 
                        : 'text-red-400 financial-glow-danger'
                    }`}>
                      {formatCurrency(state.stats.balance)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onAddTransaction}
              className="financial-button-primary flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="font-semibold hidden sm:inline">Add Transaction</span>
              <span className="font-semibold sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;