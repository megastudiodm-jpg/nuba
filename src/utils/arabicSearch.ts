/**
 * Arabic normalization and semantic search helper for Nubian Dictionary
 */

// Strip Arabic diacritics (tashkeel), tatweel, and normalize characters
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Remove diacritics (Fathatan, Dammatan, Kasratan, Fatha, Damma, Kasra, Shadda, Sukun, Superscript Alef)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Remove tatweel (kashida)
    .replace(/\u0640/g, '')
    // Normalize Alefs: أ, إ, آ, ٱ -> ا
    .replace(/[إأآٱ]/g, 'ا')
    // Normalize Alef Maqsura: ى -> ي
    .replace(/ى/g, 'ي')
    // Normalize Taa Marbuta: ة -> ه
    .replace(/ة/g, 'ه')
    // Normalize hamzas on waw/yaa: ؤ, ئ -> ء
    .replace(/[ؤئ]/g, 'ء')
    // Remove punctuation & collapse extra whitespace
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟،]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Semantic synonym clusters for Nubian & Egyptian Arabic colloquial usage
const SYNONYM_CLUSTERS: Record<string, string[]> = {
  // Cluster 1: Love, affection, passion (أحبك، بحبك، حب، عشق، غرام، آي كادولي)
  love: [
    'احبك',
    'بحبك',
    'حب',
    'عشق',
    'اعشقك',
    'اهواك',
    'موده',
    'غرام',
    'حبيبي',
    'حبيبتي',
    'حبيب',
    'ود',
    'اعزك',
    'محبه',
    'اي كادولي',
    'كادولي',
    'اي كادوللي',
    'اي كادولى',
    'اي كادولي فين',
    'اي كادولى فين',
    'اي كادوللي فين',
    'كادوللي',
    'كادولى',
    'اي كادول',
    'كيجيل',
    'مني',
    'ايارا',
    'دوكي',
    'love',
    'iloveyou',
    'i love you',
    'ay kadoli',
    'kadoli',
  ],

  // Cluster 2: Greetings and peace (مرحبا، سلام، تحية، ازيك)
  greetings: [
    'مرحبا',
    'اهلا',
    'سلام',
    'تحيه',
    'صباح الخير',
    'مساء الخير',
    'ازيك',
    'عامل ايه',
    'كيف حالك',
    'اخبارك',
    'مسكاقرو',
    'مسكاجلو',
    'اونبا',
    'سناري',
    'hello',
    'hi',
    'welcome',
  ],

  // Cluster 3: Thanks & Gratitude (شكرا، تسلم، ممتن)
  gratitude: ['شكرا', 'تسلم', 'ممتن', 'متشكر', 'جزاك الله', 'مشكور', 'كورا', 'شكرنجرو', 'thank', 'thanks'],

  // Cluster 4: Mother & Father & Family (امي، ابي، ام، اب، اسرة)
  mother: ['امي', 'ام', 'ماما', 'والدتي', 'انا', 'mother', 'mom'],
  father: ['ابي', 'اب', 'بابا', 'والدي', 'ابا', 'father', 'dad'],
  family: ['اسره', 'عائله', 'اهل', 'بيت', 'اقارب', 'family'],

  // Cluster 5: Water, Nile, River, Drink (ماء، ميه، نيل، شرب)
  water: ['ماء', 'ميه', 'مويه', 'نيل', 'نهر', 'شرب', 'عطش', 'ايسي', 'امان', 'water', 'nile', 'river'],

  // Cluster 6: House & Home (بيت، منزل، دار)
  house: ['بيت', 'منزل', 'دار', 'سكن', 'حوش', 'قو', 'نوق', 'house', 'home'],

  // Cluster 7: Beautiful, good, fine (جميل، حلو، طيب، بخير)
  good: ['حلو', 'جميل', 'طيب', 'كويس', 'بخير', 'تمام', 'الحمد لله', 'مسكا', 'good', 'fine', 'beautiful'],
};

/**
 * Given a search query, returns a set of normalized search tokens including semantic synonyms
 */
