import React, { useState } from 'react';
import { View, Button, Image, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [image, setImage] = useState(null);
  const [palette, setPalette] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (imageData) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageData.uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      const response = await axios.post('http://192.168.126.167:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPalette(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {palette.length > 0 && (
        <>
          <Text style={styles.title}>Dominant Colors with Percentages:</Text>
          <FlatList
            data={palette}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.colorContainer}>
                <TouchableOpacity
                  style={{
                    ...styles.colorBox,
                    backgroundColor: item.hex,
                  }}
                />
                <Text style={styles.percentageText}>{item.percentage}%</Text>
                <Text style={styles.hexText}>{item.hex}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
  },
  colorContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  percentageText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  hexText: {
    fontSize: 12,
    color: '#555',
  },
});
