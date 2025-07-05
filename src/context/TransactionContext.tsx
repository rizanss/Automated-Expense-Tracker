import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Transaction, Category, FilterState, Stats } from '../types';
import { defaultCategories } from '../utils/constants';

interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  filter: FilterState;
  stats: Stats;
}

type TransactionAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<FilterState> }
  | { type: 'LOAD_DATA'; payload: { transactions: Transaction[]; categories: Category[] } }
  | { type: 'ADD_CATEGORY'; payload: Category };

const initialState: TransactionState = {
  transactions: [],
  categories: defaultCategories,
  filter: {
    type: 'all',
    category: 'all',
    dateRange: 'all',
    searchTerm: '',
  },
  stats: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    transactionCount: 0,
  },
};

const calculateStats = (transactions: Transaction[]): Stats => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  };
};

const transactionReducer = (state: TransactionState, action: TransactionAction): TransactionState => {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const newTransactions = [...state.transactions, action.payload];
      return {
        ...state,
        transactions: newTransactions,
        stats: calculateStats(newTransactions),
      };
    }
    case 'UPDATE_TRANSACTION': {
      const updatedTransactions = state.transactions.map(t =>
        t.id === action.payload.id ? action.payload : t
      );
      return {
        ...state,
        transactions: updatedTransactions,
        stats: calculateStats(updatedTransactions),
      };
    }
    case 'DELETE_TRANSACTION': {
      const filteredTransactions = state.transactions.filter(t => t.id !== action.payload);
      return {
        ...state,
        transactions: filteredTransactions,
        stats: calculateStats(filteredTransactions),
      };
    }
    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    case 'LOAD_DATA':
      return {
        ...state,
        transactions: action.payload.transactions,
        categories: action.payload.categories,
        stats: calculateStats(action.payload.transactions),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    default:
      return state;
  }
};

const TransactionContext = createContext<{
  state: TransactionState;
  dispatch: React.Dispatch<TransactionAction>;
} | null>(null);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('moneyTracker');
    if (savedData) {
      const { transactions, categories } = JSON.parse(savedData);
      dispatch({ type: 'LOAD_DATA', payload: { transactions, categories } });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moneyTracker', JSON.stringify({
      transactions: state.transactions,
      categories: state.categories,
    }));
  }, [state.transactions, state.categories]);

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};