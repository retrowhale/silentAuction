import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet,} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function Home({ navigation }) {
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused();

  // Fetch items from server
  const fetchItems = async () => {
    try {
      const response = await fetch('http://10.0.2.2:5000/api/items');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [isFocused]);

  // Update single item in items list after bid
  const handleBidPlaced = (updatedItem) => {
    setItems(prevItems => {
      return prevItems.map(item =>
        item._id === updatedItem._id ? updatedItem : item
      );
    });
  };

  // Calculate remaining time for each item (unchanged)
  const calculateTimeLeft = (endTime) => {
    const difference = new Date(endTime) - new Date();
    if (difference <= 0) return 'Ended';
    const minutes = Math.floor(difference / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Render each item card (pass onBidPlaced callback)
  const renderItem = ({ item }) => {
    const timeLeft = calculateTimeLeft(item.endTime);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { item, onBidPlaced: handleBidPlaced })}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: `http://10.0.2.2:5000/${item.imageUrl}` }}
            style={styles.image}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>Current Bid: ${item.currentBid ?? item.startingBid}</Text>
            <Text style={timeLeft === 'Ended' ? styles.ended : styles.timer}>
              Ending: {timeLeft}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  timer: {
    color: 'green',
    marginTop: 5,
  },
  ended: {
    color: 'red',
    marginTop: 5,
  },
});
