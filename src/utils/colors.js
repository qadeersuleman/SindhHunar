// Ajrak Theme Colors for Sindh Hunar App
export const colors = {
  // Primary Ajrak Colors
  primary: '#C41E3A',        // Deep Red - Traditional Ajrak
  secondary: '#1B5E20',      // Deep Green - Nature and Growth
  accent: '#FF6B35',          // Orange - Warmth and Energy
  
  // Neutral Colors
  background: '#F5F5F5',      // Light Gray
  surface: '#FFFFFF',          // White
  text: '#333333',            // Dark Gray
  textSecondary: '#666666',   // Medium Gray
  textLight: '#999999',       // Light Gray
  
  // Status Colors
  success: '#2E7D32',        // Green
  warning: '#F57C00',        // Orange
  error: '#D32F2F',          // Red
  info: '#1976D2',           // Blue
  
  // Ajrak Pattern Colors
  ajrakRed: '#8B0000',       // Dark Red
  ajrakBlue: '#000080',       // Navy Blue
  ajrakWhite: '#FFFFFF',      // White
  ajrakBlack: '#000000',      // Black
  ajrakYellow: '#FFD700',     // Gold
  
  // Gradients
  primaryGradient: ['#C41E3A', '#FF6B35'],
  secondaryGradient: ['#1B5E20', '#4CAF50'],
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',
};

export const theme = {
  colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.text,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.textSecondary,
    },
  },
};
