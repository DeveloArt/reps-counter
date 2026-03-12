import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { addLog, getExercise, initDatabase } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';

export default function LogEntryScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const [exercise, setExercise] = useState<any>(null);
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    async function loadData() {
      await initDatabase();
      if (exerciseId) {
        const data = await getExercise(exerciseId);
        setExercise(data);
      }
    }
    loadData();
  }, [exerciseId]);

  const handleSave = async () => {
    if (!value || !exerciseId) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    await addLog({
      exerciseId,
      date: new Date(),
      value: Number.parseInt(value, 10),
      notes: notes || undefined,
      timestamp: Date.now(),
    });

    router.back();
  };

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.text }]}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{exercise.name}</Text>

      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholder={`Enter ${exercise.unit}`}
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={value}
          onChangeText={setValue}
        />
        <Text style={[styles.unit, { color: colors.textSecondary }]}>{exercise.unit}</Text>
      </View>

      <TextInput
        style={[
          styles.notes,
          { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
        ]}
        placeholder="Notes (optional)"
        placeholderTextColor={colors.textSecondary}
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    borderBottomWidth: 2,
    paddingVertical: 8,
  },
  unit: {
    fontSize: 18,
    marginLeft: 12,
  },
  notes: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});
