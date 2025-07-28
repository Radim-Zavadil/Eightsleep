import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Plus, X, Send, Pencil, Trash, ChevronLeft } from 'lucide-react-native';
import { JournalProvider, useJournalContext } from '@/context/JournalContext';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';

function JournalModal({ visible, onClose, onSave, initialTitle = '', initialContent = '', isEditing = false, onDelete }: {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  initialTitle?: string;
  initialContent?: string;
  isEditing?: boolean;
  onDelete?: () => void;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  React.useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent, visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Journal Entry' : 'New Journal Entry'}</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
              <X size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.inputTitle}
            placeholder="Title (optional)"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
            maxLength={60}
          />
          <TextInput
            style={[styles.inputContent, { minHeight: 100 }]}
            placeholder="How are you feeling?"
            placeholderTextColor="#888"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            autoFocus
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            {isEditing && (
              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Trash size={18} color="#ff3b30" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.saveButton, !isEditing && styles.addButtonWhite]}
              onPress={() => {
                if (content.trim()) onSave(title.trim(), content.trim());
              }}
              disabled={!content.trim()}
            >
              <Send size={18} color={isEditing ? '#fff' : '#000'} />
              <Text style={[styles.saveButtonText, !isEditing && styles.addButtonTextBlack]}>{isEditing ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function JournalContent() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalContext();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<null | { id: string; title: string; content: string }>(null);
  const router = useRouter();

  // Debug logging
  React.useEffect(() => {
    console.log('JournalContent: User:', user?.id);
    console.log('JournalContent: Entries count:', entries.length);
  }, [user, entries]);

  // Open modal for new entry
  const openNewEntry = () => {
    console.log('Opening new entry modal');
    setEditingEntry(null);
    setModalVisible(true);
  };

  // Open modal for editing
  const openEditEntry = (entry: { id: string; title: string; content: string }) => {
    console.log('Opening edit entry modal for:', entry.id);
    setEditingEntry(entry);
    setModalVisible(true);
  };

  // Save new or edited entry
  const handleSave = async (title: string, content: string) => {
    console.log('Saving entry:', { title, content, editingEntry });
    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, { title, content });
        console.log('Entry updated successfully');
      } else {
        await addEntry({ title, content });
        console.log('Entry added successfully');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  // Delete entry
  const handleDelete = async () => {
    if (editingEntry) {
      console.log('Deleting entry:', editingEntry.id);
      try {
        await deleteEntry(editingEntry.id);
        console.log('Entry deleted successfully');
        setModalVisible(false);
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  // Render a single journal block
  const renderJournalEntry = ({ item }: { item: { id: string; title: string; content: string; date: string } }) => (
    <TouchableOpacity
      style={styles.journalBlock}
      onPress={() => openEditEntry(item)}
      activeOpacity={0.85}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.journalTitle}>{item.title || 'Journal Entry'}</Text>
        <Pencil size={16} color="#aaa" />
      </View>
      <Text style={styles.journalContent} numberOfLines={4}>{item.content}</Text>
      <Text style={styles.journalDate}>{new Date(item.date).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => router.replace('/')}
        hitSlop={{ top: 12, left: 12, right: 12, bottom: 12 }}
      >
        <ChevronLeft size={28} color="#fff" />
      </TouchableOpacity>
      
      {/* Debug Info */}
      <View style={{ padding: 10, backgroundColor: '#333', marginBottom: 10, borderRadius: 8 }}>
        <Text style={{ color: '#fff', fontSize: 12 }}>
          User ID: {user?.id || 'No user'}
        </Text>
        <Text style={{ color: '#fff', fontSize: 12 }}>
          Entries: {entries.length}
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 4, marginTop: 5 }}
          onPress={() => {
            console.log('Testing Supabase connection...');
            supabase.from('journal_entries').select('count').then(({ data, error }: { data: any; error: any }) => {
              console.log('Test result:', { data, error });
            });
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Test DB Connection</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.todayDate}>
        {(() => {
          const d = new Date();
          const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
          const day = d.getDate();
          const year = d.getFullYear();
          return `${day} ${month}, ${year}`;
        })()}
      </Text>
      <FlatList
        data={entries}
        renderItem={renderJournalEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: 'center', marginTop: 80 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'Inter', marginBottom: 8 }}>No journal entries yet</Text>
            <Text style={{ color: '#aaa', fontSize: 14, textAlign: 'center', fontFamily: 'Inter' }}>
              Add your first entry by tapping the + button below
            </Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={openNewEntry}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>
      <JournalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        initialTitle={editingEntry?.title || ''}
        initialContent={editingEntry?.content || ''}
        isEditing={!!editingEntry}
        onDelete={handleDelete}
      />
    </View>
  );
}

export default function Journal() {
  return (
    <JournalProvider>
      <JournalContent />
    </JournalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 12,
  },
  backArrow: {
    position: 'absolute',
    top: 18,
    left: 10,
    zIndex: 10,
    padding: 2,
  },
  journalBlock: {
    backgroundColor: '#181818',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  journalTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    marginBottom: 6,
  },
  journalContent: {
    color: '#eee',
    fontSize: 15,
    fontFamily: 'Inter',
    marginBottom: 10,
    lineHeight: 20,
  },
  journalDate: {
    color: '#aaa',
    fontSize: 12,
    fontFamily: 'Inter',
    marginTop: 2,
    textAlign: 'right',
  },
  addButton: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#232323',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#181818',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  inputTitle: {
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter',
    marginBottom: 10,
  },
  inputContent: {
    backgroundColor: '#232323',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
  deleteButton: {
    backgroundColor: '#232323',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 6,
    fontFamily: 'Inter',
  },
  todayDate: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Inter',
    marginTop: 18,
    marginBottom: 18,
  },
  addButtonWhite: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  addButtonTextBlack: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'Inter',
  },
});