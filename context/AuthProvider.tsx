import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { instance as axiosInstance, setAxiosToken } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';

type LoginResponse = {
  token: string,
  data: User,
}

export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

export type User = {
  id: number;
  name: string;
  email: string;
  token: string;
  role: UserRole;
  phone_number: string | null;
  weight: number | null;
  height: number | null;
  other_information: string | null;
}

export type AuthContextType = {
  login: (username: string, password: string) => void;
  logout: () => void;
  error: string | null;
  isLoading: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserInfoComplete: () => boolean;
};

export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
  error: null,
  isLoading: false,
  user: null,
  setUser: () => {},
  isUserInfoComplete: () => { return false },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = (email: string, password: string) => {
    setIsLoading(true);
    axiosInstance
      .post<LoginResponse>('/login', {
        email,
        password,
        device_name: 'mobile',
      })
      .then(response => {
        const userResponse: User = {
          ...response.data.data,
          token: response.data.token
        };

        setUser(userResponse);
        setError(null);
        SecureStore.setItemAsync('user', JSON.stringify(userResponse));
        setAxiosToken(userResponse.token);
      })
      .catch(error => {
        console.log(error.response);
        const message = getErrorMessage(error);
        setError(message);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const logout = () => {
    setIsLoading(true);
    axiosInstance
      .post('/logout')
      .then(response => {
        setError(null);
      })
      .catch(error => {
        console.log(error);
        setError(error.response.data.message);
      })
      .finally(() => {
        setUser(null);
        setIsLoading(false);
        SecureStore.deleteItemAsync('user');
        setAxiosToken('');
      });
  };

  const isUserInfoComplete = () => {
    if (!user) return false;
    if (user.role !== UserRole.PATIENT) return true;
    return (user.phone_number !== null && user.phone_number !== undefined &&
            user.weight !== null && user.weight !== undefined &&
            user.height !== null && user.height !== undefined);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        isLoading,
        login,
        logout,
        isUserInfoComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
