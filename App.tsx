import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Provider as PaperProvider, FAB, Button } from "react-native-paper";
import { supabase } from "./supabaseConfig";
import AuthScreen from "./components/AuthScreen";
import ReadingChart from "./components/ReadingChart";
import AddEnclosure from "./components/AddEnclosure";
import CurrentConditions from "./components/CurrentConditions";
import EnclosureImage from "./components/EnclosureImage";
import OptimalConditionsModal from "./components/OptimalConditionsModal";
import { useEnclosures, useReadings } from "./hooks/useSupabaseData";
import { formatChartData } from "./helper/formatChartData";
import { Enclosure, User, TimeRange, Reading } from "./types";
import "react-native-url-polyfill/auto";

export default function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [selectedEnclosure, setSelectedEnclosure] = useState<Enclosure | null>(
    null
  );
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [addEnclosureVisible, setAddEnclosureVisible] =
    useState<boolean>(false);
  const [optimalConditionsVisible, setOptimalConditionsVisible] =
    useState<boolean>(false);

  const {
    enclosures,
    loading: loadingEnclosures,
    refetch: refetchEnclosures,
    addEnclosure,
  } = useEnclosures();

  const {
    readings,
    loading: loadingReadings,
    refetch: refetchReadings,
  } = useReadings(selectedEnclosure?.id || null, timeRange);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user as User);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (enclosures.length > 0 && !selectedEnclosure) {
      setSelectedEnclosure(enclosures[0]);
    }
  }, [enclosures, selectedEnclosure]);

  const checkUser = async (): Promise<void> => {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      setUser(data.session.user as User);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  const onRefresh = (): void => {
    refetchEnclosures();
    if (selectedEnclosure?.id) {
      refetchReadings(selectedEnclosure.id);
    }
  };

  const handleAddEnclosure = (newEnclosure: Enclosure): void => {
    addEnclosure(newEnclosure);
    setAddEnclosureVisible(false);
  };

  // Function to handle image updates
  const handleImageUpdated = (): void => {
    refetchEnclosures();
  };

  const getLatestReading = (readings: Reading[]): Reading | null => {
    if (!readings || readings.length === 0) return null;
    return readings[readings.length - 1];
  };

  const latestReading = getLatestReading(readings);
  const refreshing = loadingEnclosures || loadingReadings;

  const hasAirTempData = readings.some((r) => r.air_temperature !== null);
  const hasHumidityData = readings.some((r) => r.humidity !== null);
  const hasSurfaceTempData = readings.some(
    (r) => r.surface_temperature !== null
  );

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gecko Enclosure Monitor</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.scrollView}
        >
          {/* Enclosure Selection */}
          <View style={styles.enclosureSelector}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {enclosures.map((enclosure) => (
                <TouchableOpacity
                  key={enclosure.id}
                  style={[
                    styles.enclosureButton,
                    selectedEnclosure?.id === enclosure.id &&
                      styles.selectedEnclosure,
                  ]}
                  onPress={() => setSelectedEnclosure(enclosure)}
                >
                  <Text
                    style={[
                      styles.enclosureButtonText,
                      selectedEnclosure?.id === enclosure.id &&
                        styles.selectedEnclosureText,
                    ]}
                  >
                    {enclosure.name}
                    {enclosure.gecko_species && (
                      <Text style={styles.speciesTag}>
                        {" "}
                        ({enclosure.gecko_species})
                      </Text>
                    )}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Time Range Selection */}
          <View style={styles.timeRangeSelector}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === "24h" && styles.selectedTimeButton,
              ]}
              onPress={() => setTimeRange("24h")}
            >
              <Text style={styles.timeButtonText}>24h</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === "7d" && styles.selectedTimeButton,
              ]}
              onPress={() => setTimeRange("7d")}
            >
              <Text style={styles.timeButtonText}>7d</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === "30d" && styles.selectedTimeButton,
              ]}
              onPress={() => setTimeRange("30d")}
            >
              <Text style={styles.timeButtonText}>30d</Text>
            </TouchableOpacity>
          </View>

          {/* User Uploaded Enclosure Image */}
          {selectedEnclosure && (
            <EnclosureImage
              enclosure={selectedEnclosure}
              onImageUpdated={handleImageUpdated}
            />
          )}

          {/* Current Conditions with Color Coding */}
          {latestReading && (
            <View>
              <CurrentConditions
                reading={latestReading}
                enclosure={selectedEnclosure}
              />
              {selectedEnclosure?.gecko_species && (
                <Button
                  mode="outlined"
                  style={styles.optimalButton}
                  icon="information-outline"
                  onPress={() => setOptimalConditionsVisible(true)}
                >
                  View Optimal Conditions
                </Button>
              )}
            </View>
          )}

          {/* Charts using the reusable component */}
          {hasAirTempData && (
            <ReadingChart
              title="Air Temperature"
              data={formatChartData(readings, "air_temp")}
              color="255, 69, 0"
              unit="°C"
              emptyMessage="No temperature data available"
            />
          )}

          {hasHumidityData && (
            <ReadingChart
              title="Humidity"
              data={formatChartData(readings, "humidity")}
              color="0, 105, 255"
              unit="%"
              emptyMessage="No humidity data available"
            />
          )}

          {hasSurfaceTempData && (
            <ReadingChart
              title="Surface Temperature"
              data={formatChartData(readings, "surface_temp")}
              color="75, 192, 192"
              unit="°C"
              emptyMessage="No surface temperature data available"
            />
          )}
        </ScrollView>

        {/* FAB for adding new enclosure */}
        <FAB
          style={styles.fab}
          icon="plus"
          label="Add Enclosure"
          onPress={() => setAddEnclosureVisible(true)}
        />

        {/* Add Enclosure Modal */}
        <AddEnclosure
          visible={addEnclosureVisible}
          onClose={() => setAddEnclosureVisible(false)}
          onSuccess={handleAddEnclosure}
        />

        {/* Optimal Conditions Modal */}
        <OptimalConditionsModal
          visible={optimalConditionsVisible}
          onClose={() => setOptimalConditionsVisible(false)}
          enclosure={selectedEnclosure}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2c3e50",
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  enclosureSelector: {
    marginBottom: 15,
  },
  enclosureButton: {
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
  },
  selectedEnclosure: {
    backgroundColor: "#2c3e50",
  },
  enclosureButtonText: {
    fontWeight: "500",
  },
  selectedEnclosureText: {
    color: "white",
  },
  speciesTag: {
    fontSize: 12,
    fontStyle: "italic",
  },
  timeRangeSelector: {
    flexDirection: "row",
    marginBottom: 15,
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
  },
  selectedTimeButton: {
    backgroundColor: "#3498db",
  },
  timeButtonText: {
    fontWeight: "500",
  },
  optimalButton: {
    marginTop: -5,
    marginBottom: 15,
    borderColor: "#2c3e50",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#2c3e50",
  },
});
