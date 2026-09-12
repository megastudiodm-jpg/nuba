import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { LESSONS, NUBIAN_ALPHABET } from '../data/nubianData';
import { NubianLetter, Lesson } from '../types/nubian';
import { audioManager } from '../utils/audio';

interface LessonsViewProps {
  completedLessonIds: string[];
  onToggleLessonCompleted: (lessonId: string) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  completedLessonIds,
  onToggleLessonCompleted,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'lessons' | 'alphabet'>('lessons');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [selectedLetter, setSelectedLetter] = useState<NubianLetter>(NUBIAN_ALPHABET[0]);
  const [filterSpecialLetters, setFilterSpecialLetters] = useState<boolean>(false);

  const activeLesson: Lesson = LESSONS[selectedLessonIndex];
  const isCurrentLessonDone = completedLessonIds.includes(activeLesson.id);

  const handlePronounce = (textArabic: string, textPhonetic?: string) => {
    audioManager.playClickTone();
    audioManager.speak(textArabic, textPhonetic);
  };

  const handleSelectLetter = (letter: NubianLetter) => {
    audioManager.playClickTone();
    setSelectedLetter(letter);
    audioManager.speak(letter.nameArabic, letter.ipa);
  };

  const displayedLetters = filterSpecialLetters
    ? NUBIAN_ALPHABET.filter((l) => l.isSpecialNubian)
    : NUBIAN_ALPHABET;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex items-center justify-center">
        <div className="bg-cyan-100/70 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner border border-cyan-200">
          <button
            id="tab-sub-lessons"
            onClick={() => setActiveSubTab('lessons')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'lessons'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm border border-cyan-700'
                : 'text-slate-700 hover:text-cyan-950'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>مسار الدروس ({LESSONS.length})</span>
          </button>

          <button
            id="tab-sub-alphabet"
            onClick={() => setActiveSubTab('alphabet')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeSubTab === 'alphabet'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm border border-cyan-700'
                : 'text-slate-700 hover:text-cyan-950'
            }`}
          >
            <span className="font-mono text-base">ⲁⲃⲅ</span>
            <span>الأبجدية النوبية ({NUBIAN_ALPHABET.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: STRUCTURED LESSONS */}
      {activeSubTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lessons Sidebar / List */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 border-2 border-cyan-100 shadow-sm space-y-2">
            <div className="px-2 py-1 mb-2 text-xs font-black text-cyan-950 uppercase tracking-wider flex items-center justify-between">
              <span>فهرس الدروس</span>
              <span className="text-cyan-800 font-bold">
                {completedLessonIds.length} / {LESSONS.length} مكتمل
              </span>
            </div>

            {LESSONS.map((lesson, idx) => {
              const isSelected = selectedLessonIndex === idx;
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  id={`lesson-item-${idx}`}
                  onClick={() => {
                    audioManager.playClickTone();
                    setSelectedLessonIndex(idx);
                  }}
                  className={`w-full text-right p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-cyan-50/90 border-cyan-500 shadow-xs text-cyan-950'
                      : 'bg-[#F8FCFC] hover:bg-cyan-50/50 border-cyan-100/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-600 to-teal-600 text-white shadow-xs'
                          : 'bg-cyan-100 text-cyan-900'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold leading-tight line-clamp-1">
                        {lesson.title}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">
                        المستوى: {lesson.level}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Reader Content */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border-2 border-cyan-100 shadow-sm space-y-6 relative overflow-hidden">
            {/* Top Aswan Nubian House Geometric Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 nubian-stripe-accent" />

            {/* Lesson Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-cyan-100 pt-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-0.5 rounded-full text-xs font-black bg-cyan-100 text-cyan-950 border border-cyan-200">
                    الدرس {selectedLessonIndex + 1} من {LESSONS.length}
                  </span>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                    المستوى: {activeLesson.level}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0c3559]">
                  {activeLesson.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
                  {activeLesson.subtitle}
                </p>
              </div>

              {/* Mark Completed Toggle */}
              <button
                id="toggle-lesson-done-btn"
                onClick={() => {
                  audioManager.playSuccessTone();
                  onToggleLessonCompleted(activeLesson.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black border transition-all ${
                  isCurrentLessonDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                    : 'bg-cyan-50/70 hover:bg-cyan-100 text-slate-700 border-cyan-200'
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isCurrentLessonDone ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{isCurrentLessonDone ? 'تم إنهاء الدرس' : 'تحديد كمكتمل'}</span>
              </button>
            </div>

            {/* Overview / Introduction */}
            <div className="p-4 bg-[#F5FAFA] rounded-2xl border border-cyan-200/80 text-sm text-slate-800 leading-relaxed font-medium">
              <strong className="text-cyan-950 block mb-1">💡 فكرة الدرس:</strong>
              {activeLesson.description}
            </div>

            {/* Lesson Sections */}
            <div className="space-y-6">
              {activeLesson.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
                    <span>{section.title}</span>
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {section.content}
                  </p>

                  {/* Section Examples Table/Cards */}
                  {section.examples && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      {section.examples.map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          className="p-4 bg-[#FAFDFD] rounded-2xl border border-cyan-100 hover:border-cyan-300 transition-all flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="text-lg font-black text-[#0c3559] font-mono">
                              {ex.nubian}
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              نطق: <span className="font-sans text-cyan-800 font-bold">{ex.phonetic}</span>
                            </div>
                            <div className="text-sm font-bold text-slate-800 mt-1">
                              {ex.arabic}
                            </div>
                            {ex.notes && (
                              <div className="text-[11px] text-cyan-800/80 mt-1 font-medium">
                                {ex.notes}
                              </div>
                            )}
                          </div>

                          <button
                            id={`listen-example-${sIdx}-${eIdx}`}
                            onClick={() => handlePronounce(ex.nubian, ex.phonetic)}
                            className="p-2.5 rounded-xl bg-cyan-100 hover:bg-cyan-200 text-cyan-950 transition-all active:scale-95 shrink-0 border border-cyan-200"
                            title="استمع إلى نطق الكلمة"
                          >
                            <Volume2 className="w-4 h-4 text-cyan-700" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination between lessons */}
            <div className="pt-6 border-t border-cyan-100 flex items-center justify-between">
              <button
                id="prev-lesson-btn"
                disabled={selectedLessonIndex === 0}
                onClick={() => {
                  audioManager.playClickTone();
                  setSelectedLessonIndex(selectedLessonIndex - 1);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-cyan-200 disabled:opacity-30 hover:bg-cyan-50 text-slate-700 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الدرس السابق</span>
              </button>

              <button
                id="next-lesson-btn"
                disabled={selectedLessonIndex === LESSONS.length - 1}
                onClick={() => {
                  audioManager.playClickTone();
                  setSelectedLessonIndex(selectedLessonIndex + 1);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-30 text-white shadow-sm transition-all"
              >
                <span>الدرس التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: NUBIAN ALPHABET EXPLORER */}
      {activeSubTab === 'alphabet' && (
        <div className="space-y-6">
          {/* Top Info & Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">الأبجدية النوبية التراثية</h3>
              <p className="text-xs text-slate-500 font-medium">
                انقر على أي حرف للاستماع إلى نطقه الصوتي وتفاصيل رسمه والكلمات الدالة عليه.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="filter-all-letters-btn"
                onClick={() => setFilterSpecialLetters(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  !filterSpecialLetters
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-xs'
                    : 'bg-cyan-50 text-slate-700 hover:bg-cyan-100 border border-cyan-100'
                }`}
              >
                جميع الحروف ({NUBIAN_ALPHABET.length})
              </button>
              <button
                id="filter-special-letters-btn"
                onClick={() => setFilterSpecialLetters(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                  filterSpecialLetters
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                الحروف النوبية الخاصة فقط (4)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Letters Grid */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 border-2 border-cyan-100 shadow-sm">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                {displayedLetters.map((letter) => {
                  const isSelected = selectedLetter.char === letter.char;
                  return (
                    <button
                      key={letter.char}
                      id={`letter-cell-${letter.char}`}
                      onClick={() => handleSelectLetter(letter)}
                      className={`p-3 rounded-2xl border transition-all active:scale-95 flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-gradient-to-br from-cyan-600 to-teal-600 border-cyan-700 text-white shadow-md'
                          : letter.isSpecialNubian
                          ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                          : 'bg-[#FAFDFD] border-cyan-100 text-slate-800 hover:bg-cyan-50'
                      }`}
                    >
                      <span className="text-2xl sm:text-3xl font-mono font-black leading-none mb-1">
                        {letter.char}
                      </span>
                      <span className={`text-[10px] truncate max-w-full font-bold ${isSelected ? 'text-cyan-100' : 'text-slate-500'}`}>
                        {letter.nameArabic.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Letter Spotlight Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border-2 border-cyan-300 shadow-md space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 nubian-stripe-accent" />

              <div className="flex items-center justify-between pb-4 border-b border-cyan-100 pt-1">
                <span className="text-xs font-black text-cyan-950 uppercase tracking-wider">
                  بطاقة الحرف النوبي
                </span>
                {selectedLetter.isSpecialNubian && (
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 border border-amber-300">
                    صوت نوبي فريد
                  </span>
                )}
              </div>

              {/* Big Letter Display */}
              <div className="flex items-center justify-center gap-6 py-4">
                <div className="text-center">
                  <div className="text-6xl font-black font-mono text-slate-900 tracking-wider">
                    {selectedLetter.char} {selectedLetter.charUpper}
                  </div>
                  <div className="text-sm font-black text-[#0c3559] mt-2">
                    {selectedLetter.nameArabic}
                  </div>
                </div>

                <button
                  id="speak-selected-letter-btn"
                  onClick={() => handlePronounce(selectedLetter.nameArabic, selectedLetter.ipa)}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 active:scale-90 text-white flex items-center justify-center shadow-lg transition-all border border-cyan-400"
                  title="استمع إلى نطق الحرف"
                >
                  <Volume2 className="w-7 h-7" />
                </button>
              </div>

              {/* Sound Details */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#F8FCFC] rounded-xl border border-cyan-100 flex items-center justify-between">
                  <span className="text-slate-500 font-bold">الصوت العربي المقابل:</span>
                  <span className="font-black text-slate-900 text-sm">{selectedLetter.arabicSound}</span>
                </div>

                <div className="p-3 bg-[#F8FCFC] rounded-xl border border-cyan-100 flex items-center justify-between">
                  <span className="text-slate-500 font-bold">الرمز الصوتي العالمي (IPA):</span>
                  <span className="font-mono font-black text-cyan-800 text-sm">{selectedLetter.ipa}</span>
                </div>

                <div className="p-3.5 bg-cyan-50/80 rounded-xl border border-cyan-200 space-y-1">
                  <div className="text-slate-500 font-bold">مثال على كلمة بالحرف:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-[#0c3559] font-mono">
                      {selectedLetter.exampleWord}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      معناها: {selectedLetter.exampleMeaning}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
