import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Volume2,
  Copy,
  Check,
  Sparkles,
  Loader2,
  Keyboard,
  Info,
  BookOpen,
} from 'lucide-react';
import { COMMON_PHRASES } from '../data/nubianData';
import { TranslationResponse, NubianDialect } from '../types/nubian';
import { audioManager } from '../utils/audio';

interface TranslatorViewProps {
  onOpenKeyboard: () => void;
}

export const TranslatorView: React.FC<TranslatorViewProps> = ({ onOpenKeyboard }) => {
  const [inputText, setInputText] = useState<string>('');
  const [sourceLang, setSourceLang] = useState<'ar' | 'nubian' | 'en'>('ar');
  const [targetDialect, setTargetDialect] = useState<NubianDialect>('both');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Local fallback matcher for instant responses
  const findLocalTranslation = (text: string): TranslationResponse | null => {
    const cleaned = text.trim().toLowerCase();

    if (cleaned.includes('كادول') || cleaned.includes('kadoli') || cleaned.includes('اي كادولي')) {
      return {
        translation: 'آي كَادُولِّي',
        nubianScript: 'ⲁⲓ ⲕⲁⲇⲟⲩⲗⲗⲓ',
        phonetic: 'Ay Kadoli / Ay Kadolee',
        dialect: 'مشترك (فاديجا وكنزي)',
        notes: '«آي كادولي» هي أشهر وأعذب عبارة حب في التراث النوبي المصري («آي» = أنا، «كادولي» = أحبك / أهواك). تغنى بها الكينج محمد منير ومطربو النوبة.',
        dialectComparison: 'تستخدم في كلتا اللهجتين (الفاديجا والكنزي) للتعبير عن الحب الصادق والود.',
        breakdown: [
          { word: 'آي (Aay)', meaning: 'ضمير المتكلم: أنا', role: 'ضمير' },
          { word: 'كَادُولِّي (Kadoli)', meaning: 'أحبك / أهواك / أودك', role: 'فعل محبة ورغبة' },
        ],
      };
    }

    const foundPhrase = COMMON_PHRASES.find(
      (p) =>
        p.ar.includes(cleaned) ||
        cleaned.includes(p.ar) ||
        p.nubian.toLowerCase().includes(cleaned) ||
        p.phonetic.toLowerCase().includes(cleaned)
    );

    if (foundPhrase) {
      return {
        translation: foundPhrase.nubian,
        nubianScript: foundPhrase.script,
        phonetic: foundPhrase.phonetic,
        dialect: targetDialect === 'fadicha' ? 'فاديجا (نوبين)' : targetDialect === 'kenzi' ? 'كنزي (ماتوكي)' : 'فاديجا وكنزي',
        notes: 'تمت الترجمة بدقة بالاعتماد على معجم التراث النوبي المصري.',
        dialectComparison: 'تتطابق بعض التراكيب بين الفاديجا والكنزي مع تنوع في النهايات الصوتية.',
        breakdown: [
          { word: foundPhrase.nubian.split(' ')[0], meaning: 'كلمة أساسية في التعبير' },
        ],
      };
    }
    return null;
  };

  const handleTranslate = async (overrideText?: string) => {
    const textToTranslate = overrideText !== undefined ? overrideText : inputText;
    if (!textToTranslate.trim()) return;

    audioManager.playClickTone();
    setLoading(true);
    setErrorMsg(null);

    const localMatch = findLocalTranslation(textToTranslate);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToTranslate,
          sourceLang,
          targetDialect,
        }),
      });

      if (!res.ok) {
        throw new Error('فشل طلب الترجمة');
      }

      const data = await res.json();
      if (data.translation) {
        setResult(data);
      } else if (localMatch) {
        setResult(localMatch);
      } else {
        setResult({
          translation: textToTranslate,
          phonetic: 'Local transcription',
          dialect: targetDialect,
          notes: 'لم نتمكن من الوصول للترجمة التلقائية حالياً.',
        });
      }
    } catch (err: any) {
      console.warn('API translate failed, using local match:', err);
      if (localMatch) {
        setResult(localMatch);
      } else {
        setErrorMsg('تعذر الاتصال بخادم الترجمة الذكي. تم استخدام المحاكي المحلي.');
        setResult({
          translation: textToTranslate,
          phonetic: 'Nobiin translation preview',
          dialect: 'فاديجا / كنزي',
          notes: 'يرجى مراجعة الاتصال أو التأكد من إدخال جمل شائعة.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPhraseClick = (phrase: typeof COMMON_PHRASES[0]) => {
    setInputText(phrase.ar);
    handleTranslate(phrase.ar);
  };

  const handleCopyResult = () => {
    if (!result) return;
    const fullText = `${result.translation} ${result.nubianScript ? `(${result.nubianScript})` : ''}\nالنطق: ${result.phonetic}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePronounceResult = () => {
    if (!result) return;
    audioManager.playClickTone();
    audioManager.speak(result.translation, result.phonetic);
  };

  const swapLanguages = () => {
    audioManager.playClickTone();
    setSourceLang(sourceLang === 'ar' ? 'nubian' : 'ar');
    if (result) {
      setInputText(result.translation);
      setResult(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info with Deep Nile Blue, Turquoise & Egyptian Nubian Painted House Trim */}
      <div className="bg-gradient-to-r from-[#072d4c] via-[#0a3f6a] to-[#0d558d] text-white rounded-3xl p-6 shadow-xl border-2 border-cyan-400/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
        {/* Top Decorative Geometric Band */}
        <div className="absolute top-0 left-0 right-0 h-1.5 nubian-stripe-accent" />

        <div className="pt-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 text-xs font-black shadow-xs">
              AI Smart Translator
            </span>
            <h2 className="text-xl sm:text-2xl font-black">المترجم النوبي الذكي</h2>
          </div>
          <p className="text-xs sm:text-sm text-cyan-100/90 max-w-xl">
            ترجمة فورية متقدمة بين العربية والإنجليزية واللغة النوبية بلهجتيها (الفاديجا والكَنزي) مع الشرح النحوي والتراثي.
          </p>
        </div>

        {/* Dialect Selector */}
        <div className="bg-black/30 p-1.5 rounded-2xl border border-cyan-300/30 flex items-center gap-1 self-stretch sm:self-auto backdrop-blur-xs">
          <span className="text-xs text-amber-300 px-2 font-black hidden sm:inline">اللهجة:</span>
          {(['both', 'fadicha', 'kenzi'] as NubianDialect[]).map((d) => (
            <button
              key={d}
              id={`dialect-tab-${d}`}
              onClick={() => {
                setTargetDialect(d);
                if (inputText) handleTranslate();
              }}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                targetDialect === d
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-sm border border-white'
                  : 'text-cyan-100 hover:text-white hover:bg-white/10'
              }`}
            >
              {d === 'both' ? 'كلتا اللهجتين' : d === 'fadicha' ? 'فاديجا' : 'كَنزي'}
            </button>
          ))}
        </div>
      </div>

      {/* Translation Workspace Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Box */}
        <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100/90 shadow-sm flex flex-col justify-between">
          <div>
            {/* Lang Controls Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-100 mb-3">
              <span className="text-xs font-bold text-slate-600">
                {sourceLang === 'ar' ? 'اللغة المدخلة: العربية' : sourceLang === 'en' ? 'اللغة المدخلة: الإنجليزية' : 'اللغة المدخلة: النوبية'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  id="swap-lang-btn"
                  onClick={swapLanguages}
                  className="p-1.5 rounded-xl hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 flex items-center gap-1 text-xs font-bold border border-transparent hover:border-cyan-200 transition-colors"
                  title="تبديل اتجاه الترجمة"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-600" />
                  <span>تبديل</span>
                </button>
                <button
                  id="open-keyboard-translator-btn"
                  onClick={onOpenKeyboard}
                  className="p-1.5 px-2.5 rounded-xl bg-cyan-100/90 hover:bg-cyan-200 text-cyan-950 text-xs font-black flex items-center gap-1 border border-cyan-300"
                  title="كتابة بالحروف النوبية"
                >
                  <Keyboard className="w-3.5 h-3.5 text-cyan-700" />
                  <span>الحروف النوبية</span>
                </button>
              </div>
            </div>

            {/* Input Textarea */}
            <textarea
              id="translator-input-textarea"
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                sourceLang === 'ar'
                  ? 'اكتب جملة أو كلمة للترجمة إلى النوبية (مثال: أهلاً وسهلاً، كيف حالك، النيل جميل، أحبك يا أمي)...'
                  : 'اكتب الكلمة النوبية (بالعربية أو الأبجدية النوبية)...'
              }
              className="w-full bg-transparent resize-none outline-none text-slate-800 placeholder:text-slate-400 text-base leading-relaxed font-medium"
            />
          </div>

          <div className="pt-3 border-t border-cyan-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">{inputText.length} حرف</span>
            <button
              id="submit-translate-btn"
              onClick={() => handleTranslate()}
              disabled={loading || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 text-white text-sm font-black rounded-2xl shadow-md transition-all active:scale-95 border border-cyan-500"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>{loading ? 'جاري الترجمة...' : 'ترجم الآن'}</span>
            </button>
          </div>
        </div>

        {/* Output Box */}
        <div className="bg-[#F5FAFA] rounded-3xl p-5 border-2 border-cyan-200/90 shadow-sm flex flex-col justify-between relative min-h-[220px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cyan-200/60 mb-3">
              <span className="text-xs font-black text-cyan-950">
                الترجمة النوبية المقترحة
              </span>
              {result && (
                <div className="flex items-center gap-1.5">
                  <button
                    id="speak-translation-btn"
                    onClick={handlePronounceResult}
                    className="p-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-950 transition-colors border border-cyan-200"
                    title="استمع إلى النطق"
                  >
                    <Volume2 className="w-4 h-4 text-cyan-700" />
                  </button>
                  <button
                    id="copy-translation-btn"
                    onClick={handleCopyResult}
                    className="p-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-950 transition-colors border border-cyan-200"
                    title="نسخ الترجمة"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-cyan-700" />}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
                <span className="text-xs font-bold text-cyan-800">جاري الترجمة والتحليل اللغوي النوبي...</span>
              </div>
            ) : result ? (
              <div className="space-y-3">
                {/* Nubian Script */}
                {result.nubianScript && (
                  <div className="text-2xl font-black font-mono text-slate-900 tracking-wide">
                    {result.nubianScript}
                  </div>
                )}
                {/* Arabic Transliteration */}
                <div className="text-2xl font-black text-[#0c3559] leading-snug">
                  {result.translation}
                </div>
                {/* Phonetic guide */}
                {result.phonetic && (
                  <div className="text-xs font-bold text-cyan-800 font-sans tracking-wide">
                    نطق صوتي: <span className="text-cyan-950">{result.phonetic}</span>
                  </div>
                )}
                {/* Dialect tag */}
                <div className="inline-block px-3 py-1 rounded-xl text-xs font-black bg-cyan-100 text-cyan-950 border border-cyan-200">
                  {result.dialect}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm font-medium">
                ستظهر الترجمة النوبية هنا مع الأبجدية والنطق الصوتي وملاحظات اللهجات.
              </div>
            )}
          </div>

          {result?.notes && (
            <div className="mt-4 pt-3 border-t border-cyan-200/60 text-xs text-slate-600 flex items-start gap-1.5 font-medium">
              <Info className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
              <span>{result.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Extra Breakdown & Dialect Comparison */}
      {result && (result.breakdown || result.dialectComparison) && (
        <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <span>التحليل اللغوي وتفصيل الكلمات</span>
          </h3>

          {result.dialectComparison && (
            <div className="p-3.5 bg-cyan-50/70 rounded-2xl border border-cyan-200 text-xs text-slate-700 font-medium">
              <strong className="text-cyan-950 block mb-1">مقارنة اللهجتين (فاديجا vs كنزي):</strong>
              {result.dialectComparison}
            </div>
          )}

          {result.breakdown && result.breakdown.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {result.breakdown.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#F5FAFA] border border-cyan-100 text-xs">
                  <span className="font-black text-[#0c3559] block font-mono text-sm">{item.word}</span>
                  <span className="text-slate-600 block mt-0.5 font-medium">{item.meaning}</span>
                  {item.role && <span className="text-[10px] text-cyan-700 font-bold">{item.role}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 text-center font-bold">
          {errorMsg}
        </div>
      )}

      {/* Quick Phrase Suggestions */}
      <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-sm">
        <div className="text-xs font-black text-slate-600 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>عبارات نوبية شائعة جاهزة للتجربة والترجمة السريعة:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_PHRASES.map((phrase, i) => (
            <button
              key={i}
              id={`quick-phrase-${i}`}
              onClick={() => handleQuickPhraseClick(phrase)}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-50/70 hover:bg-cyan-100/90 hover:border-cyan-300 border border-cyan-100 text-xs font-bold text-slate-700 transition-all active:scale-95"
            >
              {phrase.ar}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
