import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props { onCapture: (uri: string) => void }

const MealPhotoCapture: React.FC<Props> = ({ onCapture }) => (
  <View style={styles.container}>
    <Text style={styles.title}>📸 Capture Meal</Text>
    <TouchableOpacity style={styles.btn} onPress={() => onCapture('captured_photo_uri')}>
      <Text style={styles.btnText}>Take Photo</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => onCapture('gallery_photo_uri')}>
      <Text style={styles.btnText}>Choose from Gallery</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
  btn: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 8 },
  btnSecondary: { backgroundColor: '#16213E' },
  btnText: { color: '#fff', fontWeight: '600' },
});

export default MealPhotoCapture;
