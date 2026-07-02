import { Ionicons } from '@expo/vector-icons';
import { format, parseISO, subDays } from 'date-fns';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MoodLineChart } from '@/components/MoodLineChart';
import { PieChart } from '@/components/PieChart';
import { TrackerSwitcher } from '@/components/TrackerSwitcher';
import type { Category, TrackerType } from '@/data/models';
import {
  categoryCounts,
  coincidingCategories,
  moodPoints,
  type FilteredDay,
  type SummaryWindow,
} from '@/features/summary';
import type { Strings } from '@/i18n';
import { useCategories } from '@/store/categories';
import { useEntries } from '@/store/entries';
import { useTheme } from '@/theme/useTheme';
import { todayISO } from '@/util/dates';
import { categoryLabel } from '@/util/labels';

const MONTH_KEYS: (keyof Strings)[] = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

const WINDOWS: { key: SummaryWindow; labelKey: keyof Strings }[] = [
  { key: 'last30', labelKey: 'lastThirtyDays' },
  { key: 'month', labelKey: 'monthLabel' },
  { key: 'all', labelKey: 'allDays' },
];

export default function SummaryScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const now = todayISO();
  const nowMonth = Number(now.slice(5, 7));
  const nowYear = Number(now.slice(0, 4));

  const [tracker, setTracker] = useState<TrackerType>('best');
  const [win, setWin] = useState<SummaryWindow>('last30');
  const [month, setMonth] = useState<number>(nowMonth);
  const [year, setYear] = useState<number>(nowYear);

  const byDate = useEntries((s) => s.byDate);
  const catMap = useCategories((s) => s.map);
  const labelOf = (c: Category) => categoryLabel(c, t);

  const filtered: FilteredDay[] = useMemo(() => {
    const entries = Object.entries(byDate) as FilteredDay[];
    if (win === 'all') return entries;
    if (win === 'month') {
      const prefix = `${year}-${String(month).padStart(2, '0')}`;
      return entries.filter(([d]) => d.startsWith(prefix));
    }
    const cutoff = format(subDays(parseISO(now), 29), 'yyyy-MM-dd');
    return entries.filter(([d]) => d >= cutoff);
  }, [byDate, win, month, year, now]);

  const atCurrentMonth = year === nowYear && month === nowMonth;
  const stepMonth = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    if (y > nowYear || (y === nowYear && m > nowMonth)) return; // no future
    setMonth(m);
    setYear(y);
  };

  const pie = tracker === 'mood' ? [] : categoryCounts(filtered, tracker, catMap, labelOf);
  const points = tracker === 'mood' ? moodPoints(filtered) : [];
  const goodCoinc =
    tracker === 'mood' ? coincidingCategories(filtered, 'mood.good', 'best', catMap, labelOf) : [];
  const badCoinc =
    tracker === 'mood' ? coincidingCategories(filtered, 'mood.bad', 'worst', catMap, labelOf) : [];

  const chartWidth = Math.min(width - 40, 480);
  const pieSize = Math.min(width - 80, 240);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>{t('tabSummary')}</Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={10} style={styles.gear}>
          <Ionicons name="settings-outline" size={22} color={theme.primary} />
        </Pressable>
      </View>

      <TrackerSwitcher value={tracker} onChange={setTracker} theme={theme} />

      <View style={styles.windowRow}>
        {WINDOWS.map((w) => {
          const active = w.key === win;
          return (
            <Pressable
              key={w.key}
              onPress={() => setWin(w.key)}
              style={[
                styles.pill,
                { borderColor: theme.border },
                active && { backgroundColor: theme.primary, borderColor: theme.primary },
              ]}>
              <Text style={{ color: active ? theme.onPrimary : theme.muted, fontWeight: '600', fontSize: 12 }}>
                {t(w.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {win === 'month' && (
        <View style={styles.monthRow}>
          <Pressable onPress={() => stepMonth(-1)} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={theme.primary} />
          </Pressable>
          <Text style={[styles.monthLabel, { color: theme.title }]}>
            {t(MONTH_KEYS[month - 1])} {year}
          </Text>
          <Pressable onPress={() => stepMonth(1)} hitSlop={10} disabled={atCurrentMonth}>
            <Ionicons name="chevron-forward" size={22} color={atCurrentMonth ? theme.border : theme.primary} />
          </Pressable>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.body}>
        {tracker === 'mood' ? (
          points.length > 0 ? (
            <>
              <View style={styles.moodChartRow}>
                <View style={styles.moodIcons}>
                  <Ionicons name="happy-outline" size={22} color={theme.moodColors[0]} />
                  <Ionicons name="remove-outline" size={22} color={theme.moodColors[1]} />
                  <Ionicons name="sad-outline" size={22} color={theme.moodColors[2]} />
                </View>
                <MoodLineChart points={points} width={chartWidth - 40} height={140} theme={theme} />
              </View>

              <Text style={[styles.coincTitle, { color: theme.title }]}>{t('mostAssociated')}</Text>
              <View style={styles.coincRow}>
                <Ionicons name="happy" size={22} color={theme.moodColors[0]} />
                <Text style={[styles.coincText, { color: theme.body }]}>{goodCoinc.join(', ') || '—'}</Text>
              </View>
              <View style={styles.coincRow}>
                <Ionicons name="sad" size={22} color={theme.moodColors[2]} />
                <Text style={[styles.coincText, { color: theme.body }]}>{badCoinc.join(', ') || '—'}</Text>
              </View>
            </>
          ) : (
            <Text style={[styles.noData, { color: theme.muted }]}>{t('noData')}</Text>
          )
        ) : pie.length > 0 ? (
          <PieChart data={pie} size={pieSize} theme={theme} />
        ) : (
          <Text style={[styles.noData, { color: theme.muted }]}>{t('noData')}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 6, paddingBottom: 4 },
  title: { flex: 1, fontSize: 20, fontWeight: '800' },
  gear: { padding: 4 },
  windowRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 4 },
  pill: { flex: 1, alignItems: 'center', paddingVertical: 8, borderWidth: 1.5, borderRadius: 999 },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 8,
  },
  monthLabel: { fontSize: 15, fontWeight: '700', minWidth: 160, textAlign: 'center' },
  body: { padding: 20, paddingTop: 12, alignItems: 'center', gap: 12 },
  moodChartRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moodIcons: { height: 140, justifyContent: 'space-between', paddingVertical: 12 },
  coincTitle: { fontSize: 15, fontWeight: '700', marginTop: 16 },
  coincRow: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch', paddingHorizontal: 12 },
  coincText: { flex: 1, fontSize: 15 },
  noData: { marginTop: 40, fontSize: 14 },
});
