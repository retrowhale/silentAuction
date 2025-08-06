import React, { useEffect, useState } from 'react';
import {View,Text,FlatList,Image,StyleSheet,ActivityIndicator,} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';

export default function MyBids() {
  const [biddedItems, setBiddedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timerTick, setTimerTick] = useState(0);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchUserBids();
    }
  }, [isFocused]);
  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserBids = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setBiddedItems([]);
        setLoading(false);
        return;
      }

      const userEmail = user.email;

      // Fetch all items
      const response = await fetch('http://10.0.2.2:5000/api/items');
      const data = await response.json();

      const filtered = data.filter(item => 
        item.bids && item.bids.some(bid => bid.username === userEmail)
      );

      setBiddedItems(filtered);
    } catch (error) {
      console.error('Error fetching user bids:', error);
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

   
    const auth = getAuth();
    const userEmail = auth.currentUser?.email;
    const userBids = item.bids?.filter(bid => bid.username === userEmail) || [];
    const highestUserBid = userBids.length > 0 ? Math.max(...userBids.map(b => b.amount)) : 0;

    return (
      <View style={styles.card}>
        <Image source={{ uri: `http://10.0.2.2:5000/${item.imageUrl}` }} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.detail}>Current Bid: ${item.currentBid}</Text>
        <Text style={styles.detail}>Your Bid: ${highestUserBid}</Text>
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
