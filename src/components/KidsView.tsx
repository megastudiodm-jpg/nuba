import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  Heart,
  Star,
} from 'lucide-react';
import { audioManager } from '../utils/audio';
import { NubianOpposingTriangles } from './NubianOpposingTriangles';

export interface KidItem {
  id: string;
  arabic: string;
  nubianArabic: string;
  nubianScript: string;
  phonetic: string;
  category: 'animals' | 'vegetables' | 'nature' | 'colors';
  dialect: 'fadicha' | 'kenzi' | 'both';
  emoji: string;
  iconBg: string;
  funFact: string;
}

const KIDS_DATA: KidItem[] = [
  // 🐾 حيوانات وطيور (Animals & Birds)
  {
    id: 'k-anim-1',
    arabic: 'التمساح النوبي',
    nubianArabic: 'أُولُومْ',
    nubianScript: 'ⲟⲩⲗⲟⲩⲙ',
    phonetic: 'Oloom',
    category: 'animals',
    dialect: 'both',
    emoji: '🐊',
    iconBg: 'from-emerald-400 to-teal-500',
    funFact: 'يعيش في بحيرة ناصر بأسوان، وتضعه البيوت النوبية كتميمة حماية وبركة فوق الباب!',
  },
  {
    id: 'k-anim-2',
    arabic: 'الجمل (سفينة الصحراء)',
    nubianArabic: 'كَمَلْ',
    nubianScript: 'ⲕⲁⲙⲟⲗ',
    phonetic: 'Kamol',
    category: 'animals',
    dialect: 'both',
    emoji: '🐪',
    iconBg: 'from-amber-400 to-yellow-500',
    funFact: 'يساعد أهل النوبة في ركوب رمال الصحراء والتنقل بين قرى غرب سهيل.',
  },
  {
    id: 'k-anim-3',
    arabic: 'القطة الأليفة',
    nubianArabic: 'إِمْبُو / كَاوْكَاوْ',
    nubianScript: 'ⲓⲙⲃⲟⲩ',
    phonetic: 'Imbo / Kawkaw',
    category: 'animals',
    dialect: 'both',
    emoji: '🐱',
    iconBg: 'from-rose-400 to-pink-500',
    funFact: 'تجلس في حوش البيت النوبي الملون وتلعب مع الأطفال في الدار.',
  },
  {
    id: 'k-anim-4',
    arabic: 'الكلب الوفي',
    nubianArabic: 'وِلْ',
    nubianScript: 'ⲟⲩⲓⲗ',
    phonetic: 'Woil',
    category: 'animals',
    dialect: 'both',
    emoji: '🐕',
    iconBg: 'from-orange-400 to-amber-500',
    funFact: 'يحرس البيوت والزرع بجوار شاطئ النيل.',
  },
  {
    id: 'k-anim-5',
    arabic: 'الحصان الأصيل',
    nubianArabic: 'مُورْ',
    nubianScript: 'ⲙⲟⲩⲣ',
    phonetic: 'Moor',
    category: 'animals',
    dialect: 'fadicha',
    emoji: '🐎',
    iconBg: 'from-amber-600 to-amber-800',
    funFact: 'رمز الفروسية والعزة في أفراح واحتفالات النوبة.',
  },
  {
    id: 'k-anim-6',
    arabic: 'السمكة النيلية',
    nubianArabic: 'كَارِي',
    nubianScript: 'ⲕⲁⲣⲓ',
    phonetic: 'Kari',
    category: 'animals',
    dialect: 'both',
    emoji: '🐟',
    iconBg: 'from-cyan-400 to-blue-500',
    funFact: 'يصطادها الصيادون من نهر النيل العذب بالفلوكة النوبية.',
  },
  {
    id: 'k-anim-7',
    arabic: 'العصفور المغرد',
    nubianArabic: 'كَوِنْجِي',
    nubianScript: 'ⲕⲟⲩⲓⲛϫⲓ',
    phonetic: 'Kwingi',
    category: 'animals',
    dialect: 'both',
    emoji: '🐦',
    iconBg: 'from-sky-400 to-teal-400',
    funFact: 'يغرد فوق أشجار النخيل والسنط مع شروق شمس أسوان الدافئة.',
  },
  {
    id: 'k-anim-8',
    arabic: 'البقرة الطيبة',
    nubianArabic: 'تِي',
    nubianScript: 'ⲧⲓ',
    phonetic: 'Ti',
    category: 'animals',
    dialect: 'both',
    emoji: '🐮',
    iconBg: 'from-emerald-500 to-green-600',
    funFact: 'تعطينا الحليب الطازج والزبدة النوبية الشهية.',
  },
  {
    id: 'k-anim-9',
    arabic: 'الخروف / الكبش',
    nubianArabic: 'كِيجْ',
    nubianScript: 'ⲕⲓϫ',
    phonetic: 'Kij',
    category: 'animals',
    dialect: 'both',
    emoji: '🐑',
    iconBg: 'from-slate-400 to-slate-600',
    funFact: 'يستفاد من صوفه الدافئ في نسج الأغطية والسجاد التراثي.',
  },
  {
    id: 'k-anim-10',
    arabic: 'الحمار الصبور',
    nubianArabic: 'كَاجْ',
    nubianScript: 'ⲕⲁϫ',
    phonetic: 'Kaaj',
    category: 'animals',
    dialect: 'both',
    emoji: '🫏',
    iconBg: 'from-stone-500 to-stone-700',
    funFact: 'يساعد المزارع النوبي في حمل الغلال والتمر من النخيل.',
  },

  // 🥕 خضروات وفواكه وطعام (Vegetables, Fruits & Food)
  {
    id: 'k-veg-1',
    arabic: 'البلح / التمر النوبي',
    nubianArabic: 'بَيْنْتِي',
    nubianScript: 'ⲡⲉⲛⲧⲓ',
    phonetic: 'Benti',
    category: 'vegetables',
    dialect: 'both',
    emoji: '🌴',
    iconBg: 'from-amber-500 to-yellow-600',
    funFact: 'أشهر ثمار أسوان، تمر السكوتي والبرتمودا الحلو الغني بالطاقة والفوائد!',
  },
  {
    id: 'k-veg-2',
    arabic: 'البامية النوبية (الويكة)',
    nubianArabic: 'وِيكَة',
    nubianScript: 'ⲟⲩⲓⲕⲁ',
    phonetic: 'Wika',
    category: 'vegetables',
    dialect: 'both',
    emoji: '🥗',
    iconBg: 'from-emerald-500 to-teal-600',
    funFact: 'تُطبخ بالفرك في أواني الفخار وتؤكل مع خبز الكابيد النوبي الشهير.',
  },
  {
    id: 'k-veg-3',
    arabic: 'الدوم النوبي العطري',
    nubianArabic: 'دُومْ',
    nubianScript: 'ⲇⲟⲩⲙ',
    phonetic: 'Doom',
    category: 'vegetables',
    dialect: 'both',
    emoji: '🥥',
    iconBg: 'from-amber-700 to-orange-800',
    funFact: 'فاكهة نوبية فرعونية قديمة، يُصنع منها ألذ عصير منعش في الصيف.',
  },
  {
    id: 'k-veg-4',
    arabic: 'الطماطم الحمراء',
    nubianArabic: 'بَنَدُورَة / طَمَاطِمْ',
    nubianScript: 'ⲡⲁⲛⲁⲇⲟⲩⲣⲁ',
    phonetic: 'Bandoura',
    category: 'vegetables',
    dialect: 'both',
    emoji: '🍅',
    iconBg: 'from-rose-500 to-red-600',
    funFact: 'تزرع في جزر أسوان الخصبة وتدخل في كل الأكلات النوبية اللذيذة.',
  },
  {
    id: 'k-veg-5',
    arabic: 'الليمون البلدي',
    nubianArabic: 'لِيمُونْ',
    nubianScript: 'ⲗⲓⲙⲟⲩⲛ',
    phonetic: 'Limoon',
    category: 'vegetables',
    dialect: 'both',
    emoji: '🍋',
    iconBg: 'from-yellow-400 to-amber-400',
    funFact: 'عصير الليمون بالنعناع يشربه الضيف أول ما يدخل البيت النوبي للترحيب.',
  },
  {
    id: 'k-veg-6',
    arabic: 'البطيخ المنعش',
    nubianArabic: 'كَاوُنْ / بَطِّيخْ',
    nubianScript: 'ⲕⲁⲟⲩⲛ',
    phonetic: 'Kawon',
    category: 'vegetables',
    dialect: 'both',
    emoji: '🍉',
    iconBg: 'from-emerald-400 to-rose-500',
    funFact: 'يبرد حرارة الصيف ويزرع على طمي النيل بعد انحسار الفيضان.',
  },
  {
    id: 'k-veg-7',
    arabic: 'القمح وسنابل الذهب',
    nubianArabic: 'دِيشِّي',
    nubianScript: 'ⲇⲓϣϣⲓ',
    phonetic: 'Dishi',
    category: 'vegetables',
    dialect: 'both',
    emoji: '🌾',
    iconBg: 'from-amber-300 to-yellow-500',
    funFact: 'يُطحن بالرحى الحجرية لصنع الدقيق للخبز والفطائر النوبية.',
  },
  {
    id: 'k-veg-8',
    arabic: 'الخبز النوبي الرقيق (الدوكة)',
    nubianArabic: 'كَابِيدْ / دَوْكَة',
    nubianScript: 'ⲕⲁⲡⲓⲇ',
    phonetic: 'Kabid',
    category: 'vegetables',
    dialect: 'both',
    emoji: '🫓',
    iconBg: 'from-amber-500 to-amber-700',
    funFact: 'يُخبز على صاج حديدي ساخن يُسمى صاج الدوكة وتفوح رائحته الزكية في الصباح.',
  },

  // 🌴 الطبيعة النوبية والبيت (Nubian Nature & House)
  {
    id: 'k-nat-1',
    arabic: 'نهر النيل العظيم',
    nubianArabic: 'إِيسِي دُولِّي / أَمَانْ',
    nubianScript: 'ⲉⲉⲥⲓ ⲇⲟⲩⲗⲗⲓ',
    phonetic: 'Eesi Dooli',
    category: 'nature',
    dialect: 'both',
    emoji: '🌊',
    iconBg: 'from-cyan-500 to-blue-600',
    funFact: 'شريان الحياة للنوبة ومصر كلها، مياهه عذبة صافية تجري بين الجزر والصخور.',
  },
  {
    id: 'k-nat-2',
    arabic: 'الشمس الذهبية المشرقة',
    nubianArabic: 'مَاشَا',
    nubianScript: 'ⲙⲁϣⲁ',
    phonetic: 'Masha',
    category: 'nature',
    dialect: 'both',
    emoji: '☀️',
    iconBg: 'from-amber-400 to-yellow-400',
    funFact: 'تشرق طوال العام في أسوان وتجعل بيوت النوبة تشع دفئاً ونوراً وبهجة.',
  },
  {
    id: 'k-nat-3',
    arabic: 'القمر المنير في الليل',
    nubianArabic: 'أُونَاتِّي',
    nubianScript: 'ⲟⲩⲛⲁⲧⲧⲓ',
    phonetic: 'Ounatti',
    category: 'nature',
    dialect: 'both',
    emoji: '🌙',
    iconBg: 'from-indigo-400 to-purple-500',
    funFact: 'يضيء سهرات النوبة والحكايات والسمسمية على رمال الجزر الهادئة.',
  },
  {
    id: 'k-nat-4',
    arabic: 'النخلة الشامخة',
    nubianArabic: 'فِيتِّي',
    nubianScript: 'ⲫⲓⲧⲧⲓ',
    phonetic: 'Fitti',
    category: 'nature',
    dialect: 'both',
    emoji: '🌴',
    iconBg: 'from-emerald-500 to-green-600',
    funFact: 'صديقة النوبي القديمة، تعطينا التمر وسعف النخل لصنع الأطباق والسلال الملونة (الشوور).',
  },
  {
    id: 'k-nat-5',
    arabic: 'البيت النوبي الملون',
    nubianArabic: 'قُو / نُوقْ',
    nubianScript: 'ⲅⲟⲩ',
    phonetic: 'Gou / Nog',
    category: 'nature',
    dialect: 'both',
    emoji: '🏡',
    iconBg: 'from-teal-400 to-cyan-500',
    funFact: 'مبني من الطين وجذوع النخيل ومزين بمثلثات متقابلة زاهية وأقواس وقباب تحميه من الحرارة.',
  },
  {
    id: 'k-nat-6',
    arabic: 'الفلوكة الشراعية النوبية',
    nubianArabic: 'كُوبَّارْ',
    nubianScript: 'ⲕⲟⲩⲡⲡⲁⲣ',
    phonetic: 'Kobbar',
    category: 'nature',
    dialect: 'both',
    emoji: '⛵',
    iconBg: 'from-cyan-400 to-blue-500',
    funFact: 'قارب شراعي أبيض جميل يتنقل به الأجداد في النيل بين الشلال وجزيرة النباتات.',
  },

  // 🎨 ألوان بيوت أسوان (Nubian House Colors)
  {
    id: 'k-col-1',
    arabic: 'اللون الأزرق النيلي',
    nubianArabic: 'دِيسِّي',
    nubianScript: 'ⲇⲓⲥⲥⲓ',
    phonetic: 'Dissi',
    category: 'colors',
    dialect: 'both',
    emoji: '🔷',
    iconBg: 'from-blue-500 to-cyan-600',
    funFact: 'لون مياه نهر النيل والسماء الصافية، يطلى به مدخل وأعمدة البيت النوبي.',
  },
  {
    id: 'k-col-2',
    arabic: 'اللون الأصفر الشمسي',
    nubianArabic: 'كَلِّي',
    nubianScript: 'ⲕⲁⲗⲗⲓ',
    phonetic: 'Kalli',
    category: 'colors',
    dialect: 'both',
    emoji: '🟡',
    iconBg: 'from-amber-400 to-yellow-400',
    funFact: 'لون رمال الصحراء الذهبية وشمس الصباح المشرقة على واجهات البيوت.',
  },
  {
    id: 'k-col-3',
    arabic: 'اللون الأحمر القرمزي',
    nubianArabic: 'قَيْلِي',
    nubianScript: 'ⲕⲁⲓⲗⲓ',
    phonetic: 'Gayli',
    category: 'colors',
    dialect: 'both',
    emoji: '🔴',
    iconBg: 'from-rose-500 to-red-600',
    funFact: 'لون زهرة الكركديه الأسوانية الشهيرة والمثلثات النوبية المبهجة.',
  },
  {
    id: 'k-col-4',
    arabic: 'اللون الأخضر الواحاتي',
    nubianArabic: 'دِيسِّي جِنِّي',
    nubianScript: 'ⲇⲓⲥⲥⲓ ϫⲓⲛⲛⲓ',
    phonetic: 'Dissi Jinni',
    category: 'colors',
    dialect: 'both',
    emoji: '🟢',
    iconBg: 'from-emerald-500 to-green-600',
    funFact: 'لون الزرع والجزر الخضراء في قلب النيل وأوراق النخيل اليانعة.',
  },
  {
    id: 'k-col-5',
    arabic: 'اللون الأبيض الجيري الصافي',
    nubianArabic: 'أَرُوبِي',
    nubianScript: 'ⲁⲣⲟⲩⲡⲓ',
    phonetic: 'Arobi',
    category: 'colors',
    dialect: 'both',
    emoji: '⚪',
    iconBg: 'from-slate-100 to-white text-slate-800',
    funFact: 'يُطلى به الجير الأبيض على الجدران ليعكس حرارة الشمس ويعطي إشراقاً وسلاماً.',
  },
];

