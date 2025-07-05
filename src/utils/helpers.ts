import { Transaction, FilterState } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const filterTransactions = (transactions: Transaction[], filter: FilterState): Transaction[] => {
  return transactions.filter(transaction => {
    // Filter by type
    if (filter.type !== 'all' && transaction.type !== filter.type) {
      return false;
    }

    // Filter by category
    if (filter.category !== 'all' && transaction.category !== filter.category) {
      return false;
    }

    // Filter by search term
    if (filter.searchTerm && !transaction.description.toLowerCase().includes(filter.searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by date range
    if (filter.dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      switch (filter.dateRange) {
        case 'today':
          return transactionDate >= startOfDay;
        case 'week': {
          const startOfWeek = new Date(startOfDay);
          startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
          return transactionDate >= startOfWeek;
        }
        case 'month': {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return transactionDate >= startOfMonth;
        }
        case 'year': {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          return transactionDate >= startOfYear;
        }
      }
    }

    return true;
  });
};

export const getCategoryById = (categories: any[], categoryId: string) => {
  return categories.find(cat => cat.id === categoryId);
};

export const getRecentTransactions = (transactions: Transaction[], count: number = 5): Transaction[] => {
  return transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
};