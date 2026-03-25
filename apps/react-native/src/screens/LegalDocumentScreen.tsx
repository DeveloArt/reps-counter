import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

type LegalDocumentKey = 'terms' | 'privacy';

export function LegalDocumentScreen({ documentKey }: { documentKey: LegalDocumentKey }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: `${colors.primary}1A`,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: pressed ? colors.muted : 'transparent' },
          ]}
        >
          <ArrowLeft color={colors.primary} size={24} />
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{t(`${documentKey}.title`)}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <Text style={[styles.meta, { color: colors.text }]}>
          <Text style={styles.metaLabel}>{t(`${documentKey}.effectiveDate`)}: </Text>
          {t(`${documentKey}.effectiveDateValue`)}
        </Text>

        {[1, 2, 3, 4, 5].map((section) => (
          <View key={section} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t(`${documentKey}.section${section}.title`)}
            </Text>
            <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
              {t(`${documentKey}.section${section}.content`)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    rowGap: 20,
  },
  meta: {
    fontSize: 15,
    lineHeight: 22,
  },
  metaLabel: {
    fontWeight: '700',
  },
  section: {
    rowGap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 24,
  },
});
