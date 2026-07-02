import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PALETTE } from '@/data/palette';
import type { Strings } from '@/i18n';
import { useCategories } from '@/store/categories';
import { useTheme } from '@/theme/useTheme';

export default function CategoryEditScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const category = useCategories((s) => (id ? s.map[id] : undefined));
  const rename = useCategories((s) => s.rename);
  const recolor = useCategories((s) => s.recolor);

  const [label, setLabel] = useState(category?.customLabel ?? '');
  const [color, setColor] = useState(category?.color ?? PALETTE[0]);

  useEffect(() => {
    if (!category) router.back();
  }, [category, router]);
  if (!category) return null;

  const defaultLabel = t(category.key as keyof Strings);

  const onSave = async () => {
    await rename(category.id, label);
    await recolor(category.id, color);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.inner}>
        <Text style={[styles.preview, { color }]}>{label.trim() || defaultLabel}</Text>

        <TextInput
          value={label}
          onChangeText={setLabel}
          placeholder={defaultLabel}
          placeholderTextColor={theme.muted}
          style={[styles.input, { borderColor: theme.border, color: theme.body }]}
        />

        <View style={styles.swatches}>
          {PALETTE.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColor(c)}
              style={[styles.swatch, { backgroundColor: c }, color === c && { borderColor: theme.title }]}
            />
          ))}
        </View>

        <Pressable onPress={onSave} style={[styles.save, { backgroundColor: theme.primary }]}>
          <Text style={{ color: theme.onPrimary, fontWeight: '800', fontSize: 16 }}>{t('buttonSave')}</Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={styles.cancel}>
          <Text style={{ color: theme.muted }}>{t('buttonCancel')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: 24, gap: 16, maxWidth: 480, width: '100%', alignSelf: 'center' },
  preview: { fontSize: 22, fontWeight: '800', textAlign: 'center', marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  swatch: { width: 44, height: 44, borderRadius: 22, borderWidth: 3, borderColor: 'transparent' },
  save: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  cancel: { alignItems: 'center', paddingVertical: 12 },
});
