import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import type { TrackerType } from '@/data/models';
import type { Strings } from '@/i18n';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface TrackerMeta {
  type: TrackerType;
  titleKey: keyof Strings;
  registerKey: keyof Strings;
  icon: IoniconName;
}

export const TRACKERS: TrackerMeta[] = [
  { type: 'best', titleKey: 'titleBest', registerKey: 'registerBest', icon: 'sunny-outline' },
  { type: 'worst', titleKey: 'titleWorst', registerKey: 'registerWorst', icon: 'rainy-outline' },
  { type: 'mood', titleKey: 'titleMood', registerKey: 'registerMood', icon: 'happy-outline' },
];

export const TRACKER_BY_TYPE: Record<TrackerType, TrackerMeta> = {
  best: TRACKERS[0],
  worst: TRACKERS[1],
  mood: TRACKERS[2],
};
