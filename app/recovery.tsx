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

type Rule = {
  id: string;
  title: string;
  value: string;
  target?: string;
  status: "not_started" | "done" | "not_done";
};

export default function RecoveryScreen() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: "1",
      title: "Steps",
      value: "211",
      target: "10000",
      status: "not_started",
    },
    {
      id: "2",
      title: "Temperature",
      value: "21°C",
      target: "21°C",
      status: "done",
    },
    { id: "3", title: "Darkness", value: "--", target: "--", status: "done" },
    {
      id: "4",
      title: "Workout Minutes",
      value: "--",
      target: "20",
      status: "not_started",
    },
    {
      id: "5",
      title: "Caffeine",
      value: "--",
      target: "--",
      status: "not_done",
    },
    {
      id: "6",
      title: "Noise",
      value: "--",
      target: "10db",
      status: "not_started",
    },
    {
      id: "7",
      title: "Blue light",
      value: "--",
      target: "--",
      status: "not_started",
    },
    {
      id: "8",
      title: "Eating",
      value: "--",
      target: "--",
      status: "not_started",
    },
    {
      id: "9",
      title: "Drinking",
      value: "240ml",
      target: "2h before bedtime",
      status: "done",
    },
    { id: "10", title: "Alcohol", value: "0", target: "0", status: "done" },
  ]);

  const calculateScore = () => {
    const completed = rules.filter((rule) => rule.status === "done").length;
    return (completed / rules.length) * 100;
  };

  const getScoreColor = () => {
    const score = calculateScore();
    if (score < 30) return "#FF4747";
    if (score < 60) return "#FFB800";
    return "#00FF75";
  };

  const toggleStatus = (id: string) => {
    setRules(
      rules.map((rule) => {
        if (rule.id === id) {
          const statuses: ("not_started" | "done" | "not_done")[] = [
            "not_started",
            "done",
            "not_done",
          ];
          const currentIndex = statuses.indexOf(rule.status);
          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
          return { ...rule, status: nextStatus };
        }
        return rule;
      }),
    );
  };

  const addNewRule = () => {
    const newId = (rules.length + 1).toString();
    setRules([
      ...rules,
      {
        id: newId,
        title: "New Rule",
        value: "--",
        target: "--",
        status: "not_started",
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("../assets/images/Home.svg")}
            style={styles.backButton}
          />
        </TouchableOpacity>
        <ThemedText style={styles.title}>RECOVERY</ThemedText>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.score, { color: getScoreColor() }]}>
          {Math.round(calculateScore())}%
        </Text>
        <Text style={styles.scoreLabel}>COMPLETIONS</Text>
      </View>

      <ScrollView style={styles.rulesList}>
        {rules.map((rule) => (
          <TouchableOpacity
            key={rule.id}
            style={styles.ruleItem}
            onPress={() => toggleStatus(rule.id)}
          >
            <View style={styles.ruleContent}>
              <View style={styles.ruleHeader}>
                <Text style={styles.ruleTitle}>{rule.title}</Text>
                {rule.status === "done" && (
                  <Image
                    source={require("../assets/images/GreenCheck.svg")}
                    style={styles.statusIcon}
                  />
                )}
                {rule.status === "not_done" && (
                  <Image
                    source={require("../assets/images/Attention.svg")}
                    style={styles.statusIcon}
                  />
                )}
                {rule.status === "not_started" && (
                  <View style={styles.statusCircle} />
                )}
              </View>
              <Text style={styles.ruleValue}>
                {rule.value}
                {rule.target ? `/${rule.target}` : ""}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={addNewRule}>
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
    marginLeft: 16,
  },
  scoreContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  score: {
    fontSize: 72,
    fontWeight: "600",
  },
  scoreLabel: {
    color: "#808080",
    fontSize: 14,
  },
  rulesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ruleItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  ruleContent: {
    padding: 16,
  },
  ruleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ruleTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  ruleValue: {
    color: "#808080",
    fontSize: 14,
  },
  statusIcon: {
    width: 20,
    height: 20,
  },
  statusCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#808080",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 32,
  },
});
