import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../../shared/constants/theme';
import { formatCurrency } from '../utils/helpers';

/**
 * Horizontal scrollable category breakdown cards.
 * Shows each category's total and percentage of monthly spend.
 */
const CategoryBreakdown = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <View key={cat.name} style={styles.card}>
          {/* Color indicator bar */}
          <View style={[styles.colorBar, { backgroundColor: cat.color }]} />
          <Text style={styles.name}>{cat.name}</Text>
          <Text style={styles.amount}>{formatCurrency(cat.amount)}</Text>
          <Text style={[styles.percentage, { color: cat.color }]}>{cat.percentage}%</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  colorBar: {
    width: 24,
    height: 3,
    borderRadius: 1.5,
    marginBottom: SPACING.sm,
  },
  name: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  amount: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontWeight: '700',
    marginBottom: 2,
  },
  percentage: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
});

export default CategoryBreakdown;
