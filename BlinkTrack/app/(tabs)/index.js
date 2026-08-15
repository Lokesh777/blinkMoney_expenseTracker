import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../shared/constants/theme';
import { useTransactions } from '../../features/transactions/hooks/useTransactions';
import { formatCurrency } from '../../features/transactions/utils/helpers';
import TransactionItem from '../../features/transactions/components/TransactionItem';
import EmptyState from '../../features/transactions/components/EmptyState';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { groupedTransactions, stats, loading } = useTransactions(refreshKey);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      setRefreshKey((k) => k + 1);
    });
    return unsub;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 500);
  };

  if (loading && !refreshing) return <LoadingSpinner />;

  const hasTransactions = groupedTransactions.length > 0;

  // Flatten grouped transactions for FlatList
  const sections = groupedTransactions.map(([label, txns]) => ({
    title: label,
    data: txns,
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appName}>BlinkTrack</Text>
            <Text style={styles.monthText}>
              {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.avatar}>
            <Ionicons name="flash" size={18} color={COLORS.primary} />
          </View>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Spent This Month</Text>
        <Text style={styles.summaryAmount}>{formatCurrency(stats.totalSpent)}</Text>
        {stats.insight ? (
          <View style={styles.insightBadge}>
            <Ionicons name="bulb-outline" size={13} color="#fff" />
            <Text style={styles.insightText}>{stats.insight}</Text>
          </View>
        ) : null}
      </View>

      {/* Category Quick View */}
      {stats.categoryBreakdown.length > 0 && (
        <View style={styles.categoryRow}>
          {stats.categoryBreakdown.slice(0, 4).map((cat) => (
            <View key={cat.name} style={styles.categoryPill}>
              <View style={[styles.catDot, { backgroundColor: cat.color }]} />
              <Text style={styles.catName}>{cat.name}</Text>
              <Text style={styles.catPercent}>{cat.percentage}%</Text>
            </View>
          ))}
        </View>
      )}

      {/* Transactions */}
      {hasTransactions ? (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.dateLabel}>{item.title}</Text>
              {item.data.map((txn) => (
                <TransactionItem key={txn.id} transaction={txn} />
              ))}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState />
      )}
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
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  monthText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.lg,
  },
  summaryLabel: {
    ...TYPOGRAPHY.label,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: SPACING.xs,
  },
  summaryAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
    gap: 4,
  },
  insightText: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: 8,
  },
  categoryPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
    ...SHADOWS.sm,
  },
  catDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  catName: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textSecondary,
    flex: 1,
  },
  catPercent: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dateLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  listContent: {
    paddingBottom: 100,
  },
});
