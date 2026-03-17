import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Logo({ size = 'normal' }) {
  const logoSize = size === 'small' ? 24 : 32;
  const textSize = size === 'small' ? 16 : 20;

  return (
    <View style={styles.container}>
      <Text style={[styles.logo, { fontSize: textSize }]}>JammLine</Text>
      <Text style={[styles.tagline, { fontSize: textSize * 0.6 }]}>🏥</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    color: '#14B8A6',
  },
  tagline: {
    marginLeft: 5,
  },
});
