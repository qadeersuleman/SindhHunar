// Ajrak Theme Colors for Sindh Hunar App

export interface Colors {
  // Primary Ajrak Colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Neutral Colors
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textLight: string;
  
  // Status Colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Ajrak Pattern Colors
  ajrakRed: string;
  ajrakBlue: string;
  ajrakWhite: string;
  ajrakBlack: string;
  ajrakYellow: string;
  
  // Gradients
  primaryGradient: string[];
  secondaryGradient: string[];
  
  // Shadow Colors
  shadow: string;
  shadowDark: string;
}

export const colors: Colors = {
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
};
