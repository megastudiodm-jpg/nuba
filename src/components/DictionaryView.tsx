import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Sparkles,
  Keyboard,
  Filter,
  Layers,
  HeartHandshake,
  Users,
  Compass,
  Home,
  Utensils,
  Hash,
  Palette,
  Zap,
  Scroll,
  X,
  BookOpen,
  ArrowDown,
  Sparkle,
} from 'lucide-react';
import { DictionaryEntry, NubianDialect, WordCategory } from '../types/nubian';
import { audioManager } from '../utils/audio';
import { entryMatchesSearch } from '../utils/arabicSearch';

interface DictionaryViewProps {
  entries: DictionaryEntry[];
  savedWordIds: string[];
  onToggleSave: (id: string) => void;
  onOpenKeyboard: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const CATEGORIES: { id: WordCategory | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'جميع الأقسام', icon: Layers },
  { id: 'greetings', label: 'التحيات والمجاملات', icon: HeartHandshake },
  { id: 'family', label: 'العائلة والقرابة', icon: Users },
  { id: 'nature', label: 'النيل والطبيعة', icon: Compass },
  { id: 'home', label: 'البيت والعمارة النوبية', icon: Home },
  { id: 'food', label: 'الطعام النوبي', icon: Utensils },
  { id: 'numbers', label: 'الأرقام والعد', icon: Hash },
  { id: 'colors', label: 'الألوان والصفات', icon: Palette },
  { id: 'verbs', label: 'أفعال يومية', icon: Zap },
  { id: 'proverbs', label: 'أمثال وحكم', icon: Scroll },
];

