import React, { useEffect, useState } from 'react';
import {View,Text,FlatList,Image,StyleSheet,ActivityIndicator,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function MyBids() {
  const [biddedItems, setBiddedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timerTick, setTimerTick] = useState(0); // used to update timers every second
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchBiddedItems();
    }
  }, [isFocused]);

  // Timer tick every 1 second to refresh timeLeft UI
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchBiddedItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/api/items');
      const data = await response.json();

      const storedItemIds = await AsyncStorage.getItem('biddedItemIds');
      const biddedItemIds = storedItemIds ? JSON.parse(storedItemIds) : [];

      const filtered = data.filter(item => biddedItemIds.includes(item._id));
      setBiddedItems(filtered);
    } catch (error) {
      console.error('Error fetching bidded items:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (endTime) => {
    const difference = new Date(endTime) - new Date();
    if (difference <= 0) return 'Ended';
    const minutes = Math.floor(difference / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const renderItem = ({ item }) => {
    const timeLeft = calculateTimeLeft(item.endTime);

    return (
      <View style={styles.card}>
        <Image source={{ uri: `http://10.0.2.2:5000/${item.imageUrl}` }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>Current Bid: ${item.currentBid}</Text>
        <Text style={timeLeft === 'Ended' ? styles.ended : styles.timer}>
          Ending: {timeLeft}
        </Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bids</Text>
      {biddedItems.length === 0 ? (
        <Text style={styles.noBids}>You haven't placed any bids yet.</Text>
      ) : (
        <FlatList
          data={biddedItems}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  noBids: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
  },
  timer: {
    marginTop: 6,
    color: 'green',
    fontWeight: 'bold',
  },
  ended: {
    marginTop: 6,
    color: 'red',
    fontWeight: 'bold',
  },
});
