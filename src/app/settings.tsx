import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LANGUAGES } from '@/i18n';
import { useSettings, type LanguageCode } from '@/store/settings';
import { THEME_KEYS, type AppTheme } from '@/theme/themes';
import { useTheme } from '@/theme/useTheme';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const language = useSettings((s) => s.language);
  const themeKey = useSettings((s) => s.theme);
  const setLanguage = useSettings((s) => s.setLanguage);
  const setTheme = useSettings((s) => s.setTheme);

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.topbar, { borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={theme.primary} />
        </Pressable>
        <Text style={[styles.topTitle, { color: theme.title }]}>{t('tabSettings')}</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={[styles.section, { color: theme.body }]}>{t('changeLanguage')}</Text>
        <View style={styles.rowWrap}>
          {LANGUAGES.map((l) => (
            <Chip
              key={l.code}
              theme={theme}
              active={language === l.code}
              label={l.label}
              onPress={() => setLanguage(l.code as LanguageCode)}
            />
          ))}
        </View>

        <Text style={[styles.section, { color: theme.body }]}>{t('changeDesign')}</Text>
        <View style={styles.rowWrap}>
          {THEME_KEYS.map((k) => (
            <Chip key={k} theme={theme} active={themeKey === k} label={k} onPress={() => setTheme(k)} />
          ))}
        </View>

        <Text style={[styles.section, { color: theme.body }]}>{t('configureCategories')}</Text>
        <Pressable onPress={() => router.push('/categories')} style={[styles.btn, { borderColor: theme.primary }]}>
          <Ionicons name="options-outline" size={18} color={theme.primary} />
          <Text style={{ color: theme.primary, fontWeight: '600' }}>{t('configureCategories')}</Text>
        </Pressable>

        <Text style={[styles.section, { color: theme.body }]}>{t('viewTutorialTitle')}</Text>
        <Pressable onPress={() => router.push('/onboarding')} style={[styles.btn, { borderColor: theme.primary }]}>
          <Ionicons name="play-outline" size={18} color={theme.primary} />
          <Text style={{ color: theme.primary, fontWeight: '600' }}>{t('introButton')}</Text>
        </Pressable>

        <Text style={[styles.version, { color: theme.muted }]}>
          {t('versionLabel')} {version}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Chip({
  theme,
  active,
  label,
  onPress,
}: {
  theme: AppTheme;
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { borderColor: theme.primary }, active && { backgroundColor: theme.primary }]}>
      <Text style={{ color: active ? theme.onPrimary : theme.primary, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  back: { width: 40, alignItems: 'flex-start' },
  topTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '800' },
  inner: { padding: 20, gap: 10 },
  section: { fontSize: 15, fontWeight: '700', marginTop: 14 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderRadius: 12, paddingVertical: 12 },
  version: { textAlign: 'center', marginTop: 40, fontSize: 12 },
});
