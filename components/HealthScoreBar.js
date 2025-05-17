import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HealthScoreBar = ({ score }) => {
  const getColor = () => {
    if (score >= 80) return '#4CAF50'; 
    if (score >= 50) return '#FFC107';
    return '#F44336'; 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sağlık Skoru: {score}/100</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${score}%`, backgroundColor: getColor() }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  barBackground: {
    height: 20,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
});

export default HealthScoreBar;
