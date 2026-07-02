import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TRACKERS } from '@/config/trackers';
import type { TrackerType } from '@/data/models';
import type { AppTheme } from '@/theme/themes';

/** Best / Worst / Mood segmented control, shared by the calendar and summary screens. */
export function TrackerSwitcher({
  value,
  onChange,
  theme,
}: {
  value: TrackerType;
  onChange: (t: TrackerType) => void;
  theme: AppTheme;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.switcher}>
      {TRACKERS.map((tr) => {
        const active = tr.type === value;
        return (
          <Pressable
            key={tr.type}
            onPress={() => onChange(tr.type)}
            style={[
              styles.tab,
              { borderColor: theme.border },
              active && { backgroundColor: theme.highlight, borderColor: theme.primary },
            ]}>
            <Ionicons name={tr.icon} size={18} color={active ? theme.primary : theme.muted} />
            <Text style={{ color: active ? theme.primary : theme.muted, fontWeight: '600', fontSize: 12 }}>
              {t(tr.titleKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  switcher: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  tab: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1.5,
    borderRadius: 12,
  },
});
