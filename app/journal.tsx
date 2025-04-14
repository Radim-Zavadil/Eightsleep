import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

type JournalEntry = {
  id: string;
  date: string;
  title: string;
  content: string;
};

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: "30",
      title: "About today ...",
      content: "",
    },
  ]);

  const addNewEntry = () => {
    const newEntry = {
      id: String(entries.length + 1),
      date: new Date().getDate().toString(),
      title: "New Entry",
      content: "",
    };
    setEntries([...entries, newEntry]);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const updateEntryTitle = (id: string, newTitle: string) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, title: newTitle } : entry,
      ),
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/images/ArrowRightGrey.svg")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <ThemedText style={styles.title}>JOURNAL</ThemedText>
        <TouchableOpacity>
          <Image
            source={require("../assets/images/infoIcon.svg")}
            style={styles.infoIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.entriesCountContainer}>
        <Text style={styles.entriesCount}>{entries.length}</Text>
        <Text style={styles.entriesLabel}>JOURNAL ENTRIES</Text>
      </View>

      <ScrollView style={styles.entriesList}>
        {entries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.entryItem}
            onPress={() => {
              /* Navigate to entry detail */
            }}
          >
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>{entry.date}</Text>
              <View style={styles.entryContent}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  /* Show dropdown menu */
                }}
                style={styles.menuButton}
              >
                <Text style={styles.menuDots}>⋮</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={addNewEntry}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 24,
    height: 24,
    transform: [{ rotate: "180deg" }],
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoIcon: {
    width: 24,
    height: 24,
  },
  entriesCountContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  entriesCount: {
    fontSize: 72,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  entriesLabel: {
    color: "#808080",
    fontSize: 14,
  },
  entriesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  entryItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  entryDate: {
    color: "#808080",
    fontSize: 24,
    marginRight: 16,
  },
  entryContent: {
    flex: 1,
  },
  entryTitle: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  menuButton: {
    padding: 8,
  },
  menuDots: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#000000",
    fontSize: 32,
  },
});
