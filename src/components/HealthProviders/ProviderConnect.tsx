import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { HealthProvider } from '../../types';

interface Props { onConnect: (provider: Omit<HealthProvider, 'id' | 'userId' | 'connectedAt'>) => void }

const ProviderConnect: React.FC<Props> = ({ onConnect }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [endpoint, setEndpoint] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏥 Connect Health Provider</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Provider / Hospital name" placeholderTextColor="#6B6B8A" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Provider email" placeholderTextColor="#6B6B8A" keyboardType="email-address" />
      <TextInput style={styles.input} value={endpoint} onChangeText={setEndpoint} placeholder="FHIR endpoint URL" placeholderTextColor="#6B6B8A" autoCapitalize="none" />
      <TouchableOpacity style={styles.btn} onPress={() => onConnect({
        providerName: name, specialty: '', email,
        fhirEndpoint: endpoint,
        sharePermissions: { activityLogs: true, nutritionLogs: true, sleepLogs: true, weight: true, bloodPressure: true },
      })}>
        <Text style={styles.btnText}>Connect Provider</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#16213E', borderRadius: 12, padding: 12, color: '#fff', marginBottom: 8 },
  btn: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700' },
});

export default ProviderConnect;
