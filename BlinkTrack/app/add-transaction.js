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
import { CATEGORIES } from '../features/transactions/utils/helpers';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { add } = useTransactions();

  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAmountChange = (text) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmount(cleaned);
  };

  const handleSave = async () => {
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

  const isValid = parseFloat(amount) > 0 && selectedCategory;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Expense</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || !isValid}
          style={[styles.saveBtn, (!isValid || saving) && styles.saveBtnDisabled]}
        >
          <Text style={[styles.saveBtnText, (!isValid || saving) && styles.saveBtnTextDisabled]}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount */}
        <View style={styles.amountCard}>
          <Text style={styles.amountPrefix}>₹</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            placeholderTextColor="rgba(255,255,255,0.35)"
            keyboardType="decimal-pad"
            autoFocus
            maxLength={10}
          />
        </View>

        {/* Categories */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.catGrid}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catBtn, isSelected && { backgroundColor: cat.color, borderColor: cat.color }]}
                onPress={() => setSelectedCategory(cat.name)}
                activeOpacity={0.7}
              >
                <Ionicons name={cat.icon} size={18} color={isSelected ? '#fff' : cat.color} />
                <Text style={[styles.catBtnText, isSelected && { color: '#fff', fontWeight: '700' }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Note */}
        <Text style={styles.label}>Note (optional)</Text>
        <View style={styles.inputCard}>
          <Ionicons name="pencil-outline" size={16} color={COLORS.textTertiary} />
          <TextInput
            style={styles.textInput}
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={COLORS.textTertiary}
            maxLength={100}
          />
        </View>

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <View style={styles.dateCard}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
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
    paddingTop: 56,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  saveBtnTextDisabled: {
    color: 'rgba(255,255,255,0.5)',
  },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  amountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: 36,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
    ...SHADOWS.lg,
  },
  amountPrefix: {
    fontSize: 28,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 52,
    fontWeight: '800',
    color: '#fff',
    minWidth: 60,
    textAlign: 'center',
    letterSpacing: -1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: SPACING.xxl,
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: 6,
  },
  catBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xxl,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySurface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
