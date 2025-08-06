import React, { useState, useEffect } from 'react';
import { View,Text,Image,TextInput,TouchableOpacity,StyleSheet,Alert,} from 'react-native';
import { getAuth } from 'firebase/auth';

export default function DetailedScreen({ route, navigation }) {
  const { item, onBidPlaced } = route.params;

  const [bid, setBid] = useState('');
  const [currentBid, setCurrentBid] = useState(item.currentBid || 0);

  useEffect(() => {
    setCurrentBid(item.currentBid);
  }, [item]);

  const handleBidSubmit = async () => {
    const bidValue = parseFloat(bid);
    if (isNaN(bidValue) || bidValue <= currentBid) {
      Alert.alert('Invalid Bid', 'Bid must be a valid number greater than current bid.');
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to place a bid.');
        return;
      }

      const username = currentUser.email;

      const response = await fetch(`http://10.0.2.2:5000/api/items/${item._id}/bid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bid: bidValue, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place bid');
      }

      const updatedItem = await response.json();
      setCurrentBid(updatedItem.currentBid);
      Alert.alert('Success', 'Your bid was placed successfully!');
      setBid('');

      if (onBidPlaced) {
        onBidPlaced(updatedItem);
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };
return (
    <View style={styles.container}>
      <Image
  source={{ uri: `http://10.0.2.2:5000/${item.imageUrl}` }}
  style={styles.image}
/>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <Text style={styles.details}>
        Starting Bid: ${item.startingBid}    Current Bid: ${currentBid}
      </Text>

      <Text style={styles.deadline}>
        Deadline: {new Date(item.endTime).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
      </Text>

      <TextInput
        placeholder="Enter your bid"
        keyboardType="numeric"
        value={bid}
        onChangeText={setBid}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleBidSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

// Your existing styles here, unchanged
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  details: {
    fontWeight: '500',
    marginBottom: 6,
  },
  deadline: {
    marginBottom: 16,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF6F00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
})