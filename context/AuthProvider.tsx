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
  phoneNumber: string | null;
  weight: number | null;
  height: number | null;
  otherInfo: string | null;
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
          token: response.data.token,
          id: response.data.data.id,
          name: response.data.data.name,
          email: response.data.data.email,
          role: UserRole[response.data.data.role],
          phoneNumber: response.data.data.phoneNumber ?? null,
          weight: response.data.data.weight ?? null,
          height: response.data.data.height ?? null,
          otherInfo: response.data.data.otherInfo ?? null,
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
    if (!user) { return false }
    return user.role === UserRole.DOCTOR || (
      user.phoneNumber !== null &&
      user.weight !== null &&
      user.height !== null
    );
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
