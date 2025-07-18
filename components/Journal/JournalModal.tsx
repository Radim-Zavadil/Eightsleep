import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Keyboard,
  ScrollView
} from 'react-native';
import { X } from 'lucide-react-native';
import { useJournalContext } from '@/context/JournalContext';

interface JournalModalProps {
  visible: boolean;
  entryId: string | null;
  onClose: () => void;
}

const JournalModal = ({ visible, entryId, onClose }: JournalModalProps) => {
  const { getEntryById, addEntry, updateEntry } = useJournalContext();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      e => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  useEffect(() => {
    if (entryId) {
      const entry = getEntryById(entryId);
      if (entry) {
        setTitle(entry.title);
        setContent(entry.content);
      }
    } else {
      setTitle('');
      setContent('');
    }
  }, [entryId, visible, getEntryById]);

  const handleSave = () => {
    if (entryId) {
      updateEntry(entryId, { title, content });
    } else {
      addEntry({ title, content });
    }
    onClose();
  };

  const animatedStyle = {
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [600, 0],
        }),
      },
    ],
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <Animated.View style={[styles.modalContent, animatedStyle]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.scrollView} 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
              scrollIndicatorStyle={{ backgroundColor: '#666' }}
            >
              <TextInput
                style={styles.titleInput}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#A0A0A0"
                autoCapitalize="sentences"
              />
              <TextInput
                style={styles.contentInput}
                placeholder="Write about your day..."
                value={content}
                onChangeText={setContent}
                multiline
                placeholderTextColor="#A0A0A0"
                textAlignVertical="top"
                autoCapitalize="sentences"
              />
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  saveText: {
    fontFamily: 'Inter',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  titleInput: {
    fontFamily: 'Inter',
    fontSize: 20,
    marginBottom: 16,
    color: '#000',
  },
  contentInput: {
    fontFamily: 'Inter',
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
    color: '#333',
    minHeight: 300,
  },
});

export default JournalModal;