import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

// Placeholder for RuleBlock component
const RuleBlock = ({ rule, value, onValueChange }: any) => (
  <View style={styles.ruleBlock}>
    <Text style={styles.ruleName}>{rule.name}</Text>
    <Text style={styles.ruleGoal}>{rule.goal}</Text>
    {/* User value and arc gauge would go here */}
    <TouchableOpacity style={styles.noValues}><Text style={styles.noValuesText}>No values</Text></TouchableOpacity>
  </View>
);

const defaultRules = [
  { name: 'Temperature', goal: '~21°C' },
  { name: 'Darkness in the room', goal: 'No lights in your room' },
  { name: 'Noise', goal: '0-30dB' },
  { name: 'Sun exposure', goal: '20 minutes' },
  { name: 'Exercise', goal: '20 minutes' },
  { name: 'Blue light', goal: 'limit blue light 1-2h before bed' },
  { name: 'Not eating large meals', goal: '2-3h avoid large meals (just snack if hungry)' },
  { name: '240ml fluids in 2h before bed', goal: 'reduce fluids close to bedtime (240ml in 2h)' },
  { name: 'No alcohol', goal: 'No alcohol' },
  { name: 'No caffeine', goal: 'avoid 6+ hours before bed' },
];

export default function BedroomPage() {
  const [rules, setRules] = useState(defaultRules);
  const [customRuleName, setCustomRuleName] = useState('');
  const [customRuleGoal, setCustomRuleGoal] = useState('');

  // Placeholder for score calculation
  const score = 0;

  const addCustomRule = () => {
    if (customRuleName && customRuleGoal) {
      setRules([...rules, { name: customRuleName, goal: customRuleGoal }]);
      setCustomRuleName('');
      setCustomRuleGoal('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Bedroom Checklist</Text>
      <Text style={styles.score}>Score: {score}%</Text>
      {rules.map((rule, idx) => (
        <RuleBlock key={idx} rule={rule} />
      ))}
      <View style={styles.customRuleContainer}>
        <Text style={styles.addCustomRuleTitle}>Add Custom Rule</Text>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Name:</Text>
          <TouchableOpacity style={styles.inputBox}><Text>{customRuleName || 'Enter name'}</Text></TouchableOpacity>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Goal:</Text>
          <TouchableOpacity style={styles.inputBox}><Text>{customRuleGoal || 'Enter goal'}</Text></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addCustomRule}>
          <Text style={styles.addButtonText}>Add Rule</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#181818', padding: 16 },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 16 },
  score: { fontSize: 20, color: '#fff', marginBottom: 16 },
  ruleBlock: { backgroundColor: '#222', borderRadius: 16, padding: 16, marginBottom: 12 },
  ruleName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ruleGoal: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  noValues: { backgroundColor: '#333', borderRadius: 8, padding: 6, alignSelf: 'flex-start' },
  noValuesText: { color: '#bbb', fontSize: 12 },
  customRuleContainer: { marginTop: 24, backgroundColor: '#232323', borderRadius: 16, padding: 16 },
  addCustomRuleTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputLabel: { color: '#fff', width: 50 },
  inputBox: { backgroundColor: '#333', borderRadius: 8, padding: 6, flex: 1, marginLeft: 8 },
  addButton: { backgroundColor: '#1EED67', borderRadius: 8, padding: 10, marginTop: 8, alignItems: 'center' },
  addButtonText: { color: '#181818', fontWeight: 'bold' },
}); 