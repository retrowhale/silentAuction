import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { getAuth } from 'firebase/auth';


export default function Profile({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUsername(currentUser.displayName || 'No username set');
      setEmail(currentUser.email || 'No email set');
    } else {

      navigation.replace('Login');
    }
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../profile.png')}
        style={{ width: 200, height: 200, borderRadius: 50, alignSelf: 'center', marginBottom: 20 }}/>
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
    padding: 14,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 40,
  },
  value: {
    fontSize: 20,
    marginTop: 6,
  },
  logoutButton: {
    marginTop: 50,
    backgroundColor: '#f28c28',
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
