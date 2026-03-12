import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface Note { id: string; content: string; doctor: string; date: string }
interface Props { notes: Note[] }

const DoctorNotes: React.FC<Props> = ({ notes }) => (
  <View style={styles.container}>
    <Text style={styles.title}>📝 Doctor Notes</Text>
    {notes.length === 0
      ? <Text style={styles.empty}>No doctor notes yet.</Text>
      : notes.map((note) => (
          <View key={note.id} style={styles.note}>
            <Text style={styles.doctor}>{note.doctor}</Text>
            <Text style={styles.content}>{note.content}</Text>
            <Text style={styles.date}>{note.date}</Text>
          </View>
        ))}
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  empty: { color: '#B0B0CC', textAlign: 'center', padding: 24 },
  note: { backgroundColor: '#16213E', borderRadius: 12, padding: 12, marginBottom: 8 },
  doctor: { color: '#6C63FF', fontWeight: '600', marginBottom: 4 },
  content: { color: '#fff', fontSize: 14 },
  date: { color: '#6B6B8A', fontSize: 11, marginTop: 4 },
});

export default DoctorNotes;
