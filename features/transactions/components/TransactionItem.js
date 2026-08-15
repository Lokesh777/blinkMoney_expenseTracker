import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../../shared/constants/theme';
import { getCategoryConfig, formatCurrency, formatRelativeTime } from '../utils/helpers';

const TransactionItem = ({ transaction }) => {
  const config = getCategoryConfig(transaction.category);

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}>
        <Ionicons name={config.icon} size={18} color={config.color} />
      </View>

      <View style={styles.details}>
        <Text style={styles.note} numberOfLines={1}>
          {transaction.note || transaction.category}
        </Text>
        <Text style={styles.date}>{formatRelativeTime(transaction.date)}</Text>
      </View>

      <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginBottom: 2,
    borderRadius: 12,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
    marginRight: 8,
  },
  note: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  date: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});

export default TransactionItem;
