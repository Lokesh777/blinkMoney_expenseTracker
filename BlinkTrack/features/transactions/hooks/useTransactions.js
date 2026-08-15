import { useState, useEffect, useCallback } from 'react';
import { loadTransactions, saveTransactions, addTransaction as addTxn, deleteTransaction as deleteTxn } from '../../../shared/utils/storage';
import { calculateMonthlyStats, groupTransactionsByDate, generateId } from '../utils/helpers';

/**
 * Custom hook encapsulating all transaction data logic.
 * Handles AsyncStorage read/write, monthly calculations, and CRUD operations.
 */
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load transactions on mount
  useEffect(() => {
    const init = async () => {
      try {
        const data = await loadTransactions();
        setTransactions(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Recalculate stats whenever transactions change
  const stats = calculateMonthlyStats(transactions);
  const groupedTransactions = groupTransactionsByDate(
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
  );

  // Add a new transaction
  const add = useCallback(async ({ amount, category, note, date }) => {
    const newTransaction = {
      id: generateId(),
      amount: Number(amount),
      category,
      note: note || '',
      date: date || new Date().toISOString(),
    };

    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    await saveTransactions(updated);
    return newTransaction;
  }, [transactions]);

  // Delete a transaction by ID
  const remove = useCallback(async (id) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    await saveTransactions(updated);
  }, [transactions]);

  // Reload transactions from AsyncStorage
  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await loadTransactions();
      setTransactions(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    transactions,
    groupedTransactions,
    stats,
    loading,
    error,
    add,
    remove,
    refresh,
  };
};
