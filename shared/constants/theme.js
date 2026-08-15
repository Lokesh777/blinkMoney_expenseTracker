// BlinkMoney-inspired design tokens
// Primary palette uses teal as accent, matching BlinkMoney's fintech aesthetic

export const COLORS = {
  // Primary accent - deep teal (BlinkMoney-inspired)
  primary: '#0D9488',
  primaryLight: '#14B8A6',
  primaryDark: '#0F766E',
  primarySurface: '#CCFBF1',

  // Backgrounds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  divider: '#F1F5F9',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Category Colors - distinct, accessible palette
  categories: {
    Food: '#F97316',
    Travel: '#3B82F6',
    Shopping: '#8B5CF6',
    Bills: '#EF4444',
    Entertainment: '#EC4899',
    Other: '#6B7280',
  },

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  // Large header - total spent
  headerLarge: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  // Section headers
  headerSection: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  // Card titles
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Body text
  body: {
    fontSize: 14,
    fontWeight: '400',
  },
  // Small labels
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Tiny text
  caption: {
    fontSize: 11,
    fontWeight: '400',
  },
  // Amount display
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  // FAB icon
  fabIcon: {
    fontSize: 28,
    fontWeight: '300',
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
};
