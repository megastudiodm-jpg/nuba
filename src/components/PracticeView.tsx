import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Volume2,
  CheckCircle,
  XCircle,
  Trophy,
  Sparkles,
  HelpCircle,
  Flame,
  ArrowRight,
  Shuffle,
  Loader2,
} from 'lucide-react';
import { QUIZ_QUESTIONS, DICTIONARY_ENTRIES } from '../data/nubianData';
import { QuizQuestion, DictionaryEntry } from '../types/nubian';
import { audioManager } from '../utils/audio';

export const PracticeView: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'flashcards' | 'quiz' | 'match'>('flashcards');

  // FLASHCARDS STATE
  const [flashcardDeck, setFlashcardDeck] = useState<DictionaryEntry[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [knownCount, setKnownCount] = useState<number>(0);

  // QUIZ STATE
  const [quizList, setQuizList] = useState<QuizQuestion[]>(QUIZ_QUESTIONS);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);
  const [generatingQuiz, setGeneratingQuiz] = useState<boolean>(false);

  // MATCHING GAME STATE
  const [matchPairs, setMatchPairs] = useState<{ id: string; nubian: string; arabic: string }[]>([]);
  const [selectedNubian, setSelectedNubian] = useState<string | null>(null);
  const [selectedArabic, setSelectedArabic] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState<number>(0);

  // Initialize Flashcards
  useEffect(() => {
    shuffleFlashcards();
    initMatchGame();
  }, []);

  const shuffleFlashcards = () => {
    const shuffled = [...DICTIONARY_ENTRIES].sort(() => 0.5 - Math.random()).slice(0, 15);
    setFlashcardDeck(shuffled);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownCount(0);
  };

  const handleNextCard = (known: boolean) => {
    audioManager.playClickTone();
    if (known) setKnownCount(prev => prev + 1);
    setIsFlipped(false);
    if (currentCardIndex < flashcardDeck.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      audioManager.playSuccessTone();
    }
  };

  // Initialize Matching Game
  const initMatchGame = () => {
    const subset = [...DICTIONARY_ENTRIES].sort(() => 0.5 - Math.random()).slice(0, 6);
    const pairs = subset.map(entry => ({
      id: entry.id,
      nubian: entry.nubianArabic,
      arabic: entry.arabicMeaning.split('/')[0].trim(),
    }));
    setMatchPairs(pairs);
    setMatchedIds([]);
    setSelectedNubian(null);
    setSelectedArabic(null);
    setMatchScore(0);
  };

  const handleSelectNubianWord = (id: string) => {
    if (matchedIds.includes(id)) return;
    audioManager.playClickTone();
    setSelectedNubian(id);

    if (selectedArabic) {
      checkMatch(id, selectedArabic);
    }
  };

  const handleSelectArabicMeaning = (id: string) => {
    if (matchedIds.includes(id)) return;
    audioManager.playClickTone();
    setSelectedArabic(id);

    if (selectedNubian) {
      checkMatch(selectedNubian, id);
    }
  };

  const checkMatch = (nubianId: string, arabicId: string) => {
    if (nubianId === arabicId) {
      // Correct match!
      audioManager.playSuccessTone();
      setMatchedIds(prev => [...prev, nubianId]);
      setMatchScore(prev => prev + 10);
      setSelectedNubian(null);
      setSelectedArabic(null);
    } else {
      // Wrong match
      audioManager.playClickTone();
      setTimeout(() => {
        setSelectedNubian(null);
        setSelectedArabic(null);
      }, 500);
    }
  };

  // Quiz Handlers
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    audioManager.playClickTone();
    setSelectedOption(index);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const currentQ = quizList[quizIndex];
    if (selectedOption === currentQ.correctIndex) {
      audioManager.playSuccessTone();
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false);
    setSelectedOption(null);

    if (quizIndex < quizList.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setIsQuizFinished(true);
      audioManager.playSuccessTone();
    }
  };

  const handleResetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsQuizFinished(false);
  };

  // AI Quiz Generator
  const handleGenerateAIQuiz = async () => {
    setGeneratingQuiz(true);
    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'كلمات وعادات النوبة', difficulty: 'متوسط' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuizList(data.questions);
          handleResetQuiz();
        }
      }
    } catch {
      // Keep existing list
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const currentCard = flashcardDeck[currentCardIndex];
  const currentQuiz = quizList[quizIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Mode Selector with Nubian Turquoise & Deep Blue Theme */}
      <div className="flex items-center justify-center">
        <div className="bg-cyan-100/70 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner border border-cyan-200">
          <button
            id="tab-practice-flashcards"
            onClick={() => setActiveGame('flashcards')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeGame === 'flashcards'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm border border-cyan-700'
                : 'text-slate-700 hover:text-cyan-950'
            }`}
          >
            بطاقات التذكر (Flashcards)
          </button>

          <button
            id="tab-practice-quiz"
            onClick={() => setActiveGame('quiz')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeGame === 'quiz'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm border border-cyan-700'
                : 'text-slate-700 hover:text-cyan-950'
            }`}
          >
            اختبار النوبة (Quiz)
          </button>

          <button
            id="tab-practice-match"
            onClick={() => setActiveGame('match')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeGame === 'match'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm border border-cyan-700'
                : 'text-slate-700 hover:text-cyan-950'
            }`}
          >
            لعبة المطابقة (Match Game)
          </button>
        </div>
      </div>

      {/* MODE 1: FLASHCARDS */}
      {activeGame === 'flashcards' && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-700 bg-white px-5 py-3 rounded-2xl border-2 border-cyan-100 shadow-sm">
            <span>
              البطاقة: <strong className="text-cyan-900">{currentCardIndex + 1}</strong> من {flashcardDeck.length}
            </span>
            <span>
              الكلمات المتقنة: <strong className="text-emerald-600">{knownCount}</strong>
            </span>
            <button
              onClick={shuffleFlashcards}
              className="flex items-center gap-1 text-xs text-cyan-800 hover:text-cyan-950 font-bold"
            >
              <Shuffle className="w-3.5 h-3.5 text-cyan-600" /> إعادة خلط
            </button>
          </div>

          {currentCard ? (
            <div className="flex flex-col items-center">
              {/* Flip Card Container */}
              <div
                id="interactive-flashcard"
                onClick={() => {
                  audioManager.playClickTone();
                  setIsFlipped(!isFlipped);
                }}
                className={`w-full max-w-lg min-h-[300px] p-8 rounded-3xl border-2 cursor-pointer transition-all duration-300 shadow-lg flex flex-col items-center justify-between text-center select-none relative overflow-hidden ${
                  isFlipped
                    ? 'bg-[#F4FAFB] border-cyan-400'
                    : 'bg-white border-cyan-200 hover:border-cyan-400'
                }`}
              >
                {/* Top Nubian Accent Stripe */}
                <div className="absolute top-0 left-0 right-0 h-1.5 nubian-stripe-accent" />

                <div className="w-full flex items-center justify-between text-xs text-slate-400 font-bold pt-1">
                  <span>{isFlipped ? 'المعنى بالعربية' : 'الوجه: نوبي'}</span>
                  <span className="text-[10px] bg-cyan-100/70 text-cyan-900 px-2.5 py-0.5 rounded-full font-black">
                    انقر للقلب ↺
                  </span>
                </div>

                {/* Card Content */}
                <div className="my-auto py-6">
                  {!isFlipped ? (
                    <div className="space-y-3">
                      <div className="text-4xl sm:text-5xl font-mono font-black text-slate-900 tracking-wide">
                        {currentCard.nubianScript}
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-[#0c3559]">
                        {currentCard.nubianArabic}
                      </div>
                      <div className="text-sm font-bold text-cyan-800 font-sans">
                        {currentCard.phonetic}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-2xl sm:text-3xl font-black text-slate-900">
                        {currentCard.arabicMeaning}
                      </div>
                      {currentCard.englishMeaning && (
                        <div className="text-sm font-semibold text-slate-500 font-sans">
                          {currentCard.englishMeaning}
                        </div>
                      )}
                      {currentCard.notes && (
                        <div className="text-xs text-cyan-900 bg-cyan-100/60 p-2.5 rounded-xl mt-2 max-w-sm font-medium border border-cyan-200">
                          💡 {currentCard.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Pronounce Action */}
                <div className="w-full flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioManager.playClickTone();
                      audioManager.speak(currentCard.nubianArabic, currentCard.phonetic);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-950 text-xs font-black transition-all border border-cyan-300 shadow-2xs"
                  >
                    <Volume2 className="w-4 h-4 text-cyan-700" />
                    <span>استمع للنطق</span>
                  </button>
                </div>
              </div>

              {/* Learning Controls */}
              <div className="flex items-center gap-3 mt-6 w-full max-w-lg">
                <button
                  id="card-hard-btn"
                  onClick={() => handleNextCard(false)}
                  className="flex-1 py-3 px-4 rounded-2xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-sm font-black transition-all active:scale-95"
                >
                  أحتاج مراجعتها ❌
                </button>
                <button
                  id="card-easy-btn"
                  onClick={() => handleNextCard(true)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white text-sm font-black shadow-md transition-all active:scale-95 border border-cyan-500"
                >
                  أعرفها جيداً ✨
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border-2 border-cyan-200 shadow-md">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-2" />
              <h3 className="text-lg font-black text-slate-900">أحسنت! أنهيت مجموعة البطاقات</h3>
              <p className="text-sm text-slate-500 mt-1 mb-4 font-medium">
                أتقنت {knownCount} كلمة من أصل {flashcardDeck.length}.
              </p>
              <button
                onClick={shuffleFlashcards}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-black text-sm shadow-sm"
              >
                جولة جديدة
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: INTERACTIVE QUIZ */}
      {activeGame === 'quiz' && (
        <div className="space-y-6">
          {!isQuizFinished && currentQuiz ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cyan-100 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 nubian-stripe-accent" />

              {/* Quiz Header & Score */}
              <div className="flex items-center justify-between pb-4 border-b border-cyan-100 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-900 font-black flex items-center justify-center text-xs">
                    {quizIndex + 1}/{quizList.length}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-slate-800">
                    اختبر معلوماتك النوبية
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-bold">الدرجة:</span>
                  <span className="px-3 py-1 rounded-xl bg-cyan-50 text-cyan-950 font-black text-sm border border-cyan-200">
                    {quizScore} نقطة
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {currentQuiz.question}
                </h3>
                {currentQuiz.nubianWord && (
                  <div className="mt-2.5 flex items-center gap-3">
                    <span className="text-2xl font-black font-mono text-[#0c3559] bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200">
                      {currentQuiz.nubianWord}
                    </span>
                    <button
                      onClick={() => {
                        audioManager.playClickTone();
                        audioManager.speak(currentQuiz.nubianWord || '', currentQuiz.phonetic);
                      }}
                      className="p-2 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-950 transition-colors border border-cyan-200"
                      title="استمع للكلمة"
                    >
                      <Volume2 className="w-4 h-4 text-cyan-700" />
                    </button>
                  </div>
                )}
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuiz.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = isAnswerSubmitted && optIdx === currentQuiz.correctIndex;
                  const isWrong = isAnswerSubmitted && isSelected && optIdx !== currentQuiz.correctIndex;

                  return (
                    <button
                      key={optIdx}
                      id={`quiz-opt-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border text-right font-black text-sm transition-all flex items-center justify-between gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                          : isWrong
                          ? 'bg-rose-50 border-rose-500 text-rose-950'
                          : isSelected
                          ? 'bg-cyan-100 border-cyan-500 text-cyan-950'
                          : 'bg-[#F9FCFC] hover:bg-cyan-50 border-cyan-100 text-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                      {isWrong && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown after answering) */}
              {isAnswerSubmitted && (
                <div className="p-4 bg-cyan-50/80 rounded-2xl border border-cyan-200 text-xs sm:text-sm text-slate-800 space-y-1 font-medium">
                  <strong className="text-cyan-950 block font-black">
                    {selectedOption === currentQuiz.correctIndex ? '🎉 إجابة ممتازة وصحيحة!' : '💡 معلومة توضيحية:'}
                  </strong>
                  <p>{currentQuiz.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-cyan-100 flex items-center justify-between">
                <button
                  onClick={handleGenerateAIQuiz}
                  disabled={generatingQuiz}
                  className="flex items-center gap-1.5 text-xs text-cyan-800 hover:text-cyan-950 font-black"
                  title="توليد أسئلة جديدة بواسطة الذكاء الاصطناعي"
                >
                  {generatingQuiz ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{generatingQuiz ? 'جاري التوليد...' : 'توليد أسئلة ذكية جديدة'}</span>
                </button>

                {!isAnswerSubmitted ? (
                  <button
                    id="submit-quiz-ans-btn"
                    onClick={handleSubmitQuizAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-40 text-white text-sm font-black rounded-xl shadow-xs transition-all border border-cyan-500"
                  >
                    تأكيد الإجابة
                  </button>
                ) : (
                  <button
                    id="next-quiz-q-btn"
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0a3254] hover:bg-[#07243c] text-amber-300 text-sm font-black rounded-xl shadow-xs transition-all border border-cyan-700"
                  >
                    <span>{quizIndex < quizList.length - 1 ? 'السؤال التالي' : 'عرض النتيجة النهائية'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 sm:p-10 text-center border-2 border-cyan-200 shadow-md space-y-4">
              <div className="w-20 h-20 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center mx-auto shadow-inner border border-cyan-200">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>

              <h3 className="text-2xl font-black text-slate-900">
                مبروك! أكملت الاختبار النوبي بنجاح
              </h3>

              <p className="text-sm text-slate-600 max-w-md mx-auto font-medium">
                حصلت على <strong className="text-cyan-900 text-lg">{quizScore}</strong> من أصل {quizList.length} إجابات صحيحة!
              </p>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-black rounded-xl text-sm shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة الاختبار</span>
                </button>

                <button
                  onClick={handleGenerateAIQuiz}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0a3254] hover:bg-[#07243c] text-amber-300 font-black rounded-xl text-sm border border-cyan-700 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>توليد اختبار ذكي جديد</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: MATCHING GAME */}
      {activeGame === 'match' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-cyan-100 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 nubian-stripe-accent" />

          <div className="flex items-center justify-between pb-4 border-b border-cyan-100 pt-1">
            <div>
              <h3 className="text-base font-black text-slate-900">لعبة مطابقة الكلمات النوبية</h3>
              <p className="text-xs text-slate-500 font-medium">
                اختر الكلمة النوبية ثم انقر على معناها العربي المناسب.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-cyan-900 bg-cyan-100 px-3 py-1 rounded-xl">
                النقاط: {matchScore}
              </span>
              <button
                onClick={initMatchGame}
                className="p-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-xs border border-cyan-200"
                title="جولة جديدة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Column 1: Nubian Words */}
            <div className="space-y-2.5">
              <div className="text-xs font-black text-cyan-950 mb-1">الكلمات النوبية:</div>
              {matchPairs.map((pair) => {
                const isMatched = matchedIds.includes(pair.id);
                const isSelected = selectedNubian === pair.id;

                return (
                  <button
                    key={`nubian-${pair.id}`}
                    disabled={isMatched}
                    onClick={() => handleSelectNubianWord(pair.id)}
                    className={`w-full p-3.5 rounded-2xl border text-center font-black text-base transition-all ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-50 line-through'
                        : isSelected
                        ? 'bg-gradient-to-r from-cyan-600 to-teal-600 border-cyan-700 text-white shadow-md scale-102'
                        : 'bg-[#F8FCFC] hover:bg-cyan-50 border-cyan-100 text-slate-800'
                    }`}
                  >
                    {pair.nubian}
                  </button>
                );
              })}
            </div>

            {/* Column 2: Arabic Meanings (Shuffled) */}
            <div className="space-y-2.5">
              <div className="text-xs font-black text-cyan-950 mb-1">المعاني بالعربية:</div>
              {[...matchPairs]
                .sort((a, b) => a.arabic.localeCompare(b.arabic))
                .map((pair) => {
                  const isMatched = matchedIds.includes(pair.id);
                  const isSelected = selectedArabic === pair.id;

                  return (
                    <button
                      key={`arabic-${pair.id}`}
                      disabled={isMatched}
                      onClick={() => handleSelectArabicMeaning(pair.id)}
                      className={`w-full p-3.5 rounded-2xl border text-center font-black text-sm transition-all ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-50 line-through'
                          : isSelected
                          ? 'bg-gradient-to-r from-cyan-600 to-teal-600 border-cyan-700 text-white shadow-md scale-102'
                          : 'bg-[#F8FCFC] hover:bg-cyan-50 border-cyan-100 text-slate-800'
                      }`}
                    >
                      {pair.arabic}
                    </button>
                  );
                })}
            </div>
          </div>

          {matchedIds.length === matchPairs.length && matchPairs.length > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
              <p className="text-emerald-900 font-black text-sm">
                🎉 رائع جداً! طابقت جميع الكلمات الـ 6 بنجاح!
              </p>
              <button
                onClick={initMatchGame}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-sm"
              >
                جولة كلمات أخرى
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
