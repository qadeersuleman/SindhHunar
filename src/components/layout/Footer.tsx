import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface FooterProps {
  onAboutPress?: () => void;
  onContactPress?: () => void;
  onPrivacyPress?: () => void;
  onTermsPress?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onAboutPress,
  onContactPress,
  onPrivacyPress,
  onTermsPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Sindh Hunar</Text>
        <Text style={styles.tagline}>Celebrating Sindhi Artistry</Text>
      </View>
      
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={onAboutPress} style={styles.link}>
          <Text style={styles.linkText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onContactPress} style={styles.link}>
          <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPrivacyPress} style={styles.link}>
          <Text style={styles.linkText}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onTermsPress} style={styles.link}>
          <Text style={styles.linkText}>Terms</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyright}>
          © 2024 Sindh Hunar. All rights reserved.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1B5E20',
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#C8E6C9',
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  link: {
    padding: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  copyrightContainer: {
    alignItems: 'center',
  },
  copyright: {
    color: '#C8E6C9',
    fontSize: 12,
  },
});

export default Footer;
