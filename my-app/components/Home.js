import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet,} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function Home({ navigation }) {
  const [items, setItems] = useState([]);
  const isFocused = useIsFocused();

 
  const fetchItems = async () => {
    try {
      const response = await fetch('https://silentauction-si9k.onrender.com/api/items');
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

  // Calculate remaining time for each item 
  const calculateTimeLeft = (endTime) => {
    const difference = new Date(endTime) - new Date();
    if (difference <= 0) return 'Ended';
    const minutes = Math.floor(difference / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };


  const renderItem = ({ item }) => {
    const timeLeft = calculateTimeLeft(item.endTime);
    // Fix image URL handling: if imageUrl is missing or already absolute, handle accordingly
    let imageUri = item.imageUrl;
    if (imageUri) {
      if (!imageUri.startsWith('http')) {
        imageUri = `https://silentauction-si9k.onrender.com/${imageUri.replace(/^uploads\//, 'uploads/')}`;
      }
    } else {
      // fallback image if missing
      imageUri = 'https://silentauction-si9k.onrender.com/assets/icon.png';
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { item, onBidPlaced: handleBidPlaced })}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: imageUri }}
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
      data={items.filter(item => new Date(item.endTime) > new Date())} 
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
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: 150,
    height: 120,
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