export const KidsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'animals' | 'vegetables' | 'nature' | 'colors'>('animals');
  const [activeMode, setActiveMode] = useState<'cards' | 'game'>('cards');
  const [slowAudio, setSlowAudio] = useState<boolean>(true);

  // GAME STATE
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedGameAnswer, setSelectedGameAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [gameQuestions, setGameQuestions] = useState<
    {
      targetItem: KidItem;
      options: KidItem[];
    }[]
  >([]);

  // Initialize Kids Game Questions
  const initKidsGame = () => {
    const shuffled = [...KIDS_DATA].sort(() => 0.5 - Math.random()).slice(0, 8);
    const questions = shuffled.map((item) => {
      // Pick 2 wrong distractors
      const distractors = KIDS_DATA.filter((k) => k.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);
      const allOpts = [item, ...distractors].sort(() => 0.5 - Math.random());
      return {
        targetItem: item,
        options: allOpts,
      };
    });

    setGameQuestions(questions);
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedGameAnswer(null);
    setIsAnswerRevealed(false);
  };

  const handleStartGame = () => {
    audioManager.playClickTone();
    initKidsGame();
    setActiveMode('game');
  };

  const handleAnswerGame = (chosenId: string) => {
    if (isAnswerRevealed) return;
    setSelectedGameAnswer(chosenId);
    setIsAnswerRevealed(true);

    const currentQ = gameQuestions[currentQuestionIndex];
    if (chosenId === currentQ.targetItem.id) {
      audioManager.playSuccessTone();
      setQuizScore((prev) => prev + 1);
    } else {
      audioManager.playClickTone();
    }
  };

  const handleNextGameQuestion = () => {
    audioManager.playClickTone();
    setSelectedGameAnswer(null);
    setIsAnswerRevealed(false);

    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePronounce = (item: KidItem) => {
    audioManager.playClickTone();
    audioManager.speak(item.nubianArabic, item.phonetic, { slow: slowAudio });
  };

  const filteredItems = KIDS_DATA.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const currentQ = gameQuestions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Authentic Nubian Decorative Top Banner with Opposing Triangles & Memory Quote */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border-2 border-cyan-200/90 relative overflow-hidden">
        {/* Opposing Triangles Frieze matching the user photo */}
        <NubianOpposingTriangles height={16} />

        <div className="pt-4 pb-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-right">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-300 via-teal-400 to-cyan-500 text-3xl flex items-center justify-center shadow-md border-2 border-amber-400 shrink-0 transform hover:scale-105 transition-transform">
              🐾
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  قسم أطفال النوبة المصور
                </h2>
                <span className="bg-amber-400 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-black border border-amber-500 shadow-2xs">
                  للصغار والكبار ✨
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-900/90 mt-1 font-medium max-w-xl">
                تعلم أسماء الحيوانات والخضروات والفواكه والطبيعة وألوان بيوت أسوان بالنوبية بالرسومات المبهجة والنطق الصوتي الواضح!
              </p>
            </div>
          </div>

          {/* Mode Switchers: Cards vs Game */}
          <div className="flex items-center gap-2 bg-cyan-100/70 p-1.5 rounded-2xl border border-cyan-200 shrink-0">
            <button
              id="kids-mode-cards-btn"
              onClick={() => {
                audioManager.playClickTone();
                setActiveMode('cards');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeMode === 'cards'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm border border-cyan-700'
                  : 'text-slate-700 hover:text-cyan-950'
              }`}
            >
              📖 البطاقات المصورة
            </button>

            <button
              id="kids-mode-game-btn"
              onClick={handleStartGame}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeMode === 'game'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm border border-amber-300'
                  : 'text-slate-700 hover:text-cyan-950'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>لعبة التحدي للأطفال</span>
            </button>
          </div>
        </div>

        {/* Bottom Opposing Triangles Band */}
        <NubianOpposingTriangles height={12} className="mt-3" />
      </div>

      {/* MODE 1: ILLUSTRATED CARDS */}
      {activeMode === 'cards' && (
        <div className="space-y-6">
          {/* Categories Selector & Speed Toggle */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-cyan-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
              {[
                { id: 'animals' as const, label: '🐾 الحيوانات والطيور', count: 10 },
                { id: 'vegetables' as const, label: '🥕 الخضروات والفواكه', count: 8 },
                { id: 'nature' as const, label: '🌴 طبيعة النيل والبيت', count: 6 },
                { id: 'colors' as const, label: '🎨 ألوان بيوت أسوان', count: 5 },
                { id: 'all' as const, label: 'الكل (جميع الرسومات)', count: KIDS_DATA.length },
              ].map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`kids-cat-btn-${cat.id}`}
                    onClick={() => {
                      audioManager.playClickTone();
                      setActiveCategory(cat.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${
                      isSelected
                        ? 'bg-[#082e4e] text-amber-300 border-[#051c30] shadow-sm'
                        : 'bg-[#F4FAFB] hover:bg-cyan-100 text-slate-700 border-cyan-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="mr-1.5 opacity-80 text-[10px]">({cat.count})</span>
                  </button>
                );
              })}
            </div>

            {/* Audio Speed Toggle for Kids */}
            <button
              id="kids-slow-audio-toggle"
              onClick={() => {
                audioManager.playClickTone();
                setSlowAudio(!slowAudio);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black border flex items-center gap-1.5 shrink-0 transition-all ${
                slowAudio
                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              <span>{slowAudio ? '🐢 نطق هادئ للأطفال' : '⚡ نطق عادي'}</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                id={`kid-card-${item.id}`}
                className="bg-white rounded-3xl border-2 border-cyan-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group hover:border-cyan-400"
              >
                {/* Authentic Opposing Triangles Top Stripe */}
                <NubianOpposingTriangles height={8} />

                <div className="p-5 flex-1 flex flex-col justify-between">
                  {/* Visual Illustration Badge & Dialect Tag */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Big friendly illustration representation */}
                    <div
                      className={`w-18 h-18 rounded-3xl bg-gradient-to-br ${item.iconBg} text-white flex items-center justify-center text-4xl shadow-md border-2 border-white transform group-hover:scale-110 transition-transform`}
                    >
                      {item.emoji}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 border border-cyan-200">
                        {item.dialect === 'fadicha'
                          ? 'نوبي (فاديجا)'
                          : item.dialect === 'kenzi'
                          ? 'نوبي (كنزي)'
                          : 'مشترك (نوبي)'}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">
                        {item.phonetic}
                      </span>
                    </div>
                  </div>

                  {/* Words: Arabic & Nubian */}
                  <div className="space-y-1 mb-3">
                    <h3 className="text-xl font-black text-slate-900">{item.arabic}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-[#0c3559]">
                        {item.nubianArabic}
                      </span>
                      <span className="text-sm font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        {item.nubianScript}
                      </span>
                    </div>
                  </div>

                  {/* Fun Fact / Cultural Note for Kids */}
                  <div className="bg-cyan-50/70 p-3 rounded-2xl border border-cyan-100/90 text-xs text-slate-700 font-medium leading-relaxed mb-4">
                    💡 <span className="font-bold text-cyan-950">معلومة نوبية:</span> {item.funFact}
                  </div>

                  {/* Big Friendly Sound Button */}
                  <button
                    id={`kid-pronounce-btn-${item.id}`}
                    onClick={() => handlePronounce(item)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 active:scale-98 text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all border border-cyan-500"
                  >
                    <Volume2 className="w-5 h-5 text-amber-300" />
                    <span>استمع لنطق الكلمة</span>
                  </button>
                </div>

                {/* Bottom decorative color bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE KIDS GAME */}
      {activeMode === 'game' && currentQ && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cyan-200 shadow-lg space-y-6 relative overflow-hidden text-center">
            {/* Opposing Triangles Band */}
            <NubianOpposingTriangles height={14} />

            {/* Game Progress Header */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 pt-2 border-b border-cyan-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-950 flex items-center justify-center font-black">
                  {currentQuestionIndex + 1}/{gameQuestions.length}
                </span>
                <span>تحدي المستكشف الصغير 🌟</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-300 text-amber-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>النجوم: {quizScore}</span>
              </div>
            </div>

            {/* Question Illustration & Prompt */}
            <div className="py-4 space-y-3">
              <div
                className={`w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br ${currentQ.targetItem.iconBg} text-white flex items-center justify-center text-6xl shadow-xl border-4 border-white animate-bounce duration-1000`}
              >
                {currentQ.targetItem.emoji}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-bold">ما هو الاسم النوبي لهذا الرسم؟</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  « {currentQ.targetItem.arabic} »
                </h3>
              </div>

              <button
                onClick={() => handlePronounce(currentQ.targetItem)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-100 hover:bg-cyan-200 text-cyan-950 text-xs font-bold transition-all border border-cyan-300"
              >
                <Volume2 className="w-3.5 h-3.5 text-cyan-700" />
                <span>استمع للتلميح الصوتي 🔊</span>
              </button>
            </div>

            {/* 3 Large Option Buttons */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((opt) => {
                const isSelected = selectedGameAnswer === opt.id;
                const isCorrect = isAnswerRevealed && opt.id === currentQ.targetItem.id;
                const isWrong = isAnswerRevealed && isSelected && opt.id !== currentQ.targetItem.id;

                return (
                  <button
                    key={opt.id}
                    id={`kid-game-opt-${opt.id}`}
                    disabled={isAnswerRevealed}
                    onClick={() => handleAnswerGame(opt.id)}
                    className={`p-4 rounded-2xl border-2 font-black text-lg sm:text-xl transition-all flex items-center justify-between shadow-xs ${
                      isCorrect
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 scale-102 shadow-md'
                        : isWrong
                        ? 'bg-rose-100 border-rose-500 text-rose-950'
                        : isSelected
                        ? 'bg-cyan-100 border-cyan-500 text-cyan-950'
                        : 'bg-[#F9FCFC] hover:bg-cyan-50 border-cyan-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-xl font-bold">{opt.nubianArabic}</span>
                      <span className="text-xs font-mono text-slate-500 font-normal">
                        ({opt.phonetic})
                      </span>
                    </div>

                    {isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />}
                    {isWrong && <XCircle className="w-6 h-6 text-rose-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Post Answer Feedback & Next Button */}
            {isAnswerRevealed && (
              <div className="space-y-4 pt-2">
                <div
                  className={`p-4 rounded-2xl border text-sm font-bold ${
                    selectedGameAnswer === currentQ.targetItem.id
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  {selectedGameAnswer === currentQ.targetItem.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">🎉</span>
                      <span>إجابة صحيحة يا بطل! أحسنت صنعاً!</span>
                    </div>
                  ) : (
                    <div>
                      <span>الإجابة الصحيحة هي: </span>
                      <strong className="text-slate-900 text-base">
                        {currentQ.targetItem.nubianArabic} ({currentQ.targetItem.arabic})
                      </strong>
                    </div>
                  )}
                </div>

                {currentQuestionIndex < gameQuestions.length - 1 ? (
                  <button
                    id="kid-game-next-btn"
                    onClick={handleNextGameQuestion}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-black rounded-2xl text-base shadow-md transition-all active:scale-98 border border-cyan-500"
                  >
                    السؤال التالي ➜
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xl font-black text-slate-900">
                      🎊 مبروك! أنهيت لعبة أطفال النوبة بنجاح!
                    </div>
                    <p className="text-sm text-slate-600">
                      جمعت {quizScore} نجمة من أصل {gameQuestions.length}!
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={initKidsGame}
                        className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black rounded-2xl text-sm shadow-md"
                      >
                        العب جولة جديدة 🔄
                      </button>
                      <button
                        onClick={() => setActiveMode('cards')}
                        className="px-6 py-3 bg-cyan-100 hover:bg-cyan-200 text-cyan-950 font-black rounded-2xl text-sm border border-cyan-300"
                      >
                        العودة للبطاقات 📖
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
