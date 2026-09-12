import React from 'react';
import { BookOpen, Scroll, Languages, GraduationCap, Gamepad2, MessageSquare, Volume2, Sparkles } from 'lucide-react';
import { audioManager } from '../utils/audio';
import { NubianOpposingTriangles } from './NubianOpposingTriangles';

export type ActiveTab = 'dictionary' | 'proverbs' | 'translator' | 'lessons' | 'practice' | 'tutor' | 'kids';

interface NubianHeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  savedWordsCount: number;
  onOpenKeyboard: () => void;
}

export const NubianHeader: React.FC<NubianHeaderProps> = ({
  activeTab,
  onSelectTab,
  savedWordsCount,
  onOpenKeyboard,
}) => {
  const tabs = [
    { id: 'dictionary' as ActiveTab, label: 'قاموس النوبة', icon: BookOpen, badge: null },
    { id: 'kids' as ActiveTab, label: 'أطفال النوبة 🐾', icon: Sparkles, badge: 'رسومات وألعاب' },
    { id: 'proverbs' as ActiveTab, label: 'الأمثال والتعابير', icon: Scroll, badge: 'تراث أصيل' },
    { id: 'translator' as ActiveTab, label: 'المترجم الذكي', icon: Languages, badge: 'AI' },
    { id: 'lessons' as ActiveTab, label: 'الدروس والأبجدية', icon: GraduationCap, badge: '6 دروس' },
    { id: 'practice' as ActiveTab, label: 'الألعاب والاختبارات', icon: Gamepad2, badge: 'تفاعلي' },
    { id: 'tutor' as ActiveTab, label: 'مُعلّمي النوبي', icon: MessageSquare, badge: 'ذكي' },
  ];

  const handleTestAudio = () => {
    audioManager.playSuccessTone();
    audioManager.speak('مِسْكاقْرو أَوْنَبَّا إِيدّا', 'Meskagro onba');
  };

  return (
    <header className="relative bg-gradient-to-b from-[#082b49] via-[#0b3c66] to-[#0e4b7d] text-white shadow-xl border-b-4 border-amber-400">
      {/* Authentic Aswan Nubian Interlocking Opposing Triangles Frieze matching user image */}
      <NubianOpposingTriangles height={16} />
      <div className="w-full h-1.5 nubian-zigzag-border opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
        {/* Top Brand & Actions Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Nubian Vaulted Arch Motif Badge with Vibrant Turquoise & Sun Yellow */}
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-700 text-stone-950 flex items-center justify-center shadow-lg border-2 border-amber-300 shrink-0 transform -rotate-1 group hover:rotate-0 transition-transform">
              {/* Traditional Nubian triangle top badge */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-amber-400 rounded-t-full" />
              <span className="text-2xl font-black font-mono text-white drop-shadow-md">ⲙⲉ</span>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm flex items-center gap-2">
                  <span>قاموس النوبة المصري</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-xs border border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  <span>تراث أسوان الخالد</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-100/95 mt-0.5 flex items-center gap-2 font-medium">
                <span>لهجات نوبة مصر: الفاديجا (النوبين) والكَنزي (الماتوكي)</span>
                <span className="text-amber-300 font-black">•</span>
                <span className="font-mono text-xs text-amber-200 tracking-wider">ⲛⲟⲩⲃⲓⲓⲛ ⲗⲟⲅⲟⲥ</span>
              </p>
            </div>
          </div>

          {/* Quick Utility Tools */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="test-audio-greeting-btn"
              onClick={handleTestAudio}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 active:scale-95 text-xs font-bold text-cyan-100 border border-cyan-300/30 transition-all shadow-xs backdrop-blur-xs"
              title="استمع إلى تحية نوبية بصوت مسموع"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>نطق: مِسْكاقْرو</span>
            </button>

            <button
              id="open-keyboard-header-btn"
              onClick={onOpenKeyboard}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 active:scale-95 text-xs font-black transition-all shadow-md border border-amber-200"
              title="فتح لوحة المفاتيح النوبية لكتابة الحروف"
            >
              <span className="font-mono text-sm">ⲁⲃⲅ</span>
              <span>لوحة الحروف</span>
            </button>

            {savedWordsCount > 0 && (
              <div className="px-3.5 py-2 rounded-xl bg-teal-950/60 border border-teal-400/30 text-xs font-bold text-teal-200 shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>المحفوظات: {savedWordsCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="mt-5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => {
                  audioManager.playClickTone();
                  onSelectTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all select-none relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-lg border-2 border-white transform -translate-y-0.5'
                    : 'bg-white/10 hover:bg-white/18 text-cyan-50 hover:text-white border border-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-300'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-black ${
                      isActive
                        ? 'bg-slate-950 text-amber-300'
                        : 'bg-amber-400/30 text-amber-200 border border-amber-400/40'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
                {/* Active Nubian Triangle Indicator */}
                {isActive && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-amber-400 rounded-t-sm" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Decorative Bottom Opposing Triangles Ribbon matching Aswan Nubian walls */}
      <NubianOpposingTriangles height={10} />
    </header>
  );
};
