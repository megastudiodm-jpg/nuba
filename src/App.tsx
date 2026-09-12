/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { NubianHeader, ActiveTab } from './components/NubianHeader';
import { DictionaryView } from './components/DictionaryView';
import { ProverbsView } from './components/ProverbsView';
import { TranslatorView } from './components/TranslatorView';
import { LessonsView } from './components/LessonsView';
import { PracticeView } from './components/PracticeView';
import { TutorChatView } from './components/TutorChatView';
import { KidsView } from './components/KidsView';
import { NubianKeyboardModal } from './components/NubianKeyboardModal';
import { NubianOpposingTriangles } from './components/NubianOpposingTriangles';
import { DICTIONARY_ENTRIES } from './data/nubianData';
import { audioManager } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dictionary');
  const [savedWordIds, setSavedWordIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nubian_saved_words');
      return saved ? JSON.parse(saved) : ['w-1', 'w-8', 'n-1', 'h-1'];
    } catch {
      return ['w-1', 'w-8', 'n-1', 'h-1'];
    }
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nubian_completed_lessons');
      return saved ? JSON.parse(saved) : ['lesson-1'];
    } catch {
      return ['lesson-1'];
    }
  });

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);
  const [keyboardBuffer, setKeyboardBuffer] = useState<string>('');

  // Persist saved words to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nubian_saved_words', JSON.stringify(savedWordIds));
    } catch {}
  }, [savedWordIds]);

  // Persist completed lessons
  useEffect(() => {
    try {
      localStorage.setItem('nubian_completed_lessons', JSON.stringify(completedLessonIds));
    } catch {}
  }, [completedLessonIds]);

  const handleToggleSave = (wordId: string) => {
    audioManager.playClickTone();
    setSavedWordIds((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]
    );
  };

  const handleToggleLessonCompleted = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleInsertKeyboardChar = (char: string) => {
    setKeyboardBuffer((prev) => prev + char);
    if (activeTab === 'dictionary') {
      setSearchTerm((prev) => prev + char);
    }
  };

  return (
    <>
      <Analytics />
      <div className="min-h-screen flex flex-col bg-[#F5FBFB] text-slate-800 font-['Cairo',sans-serif] relative selection:bg-cyan-200 selection:text-cyan-950">
        {/* Top Heritage Header */}
        <NubianHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          savedWordsCount={savedWordIds.length}
          onOpenKeyboard={() => setIsKeyboardOpen(true)}
        />

      {/* Main App Canvas with Sunlit Whitewashed Plaster Texture */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dictionary' && (
          <DictionaryView
            entries={DICTIONARY_ENTRIES}
            savedWordIds={savedWordIds}
            onToggleSave={handleToggleSave}
            onOpenKeyboard={() => setIsKeyboardOpen(true)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {activeTab === 'kids' && <KidsView />}

        {activeTab === 'proverbs' && (
          <ProverbsView onOpenKeyboard={() => setIsKeyboardOpen(true)} />
        )}

        {activeTab === 'translator' && (
          <TranslatorView onOpenKeyboard={() => setIsKeyboardOpen(true)} />
        )}

        {activeTab === 'lessons' && (
          <LessonsView
            completedLessonIds={completedLessonIds}
            onToggleLessonCompleted={handleToggleLessonCompleted}
          />
        )}

        {activeTab === 'practice' && <PracticeView />}

        {activeTab === 'tutor' && (
          <TutorChatView onOpenKeyboard={() => setIsKeyboardOpen(true)} />
        )}
      </main>

      {/* Virtual Nubian Keyboard Modal */}
      <NubianKeyboardModal
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
        onInsertChar={handleInsertKeyboardChar}
        currentText={keyboardBuffer}
        onClearText={() => setKeyboardBuffer('')}
      />

      {/* Opposing Triangles Band Leading to Footer */}
      <NubianOpposingTriangles height={16} />

      {/* Authentic Nubian Village Cultural Heritage Footer */}
      <footer className="mt-auto border-t-2 border-cyan-200/70 bg-gradient-to-b from-[#0a2740] to-[#061c30] text-cyan-100 text-xs shadow-2xl relative overflow-hidden">
        {/* Colorful Nubian House Wall Ribbon */}
        <div className="w-full h-2 nubian-stripe-accent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-right pb-6 border-b border-cyan-900/60">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5 font-bold text-white text-base mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center text-xs font-mono font-black shadow-xs">
                  ⲛ
                </div>
                <span className="text-cyan-300 font-extrabold text-lg">قاموس النوبة المصري</span>
                <span className="text-amber-400">•</span>
                <span className="font-mono text-xs text-amber-300 tracking-wider">ⲛⲟⲩⲃⲓⲓⲛ ⲗⲟⲅⲟⲥ</span>
              </div>
              <p className="text-cyan-200/80 max-w-lg text-xs leading-relaxed">
                قاموس ومترجم ومعلم تفاعلي للنوبة المصرية، يوثّق مفردات وأمثال وتراث اللغة النوبية بلهجتيها (الفاديجا والكنزي) مع النطق الصوتي والأبجدية النوبية الأصيلة المستوحاة من بيوت أسوان وقراها العريقة.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 font-medium">
              <span className="bg-gradient-to-r from-amber-400/20 to-amber-500/10 text-amber-300 px-4 py-2 rounded-2xl text-xs font-black border border-amber-400/40 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>«مِسْكاقْرو وأَوْنَبَّا بك في بلاد النوبة المصرية»</span>
              </span>
              <span className="text-xs text-cyan-300/80 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/40">
                لهجات نوبة مصر (الفاديجا والكَنزي)
              </span>
            </div>
          </div>

          {/* Very bottom line: تطوير عمر ماجد */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center text-xs">
            <div className="flex items-center gap-2 font-medium text-cyan-300/70">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>قاموس النوبة المصري — جميع الحقوق محفوظة لتراث النوبة المصرية في أسوان</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/15 via-teal-400/15 to-cyan-400/15 border border-amber-400/50 text-amber-300 font-black text-xs shadow-sm hover:border-amber-300 transition-colors">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>تطوير عمر ماجد</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
