import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { AuthContext, AuthContextType } from '../context/AuthProvider';

type LoginScreenProps = {
    navigation: NavigationScreenProp<any,any>
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, error, isLoading } = useContext<AuthContextType>(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.w260}>
        <View style={styles.titleSubtitleContainer}>
          <Text style={styles.title}>Welcome to the doctor's app!</Text>
          <Text style={[styles.subtitle, styles.mt5]}>Log in to access unique features</Text>
        </View>
        <View style={styles.mt30}>
          {error && <Text style={styles.error}>{error}</Text>}
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="gray"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.inputBox, styles.mt4]}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor="gray"
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          onPress={() => login(email, password)}
          style={[styles.loginButton, styles.mt5]}
        >
          {isLoading && (
            <ActivityIndicator
              style={styles.mr18}
              size="small"
              color="white"
            />
          )}
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 150,
  },
  titleSubtitleContainer: {
    alignItems: 'center' 
  },
  title: {
    fontWeight: '600',
    fontSize: 23,
    lineHeight: 28,
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 24,
    textAlign: 'center',
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
  },
  registerText: {
    fontSize: 12,
  },
  registerTextLink: {
    fontSize: 12,
    color: 'white',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
  },
  mr18: {
    marginRight: 16,
  },
  mt4: {
    marginTop: 16,
  },
  mt5: {
    marginTop: 22,
  },
  mt30: {
    marginTop: 30,
  },
  w260: {
    width: 260,
  }
});
