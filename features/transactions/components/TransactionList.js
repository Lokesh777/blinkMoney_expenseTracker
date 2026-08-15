import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../shared/constants/theme';
import TransactionItem from './TransactionItem';

/**
 * Grouped transaction list with date section headers.
 * Uses SectionList for efficient rendering of grouped data.
 */
const TransactionList = ({ groupedTransactions }) => {
  // Convert grouped data to SectionList format
  const sections = groupedTransactions.map(([dateLabel, transactions]) => ({
    title: dateLabel,
    data: transactions,
  }));

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      renderSectionHeader={({ section }) => (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
      )}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default TransactionList;
