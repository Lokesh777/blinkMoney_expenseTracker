import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../shared/constants/theme';

/**
 * Friendly empty state shown when no transactions exist.
 * Encourages user to add their first expense.
 */
const EmptyState = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="wallet-outline" size={48} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>No expenses yet</Text>
      <Text style={styles.subtitle}>
        Tap the + button to add your first expense
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
    paddingBottom: 80,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.headerSection,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyState;
