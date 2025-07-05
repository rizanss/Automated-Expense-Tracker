import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useTransaction } from '../../context/TransactionContext';
import { dateRanges } from '../../utils/constants';

const TransactionFilters: React.FC = () => {
  const { state, dispatch } = useTransaction();

  const handleFilterChange = (key: string, value: string) => {
    dispatch({ type: 'SET_FILTER', payload: { [key]: value } });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={state.filter.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="financial-input w-full pl-12"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={state.filter.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="financial-input"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <select
          value={state.filter.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="financial-input"
        >
          <option value="all">All Categories</option>
          {state.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        
        <select
          value={state.filter.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="financial-input"
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TransactionFilters;