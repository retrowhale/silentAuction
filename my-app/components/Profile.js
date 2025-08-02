import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Fetch user info from AsyncStorage on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedEmail = await AsyncStorage.getItem('email');
        if (storedUsername) setUsername(storedUsername);
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear all user-related data from AsyncStorage
      await AsyncStorage.multiRemove(['username', 'email', 'token']); // add keys you use
      // Navigate back to login screen (adjust route name as needed)
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{username || 'Not available'}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{email || 'Not available'}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  value: {
    fontSize: 20,
    marginTop: 6,
  },
  logoutButton: {
    marginTop: 50,
    backgroundColor: '#ff4d4d',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
