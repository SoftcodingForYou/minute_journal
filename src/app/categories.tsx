import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRACKERS } from '@/config/trackers';
import { useCategories } from '@/store/categories';
import { useTheme } from '@/theme/useTheme';
import { categoryLabel } from '@/util/labels';

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const categories = useCategories((s) => s.categories);
  const reset = useCategories((s) => s.reset);
  const [confirming, setConfirming] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.topbar, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={theme.primary} />
        </Pressable>
        <Text style={[styles.topTitle, { color: theme.title }]} numberOfLines={1}>
          {t('configureCategories')}
        </Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {TRACKERS.map((tr) => (
          <View key={tr.type} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.muted }]}>{t(tr.titleKey)}</Text>
            {categories
              .filter((c) => c.type === tr.type)
              .map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => router.push({ pathname: '/category-edit', params: { id: c.id } })}
                  style={[styles.row, { borderColor: theme.border }]}>
                  <View style={[styles.dot, { backgroundColor: c.color }]} />
                  <Text style={[styles.rowLabel, { color: c.color }]}>{categoryLabel(c, t)}</Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.muted} />
                </Pressable>
              ))}
          </View>
        ))}

        {confirming ? (
          <View style={[styles.confirm, { borderColor: theme.alert }]}>
            <Text style={[styles.confirmText, { color: theme.body }]}>{t('resetWarning')}</Text>
            <View style={styles.confirmRow}>
              <Pressable
                onPress={() => setConfirming(false)}
                style={[styles.confirmBtn, { borderColor: theme.border }]}>
                <Text style={{ color: theme.body }}>{t('noWord')}</Text>
              </Pressable>
              <Pressable
                onPress={async () => {
                  await reset();
                  setConfirming(false);
                }}
                style={[styles.confirmBtn, { backgroundColor: theme.alert, borderColor: theme.alert }]}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>{t('yesWord')}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable onPress={() => setConfirming(true)} style={[styles.resetBtn, { borderColor: theme.alert }]}>
            <Text style={{ color: theme.alert, fontWeight: '700' }}>{t('resetAllButton')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  back: { width: 40, alignItems: 'flex-start' },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800' },
  body: { padding: 16 },
  section: { gap: 6, marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  dot: { width: 14, height: 14, borderRadius: 7 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  resetBtn: { marginTop: 8, alignItems: 'center', paddingVertical: 12, borderWidth: 1.5, borderRadius: 12 },
  confirm: { marginTop: 8, padding: 16, borderWidth: 1.5, borderRadius: 12, gap: 12 },
  confirmText: { fontSize: 14, textAlign: 'center' },
  confirmRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  confirmBtn: { paddingVertical: 10, paddingHorizontal: 24, borderWidth: 1.5, borderRadius: 10 },
});
