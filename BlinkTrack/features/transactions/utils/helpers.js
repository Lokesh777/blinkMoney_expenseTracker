import { COLORS } from '../../../shared/constants/theme';

// Category configuration with icons and colors
export const CATEGORIES = [
  { id: 'food', name: 'Food', icon: 'restaurant', color: COLORS.categories.Food },
  { id: 'travel', name: 'Travel', icon: 'car', color: COLORS.categories.Travel },
  { id: 'shopping', name: 'Shopping', icon: 'cart', color: COLORS.categories.Shopping },
  { id: 'bills', name: 'Bills', icon: 'receipt', color: COLORS.categories.Bills },
  { id: 'entertainment', name: 'Entertainment', icon: 'film', color: COLORS.categories.Entertainment },
  { id: 'other', name: 'Other', icon: 'ellipsis-horizontal', color: COLORS.categories.Other },
];

// Get category config by name
export const getCategoryConfig = (categoryName) => {
  return CATEGORIES.find((c) => c.name === categoryName) || CATEGORIES[5]; // Default to Other
};

// Format currency in INR
export const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (transactionDate.getTime() === today.getTime()) return 'Today';
  if (transactionDate.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

// Get date group key for grouping transactions
export const getDateGroupKey = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (transactionDate.getTime() === today.getTime()) return 'Today';
  if (transactionDate.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

// Group transactions by date
export const groupTransactionsByDate = (transactions) => {
  const groups = {};
  transactions.forEach((t) => {
    const key = getDateGroupKey(t.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return Object.entries(groups); // [["Today", [...]], ["Yesterday", [...]]]
};

// Calculate monthly stats from transactions
export const calculateMonthlyStats = (transactions) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter to current month
  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Total spent this month
  const totalSpent = monthTransactions.reduce((sum, t) => sum + Number(t.amount), 0);

  // Per-category totals
  const categoryTotals = {};
  monthTransactions.forEach((t) => {
    if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
    categoryTotals[t.category] += Number(t.amount);
  });

  // Convert to array with percentages, sorted by amount descending
  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
      ...getCategoryConfig(name),
    }))
    .sort((a, b) => b.amount - a.amount);

  // Generate insight text
  let insight = '';
  if (categoryBreakdown.length > 0) {
    const top = categoryBreakdown[0];
    insight = `You've spent the most on ${top.name} this month`;
  }

  return {
    totalSpent,
    categoryBreakdown,
    insight,
    transactionCount: monthTransactions.length,
  };
};

// Format relative time (e.g., "2h ago")
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};

// Generate a simple unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};