const DIALECT_OPTIONS: { id: NubianDialect | 'all'; label: string }[] = [
  { id: 'all', label: 'جميع اللهجات' },
  { id: 'fadicha', label: 'الفاديجا (نوبين)' },
  { id: 'kenzi', label: 'الكنزي (ماتوكي)' },
  { id: 'both', label: 'مشترك بين اللهجتين' },
];

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  entries,
  savedWordIds,
  onToggleSave,
  onOpenKeyboard,
  searchTerm,
  setSearchTerm,
}) => {
  const [inputVal, setInputVal] = useState<string>(searchTerm);
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | 'all'>('all');
  const [selectedDialect, setSelectedDialect] = useState<NubianDialect | 'all'>('all');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);
  const [slowAudio, setSlowAudio] = useState<boolean>(false);

  // Sync inputVal when external searchTerm changes (e.g. from quick chips)
  React.useEffect(() => {
    setInputVal(searchTerm);
  }, [searchTerm]);

  // Execute search function
  const handleExecuteSearch = (queryOverride?: string) => {
    audioManager.playClickTone();
    const query = (queryOverride !== undefined ? queryOverride : inputVal).trim();
    setInputVal(query);
    setSearchTerm(query);
    // When searching, clear restrictive category filter so whole dictionary is searched
    if (query) {
      setSelectedCategory('all');
      setShowSavedOnly(false);
    }
  };

  const handleClearSearch = () => {
    audioManager.playClickTone();
    setInputVal('');
    setSearchTerm('');
  };

  const isSearchActive = Boolean(searchTerm.trim());

  // Filter entries
  const filteredEntries = useMemo(() => {
    const trimmed = searchTerm.trim();
    if (trimmed) {
      // When searching, match across all entries without category blockage
      const results = entries.filter((entry) => {
        return entryMatchesSearch(entry, trimmed);
      });

      // Sort results so direct matches (like 'آي كادولي' when searching 'كادولي' or 'احبك') come first
      return results.sort((a, b) => {
        const aDirect =
          a.nubianArabic.includes(trimmed) ||
          a.arabicMeaning.includes(trimmed) ||
          (a.notes && a.notes.includes(trimmed));
        const bDirect =
          b.nubianArabic.includes(trimmed) ||
          b.arabicMeaning.includes(trimmed) ||
          (b.notes && b.notes.includes(trimmed));
        if (aDirect && !bDirect) return -1;
        if (!aDirect && bDirect) return 1;
        return 0;
      });
    }

    return entries.filter((entry) => {
      // Category filter for browsing
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false;
      }

      // Dialect filter
      if (selectedDialect !== 'all') {
        if (selectedDialect === 'both' && entry.dialect !== 'both') return false;
        if (selectedDialect !== 'both' && entry.dialect !== selectedDialect && entry.dialect !== 'both') {
          return false;
        }
      }

      // Saved filter
      if (showSavedOnly && !savedWordIds.includes(entry.id)) {
        return false;
      }

      return true;
    });
  }, [entries, selectedCategory, selectedDialect, showSavedOnly, searchTerm, savedWordIds]);

  const handlePronounce = (entry: DictionaryEntry, customText?: string) => {
    audioManager.playClickTone();
    const idToPlay = entry.id;
    setPlayingWordId(idToPlay);

    const arabicToSpeak = customText || entry.nubianArabic;
    const phoneticToSpeak = customText ? undefined : entry.phonetic;

    audioManager.speak(arabicToSpeak, phoneticToSpeak, {
      slow: slowAudio,
      onStart: () => setPlayingWordId(idToPlay),
      onEnd: () => setPlayingWordId(null),
    });
  };

  const handleCopy = (entry: DictionaryEntry) => {
    const textToCopy = `${entry.nubianArabic} (${entry.nubianScript}) - ${entry.arabicMeaning}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reusable Word Card Component
  const renderWordCard = (entry: DictionaryEntry, isTopSpotlight: boolean = false) => {
    const isSaved = savedWordIds.includes(entry.id);
    const isCopied = copiedId === entry.id;
    const isPlaying = playingWordId === entry.id;

    return (
      <div
        key={entry.id}
        id={`word-card-${entry.id}`}
        className={`bg-white rounded-3xl p-5 border-2 ${
          isTopSpotlight
            ? 'border-amber-400/90 shadow-md ring-2 ring-amber-400/20'
            : 'border-cyan-100/90 hover:border-cyan-400 shadow-xs hover:shadow-md'
        } transition-all flex flex-col justify-between group relative overflow-hidden`}
      >
        {/* Accent Top Border: Authentic Nubian village color strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            isTopSpotlight
              ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500'
              : entry.dialect === 'fadicha'
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
              : entry.dialect === 'kenzi'
              ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600'
              : 'nubian-stripe-accent'
          }`}
        />

        {/* Card Body */}
        <div>
          {/* 1. ARABIC MEANING FIRST (معنى الكلمة يظهر أولاً في الصدارة) */}
          <div className="mb-3 p-3.5 bg-gradient-to-r from-amber-50/95 via-white to-cyan-50/70 rounded-2xl border-2 border-amber-300 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>المعنى بالعربية:</span>
              </span>
              {isTopSpotlight && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-950 border border-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-600" /> أفضل تطابق
                </span>
              )}
            </div>
            <p className="text-xl font-black text-slate-950 leading-snug">
              {entry.arabicMeaning}
            </p>
            {entry.englishMeaning && (
              <p className="text-xs font-semibold text-slate-500 mt-1 font-sans">
                {entry.englishMeaning}
              </p>
            )}
          </div>

          {/* 2. Nubian Word, Script & Phonetics */}
          <div className="flex items-start justify-between gap-2 mb-2.5 p-3 bg-[#F4F9FA] rounded-2xl border border-cyan-100">
            <div>
              <span className="text-[10px] font-extrabold text-cyan-900 block mb-0.5">
                الكلمة بالنوبية:
              </span>
              {/* Arabic Transliteration */}
              <h2 className="text-xl font-extrabold text-[#0c3559] leading-snug">
                {entry.nubianArabic}
              </h2>
              {/* Nubian Script Display */}
              <span className="text-lg font-black font-mono text-slate-800 tracking-wide block leading-tight mt-0.5">
                {entry.nubianScript}
              </span>
              {/* Latin Phonetics */}
              <span className="text-xs font-bold text-cyan-800 font-sans tracking-wide block mt-0.5">
                {entry.phonetic}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                id={`save-btn-${entry.id}`}
                onClick={() => onToggleSave(entry.id)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'hover:bg-cyan-100/60 text-slate-400 hover:text-cyan-700'
                }`}
                title={isSaved ? 'إزالة من المحفوظات' : 'حفظ الكلمة'}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                id={`copy-btn-${entry.id}`}
                onClick={() => handleCopy(entry)}
                className="p-2 rounded-xl hover:bg-cyan-100/60 text-slate-400 hover:text-cyan-700 transition-all cursor-pointer"
                title="نسخ الكلمة"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. PROMINENT AUDIO PRONUNCIATION BUTTON */}
          <div className="mb-3">
            <button
              id={`pronounce-btn-${entry.id}`}
              onClick={() => handlePronounce(entry)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-xs font-black transition-all active:scale-98 border-2 cursor-pointer ${
                isPlaying
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md animate-pulse'
                  : 'bg-gradient-to-r from-cyan-50 via-teal-50 to-cyan-100/70 hover:from-cyan-100 hover:to-teal-100 text-[#073656] border-cyan-300/80 shadow-2xs'
              }`}
              title="تشغيل النطق الصوتي للكلمة"
            >
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-white' : 'text-cyan-700'}`} />
              <span>{isPlaying ? 'جاري نطق الكلمة...' : '🔊 استمع لنطق الكلمة النوبية'}</span>
            </button>
          </div>

          {/* 4. Example Sentence */}
          {entry.exampleNubian && (
            <div className="mt-2.5 text-xs space-y-1">
              <div className="flex items-center justify-between text-cyan-900 font-bold">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-extrabold">مثال في جملة:</span>
                </div>
                <button
                  onClick={() => handlePronounce(entry, entry.exampleNubian)}
                  className="flex items-center gap-1 text-[11px] text-cyan-800 hover:text-cyan-950 bg-cyan-100/80 px-2 py-0.5 rounded-lg border border-cyan-200 transition-colors font-bold cursor-pointer"
                  title="استمع إلى نطق جملة المثال"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>نطق المثال</span>
                </button>
              </div>
              <div className="p-2.5 bg-gradient-to-r from-cyan-50/60 to-amber-50/40 rounded-xl text-slate-800 border border-cyan-100">
                <span className="font-black text-[#0c3559] font-mono text-sm block">{entry.exampleNubian}</span>
                <span className="block text-slate-600 mt-0.5 font-medium">{entry.exampleArabic}</span>
              </div>
            </div>
          )}

          {/* 5. Cultural Note */}
          {entry.notes && (
            <p className="mt-2.5 text-[11px] text-slate-600 leading-relaxed bg-amber-50/60 p-2.5 rounded-xl border-r-3 border-amber-400 font-medium">
              💡 {entry.notes}
            </p>
          )}
        </div>

        {/* Footer Badges */}
        <div className="mt-4 pt-3 border-t border-cyan-100 flex items-center justify-between text-[11px]">
          <span
            className={`px-2.5 py-0.5 rounded-lg font-black ${
              entry.dialect === 'fadicha'
                ? 'bg-amber-100 text-amber-950 border border-amber-300'
                : entry.dialect === 'kenzi'
                ? 'bg-cyan-100 text-cyan-950 border border-cyan-300'
                : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}
          >
            {entry.dialect === 'fadicha'
              ? 'لهجة الفاديجا (النوبين)'
              : entry.dialect === 'kenzi'
              ? 'لهجة الكنزي (الماتوكي)'
              : 'مشترك (فاديجا وكنزي)'}
          </span>

          <span className="text-cyan-800 font-bold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
            {CATEGORIES.find((c) => c.id === entry.category)?.label || entry.category}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Top Section with Aswan Nubian Styling */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-cyan-100 relative overflow-hidden">
        {/* Subtle decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 nubian-stripe-accent" />

        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-cyan-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="dictionary-search-input"
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setSearchTerm(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleExecuteSearch();
                }
              }}
              placeholder="ابحث بالعربية أو النوبية (مثال: اي كادولي، احبك، مسكاقرو، ماء)..."
              className="w-full pr-11 pl-28 py-3.5 bg-[#F4FAFB] hover:bg-white focus:bg-white border-2 border-cyan-200/80 focus:border-cyan-600 focus:ring-3 focus:ring-cyan-500/20 rounded-2xl text-slate-800 text-sm sm:text-base outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {inputVal && (
                <button
                  id="clear-search-btn"
                  onClick={handleClearSearch}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="مسح حقل البحث"
                >
                  مسح
                </button>
              )}
              <button
                id="open-keyboard-search-btn"
                onClick={onOpenKeyboard}
                className="p-2 text-cyan-900 bg-cyan-100 hover:bg-cyan-200 rounded-xl transition-colors border border-cyan-200 cursor-pointer"
                title="لوحة المفاتيح النوبية لكتابة الحروف"
              >
                <Keyboard className="w-4 h-4 text-cyan-700" />
              </button>
            </div>
          </div>

          {/* DEDICATED SEARCH BUTTON (زر البحث المخصص) */}
          <button
            id="execute-search-button"
            onClick={() => handleExecuteSearch()}
            className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 hover:from-cyan-700 hover:to-teal-800 active:scale-95 text-white font-black rounded-2xl text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-cyan-500 shrink-0 cursor-pointer"
            title="انقر لتنفيذ البحث وإظهار النتائج فوراً"
          >
            <Search className="w-5 h-5 text-amber-300" />
            <span>ابحث الآن</span>
          </button>

          {/* Audio Speed Mode Toggle */}
          <button
            id="toggle-audio-speed-btn"
            onClick={() => {
              audioManager.playClickTone();
              setSlowAudio(!slowAudio);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
              slowAudio
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                : 'bg-white hover:bg-cyan-50 text-slate-700 border-cyan-200'
            }`}
            title="تبديل سرعة النطق التعليمي للكلمات"
          >
            <span>{slowAudio ? '🐢 نطق متأنٍ' : '⚡ نطق عادي'}</span>
          </button>

          {/* Bookmarks Toggle */}
          <button
            id="toggle-saved-filter-btn"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold border transition-all cursor-pointer ${
              showSavedOnly
                ? 'bg-[#0e3c66] text-amber-300 border-[#0a2c4a] shadow-sm'
                : 'bg-white hover:bg-cyan-50 text-slate-700 border-cyan-200'
            }`}
          >
            {showSavedOnly ? <BookmarkCheck className="w-4 h-4 text-amber-400" /> : <Bookmark className="w-4 h-4 text-cyan-700" />}
            <span>المحفوظة ({savedWordIds.length})</span>
          </button>
        </div>

        {/* Dialect Filter Bar with Nubian Palette (Shown when not searching or as secondary filter) */}
        {!isSearchActive && (
          <>
            <div className="mt-4 pt-4 border-t border-cyan-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-cyan-900 flex items-center gap-1 mr-1">
                  <Filter className="w-3.5 h-3.5 text-cyan-600" /> اللهجة النوبية:
                </span>
                {DIALECT_OPTIONS.map((dialect) => (
                  <button
                    key={dialect.id}
                    id={`dialect-filter-${dialect.id}`}
                    onClick={() => setSelectedDialect(dialect.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedDialect === dialect.id
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm border border-cyan-700'
                        : 'bg-cyan-50/80 hover:bg-cyan-100 text-slate-700 border border-cyan-100'
                    }`}
                  >
                    {dialect.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 font-medium">
                عدد الكلمات المعروضة: <span className="font-black text-cyan-900">{filteredEntries.length}</span> من أصل {entries.length}
              </div>
            </div>

            {/* Categories Chips */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`cat-chip-${cat.id}`}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0b3860] text-amber-300 shadow-sm border border-[#092b4a]'
                        : 'bg-cyan-50/70 hover:bg-cyan-100/90 text-slate-700 border border-cyan-100/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-cyan-700'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* =================================================================== */}
      {/* 1. WORD MEANINGS & RESULTS FIRST (معاني الكلمات أولاً)               */}
      {/* =================================================================== */}
      {isSearchActive ? (
        <div
          id="direct-search-results-box"
          className="p-5 sm:p-6 bg-gradient-to-b from-cyan-50/95 via-white to-cyan-50/70 rounded-3xl border-2 border-cyan-400 shadow-md"
        >
          {/* Header of Search Results */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-5 border-b border-cyan-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Search className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-cyan-950 flex items-center gap-2">
                  معاني الكلمات المطابقة لـ: <span className="text-cyan-800 bg-white px-3 py-0.5 rounded-xl border border-cyan-300 shadow-2xs">«{searchTerm}»</span>
                </h2>
                <span className="text-xs font-bold text-slate-500">
                  {filteredEntries.length > 0
                    ? `✨ وجدنا ${filteredEntries.length} كلمة مطابقة مع إبراز المعنى العربي في الصدارة:`
                    : 'لم يتم العثور على كلمات مطابقة تماماً'}
                </span>
              </div>
            </div>

            <button
              id="clear-search-results-btn"
              onClick={handleClearSearch}
              className="px-3.5 py-2 text-xs font-black text-slate-700 hover:text-red-700 bg-white hover:bg-red-50 rounded-xl border border-slate-200 hover:border-red-200 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>إغلاق نتائج البحث وعرض القاموس كاملاً</span>
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>

          {/* If Results Are Found */}
          {filteredEntries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredEntries.map((entry, index) => renderWordCard(entry, index === 0))}
            </div>
          ) : (
            /* If No Results Are Found */
            <div className="py-8 text-center bg-white rounded-2xl border border-cyan-200 p-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 font-bold text-2xl border border-amber-200">
                🔍
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1">
                لم نجد كلمة مطابقة تماماً لـ «{searchTerm}»
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-2">
                يمكنك الضغط على أحد الاقتراحات أدناه بعد الفاصل لعرض معانيها مباشرة:
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Main Browse Word Cards Grid (Shown when not searching) */
        <div>
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-cyan-200 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center mx-auto mb-3 text-2xl font-mono border border-cyan-200">
                ?
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">لا توجد كلمات في هذا القسم أو الفلتر</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                جرب تغيير خيارات الفلتر أو إعادة ضبطها لعرض كافة كلمات القاموس النوبي!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDialect('all');
                  setShowSavedOnly(false);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredEntries.map((entry) => renderWordCard(entry))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. CLEAR DISTINCT SEPARATOR (فاصل واضح ومميز يفصل بينهما)          */}
      {/* =================================================================== */}
      <div className="my-10 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-cyan-300" />
        </div>
        <div className="relative bg-gradient-to-r from-[#072d4c] via-[#0b3860] to-[#0a4f82] text-amber-300 px-6 py-2.5 rounded-full border-2 border-cyan-400 shadow-md flex items-center gap-2.5 text-xs sm:text-sm font-black">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>فاصل: اقتراحات كلمات وعبارات نوبية شائعة</span>
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. SUGGESTIONS AFTERWARDS (الاقتراحات بعدها بنقرة واحدة)            */}
      {/* =================================================================== */}
      <div
        id="dictionary-suggestions-section"
        className="bg-white rounded-3xl p-6 border-2 border-cyan-200 shadow-sm relative overflow-hidden space-y-5"
      >
        {/* Accent Top Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-500" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cyan-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#0c3559] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>اقتراحات كلمات وعبارات نوبية شائعة ومختارة</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              انقر على أي عبارة أو كلمة من الاقتراحات أدناه لإظهار معناها الدقيق ونطقها الصوتي فوراً في القاموس
            </p>
          </div>
          <span className="text-[11px] font-black text-cyan-800 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200 self-start sm:self-auto">
            💡 نقرة واحدة تكفي
          </span>
        </div>

        {/* Suggestion Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Group 1: الحب والمشاعر */}
          <div className="p-4 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 rounded-2xl border border-rose-200">
            <h4 className="text-xs font-black text-rose-900 mb-2.5 flex items-center gap-1.5">
              <span>💖</span>
              <span>عبارات المحبة والغرام النوبية:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'آي كادولي (أنا بحبك) 💖', query: 'اي كادولي' },
                { label: 'إكادولي (أحبكِ / أحبك)', query: 'اكادولي' },
                { label: 'كادول (حب وعشق)', query: 'حب' },
                { label: 'حبيبي / غالي (ماندوج)', query: 'حبيبي' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleExecuteSearch(item.query);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-950 border border-rose-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group 2: التحيات والمجاملات */}
          <div className="p-4 bg-gradient-to-br from-teal-50/70 via-white to-cyan-50/50 rounded-2xl border border-teal-200">
            <h4 className="text-xs font-black text-teal-900 mb-2.5 flex items-center gap-1.5">
              <span>🤝</span>
              <span>التحيات والمجاملات التراثية:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'مسكاقرو (مرحباً وأهلاً)', query: 'مسكاقرو' },
                { label: 'مسكاجلو (صباح / مساء الخير)', query: 'مسكاجلو' },
                { label: 'كورّا (شكراً جزيلاً)', query: 'شكرا' },
                { label: 'سمنود (مع السلامة)', query: 'سمنود' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleExecuteSearch(item.query);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-teal-50 hover:border-teal-300 text-teal-950 border border-teal-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group 3: تراث النيل والطبيعة */}
          <div className="p-4 bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/50 rounded-2xl border border-cyan-200">
            <h4 className="text-xs font-black text-cyan-950 mb-2.5 flex items-center gap-1.5">
              <span>🌊</span>
              <span>تراث النيل والطبيعة بأسوان:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'إيسي (ماء النيل العذب)', query: 'ماء' },
                { label: 'أرتي (جزيرة وسط النيل)', query: 'جزيرة' },
                { label: 'نيل (النيل الخالد)', query: 'نيل' },
                { label: 'مركب وفلوكة', query: 'مركب' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleExecuteSearch(item.query);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-cyan-50 hover:border-cyan-300 text-cyan-950 border border-cyan-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group 4: الأسرة والبيت */}
          <div className="p-4 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 rounded-2xl border border-amber-200">
            <h4 className="text-xs font-black text-amber-950 mb-2.5 flex items-center gap-1.5">
              <span>🏡</span>
              <span>الأسرة والبيت النوبي:</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'آنّا (أمي الحبيبة)', query: 'امي' },
                { label: 'آبّا (أبي العزيز)', query: 'ابي' },
                { label: 'نوگ (البيت والدار)', query: 'بيت' },
                { label: 'تود (ولد / ابن)', query: 'ولد' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleExecuteSearch(item.query);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 hover:border-amber-300 text-amber-950 border border-amber-200 shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
