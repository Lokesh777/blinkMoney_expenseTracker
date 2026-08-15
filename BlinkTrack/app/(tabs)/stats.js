import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../shared/constants/theme';
import { useTransactions } from '../../features/transactions/hooks/useTransactions';
import { formatCurrency, getCategoryConfig } from '../../features/transactions/utils/helpers';

export default function StatsScreen() {
  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0);
  const { stats, transactions, loading } = useTransactions(refreshKey);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      setRefreshKey((k) => k + 1);
    });
    return unsub;
  }, [navigation]);

  const maxAmount = Math.max(...stats.categoryBreakdown.map((c) => c.amount), 1);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spending Stats</Text>
        <Text style={styles.headerSub}>
          {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Summary */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Spent</Text>
          <Text style={styles.totalAmount}>{formatCurrency(stats.totalSpent)}</Text>
          <Text style={styles.totalCount}>{stats.transactionCount} transactions</Text>
        </View>

        {/* Insight */}
        {stats.insight ? (
          <View style={styles.insightCard}>
            <Ionicons name="bulb" size={20} color={COLORS.primary} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.insightTitle}>Spending Insight</Text>
              <Text style={styles.insightBody}>{stats.insight}</Text>
            </View>
          </View>
        ) : null}

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {stats.categoryBreakdown.length > 0 ? (
          stats.categoryBreakdown.map((cat) => {
            const config = getCategoryConfig(cat.name);
            const barWidth = (cat.amount / maxAmount) * 100;
            return (
              <View key={cat.name} style={styles.catCard}>
                <View style={styles.catHeader}>
                  <View style={[styles.catIcon, { backgroundColor: `${config.color}15` }]}>
                    <Ionicons name={config.icon} size={18} color={config.color} />
                  </View>
                  <View style={styles.catInfo}>
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catAmount}>{formatCurrency(cat.amount)}</Text>
                  </View>
                  <Text style={[styles.catPercent, { color: config.color }]}>{cat.percentage}%</Text>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: config.color }]} />
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="analytics-outline" size={40} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No data yet. Add some expenses!</Text>
          </View>
        )}

        {/* Recent Activity */}
        {transactions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <View style={styles.activityRow}>
                <View style={[styles.activityDot, { backgroundColor: COLORS.primary }]} />
                <Text style={styles.activityLabel}>This month</Text>
                <Text style={styles.activityValue}>{stats.transactionCount} expenses</Text>
              </View>
              {stats.categoryBreakdown.slice(0, 3).map((cat) => (
                <View key={cat.name} style={styles.activityRow}>
                  <View style={[styles.activityDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.activityLabel}>{cat.name}</Text>
                  <Text style={styles.activityValue}>{formatCurrency(cat.amount)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSub: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  totalCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  totalLabel: {
    ...TYPOGRAPHY.label,
    color: 'rgba(255,255,255,0.75)',
  },
  totalAmount: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
    marginVertical: 4,
  },
  totalCount: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.65)',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  insightTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  insightBody: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
  },
  catCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
  },
  catAmount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  catPercent: {
    fontSize: 16,
    fontWeight: '800',
  },
  barBg: {
    height: 4,
    backgroundColor: COLORS.divider,
    borderRadius: 2,
    marginTop: SPACING.md,
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xxxl,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textTertiary,
    marginTop: SPACING.md,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.md,
  },
  activityLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    flex: 1,
  },
  activityValue: {
    ...TYPOGRAPHY.amount,
    color: COLORS.textPrimary,
  },
});
