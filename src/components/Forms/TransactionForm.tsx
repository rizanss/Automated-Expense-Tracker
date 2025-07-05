import React, { useState, useEffect } from 'react';
import { X, Save, Camera, DollarSign } from 'lucide-react';
import { useTransaction } from '../../context/TransactionContext';
import { Transaction } from '../../types';
import { generateId } from '../../utils/helpers';
import InvoiceUpload from './InvoiceUpload';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

interface InvoiceData {
  description: string;
  amount: number;
  category: string;
  date: string;
  vendor?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ isOpen, onClose, transaction }) => {
  const { state, dispatch } = useTransaction();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
  });
  const [showInvoiceUpload, setShowInvoiceUpload] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    const transactionData: Transaction = {
      id: transaction?.id || generateId(),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date,
      createdAt: transaction?.createdAt || new Date().toISOString(),
    };

    if (transaction) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: transactionData });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: transactionData });
    }

    onClose();
  };

  const handleInvoiceProcessed = (invoiceData: InvoiceData) => {
    setFormData({
      description: invoiceData.vendor ? `${invoiceData.vendor} - ${invoiceData.description}` : invoiceData.description,
      amount: invoiceData.amount.toString(),
      category: invoiceData.category,
      type: 'expense',
      date: invoiceData.date,
    });
    setShowInvoiceUpload(false);
  };

  const availableCategories = state.categories.filter(cat => cat.type === formData.type);
  const expenseCategories = state.categories.filter(cat => cat.type === 'expense');

  if (!isOpen) return null;

  if (showInvoiceUpload) {
    return (
      <InvoiceUpload
        onInvoiceProcessed={handleInvoiceProcessed}
        onClose={() => setShowInvoiceUpload(false)}
        categories={expenseCategories}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="financial-card-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <h2 className="text-2xl font-bold text-slate-100">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors duration-150 p-2 hover:bg-slate-700 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!transaction && (
            <div className="financial-card p-4 border border-sky-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-100 flex items-center">
                    <Camera className="w-5 h-5 text-sky-400 mr-2" />
                    AI Invoice Scanner
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Upload receipt for automatic detection</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInvoiceUpload(true)}
                  className="financial-button-primary flex items-center space-x-2 px-4 py-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan</span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter transaction description"
              className="financial-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              Amount (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold text-lg">Rp</span>
              <input
                type="number"
                step="1"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                className="financial-input w-full pl-12 text-lg font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center flex-1">
                <input
                  type="radio"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense', category: '' })}
                  className="sr-only"
                />
                <div className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  formData.type === 'income' 
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' 
                    : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500'
                }`}>
                  <div className="text-center font-semibold">Income</div>
                </div>
              </label>
              <label className="flex items-center flex-1">
                <input
                  type="radio"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense', category: '' })}
                  className="sr-only"
                />
                <div className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  formData.type === 'expense' 
                    ? 'border-red-500 bg-red-500/20 text-red-400' 
                    : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500'
                }`}>
                  <div className="text-center font-semibold">Expense</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="financial-input w-full"
              required
            >
              <option value="">Select a category</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="financial-input w-full"
              required
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 financial-button-success flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{transaction ? 'Update' : 'Add'} Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;