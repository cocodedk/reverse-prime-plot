// The Chinese year a day falls in, as Intl's chinese calendar numbers it. That
// year begins at Chinese New Year, between late January and mid-February, so a
// day early in a Gregorian year can belong to the previous Chinese year.
// Kept free of DOM and i18n imports; the names and meanings live in the dictionaries.

// The ten heavenly stems: each pair shares an element, the first yang, the second yin.
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEM_PINYIN = ['jiǎ', 'yǐ', 'bǐng', 'dīng', 'wù', 'jǐ', 'gēng', 'xīn', 'rén', 'guǐ'];
export const ELEMENTS = ['wood', 'fire', 'earth', 'metal', 'water'];
const ELEMENT_CHARACTERS = ['木', '火', '土', '金', '水'];
const STEMS_PER_ELEMENT = 2;
// The twelve earthly branches, each with its animal.
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCH_PINYIN = ['zǐ', 'chǒu', 'yín', 'mǎo', 'chén', 'sì', 'wǔ', 'wèi', 'shēn', 'yǒu', 'xū', 'hài'];
export const ANIMALS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
const ANIMAL_CHARACTERS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

const formatter = new Intl.DateTimeFormat('zh-u-ca-chinese', { timeZone: 'UTC', year: 'numeric' });

// `day` is a UTC midnight in milliseconds. `year` is the Gregorian year the
// Chinese year began in; `characters` its stem and branch, as in 己未.
export function chineseYear(day) {
  const parts = Object.fromEntries(formatter.formatToParts(day).map(({ type, value }) => [type, value]));
  const [stemCharacter, branchCharacter] = parts.yearName;
  const stem = STEMS.indexOf(stemCharacter);
  const branch = BRANCHES.indexOf(branchCharacter);
  const element = Math.floor(stem / STEMS_PER_ELEMENT);
  return {
    year: Number(parts.relatedYear),
    element: ELEMENTS[element],
    animal: ANIMALS[branch],
    yang: stem % STEMS_PER_ELEMENT === 0,
    characters: parts.yearName,
    pinyin: `${STEM_PINYIN[stem]} ${BRANCH_PINYIN[branch]}`,
    elementCharacter: ELEMENT_CHARACTERS[element],
    animalCharacter: ANIMAL_CHARACTERS[branch],
  };
}
