import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import type { AppTheme } from '@/theme/themes';

/** Simple mood-over-time line (values 1..3 = bad..good) drawn with SVG. */
export function MoodLineChart({
  points,
  width,
  height,
  theme,
}: {
  points: number[]; // each 1..3, chronological
  width: number;
  height: number;
  theme: AppTheme;
}) {
  if (points.length === 0) return null;

  const pad = 12;
  const n = points.length;
  const xFor = (i: number) => (n === 1 ? width / 2 : pad + (i / (n - 1)) * (width - 2 * pad));
  const yFor = (v: number) => height - pad - ((v - 1) / 2) * (height - 2 * pad);

  const polyline = points.map((v, i) => `${xFor(i)},${yFor(v)}`).join(' ');

  return (
    <Svg width={width} height={height}>
      {[3, 2, 1].map((v) => (
        <Line key={v} x1={pad} y1={yFor(v)} x2={width - pad} y2={yFor(v)} stroke={theme.border} strokeWidth={1} />
      ))}
      <Polyline
        points={polyline}
        fill="none"
        stroke={theme.primary}
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((v, i) => (
        <Circle key={i} cx={xFor(i)} cy={yFor(v)} r={3.5} fill={theme.primary} />
      ))}
    </Svg>
  );
}
