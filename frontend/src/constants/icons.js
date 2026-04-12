export const ICON_EMOJIS = Object.freeze({
  water: '💧',
  food: '🍎',
  workout: '🏋️',
  calories: '🔥',
  weight: '⚖️',
  dashboard: '📊',
  refresh: '🔄',
  search: '🔍',
  diary: '📝',
  celebration: '🎉',
});

const BROKEN_KEYS = {
  water: String.fromCodePoint(0x00F0, 0x0178, 0x2019, 0x00A7),
  food: String.fromCodePoint(0x00F0, 0x0178, 0x008D, 0x017D),
  workout: String.fromCodePoint(0x00F0, 0x0178, 0x008F, 0x2039),
  workoutWithVariation: String.fromCodePoint(0x00F0, 0x0178, 0x008F, 0x2039, 0xFE0F),
  calories: String.fromCodePoint(0x00F0, 0x0178, 0x201D, 0x00A5),
  refresh: String.fromCodePoint(0x00F0, 0x0178, 0x201D, 0x201E),
  diary: String.fromCodePoint(0x00F0, 0x0178, 0x201C, 0x009D),
  search: String.fromCodePoint(0x00F0, 0x0178, 0x201D, 0x008D),
  celebration: String.fromCodePoint(0x00F0, 0x0178, 0x017D, 0x2030),
};

const MOJIBAKE_EMOJI_REPLACEMENTS = [
  [BROKEN_KEYS.water, ICON_EMOJIS.water],
  [BROKEN_KEYS.food, ICON_EMOJIS.food],
  [BROKEN_KEYS.workoutWithVariation, ICON_EMOJIS.workout],
  [BROKEN_KEYS.workout, ICON_EMOJIS.workout],
  [BROKEN_KEYS.calories, ICON_EMOJIS.calories],
  [BROKEN_KEYS.refresh, ICON_EMOJIS.refresh],
  [BROKEN_KEYS.diary, ICON_EMOJIS.diary],
  [BROKEN_KEYS.search, ICON_EMOJIS.search],
  [BROKEN_KEYS.celebration, ICON_EMOJIS.celebration],
];

export function normalizeEmojiText(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return value;
  }

  return MOJIBAKE_EMOJI_REPLACEMENTS.reduce(
    (normalized, [broken, emoji]) => normalized.split(broken).join(emoji),
    value,
  );
}
