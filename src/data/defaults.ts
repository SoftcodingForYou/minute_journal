import type { Category } from './models';

/**
 * The 15 default categories, ported from the original Flutter app's "mint"
 * palette. Colors are the RGB values from the Flutter ColorCollection,
 * converted to hex. Users can rename/recolor these; a reset restores them.
 */
export const DEFAULT_CATEGORIES: Category[] = [
  // Best (6)
  { id: 'best.achievement', type: 'best', key: 'categoryAchievement', customLabel: null, color: '#0066B9', sortOrder: 0 },
  { id: 'best.newGoal', type: 'best', key: 'categoryNewGoal', customLabel: null, color: '#00ABCC', sortOrder: 1 },
  { id: 'best.productiveDay', type: 'best', key: 'categoryProductiveDay', customLabel: null, color: '#00E2B8', sortOrder: 2 },
  { id: 'best.relationships', type: 'best', key: 'categoryRelationships', customLabel: null, color: '#00CC1B', sortOrder: 3 },
  { id: 'best.friendsFamily', type: 'best', key: 'categoryFriendsFamily', customLabel: null, color: '#A5CC00', sortOrder: 4 },
  { id: 'best.peace', type: 'best', key: 'categoryPeace', customLabel: null, color: '#CCAD00', sortOrder: 5 },

  // Worst (6)
  { id: 'worst.work', type: 'worst', key: 'categoryWork', customLabel: null, color: '#0066B9', sortOrder: 6 },
  { id: 'worst.stress', type: 'worst', key: 'categoryStress', customLabel: null, color: '#00ABCC', sortOrder: 7 },
  { id: 'worst.addiction', type: 'worst', key: 'categoryAddiction', customLabel: null, color: '#00E2B8', sortOrder: 8 },
  { id: 'worst.personality', type: 'worst', key: 'categoryMe', customLabel: null, color: '#00CC1B', sortOrder: 9 },
  { id: 'worst.finances', type: 'worst', key: 'categoryFinances', customLabel: null, color: '#A5CC00', sortOrder: 10 },
  { id: 'worst.chaos', type: 'worst', key: 'categoryChaos', customLabel: null, color: '#CCAD00', sortOrder: 11 },

  // Mood (3)
  { id: 'mood.good', type: 'mood', key: 'moodGood', customLabel: null, color: '#DCDC78', sortOrder: 12 },
  { id: 'mood.neutral', type: 'mood', key: 'moodNeutral', customLabel: null, color: '#95B74D', sortOrder: 13 },
  { id: 'mood.bad', type: 'mood', key: 'moodBad', customLabel: null, color: '#4D9221', sortOrder: 14 },
];

/** Numeric weight for mood categories, used to plot the mood curve (good=3..bad=1). */
export const MOOD_VALUE: Record<string, number> = {
  'mood.good': 3,
  'mood.neutral': 2,
  'mood.bad': 1,
};
