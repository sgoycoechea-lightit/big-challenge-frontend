import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthProvider';
import { AuthStackParamList } from '../Root';
import Colors from '../constants/Colors';

//
// This screen is implemented without any external library.
//

export default function LoginScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Login'>
) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.w260}>
        <View style={styles.titleSubtitleContainer}>
          <Text style={styles.title}>Welcome to the doctor's app!</Text>
          <Text style={[styles.subtitle, styles.mt22]}>Log in to access unique features</Text>
        </View>
        <View style={styles.mt30}>
          {error && <Text style={styles.error}>{error}</Text>}
          <TextInput
            style={[styles.inputBox, styles.mt16]}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            placeholderTextColor="gray"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.inputBox, styles.mt16]}
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
          style={[styles.loginButton, styles.mt22]}
        >
          {isLoading && (
            <ActivityIndicator
              style={styles.activityIndicator}
              color="white"
            />
          )}
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <View style={[styles.registerView, styles.mt16]}>
          <Text style={styles.registerText}>Don't have an account yet?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerTextLink}> Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
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
    backgroundColor: Colors.WHITE,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLUE,
    padding: 12,
    borderRadius: 5,
  },
  loginButtonText: {
    color: Colors.WHITE,
  },
  activityIndicator: {
    marginRight: 18,
    height: 10,
    width: 10,
  },
  registerText: {
    fontSize: 14,
    color: Colors.DARK_GRAY,
  },
  registerTextLink: {
    fontSize: 14,
    color: 'blue',
  },
  error: {
    color: 'red',
  },
  registerView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mt16: {
    marginTop: 16,
  },
  mr16: {
    marginRight: 16,
  },
  mt22: {
    marginTop: 22,
  },
  mt30: {
    marginTop: 30,
  },
  w260: {
    width: 260,
  }
});
