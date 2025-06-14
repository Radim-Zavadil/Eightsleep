import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Trash } from 'lucide-react-native';
import { useJournalContext } from '@/context/JournalContext';
import { Entry } from '@/types/journal';

interface JournalEntryProps {
  entry: Entry;
  onPress: () => void;
}

const JournalEntry = ({ entry, onPress }: JournalEntryProps) => {
  const { deleteEntry } = useJournalContext();
  
  const handleDelete = () => {
    deleteEntry(entry.id);
  };

  const day = new Date(entry.date).getDate();

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.dateContainer}>
        <Text style={styles.day}>{day}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {entry.title || 'Untitled'}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {entry.content || 'No content'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDelete}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Trash size={20} color="#ff3b30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#1C1C1E',
  },
  dateContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  day: {
    fontFamily: 'Inter',
    fontSize: 24,
    color: '#8E8E93',
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  preview: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#8E8E93',
  },
  deleteButton: {
    padding: 4,
  },
});

export default JournalEntry;