import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import { User } from "../types";

interface SignupProps {
  onLogin: (user: User) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onLogin, onSwitchToLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const validateInputs = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSignup = async (): Promise<void> => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        Alert.alert(
          "Signup Successful",
          "Please check your email to verify your account.",
          [{ text: "OK" }]
        );

        if (data.user.email_confirmed_at) {
          onLogin(data.user as User);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during signup");
      console.error("Error signing up:", error.message);
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
            <Title style={styles.title}>Create Account</Title>

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

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              error={!!passwordError}
            />
            {passwordError ? (
              <HelperText type="error">{passwordError}</HelperText>
            ) : null}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry
              error={!!confirmPasswordError}
            />
            {confirmPasswordError ? (
              <HelperText type="error">{confirmPasswordError}</HelperText>
            ) : null}

            <Button
              mode="contained"
              onPress={handleSignup}
              loading={loading}
              style={styles.button}
              disabled={loading}
            >
              Sign Up
            </Button>

            <View style={styles.loginPrompt}>
              <Text>Already have an account?</Text>
              <Button mode="text" onPress={onSwitchToLogin} disabled={loading}>
                Log In
              </Button>
            </View>
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
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 15,
    backgroundColor: "#2c3e50",
    paddingVertical: 8,
  },
  loginPrompt: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Signup;
