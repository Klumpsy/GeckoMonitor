import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../supabaseConfig";
import { Enclosure } from "../types";

interface EnclosureImageProps {
  enclosure: Enclosure | null;
  onImageUpdated: () => void;
}

const EnclosureImage: React.FC<EnclosureImageProps> = ({
  enclosure,
  onImageUpdated,
}) => {
  const [uploading, setUploading] = useState<boolean>(false);

  if (!enclosure) {
    return null;
  }

  const getImageUrl = () => {
    if (enclosure.image_url) {
      return enclosure.image_url;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Please grant camera and media library permissions to upload images.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const options = ["Take Photo", "Choose from Library", "Cancel"];

    Alert.alert("Upload Enclosure Image", "Select an image source", [
      {
        text: options[0],
        onPress: () => takePhoto(),
      },
      {
        text: options[1],
        onPress: () => chooseFromLibrary(),
      },
      {
        text: options[2],
        style: "cancel",
      },
    ]);
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "There was an error taking the photo.");
    }
  };

  const chooseFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was an error picking the image.");
    }
  };

  // Function to update enclosure with image URL
  const updateEnclosureWithImageUrl = async (imageUrl: string) => {
    try {
      console.log("About to update enclosure with URL:", imageUrl);
      console.log("Enclosure ID:", enclosure.id);

      // Try using upsert instead of update
      const { data, error } = await supabase
        .from("gecko_enclosures")
        .upsert({
          id: enclosure.id,
          image_url: imageUrl,
          // Don't include other fields to avoid overwriting them
        })
        .select();

      console.log("Upsert response:", { data, error });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Error updating enclosure:", error);
      throw error;
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setUploading(true);

      // Log the process
      console.log("Starting image upload process...");
      console.log("Image URI:", uri);

      // First convert URI to Blob
      console.log("Fetching image data...");
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("Blob created, size:", blob.size);

      // Generate simple filename
      const filename = `enclosure${enclosure.id}_${Date.now()}.jpg`;
      console.log("Upload filename:", filename);

      // Upload to Supabase
      console.log("Uploading to Supabase...");
      const { data, error } = await supabase.storage
        .from("geckoimages")
        .upload(filename, blob, {
          contentType: "image/jpeg",
        });

      // Log the response
      console.log("Upload response:", { data, error });

      if (error) {
        throw error;
      }

      // Get public URL
      console.log("Getting public URL...");
      const { data: urlData } = supabase.storage
        .from("geckoimages")
        .getPublicUrl(filename);

      console.log("URL data:", urlData);

      // Update enclosure with image URL
      try {
        console.log("Updating enclosure record...");
        const result = await updateEnclosureWithImageUrl(urlData.publicUrl);
        console.log("Update result:", result);
      } catch (updateError) {
        console.error("Error updating enclosure:", updateError);
        throw updateError;
      }

      console.log("Upload process complete!");

      // Success! Refresh the enclosure data
      onImageUpdated();
      Alert.alert("Success", "Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      // Show more detailed error
      Alert.alert("Error", `Upload failed: ${JSON.stringify(error)}`);
    } finally {
      setUploading(false);
    }
  };

  // Wrapped Card.Content in View to fix shadow warning
  return (
    <View style={styles.cardWrapper}>
      <Card style={styles.card}>
        <View style={styles.cardContentWrapper}>
          {uploading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2c3e50" />
              <Text style={styles.loadingText}>Uploading image...</Text>
            </View>
          ) : (
            <>
              {imageUrl ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={pickImage}
                  >
                    <IconButton icon="pencil" size={20} iconColor="#ffffff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadContainer}
                  onPress={pickImage}
                  disabled={uploading}
                >
                  <IconButton icon="camera" size={40} iconColor="#2c3e50" />
                  <Text style={styles.uploadText}>Add Enclosure Photo</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.enclosureName}>{enclosure.name}</Text>
            {enclosure.gecko_species && (
              <Text style={styles.speciesName}>{enclosure.gecko_species}</Text>
            )}
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 15,
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
  },
  cardContentWrapper: {
    // This replaces Card.Content
  },
  imageContainer: {
    height: 200,
    width: "100%",
    overflow: "hidden",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadContainer: {
    height: 200,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 16,
    color: "#2c3e50",
  },
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  loadingContainer: {
    height: 200,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  loadingText: {
    marginTop: 10,
    color: "#2c3e50",
  },
  infoContainer: {
    padding: 12,
    backgroundColor: "rgba(44, 62, 80, 0.9)", // Dark blue semi-transparent background
  },
  enclosureName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  speciesName: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 2,
    fontStyle: "italic",
  },
});

export default EnclosureImage;
