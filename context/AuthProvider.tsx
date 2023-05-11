import React, { createContext, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import axiosConfig from '../helpers/axiosConfig';

export type User = {
  id: number;
  name: string;
  email: string;
  token: string;
}

export type AuthContextType = {
  login: (username: string, password: string) => void;
  error: string | null;
  isLoading: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = createContext<AuthContextType>({
  login: () => {},
  error: null,
  isLoading: false,
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        error,
        isLoading,
        login: (email: string, password: string) => {
          setIsLoading(true);
          axiosConfig
            .post('/login', {
              email,
              password,
              device_name: 'mobile',
            })
            .then(response => {
              const userResponse: User = {
                token: response.data.data.token,
                id: response.data.data.user.id,
                name: response.data.data.user.name,
                email: response.data.data.user.email,
              };

              setUser(userResponse);
              setError(null);
              SecureStore.setItemAsync('user', JSON.stringify(userResponse));
              setIsLoading(false);
            })
            .catch(error => {
              console.log(error.response);
              const key = Object.keys(error.response?.data.errors)[0];
              setError(error.response?.data.errors[key][0]);
              setIsLoading(false);
            });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
