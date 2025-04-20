import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";
import { Reading, Enclosure } from "../types";
import { evaluateReading } from "../helper/evaluateConditions";

interface CurrentConditionsProps {
  reading: Reading;
  enclosure: Enclosure | null;
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({
  reading,
  enclosure,
}) => {
  const humidityEvaluation = evaluateReading(
    reading.humidity,
    enclosure,
    "humidity"
  );
  const airTempEvaluation = evaluateReading(
    reading.air_temperature,
    enclosure,
    "air_temperature"
  );
  const surfaceTempEvaluation = evaluateReading(
    reading.surface_temperature,
    enclosure,
    "surface_temperature"
  );

  const currentHour = new Date().getHours();
  const isNightTime = currentHour < 7 || currentHour >= 19;
  const timePeriod = isNightTime ? "Night" : "Day";

  return (
    <Card style={styles.currentReadings}>
      <Card.Title
        title="Current Conditions"
        subtitle={`${enclosure?.gecko_species || ""} - ${timePeriod} Period`}
      />
      <Card.Content>
        <View style={styles.readingRow}>
          <View style={styles.readingItem}>
            <Text style={styles.readingLabel}>Humidity</Text>
            <Text
              style={[styles.readingValue, { color: humidityEvaluation.color }]}
            >
              {humidityEvaluation.value}
            </Text>
          </View>

          <View style={styles.readingItem}>
            <Text style={styles.readingLabel}>Air Temp</Text>
            <Text
              style={[styles.readingValue, { color: airTempEvaluation.color }]}
            >
              {airTempEvaluation.value}
            </Text>
          </View>

          {reading.surface_temperature !== null && (
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Surface Temp</Text>
              <Text
                style={[
                  styles.readingValue,
                  { color: surfaceTempEvaluation.color },
                ]}
              >
                {surfaceTempEvaluation.value}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.timestamp}>
          Last updated: {new Date(reading.timestamp).toLocaleString()}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  currentReadings: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  readingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  readingItem: {
    alignItems: "center",
  },
  readingLabel: {
    fontSize: 14,
    color: "#666",
  },
  readingValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
});

export default CurrentConditions;
