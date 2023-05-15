import React, { useContext, useEffect, useState } from 'react';

import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import * as SecureStore from 'expo-secure-store';
import 'react-native-gesture-handler';

import { AuthContext, AuthContextType } from './context/AuthProvider';
import { setAxiosToken } from './helpers/axiosConfig';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import Colors from './constants/Colors';

export type HomeStackParamList = {
  Home: undefined;
};

export type AuthStackParamList = {
  Register: undefined;
  Login: undefined;
};

export type DrawerParamList = {
  HomeStack: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
    </HomeStack.Navigator>
  );
};

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false, presentation: 'transparentModal' }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false, presentation: 'transparentModal' }}
      />
    </AuthStack.Navigator>
  );
};

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { logout, user } = useContext(AuthContext);
  
  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={false}
    >
      <DrawerItemList {...props} />
      <View style={styles.logoutContainer}>
        <View style={styles.userInitialView}>
          <Text style={styles.userInitial}>{user?.name[0]}</Text>
        </View>
        <View style={styles.userNameAndLogoutView}>
          <Text style={styles.userName}>{user?.name}</Text>
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logout}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, setUser } = useContext<AuthContextType>(AuthContext);

  useEffect(() => {
    SecureStore.getItemAsync('user')
      .then(userString => {
        if (userString) {
          const user = JSON.parse(userString);
          setUser(user);
          setAxiosToken(user.token);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
   }, []);

  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  
  return (
    <>
      {user ? (
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="HomeStack"
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
              drawerActiveBackgroundColor: Colors.BLUEISH_GRAY_ACTIVE,
              drawerActiveTintColor: 'white',
              title: 'Home',
            }}
          >
            <Drawer.Screen name="HomeStack" component={HomeStackNavigator} />
          </Drawer.Navigator>
        </NavigationContainer>
      ) : (
        <NavigationContainer>
          <AuthStackNavigator />
        </NavigationContainer>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingBottom: 50,
    backgroundColor: Colors.BLUEISH_GRAY,
  },
  logoutContainer: {
    backgroundColor: Colors.BLUEISH_GRAY_ACTIVE,
    height: 68,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  userInitialView: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: Colors.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitial: {
    color: 'white',
    fontSize: 16,
  },
  userNameAndLogoutView: {
    paddingLeft: 12,
  },
  userName: {
    color: 'white',
    fontSize: 14,
  },
  logout: {
    color: Colors.TEXT_GRAY,
    fontSize: 12,
  },
});
