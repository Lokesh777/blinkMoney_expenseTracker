import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../shared/constants/theme';
import { useTransactions } from '../../features/transactions/hooks/useTransactions';
import { formatCurrency, getCategoryConfig } from '../../features/transactions/utils/helpers';

export default function StatsScreen() {
  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const { stats, transactions } = useTransactions(refreshKey);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => setRefreshKey((k) => k + 1));
    return unsub;
  }, [navigation]);

  const maxAmount = Math.max(...stats.categoryBreakdown.map((c) => c.amount), 1);
  const visibleTransactions = showAllActivity ? transactions.slice(0, 10) : transactions.slice(0, 5);

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
            <View style={styles.insightIcon}>
              <Ionicons name="bulb" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Spending Insight</Text>
              <Text style={styles.insightBody}>{stats.insight}</Text>
            </View>
          </View>
        ) : null}

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {stats.categoryBreakdown.length > 0 ? (
          stats.categoryBreakdown.map((cat, index) => {
            const config = getCategoryConfig(cat.name);
            const barWidth = (cat.amount / maxAmount) * 100;
            return (
              <View key={cat.name} style={[styles.catCard, index === 0 && styles.catCardFirst]}>
                <View style={styles.catTop}>
                  <View style={[styles.catIcon, { backgroundColor: `${config.color}18` }]}>
                    <Ionicons name={config.icon} size={18} color={config.color} />
                  </View>
                  <View style={styles.catInfo}>
                    <Text style={styles.catName}>{cat.name}</Text>
                    <Text style={styles.catTxnCount}>
                      {cat.transactionCount || '—'}
                    </Text>
                  </View>
                  <View style={styles.catRight}>
                    <Text style={styles.catAmount}>{formatCurrency(cat.amount)}</Text>
                    <Text style={[styles.catPercent, { color: config.color }]}>{cat.percentage}%</Text>
                  </View>
                </View>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: config.color }]} />
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="analytics-outline" size={44} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No data yet</Text>
            <Text style={styles.emptySubtext}>Add some expenses to see your stats</Text>
          </View>
        )}

        {/* Recent Activity */}
        {visibleTransactions.length > 0 && (
          <>
            <View style={styles.activityHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {transactions.length > 5 && (
                <TouchableOpacity onPress={() => setShowAllActivity(!showAllActivity)}>
                  <Text style={styles.viewAll}>{showAllActivity ? 'Show Less' : 'View All'}</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.activityCard}>
              {visibleTransactions.map((txn, index) => {
                const config = getCategoryConfig(txn.category);
                return (
                  <View key={txn.id} style={[styles.activityRow, index < visibleTransactions.length - 1 && styles.activityRowBorder]}>
                    <View style={[styles.activityIcon, { backgroundColor: `${config.color}15` }]}>
                      <Ionicons name={config.icon} size={14} color={config.color} />
                    </View>
                    <View style={styles.activityInfo}>
                      <Text style={styles.activityName} numberOfLines={1}>
                        {txn.note || txn.category}
                      </Text>
                      <Text style={styles.activityDate}>
                        {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                    <Text style={styles.activityAmount}>{formatCurrency(txn.amount)}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        <View style={{ height: 120 }} />
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...SHADOWS.sm,
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
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
    marginVertical: 4,
  },
  totalCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 3,
  },
  insightBody: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.md,
    paddingHorizontal: 0,
  },
  catCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 16,
    marginBottom: 10,
    ...SHADOWS.sm,
  },
  catCardFirst: {
    marginTop: 0,
  },
  catTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  catTxnCount: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  catRight: {
    alignItems: 'flex-end',
  },
  catAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  catPercent: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  barBg: {
    height: 5,
    backgroundColor: COLORS.divider,
    borderRadius: 2.5,
    marginTop: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: 5,
    borderRadius: 2.5,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 40,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    ...SHADOWS.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  activityRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.divider,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  activityDate: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
