import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@blinktrack_transactions';

// Load all transactions from AsyncStorage
export const loadTransactions = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
};

// Save transactions array to AsyncStorage
export const saveTransactions = async (transactions) => {
  try {
    const json = JSON.stringify(transactions);
    await AsyncStorage.setItem(STORAGE_KEY, json);
    return true;
  } catch (error) {
    console.error('Failed to save transactions:', error);
    return false;
  }
};

// Add a single transaction
export const addTransaction = async (transaction) => {
  try {
    const existing = await loadTransactions();
    const updated = [transaction, ...existing];
    await saveTransactions(updated);
    return true;
  } catch (error) {
    console.error('Failed to add transaction:', error);
    return false;
  }
};

// Delete a transaction by ID
export const deleteTransaction = async (id) => {
  try {
    const existing = await loadTransactions();
    const updated = existing.filter((t) => t.id !== id);
    await saveTransactions(updated);
    return true;
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return false;
  }
};
