import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { instance as axiosInstance, setAxiosToken } from '../helpers/axiosConfig';
import getErrorMessage from '../helpers/getErrorMessage';
import User from '../types/User';
import UserRole from '../types/UserRole';


type LoginResponse = {
  token: string,
  data: User,
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

        setAxiosToken(userResponse.token);
        SecureStore.setItemAsync('user', JSON.stringify(userResponse));
        setError(null);
        setUser(userResponse);
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
    const { role, phone_number, weight, height, } = user;

    if (role !== UserRole.PATIENT) return true;
    return (phone_number !== null && phone_number !== undefined &&
            weight !== null && weight !== undefined &&
            height !== null && height !== undefined);
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
