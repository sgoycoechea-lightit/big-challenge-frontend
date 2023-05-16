import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PatientInfoScreen() {
  return (
    <View style={styles.centeredView}>
      <Text>Patient Info!</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});