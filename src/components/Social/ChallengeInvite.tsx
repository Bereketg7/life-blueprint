import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SocialChallenge } from '../../types';

interface Props {
  visible: boolean;
  onCreate: (title: string, type: SocialChallenge['type'], goal: number, days: number) => void;
  onClose: () => void;
}

const CHALLENGE_TYPES: SocialChallenge['type'][] = ['steps', 'workouts', 'consistency', 'weight_loss'];

const ChallengeInvite: React.FC<Props> = ({ visible, onCreate, onClose }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SocialChallenge['type']>('workouts');
  const [goal, setGoal] = useState('10');
  const [days, setDays] = useState('30');
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Challenge</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Challenge title" placeholderTextColor="#6B6B8A" />
          <View style={styles.types}>
            {CHALLENGE_TYPES.map((t) => (
              <TouchableOpacity key={t} style={[styles.typeBtn, type === t && styles.selected]} onPress={() => setType(t)}>
                <Text style={styles.typeText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} value={goal} onChangeText={setGoal} placeholder="Goal (number)" placeholderTextColor="#6B6B8A" keyboardType="numeric" />
          <TextInput style={styles.input} value={days} onChangeText={setDays} placeholder="Duration (days)" placeholderTextColor="#6B6B8A" keyboardType="numeric" />
          <TouchableOpacity style={styles.create} onPress={() => { onCreate(title, type, Number(goal), Number(days)); onClose(); }}>
            <Text style={styles.createText}>Create & Invite</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onClose}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { backgroundColor: '#1A1A2E', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: { backgroundColor: '#16213E', borderRadius: 12, padding: 12, color: '#fff', marginBottom: 8 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  typeBtn: { backgroundColor: '#16213E', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  selected: { backgroundColor: '#6C63FF' },
  typeText: { color: '#fff', fontSize: 12 },
  create: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  createText: { color: '#fff', fontWeight: '700' },
  cancel: { alignItems: 'center', padding: 12 },
  cancelText: { color: '#B0B0CC' },
});

export default ChallengeInvite;
