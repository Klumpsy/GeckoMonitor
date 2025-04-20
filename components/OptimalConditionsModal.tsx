import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Card, Title, IconButton, Text, Divider } from "react-native-paper";
import { Enclosure } from "../types";
import { geckoSpecies } from "../config/geckoConditions";

interface OptimalConditionsModalProps {
  visible: boolean;
  onClose: () => void;
  enclosure: Enclosure | null;
}

const OptimalConditionsModal: React.FC<OptimalConditionsModalProps> = ({
  visible,
  onClose,
  enclosure,
}) => {
  // If no enclosure or species is selected, don't render anything
  if (!enclosure?.gecko_species) {
    return null;
  }

  // Get the conditions for the selected species
  const speciesData = geckoSpecies[enclosure.gecko_species];

  // If we don't have data for this species, show a message
  if (!speciesData) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.headerRow}>
                  <Title style={styles.title}>No Data Available</Title>
                  <IconButton icon="close" size={24} onPress={onClose} />
                </View>
                <Text>
                  We don't have optimal condition data for this species yet.
                </Text>
              </Card.Content>
            </Card>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.headerRow}>
                  <Title style={styles.title}>Optimal Conditions</Title>
                  <IconButton icon="close" size={24} onPress={onClose} />
                </View>

                <Text style={styles.speciesTitle}>
                  {enclosure.gecko_species}
                </Text>
                <Text style={styles.description}>
                  {speciesData.description}
                </Text>

                <Divider style={styles.divider} />

                {/* Day Temperature */}
                <View style={styles.conditionSection}>
                  <Text style={styles.sectionTitle}>☀️ Day Temperature</Text>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>Range:</Text>
                    <Text style={styles.rangeValue}>
                      {speciesData.temperature.day.min}°C -{" "}
                      {speciesData.temperature.day.max}°C
                    </Text>
                  </View>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>Ideal:</Text>
                    <Text style={styles.rangeValue}>
                      {speciesData.temperature.day.ideal}°C
                    </Text>
                  </View>
                </View>

                {/* Night Temperature */}
                <View style={styles.conditionSection}>
                  <Text style={styles.sectionTitle}>🌙 Night Temperature</Text>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>Range:</Text>
                    <Text style={styles.rangeValue}>
                      {speciesData.temperature.night.min}°C -{" "}
                      {speciesData.temperature.night.max}°C
                    </Text>
                  </View>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>Ideal:</Text>
                    <Text style={styles.rangeValue}>
                      {speciesData.temperature.night.ideal}°C
                    </Text>
                  </View>
                </View>

                {/* Basking Spot (if applicable) */}
                {speciesData.temperature.basking && (
                  <View style={styles.conditionSection}>
                    <Text style={styles.sectionTitle}>🔆 Basking Spot</Text>
                    <View style={styles.rangeRow}>
                      <Text style={styles.rangeLabel}>Range:</Text>
                      <Text style={styles.rangeValue}>
                        {speciesData.temperature.basking.min}°C -{" "}
                        {speciesData.temperature.basking.max}°C
                      </Text>
                    </View>
                    <View style={styles.rangeRow}>
                      <Text style={styles.rangeLabel}>Ideal:</Text>
                      <Text style={styles.rangeValue}>
                        {speciesData.temperature.basking.ideal}°C
                      </Text>
                    </View>
                  </View>
                )}

                {/* Day Humidity */}
                <View style={styles.conditionSection}>
                  <Text style={styles.sectionTitle}>☀️ Day Humidity</Text>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>Range:</Text>
                    <Text style={styles.rangeValue}>
                      {speciesData.humidity.day.min}% -{" "}
                      {speciesData.humidity.day.max}%
                    </Text>
                  </View>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>Ideal:</Text>
                    <Text style={styles.rangeValue}>
                      {speciesData.humidity.day.ideal}%
                    </Text>
                  </View>
                </View>

                {/* Night Humidity */}
                <View style={styles.conditionSection}>
                  <Text style={styles.sectionTitle}>🌙 Night Humidity</Text>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>Range:</Text>
                    <Text style={styles.rangeValue}>
                      {speciesData.humidity.night.min}% -{" "}
                      {speciesData.humidity.night.max}%
                    </Text>
                  </View>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeLabel}>Ideal:</Text>
                    <Text style={styles.rangeValue}>
                      {speciesData.humidity.night.ideal}%
                    </Text>
                  </View>
                </View>

                <Divider style={styles.divider} />

                <Text style={styles.note}>
                  These conditions are used to color-code your current readings:
                </Text>
                <View style={styles.legendRow}>
                  <View
                    style={[styles.legendItem, { backgroundColor: "#4ade80" }]}
                  />
                  <Text style={styles.legendText}>Optimal</Text>
                </View>
                <View style={styles.legendRow}>
                  <View
                    style={[styles.legendItem, { backgroundColor: "#fb923c" }]}
                  />
                  <Text style={styles.legendText}>Slight Deviation</Text>
                </View>
                <View style={styles.legendRow}>
                  <View
                    style={[styles.legendItem, { backgroundColor: "#ef4444" }]}
                  />
                  <Text style={styles.legendText}>Severe Deviation</Text>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    maxHeight: "80%",
  },
  card: {
    borderRadius: 10,
    elevation: 0,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  speciesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    fontStyle: "italic",
  },
  divider: {
    marginVertical: 10,
  },
  conditionSection: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  rangeRow: {
    flexDirection: "row",
    marginVertical: 3,
  },
  rangeLabel: {
    width: 50,
    fontWeight: "500",
  },
  rangeValue: {
    marginLeft: 10,
  },
  note: {
    fontSize: 14,
    marginVertical: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  legendItem: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});

export default OptimalConditionsModal;
