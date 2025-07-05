import React, { useState } from 'react';
import { TransactionProvider } from './context/TransactionContext';
import Header from './components/Layout/Header';
import TabNavigation from './components/Navigation/TabNavigation';
import Dashboard from './components/Dashboard/Dashboard';
import TransactionList from './components/Transactions/TransactionList';
import Analytics from './components/Analytics/Analytics';
import TransactionForm from './components/Forms/TransactionForm';
import { Transaction } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const handleAddTransaction = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList onEditTransaction={handleEditTransaction} />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <TransactionProvider>
      <div className="min-h-screen bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="relative z-10">
          <Header onAddTransaction={handleAddTransaction} />
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </main>

          <TransactionForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            transaction={editingTransaction}
          />
        </div>
      </div>
    </TransactionProvider>
  );
}

export default App;