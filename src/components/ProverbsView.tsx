import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Copy,
  Check,
  Search,
  Bookmark,
  BookmarkCheck,
  Scroll,
  HeartHandshake,
  Compass,
  Hourglass,
  Home,
  Users,
  Lightbulb,
  Target,
} from 'lucide-react';
import { NubianProverb, NubianDialect } from '../types/nubian';
import { NUBIAN_PROVERBS } from '../data/nubianData';
import { audioManager } from '../utils/audio';

interface ProverbsViewProps {
  onOpenKeyboard?: () => void;
}

const CATEGORY_TABS: { id: NubianProverb['category'] | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'جميع الأمثال', icon: Scroll },
  { id: 'hospitality', label: 'الكرم والضيافة', icon: HeartHandshake },
  { id: 'nile', label: 'النيل والوطن والحنين', icon: Compass },
  { id: 'patience', label: 'الصبر والمثابرة', icon: Hourglass },
  { id: 'family', label: 'البيت والأسرة', icon: Home },
  { id: 'wisdom', label: 'الحكمة والعمل والتعاون', icon: Lightbulb },
  { id: 'friendship', label: 'الصداقة والوفاء', icon: Users },
];

export const ProverbsView: React.FC<ProverbsViewProps> = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<NubianProverb['category'] | 'all'>('all');
  const [selectedDialect, setSelectedDialect] = useState<NubianDialect | 'all'>('all');
  const [savedProverbIds, setSavedProverbIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nubian_saved_proverbs');
      return saved ? JSON.parse(saved) : ['prv-1', 'prv-2'];
    } catch {
      return ['prv-1', 'prv-2'];
    }
  });
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [slowAudio, setSlowAudio] = useState<boolean>(false);

  // Proverb of the day (featured)
  const featuredProverb = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return NUBIAN_PROVERBS[dayOfYear % NUBIAN_PROVERBS.length] || NUBIAN_PROVERBS[0];
  }, []);

  // Filtered proverbs
  const filteredProverbs = useMemo(() => {
    return NUBIAN_PROVERBS.filter((proverb) => {
      // Category filter
      if (selectedCategory !== 'all' && proverb.category !== selectedCategory) {
        return false;
      }

      // Dialect filter
      if (selectedDialect !== 'all') {
        if (selectedDialect === 'both' && proverb.dialect !== 'both') return false;
        if (selectedDialect !== 'both' && proverb.dialect !== selectedDialect && proverb.dialect !== 'both') {
          return false;
        }
      }

      // Saved filter
      if (showSavedOnly && !savedProverbIds.includes(proverb.id)) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchArabic = proverb.nubianArabic.toLowerCase().includes(q);
        const matchScript = proverb.nubianScript.toLowerCase().includes(q);
        const matchTrans = proverb.arabicTranslation.toLowerCase().includes(q);
        const matchExp = proverb.deepExplanation.toLowerCase().includes(q);
        const matchUsage = proverb.usageOccasion.toLowerCase().includes(q);
        const matchPhonetic = proverb.phonetic.toLowerCase().includes(q);

        return matchArabic || matchScript || matchTrans || matchExp || matchUsage || matchPhonetic;
      }

      return true;
    });
  }, [selectedCategory, selectedDialect, showSavedOnly, searchTerm, savedProverbIds]);

  const handlePronounce = (proverb: NubianProverb) => {
    audioManager.playClickTone();
    setPlayingId(proverb.id);
    audioManager.speak(proverb.nubianArabic, proverb.phonetic, {
      slow: slowAudio,
      onStart: () => setPlayingId(proverb.id),
      onEnd: () => setPlayingId(null),
    });
  };

  const handleToggleSave = (id: string) => {
    audioManager.playClickTone();
    setSavedProverbIds((prev) => {
      const next = prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id];
      try {
        localStorage.setItem('nubian_saved_proverbs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleCopy = (proverb: NubianProverb) => {
    const text = `«${proverb.nubianArabic}» (${proverb.nubianScript})\nالنطق: ${proverb.phonetic}\nالترجمة: ${proverb.arabicTranslation}\nالمعنى: ${proverb.deepExplanation}\nمناسبة الاستخدام: ${proverb.usageOccasion}\n- من تراث الأمثال النوبية المصرية`;
    navigator.clipboard.writeText(text);
    setCopiedId(proverb.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Header Section in Authentic Aswan Nubian House Visual Identity */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#072d4c] via-[#0a3f6a] to-[#0d558d] rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-cyan-400/80">
        {/* Top Decorative Geometric Band */}
        <div className="absolute top-0 left-0 right-0 h-2 nubian-stripe-accent" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-1">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-xs font-black shadow-xs">
              <Scroll className="w-3.5 h-3.5 text-slate-950" />
              <span>موسوعة الحكمة النوبية والتراث الشفاهي لأسوان</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
              أمثال وتعابير شائعة باللغة النوبية
            </h2>
            <p className="text-xs sm:text-sm text-cyan-100/90 max-w-2xl leading-relaxed">
              تراث عريق يوثّق حكمة الأجداد على جزر النيل وقرى غرب سهيل وهيسا. لكل مثل نوبي نطق صوتي دقيق، وترجمة عربية، وشرح لمعناه ومناسبات استخدامه المتوارثة في نوبة مصر.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="toggle-slow-audio-proverbs"
              onClick={() => setSlowAudio(!slowAudio)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                slowAudio
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-cyan-100 border-white/20'
              }`}
            >
              <span>{slowAudio ? '🐢 نطق تعليمي متأنٍ' : '⚡ نطق عادي'}</span>
            </button>

            <button
              id="filter-saved-proverbs-btn"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                showSavedOnly
                  ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow-md font-black'
                  : 'bg-white/10 hover:bg-white/20 text-cyan-100 border-white/20'
              }`}
            >
              {showSavedOnly ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>المفضلة ({savedProverbIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPOTLIGHT: Proverb of the Day */}
      {!showSavedOnly && !searchTerm && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-cyan-200/90 shadow-md relative overflow-hidden">
          {/* Subtle Top Nubian Zigzag Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 nubian-stripe-accent" />

          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-cyan-100 pt-1">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs border border-amber-200">
                ✨
              </span>
              <div>
                <span className="text-xs font-black text-cyan-950 block leading-tight">
                  مثل اليوم المُختار
                </span>
                <span className="text-[11px] text-slate-500 font-medium">حكمة نوبية مصرية متوارثة عبر الأجيال</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-950 border border-cyan-200">
                {featuredProverb.dialect === 'fadicha'
                  ? 'لهجة الفاديجا (النوبين)'
                  : featuredProverb.dialect === 'kenzi'
                  ? 'لهجة الكنزي (الماتوكي)'
                  : 'مشترك بين اللهجتين'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Nubian Script & Arabic Transliteration */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-wide block">
                  {featuredProverb.nubianScript}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0c3559] mt-1">
                  «{featuredProverb.nubianArabic}»
                </h3>
                <span className="text-xs font-bold text-cyan-800 font-sans tracking-wide">
                  نطق صوتي: {featuredProverb.phonetic}
                </span>
              </div>

              {/* Pronounce Button */}
              <button
                id="pronounce-featured-proverb-btn"
                onClick={() => handlePronounce(featuredProverb)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-md shrink-0 border-2 ${
                  playingId === featuredProverb.id
                    ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                    : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white border-cyan-500'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                <span>{playingId === featuredProverb.id ? 'جاري الاستماع...' : 'استمع لنطق المثل'}</span>
              </button>
            </div>

            {/* Translation Box */}
            <div className="p-4 bg-[#F5FAFA] rounded-2xl border border-cyan-200/80 shadow-2xs">
              <span className="text-xs font-black text-cyan-900 block mb-1">
                📖 الترجمة إلى العربية:
              </span>
              <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {featuredProverb.arabicTranslation}
              </p>
            </div>

            {/* Grid of Explanation and Usage Occasion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div className="p-4 bg-white rounded-2xl border border-cyan-100 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-cyan-950">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>شرح موجز للمعنى وسياقه الثقافي:</span>
                </div>
                <p className="text-slate-700 leading-relaxed pt-1 font-medium">
                  {featuredProverb.deepExplanation}
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-cyan-100 space-y-1">
                <div className="flex items-center gap-1.5 font-black text-teal-950">
                  <Target className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>كيفية ومناسبة الاستخدام (متى يُقال؟):</span>
                </div>
                <p className="text-slate-700 leading-relaxed pt-1 font-medium">
                  {featuredProverb.usageOccasion}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-cyan-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-cyan-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-proverbs-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث في الأمثال النوبية (مثال: النيل، الضيافة، الصبر، الأم، مانجا، eesi)..."
              className="w-full pr-11 pl-4 py-3.5 bg-[#F4FAFB] hover:bg-white focus:bg-white border-2 border-cyan-200/80 focus:border-cyan-600 focus:ring-3 focus:ring-cyan-500/20 rounded-2xl text-slate-800 text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                مسح
              </button>
            )}
          </div>

          {/* Dialect Filter */}
          <div className="flex items-center gap-1.5 bg-cyan-50/80 p-1.5 rounded-2xl border border-cyan-100">
            <span className="text-xs font-bold text-cyan-900 px-2 hidden sm:inline">اللهجة:</span>
            {[
              { id: 'all' as const, label: 'الكل' },
              { id: 'fadicha' as const, label: 'فاديجا' },
              { id: 'kenzi' as const, label: 'كَنزي' },
              { id: 'both' as const, label: 'مشترك' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDialect(d.id)}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                  selectedDialect === d.id
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-cyan-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_TABS.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`proverb-cat-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#0a355c] text-amber-300 shadow-xs border border-[#082b4b]'
                    : 'bg-cyan-50/70 hover:bg-cyan-100 text-slate-700 border border-cyan-100/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-cyan-700'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-cyan-100">
          <span>
            عدد الأمثال المعروضة: <strong className="text-cyan-900">{filteredProverbs.length}</strong> مثل نوبي أصيل
          </span>
          {showSavedOnly && (
            <span className="text-cyan-800 font-bold">عرض الأمثال المحفوظة فقط</span>
          )}
        </div>
      </div>

      {/* Grid of Proverbs */}
      {filteredProverbs.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-cyan-200">
          <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center mx-auto mb-3 text-2xl font-mono border border-cyan-200">
            𓉐
          </div>
          <h3 className="text-lg font-bold text-slate-900">لم نجد أمثالاً مطابقة لبحثك</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            جرب البحث بموضوع آخر مثل "الكرم" أو "النيل" أو "الصبر" أو إعادة ضبط الفلاتر.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDialect('all');
              setShowSavedOnly(false);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-sm font-bold shadow-sm"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredProverbs.map((proverb) => {
            const isSaved = savedProverbIds.includes(proverb.id);
            const isCopied = copiedId === proverb.id;
            const isPlaying = playingId === proverb.id;

            return (
              <div
                key={proverb.id}
                id={`proverb-card-${proverb.id}`}
                className="bg-white rounded-3xl p-6 border-2 border-cyan-100/90 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Accent Top Border */}
                <div
                  className={`absolute top-0 left-0 right-0 h-2 ${
                    proverb.dialect === 'fadicha'
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
                      : proverb.dialect === 'kenzi'
                      ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600'
                      : 'nubian-stripe-accent'
                  }`}
                />

                <div className="space-y-4 pt-1">
                  {/* Top Header with Badges & Action Buttons */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                          proverb.dialect === 'fadicha'
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : proverb.dialect === 'kenzi'
                            ? 'bg-cyan-100 text-cyan-950 border border-cyan-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {proverb.dialect === 'fadicha'
                          ? 'لهجة الفاديجا'
                          : proverb.dialect === 'kenzi'
                          ? 'لهجة الكَنزي'
                          : 'مشترك'}
                      </span>

                      <span className="text-[11px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                        {CATEGORY_TABS.find((c) => c.id === proverb.category)?.label || proverb.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        id={`save-proverb-${proverb.id}`}
                        onClick={() => handleToggleSave(proverb.id)}
                        className={`p-2 rounded-xl transition-all ${
                          isSaved
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'hover:bg-cyan-50 text-slate-400 hover:text-cyan-700'
                        }`}
                        title={isSaved ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        id={`copy-proverb-${proverb.id}`}
                        onClick={() => handleCopy(proverb)}
                        className="p-2 rounded-xl hover:bg-cyan-50 text-slate-400 hover:text-cyan-700 transition-all"
                        title="نسخ المثل والتفاصيل"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Nubian Text & Script */}
                  <div>
                    <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-wide block leading-relaxed">
                      {proverb.nubianScript}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[#0c3559] mt-1 leading-snug">
                      «{proverb.nubianArabic}»
                    </h3>
                    <span className="text-xs font-bold text-cyan-800 font-sans tracking-wide block mt-0.5">
                      نطق صوتي: {proverb.phonetic}
                    </span>
                  </div>

                  {/* Audio Pronunciation Button */}
                  <div>
                    <button
                      id={`play-proverb-audio-${proverb.id}`}
                      onClick={() => handlePronounce(proverb)}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-black transition-all active:scale-98 border-2 ${
                        isPlaying
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md animate-pulse'
                          : 'bg-gradient-to-r from-cyan-50 via-teal-50 to-cyan-100/70 hover:from-cyan-100 hover:to-teal-100 text-[#073656] border-cyan-300/80 shadow-2xs'
                      }`}
                      title="استمع إلى نطق المثل بصوت واضح"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-white' : 'text-cyan-700'}`} />
                      <span>{isPlaying ? 'جاري نطق المثل النوبي...' : '🔊 استمع لنطق المثل باللغة النوبية'}</span>
                    </button>
                  </div>

                  {/* Arabic Translation */}
                  <div className="p-3.5 bg-[#F5FAFA] rounded-2xl border border-cyan-100">
                    <span className="text-xs font-black text-cyan-900 block mb-1">
                      📖 الترجمة إلى العربية:
                    </span>
                    <p className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                      {proverb.arabicTranslation}
                    </p>
                    {proverb.literalMeaning && (
                      <span className="text-[11px] text-slate-500 block mt-1 font-medium">
                        المعنى الحرفي: {proverb.literalMeaning}
                      </span>
                    )}
                  </div>

                  {/* Explanation & Usage Occasion */}
                  <div className="space-y-2.5 text-xs">
                    {/* Deep Explanation */}
                    <div className="p-3 bg-cyan-50/70 rounded-xl border border-cyan-200/70">
                      <div className="flex items-center gap-1 font-black text-cyan-950 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>شرح موجز لمعناه:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {proverb.deepExplanation}
                      </p>
                    </div>

                    {/* Usage Occasion */}
                    <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200/70">
                      <div className="flex items-center gap-1 font-black text-teal-950 mb-1">
                        <Target className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>كيفية ومناسبة استخدامه (متى يُقال؟):</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        {proverb.usageOccasion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Tags */}
                {proverb.tags && proverb.tags.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-cyan-100 flex items-center gap-1.5 flex-wrap">
                    {proverb.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-bold bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded-md border border-cyan-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
