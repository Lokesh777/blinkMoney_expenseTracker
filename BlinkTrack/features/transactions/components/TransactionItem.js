import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../../shared/constants/theme';
import { getCategoryConfig, formatCurrency, formatRelativeTime } from '../utils/helpers';

/**
 * Single transaction row displaying category icon, note, amount, and date.
 * Designed for visual clarity with clear hierarchy.
 */
const TransactionItem = ({ transaction }) => {
  const config = getCategoryConfig(transaction.category);

  return (
    <View style={styles.container}>
      {/* Category icon circle */}
      <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      {/* Transaction details */}
      <View style={styles.details}>
        <Text style={styles.note} numberOfLines={1}>
          {transaction.note || transaction.category}
        </Text>
        <Text style={styles.date}>{formatRelativeTime(transaction.date)}</Text>
      </View>

      {/* Amount */}
      <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  details: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  note: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  date: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
  },
  amount: {
    ...TYPOGRAPHY.amount,
    color: COLORS.textPrimary,
  },
});

export default TransactionItem;
