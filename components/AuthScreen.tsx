import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import Login from "./Login";
import Signup from "./Signup";
import PasswordReset from "./PasswordReset";
import { User } from "../types";

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

enum AuthScreenState {
  LOGIN,
  SIGNUP,
  PASSWORD_RESET,
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [screenState, setScreenState] = useState<AuthScreenState>(
    AuthScreenState.LOGIN
  );

  const switchToLogin = () => {
    setScreenState(AuthScreenState.LOGIN);
  };

  const switchToSignup = () => {
    setScreenState(AuthScreenState.SIGNUP);
  };

  const switchToPasswordReset = () => {
    setScreenState(AuthScreenState.PASSWORD_RESET);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {screenState === AuthScreenState.LOGIN ? (
          <Login
            onLogin={onLogin}
            onSwitchToSignup={switchToSignup}
            onForgotPassword={switchToPasswordReset}
          />
        ) : screenState === AuthScreenState.SIGNUP ? (
          <Signup onLogin={onLogin} onSwitchToLogin={switchToLogin} />
        ) : (
          <PasswordReset onBack={switchToLogin} />
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});

export default AuthScreen;
