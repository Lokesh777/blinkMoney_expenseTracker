import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../shared/constants/theme';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { formatCurrency } from '../features/transactions/utils/helpers';
import CategoryBreakdown from '../features/transactions/components/CategoryBreakdown';
import TransactionList from '../features/transactions/components/TransactionList';
import EmptyState from '../features/transactions/components/EmptyState';
import FloatingButton from '../shared/components/FloatingButton';
import LoadingSpinner from '../shared/components/LoadingSpinner';

/**
 * Home Screen - Main dashboard showing monthly spend summary,
 * category breakdown, and transaction history.
 */
export default function HomeScreen() {
  const router = useRouter();
  const { groupedTransactions, stats, loading } = useTransactions();

  if (loading) return <LoadingSpinner />;

  const hasTransactions = groupedTransactions.length > 0;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>BlinkTrack</Text>
            <Text style={styles.monthLabel}>
              {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <Ionicons name="flash" size={20} color={COLORS.primary} />
          </View>
        </View>

        {/* Total Spent Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Spent This Month</Text>
          <Text style={styles.totalAmount}>{formatCurrency(stats.totalSpent)}</Text>
          {stats.insight ? (
            <View style={styles.insightContainer}>
              <Ionicons name="bulb-outline" size={14} color={COLORS.primary} />
              <Text style={styles.insightText}>{stats.insight}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Content */}
      {hasTransactions ? (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Category Breakdown */}
          <Text style={styles.sectionTitle}>This Month</Text>
          <CategoryBreakdown categories={stats.categoryBreakdown} />

          {/* Transaction List */}
          <Text style={styles.sectionTitle}>Transactions</Text>
          <View style={styles.transactionCard}>
            <TransactionList groupedTransactions={groupedTransactions} />
          </View>
        </ScrollView>
      ) : (
        <EmptyState />
      )}

      {/* Floating Add Button */}
      <FloatingButton onPress={() => router.push('/add-transaction')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: SPACING.xxxxl,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.headerSection,
    color: COLORS.textPrimary,
  },
  monthLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
  },
  totalLabel: {
    ...TYPOGRAPHY.label,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SPACING.xs,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.textInverse,
    letterSpacing: -1,
    marginBottom: SPACING.sm,
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    alignSelf: 'flex-start',
    marginTop: SPACING.xs,
  },
  insightText: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  transactionCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
});
