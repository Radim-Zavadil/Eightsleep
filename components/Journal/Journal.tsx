import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useJournalContext } from '@/context/JournalContext';
import JournalEntry from './JournalEntry';
import AddButton from './AddButton';
import JournalModal from './JournalModal';

const Journal = () => {
  const { entries, entryCount } = useJournalContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<string | null>(null);

  const handleAddPress = () => {
    setCurrentEntry(null);
    setModalVisible(true);
  };

  const handleEntryPress = (id: string) => {
    setCurrentEntry(id);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JOURNAL ENTRIES</Text>
      <Text style={styles.entryCount}>{entryCount} Entries</Text>
      
      <ScrollView 
        style={styles.entriesList} 
        showsVerticalScrollIndicator={true}
        scrollIndicatorStyle={{ backgroundColor: '#666' }}
      >
        {entries.map((entry) => (
          <JournalEntry 
            key={entry.id} 
            entry={entry} 
            onPress={() => handleEntryPress(entry.id)} 
          />
        ))}
      </ScrollView>
      
      <AddButton onPress={handleAddPress} />
      
      <JournalModal 
        visible={modalVisible} 
        entryId={currentEntry}
        onClose={() => setModalVisible(false)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 13,
    letterSpacing: 1,
    marginBottom: 8,
    color: '#666',
    textTransform: 'uppercase',
  },
  entryCount: {
    fontFamily: 'Inter',
    fontSize: 32,
    color: '#fff',
    marginBottom: 24,
  },
  entriesList: {
    flex: 1,
  },
});

export default Journal;