import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LANGUAGES, type Strings } from '@/i18n';
import { useSettings, type LanguageCode } from '@/store/settings';
import { useTheme } from '@/theme/useTheme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const PAGES: { icon: IoniconName; titleKey: keyof Strings; bodyKey: keyof Strings; showLang?: boolean; logo?: boolean }[] = [
  { icon: 'book-outline', titleKey: 'welcomeMessage', bodyKey: 'valueProposition', showLang: true, logo: true },
  { icon: 'calendar-outline', titleKey: 'onboardingTitle1', bodyKey: 'onboardingMessage1' },
  { icon: 'document-text-outline', titleKey: 'onboardingTitle2', bodyKey: 'onboardingMessage2' },
  { icon: 'color-palette-outline', titleKey: 'onboardingTitle3', bodyKey: 'onboardingMessage3' },
  { icon: 'lock-closed-outline', titleKey: 'onboardingTitle5', bodyKey: 'onboardingMessage5' },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const language = useSettings((s) => s.language);
  const setLanguage = useSettings((s) => s.setLanguage);
  const setOnboardingCompleted = useSettings((s) => s.setOnboardingCompleted);

  const [page, setPage] = useState(0);
  const isLast = page === PAGES.length - 1;
  const p = PAGES[page];

  const next = async () => {
    if (isLast) {
      await setOnboardingCompleted(true);
      router.replace('/');
    } else {
      setPage((n) => n + 1);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {p.logo ? (
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        ) : (
          <Ionicons name={p.icon} size={96} color={theme.primary} style={styles.icon} />
        )}
        <Text style={[styles.title, { color: theme.title }]}>{t(p.titleKey)}</Text>
        <Text style={[styles.body, { color: theme.body }]}>{t(p.bodyKey)}</Text>

        {p.showLang && (
          <View style={styles.langWrap}>
            {LANGUAGES.map((l) => {
              const active = language === l.code;
              return (
                <Pressable
                  key={l.code}
                  onPress={() => setLanguage(l.code as LanguageCode)}
                  style={[styles.chip, { borderColor: theme.primary }, active && { backgroundColor: theme.primary }]}>
                  <Text style={{ color: active ? theme.onPrimary : theme.primary, fontWeight: '600' }}>{l.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={() => setPage((n) => Math.max(0, n - 1))}
          disabled={page === 0}
          hitSlop={10}
          style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={page === 0 ? 'transparent' : theme.primary} />
        </Pressable>

        <View style={styles.dots}>
          {PAGES.map((_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i === page ? theme.primary : theme.border }]} />
          ))}
        </View>

        <Pressable onPress={next} style={[styles.nextBtn, { backgroundColor: theme.primary }]}>
          <Text style={{ color: theme.onPrimary, fontWeight: '800' }}>
            {isLast ? t('buttonDone') : t('buttonNext')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  icon: { marginBottom: 8 },
  logo: { width: 140, height: 140, borderRadius: 28, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  body: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  langWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 },
  chip: { borderWidth: 1.5, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  nextBtn: { borderRadius: 999, paddingVertical: 12, paddingHorizontal: 24 },
});
