import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../../../shared/constants/theme';
import { getCategoryConfig } from '../utils/helpers';

/**
 * Selectable category chip with icon and label.
 * Highlights when selected using category-specific color.
 */
const CategoryChip = ({ name, isSelected, onPress }) => {
  const config = getCategoryConfig(name);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        isSelected && { backgroundColor: config.color, borderColor: config.color },
      ]}
      onPress={() => onPress(name)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={config.icon}
        size={16}
        color={isSelected ? COLORS.textInverse : config.color}
        style={styles.icon}
      />
      <Text
        style={[
          styles.label,
          isSelected && styles.labelSelected,
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
  labelSelected: {
    color: COLORS.textInverse,
    fontWeight: '600',
  },
});

export default CategoryChip;
