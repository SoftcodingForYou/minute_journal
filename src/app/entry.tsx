import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRACKER_BY_TYPE } from '@/config/trackers';
import type { TrackerType } from '@/data/models';
import { useCategories } from '@/store/categories';
import { useEntries } from '@/store/entries';
import { useSettings } from '@/store/settings';
import { useTheme } from '@/theme/useTheme';
import { formatLongDate } from '@/util/dates';
import { categoryLabel } from '@/util/labels';

export default function EntryScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const language = useSettings((s) => s.language);

  const params = useLocalSearchParams<{ date: string; type: string }>();
  const date = params.date;
  const tracker = params.type as TrackerType;

  const categories = useCategories((s) => s.categories);
  const trackerCats = useMemo(() => categories.filter((c) => c.type === tracker), [categories, tracker]);

  const existing = useEntries((s) => (date ? s.byDate[date]?.[tracker] : undefined));
  const setEntry = useEntries((s) => s.setEntry);
  const removeEntry = useEntries((s) => s.removeEntry);

  const [categoryId, setCategoryId] = useState<string>(existing?.categoryId ?? trackerCats[0]?.id ?? '');
  const [note, setNote] = useState<string>(existing?.note ?? '');

  const valid = !!date && !!tracker;
  useEffect(() => {
    if (!valid) router.back();
  }, [valid, router]);
  if (!valid) return null;

  const isEditing = !!existing;
  const meta = TRACKER_BY_TYPE[tracker];

  const onSave = async () => {
    if (!categoryId) return;
    await setEntry(date, tracker, categoryId, note.trim());
    router.back();
  };
  const onDelete = async () => {
    await removeEntry(date, tracker);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={[styles.prompt, { color: theme.body }]}>
          {t('registerThe')}
          <Text style={{ color: theme.primary, fontWeight: '800' }}>{t(meta.registerKey)}</Text>
          {t('registerAboutDay')}
        </Text>
        <Text style={[styles.date, { color: theme.title }]}>{formatLongDate(date, language)}</Text>

        <View style={styles.list}>
          {trackerCats.map((cat) => {
            const selected = cat.id === categoryId;
            return (
              <Pressable key={cat.id} onPress={() => setCategoryId(cat.id)} style={styles.option}>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={selected ? theme.primary : theme.muted}
                />
                <Text style={[styles.optionLabel, { color: cat.color, fontWeight: selected ? '800' : '500' }]}>
                  {categoryLabel(cat, t)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder={t('noteLabel')}
          placeholderTextColor={theme.muted}
          multiline
          style={[styles.note, { borderColor: theme.border, color: theme.body }]}
        />

        <Pressable onPress={onSave} style={[styles.save, { backgroundColor: theme.primary }]}>
          <Text style={{ color: theme.onPrimary, fontWeight: '800', fontSize: 16 }}>{t('buttonSave')}</Text>
        </Pressable>

        {isEditing ? (
          <Pressable onPress={onDelete} style={styles.textBtn}>
            <Text style={{ color: theme.alert, fontWeight: '700' }}>{t('buttonDelete')}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => router.back()} style={styles.textBtn}>
            <Text style={{ color: theme.muted }}>{t('buttonCancel')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 24, gap: 8, maxWidth: 560, width: '100%', alignSelf: 'center' },
  prompt: { fontSize: 18, textAlign: 'center', marginTop: 8 },
  date: { fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  list: { gap: 2, marginVertical: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  optionLabel: { fontSize: 16 },
  note: { borderWidth: 1, borderRadius: 10, padding: 12, minHeight: 80, textAlignVertical: 'top', marginVertical: 8 },
  save: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  textBtn: { alignItems: 'center', paddingVertical: 14 },
});
