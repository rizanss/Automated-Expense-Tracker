export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: string;
  createdAt: string;
  vendor?: string;
  invoiceUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}

export interface FilterState {
  type: 'all' | 'income' | 'expense';
  category: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  searchTerm: string;
}

export interface Stats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}