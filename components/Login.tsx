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
import { User } from "../types";

interface LoginProps {
  onLogin: (user: User) => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export default function Login({
  onLogin,
  onSwitchToSignup,
  onForgotPassword,
}: LoginProps): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const validateInputs = (): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        onLogin(data.user as User);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during sign in");
      console.error("Error signing in:", error.message);
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
            <Title style={styles.title}>Gecko Monitor</Title>

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

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
              disabled={loading}
            >
              Sign In
            </Button>

            <View style={styles.forgotPasswordContainer}>
              <Button mode="text" compact onPress={onForgotPassword}>
                Forgot Password?
              </Button>
            </View>

            <View style={styles.signupPrompt}>
              <Text>Don't have an account?</Text>
              <Button mode="text" onPress={onSwitchToSignup} disabled={loading}>
                Sign Up
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  signupPrompt: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
