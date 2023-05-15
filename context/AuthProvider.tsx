import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { instance as axiosInstance, setAxiosToken } from '../helpers/axiosConfig';

type LoginResponse = {
  token: string,
  data: User,
}

export type User = {
  id: number;
  name: string;
  email: string;
  token: string;
}

export type AuthContextType = {
  login: (username: string, password: string) => void;
  logout: () => void;
  error: string | null;
  isLoading: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  logout: () => {},
  error: null,
  isLoading: false,
  user: null,
  setUser: () => {},
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
        };

        setUser(userResponse);
        setError(null);
        SecureStore.setItemAsync('user', JSON.stringify(userResponse));
        setAxiosToken(userResponse.token);
      })
      .catch(error => {
        console.log(error.response);
        let value = '';
        if (error.response?.data.error.fields) {
          const key = Object.keys(error.response?.data.error.fields)[0];
          value = error.response?.data.error.fields[key];
        }
        const message = error.response?.data.error.message ?? value;
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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
