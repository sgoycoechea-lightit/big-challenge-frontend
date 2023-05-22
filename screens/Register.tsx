import React, { useState } from 'react';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { instance as axiosInstance } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../Root';
import Colors from '../constants/Colors';
import InputField from '../components/InputField';

//
// This screen is implemented using react-hook-form and zod.
//

const schema = z.object({
  name: z.string().min(3, { message: "This name is too short" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "This password is too short" }),
  password_confirmation: z.string(),
  role: z.enum(['DOCTOR', 'PATIENT']).default('PATIENT'),
})
.refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

type RegisterFormData = z.infer<typeof schema>;

export default function RegisterScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    setIsLoading(true);
    axiosInstance
      .post('/signup', data)
      .then(response => {
        Alert.alert('User created! Please login.');
        navigation.navigate('Login');
        setApiError(null);
      })
      .catch(error => {
        console.log(error.response);
        const message = getErrorMessage(error);
        setApiError(message);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.w260}>
        <View style={styles.titleSubtitleContainer}>
          <Text style={styles.title}>Welcome to the doctor's app!</Text>
          <Text style={[styles.subtitle, styles.mt22]}>Sign up to access unique features</Text>
        </View>
        <View style={styles.mt30}>
        {apiError && <Text style={styles.error}>{apiError}</Text>}
        {errors.root && <Text style={styles.error}>{errors.root.message}</Text>}
          <InputField
            error = {errors.name}
            control = {control}
            name = 'name'
            placeholder = 'Name'
          />
          <InputField
            error = {errors.email}
            control = {control}
            name = 'email'
            placeholder = 'Email'
            keyboardType = 'email-address'
            autoCapitalize = 'none'
          />
          <InputField
            error = {errors.password}
            control = {control}
            name = 'password'
            placeholder = 'Password'
            secureTextEntry
          />
          <InputField
            error = {errors.password_confirmation}
            control = {control}
            name = 'password_confirmation'
            placeholder = 'Repeat Password'
            secureTextEntry
          />
          <Controller
            control={control}
            name="role"
            defaultValue="PATIENT"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group
                onValueChange={onChange}
                value={value}
              >
                <View style={[styles.radioButtonsContainer, styles.mt5]}>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton value="PATIENT" uncheckedColor="red" />
                    <Text>Patient</Text>
                  </View>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton value="DOCTOR" />
                    <Text>Doctor</Text>
                  </View>
                </View>
              </RadioButton.Group>
            )}
          />
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[styles.loginButton, styles.mt16]}
        >
          {isLoading && (
            <ActivityIndicator
              style={styles.activityIndicator}
              color="white"
            />
          )}
          <Text style={styles.loginButtonText}>Sign up</Text>
        </TouchableOpacity>
        <View style={[styles.registerView, styles.mt16]}>
          <Text style={styles.registerText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.registerTextLink}> Log in</Text>
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
    backgroundColor: '#2563EB',
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
    color: '#6B7280',
  },
  registerTextLink: {
    fontSize: 14,
    color: 'blue',
  },
  error: {
    color: 'red',
  },
  radioButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    paddingRight: 15,
  },
  registerView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mt16: {
    marginTop: 16,
  },
  mr18: {
    marginRight: 18,
  },
  mt5: {
    marginTop: 5,
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
