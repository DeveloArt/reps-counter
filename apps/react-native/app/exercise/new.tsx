import { useRouter } from 'expo-router';
import { Check, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { addExercise, initDatabase } from '../../src/db';
import { useTheme } from '../../src/hooks/useTheme';

export default function NewExerciseScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

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
      Alert.alert(t('common.error'), t('exercises.alerts.enterName'));
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
    <Modal isOpen={true} onClose={() => router.back()} title={t('modals.addExercise.title')}>
      <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('modals.addExercise.nameLabel')}
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.muted, borderColor: 'transparent' },
            ]}
            placeholder={t('modals.addExercise.namePlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('modals.addExercise.unitLabel')}
          </Text>
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
                {t('home.reps')}
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
                {t('modals.addExercise.time')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>
            {t('modals.addExercise.colorLabel')}
          </Text>
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

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Plus size={20} color="white" />
          <Text style={styles.saveButtonText}>{t('modals.addExercise.create')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    gap: 24,
    paddingBottom: 16,
  },
  formSection: {
    gap: 8,
    marginTop: 8,
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
    marginBottom: 8,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
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
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
