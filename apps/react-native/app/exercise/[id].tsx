import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { deleteExercise, getExercise, updateExercise } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';
import type { Exercise } from '../../src/types';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState<'reps' | 'seconds'>('reps');
  const [color, setColor] = useState('#0D5D5D');
  const [isEditing, setIsEditing] = useState(false);

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

  useEffect(() => {
    async function loadExercise() {
      if (id) {
        const data = await getExercise(id);
        if (data) {
          setExercise(data);
          setName(data.name);
          setUnit(data.unit);
          setColor(data.color);
        }
      }
    }
    loadExercise();
  }, [id]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter exercise name');
      return;
    }

    if (id) {
      await updateExercise(id, {
        name: name.trim(),
        unit,
        color,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (id) {
              await deleteExercise(id);
              router.back();
            }
          },
        },
      ]
    );
  };

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.closeButton, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {isEditing ? 'Edit Exercise' : exercise.name}
        </Text>
        <TouchableOpacity onPress={() => (isEditing ? handleSave() : setIsEditing(true))}>
          <Text style={[styles.saveButton, { color: colors.primary }]}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <>
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
              <Text
                style={[styles.unitText, { color: unit === 'seconds' ? 'white' : colors.text }]}
              >
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
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={handleDelete}
          >
            <Text style={styles.deleteButtonText}>Delete Exercise</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Unit</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {exercise.unit === 'reps' ? 'Repetitions' : 'Seconds'}
            </Text>
          </View>
          <View style={[styles.detailRow, { borderTopColor: colors.border, borderTopWidth: 1 }]}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Color</Text>
            <View style={[styles.colorPreview, { backgroundColor: exercise.color }]} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 40,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
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
  deleteButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  detailCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