export function expandSearchQuery(rawQuery: string): string[] {
  const normalized = normalizeArabic(rawQuery);
  if (!normalized) return [];

  const tokens = new Set<string>();
  tokens.add(normalized);

  // Strip query helper / inquiry words (فين، اين، معنى، يعني، ايه)
  const strippedOfInquiryWords = normalized
    .replace(/\b(فين|اين|معني|معنى|يعني|ايه|شو|ما|كلمه|كلمة)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (strippedOfInquiryWords && strippedOfInquiryWords !== normalized) {
    tokens.add(strippedOfInquiryWords);
  }

  // Add individual words
  const words = normalized.split(/\s+/).filter(Boolean);
  words.forEach((w) => tokens.add(w));

  // Check synonym clusters
  for (const cluster of Object.values(SYNONYM_CLUSTERS)) {
    const hasMatch =
      cluster.some((term) => normalized.includes(normalizeArabic(term))) ||
      (strippedOfInquiryWords && cluster.some((term) => strippedOfInquiryWords.includes(normalizeArabic(term)))) ||
      words.some((w) => cluster.some((term) => normalizeArabic(term) === w));

    if (hasMatch) {
      cluster.forEach((term) => tokens.add(normalizeArabic(term)));
    }
  }

  return Array.from(tokens);
}

/**
 * Tests if a dictionary entry matches the user's search query,
 * supporting Arabic normalization (hamzas, diacritics, taa marbuta)
 * and semantic synonyms (e.g. احبك -> بحبك -> حب -> عشق).
 */
export function entryMatchesSearch(
  entry: {
    nubianArabic: string;
    nubianScript: string;
    phonetic: string;
    arabicMeaning: string;
    englishMeaning?: string;
    notes?: string;
    exampleArabic?: string;
    exampleNubian?: string;
  },
  rawQuery: string
): boolean {
  if (!rawQuery || !rawQuery.trim()) return true;

  const queryNormalized = normalizeArabic(rawQuery);
  const searchTokens = expandSearchQuery(rawQuery);

  // Target normalized strings
  const targetMeaning = normalizeArabic(entry.arabicMeaning);
  const targetNubianArabic = normalizeArabic(entry.nubianArabic);
  const targetNotes = normalizeArabic(entry.notes || '');
  const targetExampleAr = normalizeArabic(entry.exampleArabic || '');
  const targetPhonetic = (entry.phonetic || '').toLowerCase();
  const targetScript = (entry.nubianScript || '').toLowerCase();
  const targetEnglish = (entry.englishMeaning || '').toLowerCase();

  // 1. Direct query matching
  if (
    targetMeaning.includes(queryNormalized) ||
    targetNubianArabic.includes(queryNormalized) ||
    targetNotes.includes(queryNormalized) ||
    targetExampleAr.includes(queryNormalized) ||
    targetPhonetic.includes(queryNormalized) ||
    targetScript.includes(queryNormalized) ||
    targetEnglish.includes(queryNormalized)
  ) {
    return true;
  }

  // 2. Direct stripped query matching
  const strippedOfInquiryWords = queryNormalized
    .replace(/\b(فين|اين|معني|معنى|يعني|ايه|شو|ما|كلمه|كلمة)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (strippedOfInquiryWords && strippedOfInquiryWords !== queryNormalized) {
    if (
      targetMeaning.includes(strippedOfInquiryWords) ||
      targetNubianArabic.includes(strippedOfInquiryWords) ||
      targetNotes.includes(strippedOfInquiryWords) ||
      targetExampleAr.includes(strippedOfInquiryWords) ||
      targetPhonetic.includes(strippedOfInquiryWords) ||
      targetEnglish.includes(strippedOfInquiryWords)
    ) {
      return true;
    }
  }

  // 3. Word-by-word token matching (e.g. user typed "كادولي" or "اي كادولي فين" or "احبك")
  const queryWords = queryNormalized.split(/\s+/).filter((w) => w.length >= 2);
  for (const qw of queryWords) {
    if (
      targetMeaning.includes(qw) ||
      targetNubianArabic.includes(qw) ||
      targetNotes.includes(qw) ||
      targetExampleAr.includes(qw) ||
      targetPhonetic.includes(qw)
    ) {
      return true;
    }
  }

  // 4. Semantic synonym token matching
  for (const token of searchTokens) {
    if (token.length < 2) continue;
    if (
      targetMeaning.includes(token) ||
      targetNubianArabic.includes(token) ||
      targetNotes.includes(token) ||
      targetExampleAr.includes(token) ||
      targetEnglish.includes(token) ||
      targetPhonetic.includes(token) ||
      targetScript.includes(token)
    ) {
      return true;
    }
  }

  return false;
}
