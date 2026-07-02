import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DateData } from 'react-native-calendars';

import type { AppTheme } from '@/theme/themes';

export interface DayMark {
  /** Category color of the entry on this day for the active tracker. */
  color?: string;
  /** Whether that entry has a note. */
  hasNote?: boolean;
  /** Whether this is the currently selected day. */
  selected?: boolean;
}

interface Props {
  date?: DateData;
  state?: string; // '' | 'today' | 'disabled'
  marking?: DayMark;
  theme: AppTheme;
  onPress: (dateString: string) => void;
}

/** Custom calendar cell: day number, today/selected styling, entry dot + note glyph. */
export function CalendarDay({ date, state, marking, theme, onPress }: Props) {
  if (!date) return <View style={styles.cell} />;

  const selected = marking?.selected;
  const today = state === 'today';
  const disabled = state === 'disabled';

  const numberColor = selected
    ? theme.onPrimary
    : disabled
      ? theme.border
      : today
        ? theme.alert
        : theme.body;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onPress(date.dateString)}
      style={styles.cell}
      hitSlop={4}>
      <View style={[styles.circle, selected && { backgroundColor: theme.primary }]}>
        <Text style={[styles.number, { color: numberColor }, (today || selected) && styles.bold]}>
          {date.day}
        </Text>
      </View>

      {marking?.color ? (
        <View style={[styles.dot, { backgroundColor: marking.color }]} />
      ) : (
        <View style={styles.dot} />
      )}

      {marking?.hasNote ? (
        <Ionicons name="chatbubble" size={9} color={theme.muted} style={styles.note} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: { width: 38, height: 44, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: { fontSize: 15 },
  bold: { fontWeight: '800' },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 2 },
  note: { position: 'absolute', top: 2, right: 3 },
});
