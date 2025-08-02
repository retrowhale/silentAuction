import React, { useState } from 'react';
import { View,Text,TextInput,Button,StyleSheet,Image,TouchableOpacity,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function BidsUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState(null);

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !startingBid || !endTime || !image) {
      alert('Please fill all fields and select an image.');
      return;
    }

    // Validate endTime string
    const parsedDate = new Date(endTime);
    if (isNaN(parsedDate.getTime())) {
      alert(
        'Please enter a valid date and time, e.g. "2025-08-10T18:00:00Z" or "2025-08-10 18:00"'
      );
      return;
    }

    const fileUri = image.uri;
    const fileName = fileUri.split('/').pop();
    const fileType = fileName.split('.').pop();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('startingBid', parseFloat(startingBid));
    formData.append('endTime', parsedDate.toISOString());

    formData.append('image', {
      uri: fileUri,
      name: fileName,
      type: `image/${fileType}`,
    });

    try {
      const response = await fetch('http://10.0.2.2:5000/api/items', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert('Item uploaded successfully!');
        setTitle('');
        setDescription('');
        setStartingBid('');
        setEndTime('');
        setImage(null);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while uploading.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload a New Bid</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Starting Bid"
        value={startingBid}
        onChangeText={setStartingBid}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder='End Time (e.g. "2025-08-10T18:00:00Z" or "2025-08-10 18:00")'
        value={endTime}
        onChangeText={setEndTime}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleChooseImage} style={styles.button}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>

      {image && (
        <Image
          source={{ uri: image.uri }}
          style={{ width: 200, height: 200, marginVertical: 10 }}
        />
      )}

      <Button title="Submit Bid" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 6,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 6,
  },
  buttonText: {
    color: 'white',
  },
});
