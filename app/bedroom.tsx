import RecoverySection from '@/components/RecoverySection';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useBedroomScore } from '@/components/Context/BedroomScoreContext';

// Placeholder for RuleBlock component
const RuleBlock = ({ rule, onToggle }: any) => (
  <View style={styles.ruleBlock}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View>
        <Text style={styles.ruleName}>{rule.name}</Text>
        <Text style={styles.ruleGoal}>{rule.goal}</Text>
      </View>
      <TouchableOpacity
        style={[styles.checkbox, rule.checked && styles.checkboxChecked]}
        onPress={onToggle}
      >
        {rule.checked && <Text style={styles.checkboxTick}>✓</Text>}
      </TouchableOpacity>
    </View>
    {/* User value and arc gauge would go here */}
    <TouchableOpacity style={styles.noValues}><Text style={styles.noValuesText}>No values</Text></TouchableOpacity>
  </View>
);

const defaultRules = [
  { name: 'Temperature', goal: '~21°C', checked: false },
  { name: 'Darkness in the room', goal: 'No lights in your room', checked: false },
  { name: 'Noise', goal: '0-30dB', checked: false },
  { name: 'Sun exposure', goal: '20 minutes', checked: false },
  { name: 'Exercise', goal: '20 minutes', checked: false },
  { name: 'Blue light', goal: 'limit blue light 1-2h before bed', checked: false },
  { name: 'Not eating large meals', goal: '2-3h avoid large meals (just snack if hungry)', checked: false },
  { name: '240ml fluids in 2h before bed', goal: 'reduce fluids close to bedtime (240ml in 2h)', checked: false },
  { name: 'No alcohol', goal: 'No alcohol', checked: false },
  { name: 'No caffeine', goal: 'avoid 6+ hours before bed', checked: false },
];

export default function BedroomPage() {
  const [rules, setRules] = useState(defaultRules);
  const [customRuleName, setCustomRuleName] = useState('');
  const [customRuleGoal, setCustomRuleGoal] = useState('');
  const [showCustomRuleForm, setShowCustomRuleForm] = useState(false);
  const { score, setScore } = useBedroomScore();
  const [toggleValue, setToggleValue] = useState('Yesterday');

  // Calculate score as percent of checked rules
  useEffect(() => {
    const newScore = Math.round((rules.filter(r => r.checked).length / rules.length) * 100);
    setScore(newScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules]);

  const toggleRule = (idx: number) => {
    setRules(rules =>
      rules.map((rule, i) =>
        i === idx ? { ...rule, checked: !rule.checked } : rule
      )
    );
  };

  const addCustomRule = () => {
    if (customRuleName && customRuleGoal) {
      setRules([...rules, { name: customRuleName, goal: customRuleGoal, checked: false }]);
      setCustomRuleName('');
      setCustomRuleGoal('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.recoverySectionWrapper}>
        <RecoverySection score={score}/>
      </View>

      {/* Toggle Switch for Yesterday/Today */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, toggleValue === 'Yesterday' && styles.toggleButtonActive]}
          onPress={() => setToggleValue('Yesterday')}
        >
          <Text style={[styles.toggleText, toggleValue === 'Yesterday' && styles.toggleTextActive]}>Yesterday</Text>
          {toggleValue === 'Yesterday' && <View style={styles.toggleIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, toggleValue === 'Today' && styles.toggleButtonActive]}
          onPress={() => setToggleValue('Today')}
        >
          <Text style={[styles.toggleText, toggleValue === 'Today' && styles.toggleTextActive]}>Today</Text>
          {toggleValue === 'Today' && <View style={styles.toggleIndicator} />}
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={styles.header}>Bedroom Checklist</Text>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => setShowCustomRuleForm(true)}
        >
          <Text style={styles.plusButtonText}>＋</Text>
        </TouchableOpacity>
      </View>
      {rules.map((rule, idx) => (
        <RuleBlock key={idx} rule={rule} onToggle={() => toggleRule(idx)} />
      ))}
      {showCustomRuleForm && (
        <View style={styles.customRuleContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.addCustomRuleTitle}>Add Custom Rule</Text>
            <TouchableOpacity onPress={() => setShowCustomRuleForm(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Name:</Text>
            <TextInput
              style={styles.inputBox}
              value={customRuleName}
              onChangeText={setCustomRuleName}
              placeholder="Enter name"
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Goal:</Text>
            <TextInput
              style={styles.inputBox}
              value={customRuleGoal}
              onChangeText={setCustomRuleGoal}
              placeholder="Enter goal"
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => { addCustomRule(); setShowCustomRuleForm(false); }}>
            <Text style={styles.addButtonText}>Add Rule</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', padding: 8 },
  recoverySectionWrapper: { marginHorizontal: 0, marginBottom: 8 },
  header: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 16 },
  ruleBlock: { backgroundColor: '#181818', borderRadius: 16, padding: 16, marginBottom: 12 },
  ruleName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ruleGoal: { color: '#aaa', fontSize: 14, marginBottom: 8 },
  noValues: { backgroundColor: '#232323', borderRadius: 8, padding: 6, alignSelf: 'flex-start' },
  noValuesText: { color: '#bbb', fontSize: 12 },
  customRuleContainer: { marginTop: 24, backgroundColor: '#181818', borderRadius: 16, padding: 16 },
  addCustomRuleTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  inputLabel: { color: '#fff', width: 50 },
  inputBox: { backgroundColor: '#232323', borderRadius: 8, padding: 6, flex: 1, marginLeft: 8, color: '#fff' },
  addButton: { backgroundColor: '#1EED67', borderRadius: 8, padding: 10, marginTop: 8, alignItems: 'center' },
  addButtonText: { color: '#181818', fontWeight: 'bold' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
    marginLeft: 12,
  },
  checkboxChecked: {
    backgroundColor: '#1EED67',
    borderColor: '#1EED67',
  },
  checkboxTick: {
    color: '#181818',
    fontWeight: 'bold',
    fontSize: 16,
  },
  plusButton: {
    backgroundColor: '#1EED67',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  plusButtonText: {
    color: '#181818',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    padding: 4,
  },
  // Toggle styles
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    borderRadius: 24,
    alignSelf: 'center',
    marginVertical: 16,
    padding: 6,
    width: 220,
    justifyContent: 'space-between',
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    position: 'relative',
  },
  toggleButtonActive: {
    // No background, indicator is below
  },
  toggleText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  toggleIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    transform: [{ translateX: -55 }],
    width: 110,
    height: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#313131",
    backgroundColor: '#1F1F1F',
    zIndex: -1,
  },
}); 