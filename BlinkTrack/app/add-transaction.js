import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../shared/constants/theme';
import { useTransactions } from '../features/transactions/hooks/useTransactions';
import { CATEGORIES, formatCurrency } from '../features/transactions/utils/helpers';
import CategoryChip from '../features/transactions/components/CategoryChip';

/**
 * Add Transaction Screen - Modal for recording a new expense.
 * Features numeric input, category selector, note, and date picker.
 */
export default function AddTransactionScreen() {
  const router = useRouter();
  const { add } = useTransactions();

  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // Handle numeric input - only allow digits and one decimal
  const handleAmountChange = (text) => {
    // Remove non-numeric chars except decimal
    const cleaned = text.replace(/[^0-9.]/g, '');
    // Only allow one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) return;
    setAmount(cleaned);
  };

  // Validate and save transaction
  const handleSave = async () => {
    // Validation
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than zero.');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Select Category', 'Please choose a category for this expense.');
      return;
    }

    setSaving(true);
    try {
      await add({
        amount: parsedAmount,
        category: selectedCategory,
        note: note.trim(),
        date: new Date().toISOString(),
      });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        >
          <Text style={[styles.saveButtonText, saving && styles.saveButtonTextDisabled]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            placeholderTextColor={COLORS.textTertiary}
            keyboardType="decimal-pad"
            autoFocus
            maxLength={10}
          />
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipContainer}
          >
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat.id}
                name={cat.name}
                isSelected={selectedCategory === cat.name}
                onPress={setSelectedCategory}
              />
            ))}
          </ScrollView>
        </View>

        {/* Note Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Note (optional)</Text>
          <View style={styles.noteInputContainer}>
            <Ionicons name="pencil-outline" size={18} color={COLORS.textTertiary} />
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="What was this expense for?"
              placeholderTextColor={COLORS.textTertiary}
              maxLength={100}
            />
          </View>
        </View>

        {/* Date Display */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date</Text>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.xxxxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.title,
    color: COLORS.textPrimary,
  },
  saveButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.primary,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textInverse,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: 'rgba(255,255,255,0.7)',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxxl,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.textPrimary,
    minWidth: 80,
    textAlign: 'center',
    letterSpacing: -1,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionLabel: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipContainer: {
    paddingRight: SPACING.lg,
  },
  noteInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySurface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  dateText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
});
