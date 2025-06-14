import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Plus, Send, X } from 'lucide-react-native';
import { JournalProvider, useJournalContext } from '@/context/JournalContext';
import { Entry } from '@/types/journal';

// Create a separate component for the Journal content
function JournalContent() {
  const { entries, addEntry } = useJournalContext();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntryContent, setNewEntryContent] = useState('');
  
  // Filter entries for today
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(entry => 
    entry.date.startsWith(today)
  );
  
  // Handle creating a new journal entry
  const handleCreateEntry = () => {
    if (newEntryContent.trim()) {
      addEntry({
        title: newEntryTitle.trim() || 'Journal Entry',
        content: newEntryContent
      });
      setNewEntryTitle('');
      setNewEntryContent('');
      setShowNewEntry(false);
    }
  };
  
  // Format timestamp for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Render an individual journal entry
  const renderJournalEntry = ({ item }: { item: Entry }) => (
    <View style={{
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <Text style={{
          color: '#aaa',
          fontSize: 12,
          fontFamily: 'Inter',
        }}>{formatTime(item.date)}</Text>
        <Text style={{
          color: '#aaa',
          fontSize: 12,
          fontFamily: 'Inter',
        }}>{formatDate(item.date)}</Text>
      </View>
      <Text style={{
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        fontFamily: 'Inter',
      }}>{item.title}</Text>
      <Text style={{
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter',
      }}>{item.content}</Text>
    </View>
  );
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        position: 'relative',
      }}
    >
      <View style={{
        flex: 1,
        position: 'relative',
      }}>
        {/* Entry list */}
        {todayEntries.length > 0 ? (
          <FlatList
            data={todayEntries}
            renderItem={renderJournalEntry}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingBottom: 80,
            }}
          />
        ) : (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
            <Text style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Inter',
              marginBottom: 8,
            }}>No journal entries today</Text>
            <Text style={{
              color: '#aaa',
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Inter',
            }}>
              Add your first entry by tapping the + button below
            </Text>
          </View>
        )}
        
        {/* New entry form */}
        {showNewEntry && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#111',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            paddingBottom: Platform.OS === 'ios' ? 40 : 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 18,
                fontWeight: '500',
                fontFamily: 'Inter',
              }}>New Journal Entry</Text>
              <TouchableOpacity 
                onPress={() => setShowNewEntry(false)}
                style={{
                  padding: 5,
                }}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: 12,
                color: '#fff',
                fontSize: 16,
                fontFamily: 'Inter',
                marginBottom: 10,
              }}
              placeholder="Title (optional)"
              placeholderTextColor="#888"
              value={newEntryTitle}
              onChangeText={setNewEntryTitle}
            />
            
            <TextInput
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: 16,
                color: '#fff',
                fontSize: 16,
                minHeight: 120,
                fontFamily: 'Inter',
                textAlignVertical: 'top',
              }}
              placeholder="How are you feeling?"
              placeholderTextColor="#888"
              value={newEntryContent}
              onChangeText={setNewEntryContent}
              multiline
              autoFocus
            />
            
            <TouchableOpacity 
              style={{
                backgroundColor: '#007AFF',
                borderRadius: 12,
                padding: 14,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 16,
              }}
              onPress={handleCreateEntry}
              disabled={!newEntryContent.trim()}
            >
              <Send size={18} color="#fff" />
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '500',
                marginLeft: 8,
                fontFamily: 'Inter',
              }}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Add button */}
        {!showNewEntry && (
          <TouchableOpacity 
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#007AFF',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
            onPress={() => setShowNewEntry(true)}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// Main component that wraps the content with the provider
export default function Journal() {
  return (
    <JournalProvider>
      <JournalContent />
    </JournalProvider>
  );
}