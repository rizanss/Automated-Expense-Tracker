import React, { useState } from 'react';
import { Edit, Trash2, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { useTransaction } from '../../context/TransactionContext';
import { formatCurrency, formatDate, filterTransactions, getCategoryById } from '../../utils/helpers';
import { Transaction, Category } from '../../types';
import TransactionFilters from './TransactionFilters';

interface TransactionListProps {
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ onEditTransaction }) => {
  const { state, dispatch } = useTransaction();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTransactions = filterTransactions(state.transactions, state.filter);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    }
  };

  if (filteredTransactions.length === 0) {
    return (
      <div className="financial-card">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
            <Search className="w-6 h-6 text-sky-400 mr-3" />
            Transactions
          </h2>
          <TransactionFilters />
        </div>
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-500" />
          </div>
          <p className="text-slate-400 font-semibold text-lg">No transactions found</p>
          <p className="text-sm text-slate-500 mt-2">Try adjusting your filters or add a new transaction</p>
        </div>
      </div>
    );
  }

  return (
    <div className="financial-card">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
          <Search className="w-6 h-6 text-sky-400 mr-3" />
          Transactions
        </h2>
        <TransactionFilters />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {paginatedTransactions.map((transaction, index) => {
              const category = getCategoryById(state.categories, transaction.category) as Category;
              const isIncome = transaction.type === 'income';
              
              return (
                <tr 
                  key={transaction.id} 
                  className="hover:bg-slate-700/30 transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
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
                        <p className="text-sm text-slate-400 capitalize font-medium">{transaction.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-300">{category?.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-bold text-lg ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onEditTransaction(transaction)}
                        className="text-sky-400 hover:text-sky-300 transition-colors duration-150 p-2 hover:bg-slate-700 rounded-lg"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-150 p-2 hover:bg-slate-700 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
          <div className="text-sm text-slate-400 font-medium">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-slate-600 rounded-lg text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-300 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-slate-600 rounded-lg text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;