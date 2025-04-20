import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  Button,
  TextInput,
  Card,
  Title,
  Text,
  HelperText,
} from "react-native-paper";
import { supabase } from "../supabaseConfig";

interface PasswordResetProps {
  onBack: () => void;
}

const PasswordReset: React.FC<PasswordResetProps> = ({ onBack }) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [resetSent, setResetSent] = useState<boolean>(false);

  const validateEmail = (): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleResetPassword = async (): Promise<void> => {
    if (!validateEmail()) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "yourapp://reset-password", // You can set up deep linking here
      });

      if (error) throw error;

      setResetSent(true);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while requesting password reset"
      );
      console.error("Error resetting password:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Reset Password</Title>

            {resetSent ? (
              <View>
                <Text style={styles.successText}>
                  If an account exists for {email}, you will receive a password
                  reset link shortly.
                </Text>
                <Button
                  mode="contained"
                  onPress={onBack}
                  style={[styles.button, { marginTop: 20 }]}
                >
                  Back to Login
                </Button>
              </View>
            ) : (
              <>
                <Text style={styles.instructions}>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </Text>

                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={!!emailError}
                />
                {emailError ? (
                  <HelperText type="error">{emailError}</HelperText>
                ) : null}

                <Button
                  mode="contained"
                  onPress={handleResetPassword}
                  loading={loading}
                  style={styles.button}
                  disabled={loading}
                >
                  Send Reset Link
                </Button>

                <Button mode="text" onPress={onBack} style={styles.backButton}>
                  Back to Login
                </Button>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  instructions: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#2c3e50",
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 15,
  },
  successText: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
});

export default PasswordReset;
