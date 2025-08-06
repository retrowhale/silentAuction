import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import{ StyleSheet } from 'react-native';


import Login from './components/Login';
import Home from './components/Home';
import DetailedScreen from './components/DetailedScreen';
import MyBids from './components/MyBids';
import BidsUpload from './components/BidsUpload';
import Profile from './components/Profile';
import Signup from './components/Signup';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home"  screenOptions={{
    headerStyle: {
      backgroundColor: '#E67E22',
    },
  }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MyBids" component={MyBids} />
       <Tab.Screen name="BidsUpload" component={BidsUpload} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} /> 
        <Stack.Screen name="Main" component={TabNavigator} />
         <Stack.Screen name="Details" component={DetailedScreen} options={{ title: 'Item Details' ,headerShown: true }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({

  appBar: {
    backgroundColor: '#b4330cff',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
