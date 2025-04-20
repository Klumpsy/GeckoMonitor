import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  TextInput,
  Card,
  Title,
  IconButton,
  HelperText,
  Menu,
  Text,
} from "react-native-paper";
import { supabase } from "../supabaseConfig";
import { Enclosure } from "../types";
import { geckoSpecies } from "../config/geckoConditions";

interface AddEnclosureProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (enclosure: Enclosure) => void;
}

const AddEnclosure: React.FC<AddEnclosureProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [geckoSpeciesType, setGeckoSpeciesType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [speciesError, setSpeciesError] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  const speciesOptions = Object.keys(geckoSpecies);

  const handleSubmit = async (): Promise<void> => {
    let isValid = true;

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!geckoSpeciesType) {
      setSpeciesError("Gecko species is required");
      isValid = false;
    } else {
      setSpeciesError("");
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gecko_enclosures")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          gecko_species: geckoSpeciesType,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        onSuccess(data as Enclosure);
        resetForm();
      }
    } catch (error: any) {
      console.error("Error adding enclosure:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setName("");
    setDescription("");
    setGeckoSpeciesType("");
    setNameError("");
    setSpeciesError("");
  };

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
                  <Title style={styles.title}>Add New Enclosure</Title>
                  <IconButton
                    icon="close"
                    size={24}
                    onPress={() => {
                      resetForm();
                      onClose();
                    }}
                  />
                </View>

                <TextInput
                  label="Enclosure Name *"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (text.trim()) setNameError("");
                  }}
                  mode="outlined"
                  style={styles.input}
                  error={!!nameError}
                  placeholder="e.g., Living Room Leopard Gecko"
                />
                {nameError ? (
                  <HelperText type="error">{nameError}</HelperText>
                ) : null}

                <View style={styles.speciesSelector}>
                  <Text style={styles.speciesLabel}>Gecko Species *</Text>
                  <View>
                    <Button
                      mode="outlined"
                      onPress={() => setMenuVisible(true)}
                      style={[
                        styles.speciesButton,
                        !!speciesError && styles.speciesButtonError,
                      ]}
                    >
                      {geckoSpeciesType || "Select Species"}
                    </Button>
                    {speciesError ? (
                      <HelperText type="error">{speciesError}</HelperText>
                    ) : null}

                    <Menu
                      visible={menuVisible}
                      onDismiss={() => setMenuVisible(false)}
                      anchor={<View />} // Empty view as anchor since we're positioning the menu manually
                      style={styles.menu}
                    >
                      {speciesOptions.map((species) => (
                        <Menu.Item
                          key={species}
                          onPress={() => {
                            setGeckoSpeciesType(species);
                            setSpeciesError("");
                            setMenuVisible(false);
                          }}
                          title={species}
                        />
                      ))}
                    </Menu>
                  </View>
                </View>

                {geckoSpeciesType && (
                  <View style={styles.speciesInfo}>
                    <Text style={styles.speciesDescription}>
                      {geckoSpecies[geckoSpeciesType]?.description || ""}
                    </Text>
                  </View>
                )}

                <TextInput
                  label="Description (optional)"
                  value={description}
                  onChangeText={setDescription}
                  mode="outlined"
                  style={styles.input}
                  multiline
                  numberOfLines={3}
                  placeholder="e.g., 20 gallon tank with heating pad"
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.button}
                  disabled={loading}
                >
                  Add Enclosure
                </Button>
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
  input: {
    marginBottom: 12,
  },
  speciesSelector: {
    marginBottom: 12,
  },
  speciesLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
  },
  speciesButton: {
    width: "100%",
    marginVertical: 4,
  },
  speciesButtonError: {
    borderColor: "red",
  },
  menu: {
    maxHeight: 300,
  },
  speciesInfo: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  speciesDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2c3e50",
    paddingVertical: 8,
  },
});

export default AddEnclosure;
