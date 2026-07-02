import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalendarDay, type DayMark } from '@/components/CalendarDay';
import { TrackerSwitcher } from '@/components/TrackerSwitcher';
import { TRACKER_BY_TYPE } from '@/config/trackers';
import type { TrackerType } from '@/data/models';
import { useCategories } from '@/store/categories';
import { useEntries } from '@/store/entries';
import { useSettings } from '@/store/settings';
import { useTheme } from '@/theme/useTheme';
import { formatLongDate, todayISO } from '@/util/dates';
import { categoryLabel } from '@/util/labels';

export default function CalendarScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const language = useSettings((s) => s.language);

  const [tracker, setTracker] = useState<TrackerType>('best');
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());

  const byDate = useEntries((s) => s.byDate);
  const catMap = useCategories((s) => s.map);

  const markedDates = useMemo(() => {
    const md: Record<string, DayMark> = {};
    for (const [date, day] of Object.entries(byDate)) {
      const e = day[tracker];
      if (e) md[date] = { color: catMap[e.categoryId]?.color, hasNote: e.note.trim().length > 0 };
    }
    md[selectedDate] = { ...(md[selectedDate] ?? {}), selected: true };
    return md;
  }, [byDate, tracker, catMap, selectedDate]);

  const calTheme = useMemo(
    () => ({
      calendarBackground: theme.background,
      monthTextColor: theme.title,
      textMonthFontWeight: '700' as const,
      arrowColor: theme.primary,
      textSectionTitleColor: theme.muted,
      textDayHeaderFontWeight: '600' as const,
    }),
    [theme]
  );

  const entry = byDate[selectedDate]?.[tracker];
  const entryCat = entry ? catMap[entry.categoryId] : undefined;

  const openEntry = () =>
    router.push({ pathname: '/entry', params: { date: selectedDate, type: tracker } });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.title, { color: theme.title }]}>{t(TRACKER_BY_TYPE[tracker].titleKey)}</Text>
        <Pressable onPress={() => router.push('/settings')} hitSlop={10} style={styles.gear}>
          <Ionicons name="settings-outline" size={22} color={theme.primary} />
        </Pressable>
      </View>

      <TrackerSwitcher value={tracker} onChange={setTracker} theme={theme} />

      <Calendar
        key={theme.key}
        current={selectedDate}
        maxDate={todayISO()}
        firstDay={1}
        enableSwipeMonths
        theme={calTheme}
        markedDates={markedDates as never}
        dayComponent={(p: { date?: any; state?: string; marking?: DayMark }) => (
          <CalendarDay date={p.date} state={p.state} marking={p.marking} theme={theme} onPress={setSelectedDate} />
        )}
      />

      <View style={styles.detail}>
        <Text style={[styles.date, { color: theme.title }]}>{formatLongDate(selectedDate, language)}</Text>
        {entry && entryCat ? (
          <>
            <Text style={[styles.entryLabel, { color: entryCat.color }]}>{categoryLabel(entryCat, t)}</Text>
            {entry.note ? <Text style={[styles.entryNote, { color: theme.body }]}>{entry.note}</Text> : null}
          </>
        ) : (
          <Text style={{ color: theme.muted }}>—</Text>
        )}
      </View>

      <Pressable onPress={openEntry} style={[styles.fab, { backgroundColor: theme.primary }]}>
        <Ionicons name={entry ? 'pencil' : 'add'} size={26} color={theme.onPrimary} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 6, paddingBottom: 4 },
  title: { flex: 1, fontSize: 20, fontWeight: '800' },
  gear: { padding: 4 },
  logo: { width: 28, height: 28, borderRadius: 6, marginRight: 8 },
  detail: { paddingHorizontal: 20, paddingTop: 10, gap: 4 },
  date: { fontSize: 15, fontWeight: '700' },
  entryLabel: { fontSize: 16, fontWeight: '700' },
  entryNote: { fontSize: 14 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
