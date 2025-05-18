import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';


const AllergyWarnings = ({ matchedAllergies }) => {
  
  return (
    <View style={styles.alertListContainer}>
      <Text style={styles.alertListTitle}>⚠️ UYARILAR:</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {matchedAllergies.length > 0 ? (
          matchedAllergies.map((allergy, index) => (
            <Text key={index} style={styles.alertItem}>❗ {allergy}</Text>
          ))
        ) : (
          <Text style={styles.safeMessage}>Herhangi bir alerjen bulunamadı ✅</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  alertListContainer: {
    flex: 1,
    marginTop: 50,
  },
  alertListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alertItem: {
    fontSize: 16,
    marginBottom: 6,
    color: 'black',
  },
  safeMessage: {
    fontSize: 16,
    color: 'black',
    fontStyle: 'italic',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
});

export default AllergyWarnings;
