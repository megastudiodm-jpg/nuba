export type NubianDialect = 'fadicha' | 'kenzi' | 'both' | 'dongolawi';

export type WordCategory =
  | 'greetings'
  | 'family'
  | 'nature'
  | 'home'
  | 'numbers'
  | 'colors'
  | 'verbs'
  | 'proverbs'
  | 'food'
  | 'body';

export interface DictionaryEntry {
  id: string;
  nubianArabic: string; // e.g. "مِسْكاقْرو"
  nubianScript: string; // e.g. "ⲙⲉⲥⲕⲁⲅⲣⲟ"
  phonetic: string;     // e.g. "Meskagro"
  arabicMeaning: string; // e.g. "مرحباً / مساء الخير / طاب يومك"
  englishMeaning?: string; // e.g. "Hello / Good evening"
  dialect: NubianDialect;
  category: WordCategory;
  exampleNubian?: string;
  exampleArabic?: string;
  notes?: string;
}

export interface NubianLetter {
  char: string;         // e.g. "ⲁ"
  charUpper: string;    // e.g. "Ⲁ"
  nameArabic: string;   // e.g. "ألفا"
  arabicSound: string;  // e.g. "أ / ا"
  ipa: string;          // e.g. "/a/"
  exampleWord: string;  // e.g. "ⲁⲛⲛⲁ (آنّا)"
  exampleMeaning: string; // e.g. "أمي"
  isSpecialNubian?: boolean; // For unique Nubian phonemes (ⳝ, ⳟ, ⳡ, ⳣ)
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  level: 'مبتدئ' | 'متوسط' | 'تراثي';
  description: string;
  sections: {
    title: string;
    content: string;
    examples?: {
      nubian: string;
      nubianScript?: string;
      phonetic: string;
      arabic: string;
      notes?: string;
    }[];
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  nubianWord?: string;
  phonetic?: string;
  dialect?: string;
}

export interface TranslationBreakdownItem {
  word: string;
  meaning: string;
  role?: string;
}

export interface TranslationResponse {
  translation: string;
  nubianScript?: string;
  phonetic: string;
  dialect: string;
  dialectComparison?: string;
  notes?: string;
  breakdown?: TranslationBreakdownItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  audioPronunciation?: string;
  suggestedAction?: string;
}

export interface NubianProverb {
  id: string;
  nubianArabic: string;       // e.g. "مَانْجَا كُوسِي أَوْنَبَّا قَاتِّي"
  nubianScript: string;       // e.g. "ⲙⲁⲛϫⲁ ⲕⲟⲩⲥⲓ ⲟⲛⲃⲁ"
  phonetic: string;           // e.g. "Manja kousi onba gatti"
  arabicTranslation: string;  // الترجمة إلى العربية
  literalMeaning?: string;    // المعنى الحرفي
  deepExplanation: string;    // شرح موجز لمعناه وسياقه الثقافي
  usageOccasion: string;      // كيفية ومناسبة استخدامه (متى يُقال؟)
  category: 'wisdom' | 'hospitality' | 'family' | 'nile' | 'patience' | 'friendship';
  dialect: NubianDialect;
  tags?: string[];
}
