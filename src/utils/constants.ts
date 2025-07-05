import { Category } from '../types';

export const defaultCategories: Category[] = [
  // Income Categories
  { id: 'salary', name: 'Salary', icon: 'Briefcase', color: 'bg-emerald-500', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: 'bg-blue-500', type: 'income' },
  { id: 'investment', name: 'Investment', icon: 'TrendingUp', color: 'bg-purple-500', type: 'income' },
  { id: 'business', name: 'Business', icon: 'Building', color: 'bg-indigo-500', type: 'income' },
  { id: 'other-income', name: 'Other Income', icon: 'Plus', color: 'bg-green-500', type: 'income' },

  // Expense Categories
  { id: 'food', name: 'Food & Dining', icon: 'Utensils', color: 'bg-orange-500', type: 'expense' },
  { id: 'transport', name: 'Transportation', icon: 'Car', color: 'bg-red-500', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'bg-pink-500', type: 'expense' },
  { id: 'bills', name: 'Bills & Utilities', icon: 'FileText', color: 'bg-yellow-500', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Gamepad2', color: 'bg-purple-500', type: 'expense' },
  { id: 'healthcare', name: 'Healthcare', icon: 'Heart', color: 'bg-red-400', type: 'expense' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'bg-blue-600', type: 'expense' },
  { id: 'travel', name: 'Travel', icon: 'Plane', color: 'bg-cyan-500', type: 'expense' },
  { id: 'other-expense', name: 'Other Expense', icon: 'Minus', color: 'bg-gray-500', type: 'expense' },
];

export const dateRanges = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];