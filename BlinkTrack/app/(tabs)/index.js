import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../shared/constants/theme';
import { useTransactions } from '../../features/transactions/hooks/useTransactions';
import { formatCurrency } from '../../features/transactions/utils/helpers';
import TransactionItem from '../../features/transactions/components/TransactionItem';
import EmptyState from '../../features/transactions/components/EmptyState';
import LoadingSpinner from '../../shared/components/LoadingSpinner';

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { groupedTransactions, stats, loading } = useTransactions(refreshKey);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => setRefreshKey((k) => k + 1));
    return unsub;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 600);
  };

  if (loading && !refreshing) return <LoadingSpinner />;

  const hasTransactions = groupedTransactions.length > 0;

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

      {hasTransactions ? (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          ListHeaderComponent={() => (
            <>
              {/* Summary Card */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Spent This Month</Text>
                <Text style={styles.summaryAmount}>{formatCurrency(stats.totalSpent)}</Text>
                {stats.insight ? (
                  <View style={styles.insightBadge}>
                    <Ionicons name="bulb-outline" size={13} color="#fff" />
                    <Text style={styles.insightText} numberOfLines={1}>{stats.insight}</Text>
                  </View>
                ) : null}
              </View>

              {/* Category Chips - horizontal scroll */}
              {stats.categoryBreakdown.length > 0 && (
                <View style={styles.catSection}>
                  <Text style={styles.sectionTitle}>Categories</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.catScroll}
                  >
                    {stats.categoryBreakdown.map((cat) => (
                      <TouchableOpacity
                        key={cat.name}
                        style={styles.catCard}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.catIconWrap, { backgroundColor: `${cat.color}18` }]}>
                          <Ionicons name={cat.icon || 'pricetag'} size={16} color={cat.color} />
                        </View>
                        <View style={styles.catCardBody}>
                          <Text style={styles.catCardName} numberOfLines={1}>{cat.name}</Text>
                          <Text style={styles.catCardAmount}>{formatCurrency(cat.amount)}</Text>
                        </View>
                        <Text style={[styles.catCardPercent, { color: cat.color }]}>{cat.percentage}%</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Transactions Header */}
              <View style={styles.txnHeader}>
                <Text style={styles.sectionTitle}>Transactions</Text>
              </View>
            </>
          )}
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...SHADOWS.sm,
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
    padding: 20,
    ...SHADOWS.lg,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  insightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginTop: 12,
    gap: 5,
    maxWidth: '100%',
  },
  insightText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    flexShrink: 1,
  },
  catSection: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  catScroll: {
    paddingHorizontal: SPACING.lg,
    paddingRight: SPACING.lg,
    gap: 10,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 140,
    ...SHADOWS.sm,
  },
  catIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  catCardBody: {
    flex: 1,
  },
  catCardName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  catCardAmount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  catCardPercent: {
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 8,
  },
  txnHeader: {
    marginTop: SPACING.xl,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: 6,
  },
  listContent: {
    paddingBottom: 120,
  },
});
