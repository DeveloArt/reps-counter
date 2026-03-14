import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Save, Trash2 } from 'lucide-react-native';
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
import { Modal } from '../../src/components/Modal';
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      router.back();
    }
  };

  const handleDelete = async () => {
    if (id) {
      await deleteExercise(id);
      router.back();
    }
  };

  if (!exercise) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Exercise not found</Text>
      </View>
    );
  }

  if (showDeleteConfirm) {
    return (
      <Modal isOpen={true} onClose={() => setShowDeleteConfirm(false)} title="Delete?">
        <View style={styles.modalContent}>
          <Text style={[styles.confirmText, { color: colors.textSecondary }]}>
            Are you sure you want to delete this exercise?
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => setShowDeleteConfirm(false)}
              style={[styles.cancelButton, { backgroundColor: colors.muted }]}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.confirmButton, { backgroundColor: colors.error }]}
            >
              <Text style={styles.confirmButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={() => router.back()} title="Edit Exercise">
      <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>Name</Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.muted, borderColor: 'transparent' },
            ]}
            placeholder="Exercise name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
          <View style={[styles.segmentedControl, { backgroundColor: colors.muted }]}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                unit === 'reps' && [styles.segmentButtonActive, { backgroundColor: colors.card }],
              ]}
              onPress={() => setUnit('reps')}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: unit === 'reps' ? colors.primary : colors.textSecondary },
                ]}
              >
                Reps
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                unit === 'seconds' && [
                  styles.segmentButtonActive,
                  { backgroundColor: colors.card },
                ],
              ]}
              onPress={() => setUnit('seconds')}
            >
              <Text
                style={[
                  styles.segmentText,
                  { color: unit === 'seconds' ? colors.primary : colors.textSecondary },
                ]}
              >
                Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>Color</Text>
          <View style={styles.colorContainer}>
            {colors_list.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.colorButton,
                  {
                    backgroundColor: c,
                    borderColor: color === c ? colors.primary : 'transparent',
                    borderWidth: color === c ? 2 : 0,
                  },
                ]}
                onPress={() => setColor(c)}
              >
                {color === c && <Check size={16} color="white" strokeWidth={3} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.deleteButtonNew,
              { backgroundColor: `${colors.error}10`, borderColor: `${colors.error}30` },
            ]}
            onPress={() => setShowDeleteConfirm(true)}
          >
            <Trash2 size={20} color={colors.error} />
            <Text style={[styles.deleteButtonTextNew, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButtonNew, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Save size={20} color="white" />
            <Text style={styles.saveButtonTextNew}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  modalContent: {
    gap: 24,
  },
  confirmText: {
    fontSize: 14,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  formSection: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '700',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  deleteButtonNew: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
  },
  deleteButtonTextNew: {
    fontSize: 14,
    fontWeight: '700',
  },
  saveButtonNew: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonTextNew: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
});
