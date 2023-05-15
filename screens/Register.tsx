import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { instance as axiosInstance } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../Root';

type RegisterFormData = {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
  role: 'PATIENT' | 'DOCTOR';
};

export default function RegisterScreen({ navigation }: NativeStackScreenProps<AuthStackParamList, 'Register'>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch, 
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = (data: RegisterFormData) => {
    setIsLoading(true);
    axiosInstance
      .post('/signup', data)
      .then(response => {
        Alert.alert('User created! Please login.');
        navigation.navigate('Login');
        setIsLoading(false);
        setError(null);
      })
      .catch(error => {
        console.log(error.response);
        const message = getErrorMessage(error);
        setError(message);
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
        {error && <Text style={styles.error}>{error}</Text>}
          <Controller
            control={control}
            name="name"
            rules={{ required: true }}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                style={[styles.inputBox, styles.mt16]}
                value={value}
                placeholder="Name"
              />
            )}
          />
          {errors.name && <Text style={styles.error}>This field is required</Text>}
          <Controller
            control={control}
            name="email"
            rules={{ required: true, pattern: /^\S+@\S+$/i }}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                style={[styles.inputBox, styles.mt16]}
                value={value}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && errors.email.type === 'required' && (
            <Text style={styles.error}>This field is required</Text>
          )}
          {errors.email && errors.email.type === 'pattern' && (
            <Text style={styles.error}>Invalid email address</Text>
          )}
          <Controller
            control={control}
            name="password"
            rules={{ required: true, minLength: 6 }}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                style={[styles.inputBox, styles.mt16]}
                value={value}
                placeholder="Password"
                secureTextEntry
              />
            )}
          />
          {errors.password && errors.password.type === 'required' && (
            <Text style={styles.error}>This field is required</Text>
          )}
          {errors.password && errors.password.type === 'minLength' && (
            <Text style={styles.error}>The password is too short</Text>
          )}
          <Controller
            control={control}
            name="password_confirmation"
            rules={{
              required: true,
              validate: (value) => value === password || 'Passwords must match',
            }}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                onChangeText={onChange}
                style={[styles.inputBox, styles.mt16]}
                value={value}
                placeholder="Repeat Password"
                secureTextEntry
              />
            )}
          />
          {errors.password_confirmation && <Text style={styles.error}>The passwords must match</Text>}
          <Controller
            control={control}
            name="role"
            defaultValue="DOCTOR"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group
                onValueChange={onChange}
                value={value}
              >
                <View style={[styles.radioButtonsContainer, styles.mt5]}>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton value="DOCTOR" uncheckedColor="red" />
                    <Text >Doctor</Text>
                  </View>
                  <View style={styles.radioButtonContainer}>
                    <RadioButton value="PATIENT" />
                    <Text >Patient</Text>
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
              style={styles.mr18}
              size="small"
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