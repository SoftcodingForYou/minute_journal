import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import type { PieDatum } from '@/features/summary';
import type { AppTheme } from '@/theme/themes';

function arcPath(cx: number, cy: number, r: number, start: number, end: number): string {
  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

export function PieChart({ data, size = 220, theme }: { data: PieDatum[]; size?: number; theme: AppTheme }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2;

  let angle = -Math.PI / 2; // start at 12 o'clock
  const slices = data.map((d) => {
    const start = angle;
    const end = angle + (d.value / total) * 2 * Math.PI;
    angle = end;
    return { ...d, start, end };
  });

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size}>
        {slices.length === 1 ? (
          <Circle cx={r} cy={r} r={r} fill={slices[0].color} />
        ) : (
          slices.map((s) => <Path key={s.id} d={arcPath(r, r, r, s.start, s.end)} fill={s.color} />)
        )}
      </Svg>

      <View style={styles.legend}>
        {data.map((d) => (
          <View key={d.id} style={styles.legendRow}>
            <View style={[styles.swatch, { backgroundColor: d.color }]} />
            <Text style={[styles.legendLabel, { color: theme.body }]} numberOfLines={1}>
              {d.label}
            </Text>
            <Text style={[styles.legendValue, { color: theme.muted }]}>{d.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 16 },
  legend: { alignSelf: 'stretch', paddingHorizontal: 12, gap: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swatch: { width: 14, height: 14, borderRadius: 4 },
  legendLabel: { flex: 1, fontSize: 14 },
  legendValue: { fontSize: 14, fontWeight: '700' },
});
