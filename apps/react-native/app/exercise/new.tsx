import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addExercise, initDatabase } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';

export default function NewExerciseScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [unit, setUnit] = useState<'reps' | 'seconds'>('reps');
  const [color, setColor] = useState('#0D5D5D');

  const colors_list = [
    '#0D5D5D',
    '#10B981',
    '#147A7A',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
  ];

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter exercise name');
      return;
    }

    await initDatabase();
    await addExercise({
      name: name.trim(),
      unit,
      color,
      icon: 'Dumbbell',
    });

    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>New Exercise</Text>

      <Text style={[styles.label, { color: colors.text }]}>Name</Text>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
        ]}
        placeholder="Exercise name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
      <View style={styles.unitContainer}>
        <TouchableOpacity
          style={[
            styles.unitButton,
            {
              backgroundColor: unit === 'reps' ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setUnit('reps')}
        >
          <Text style={[styles.unitText, { color: unit === 'reps' ? 'white' : colors.text }]}>
            Reps
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.unitButton,
            {
              backgroundColor: unit === 'seconds' ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setUnit('seconds')}
        >
          <Text style={[styles.unitText, { color: unit === 'seconds' ? 'white' : colors.text }]}>
            Seconds
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, { color: colors.text }]}>Color</Text>
      <View style={styles.colorContainer}>
        {colors_list.map((c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.colorButton,
              {
                backgroundColor: c,
                borderColor: color === c ? colors.text : 'transparent',
                borderWidth: 3,
              },
            ]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Exercise</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  unitContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  unitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
