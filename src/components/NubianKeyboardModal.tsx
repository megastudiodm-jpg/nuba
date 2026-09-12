import React from 'react';
import { X, Delete, Copy, Check } from 'lucide-react';
import { NUBIAN_ALPHABET } from '../data/nubianData';
import { audioManager } from '../utils/audio';

interface NubianKeyboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertChar: (char: string) => void;
  currentText: string;
  onClearText?: () => void;
}

export const NubianKeyboardModal: React.FC<NubianKeyboardModalProps> = ({
  isOpen,
  onClose,
  onInsertChar,
  currentText,
  onClearText,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCharClick = (char: string, name: string) => {
    audioManager.playClickTone();
    onInsertChar(char);
  };

  const handleCopy = () => {
    if (currentText) {
      navigator.clipboard.writeText(currentText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="nubian-keyboard-card"
        className="w-full max-w-2xl bg-white border-2 border-cyan-300 rounded-3xl shadow-2xl overflow-hidden text-slate-800 relative"
      >
        {/* Header with Deep Nile Blue, Turquoise, and Nubian House Frieze */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#072d4c] via-[#0a3f6a] to-[#0d558d] text-white relative">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">𓉐</span>
            <div>
              <h3 className="text-base font-black">لوحة المفاتيح النوبية</h3>
              <p className="text-xs text-cyan-200 font-medium">الأبجدية النوبية التراثية (نوبة مصر)</p>
            </div>
          </div>
          <button
            id="close-keyboard-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Decorative Strip */}
        <div className="w-full h-1 nubian-stripe-accent" />

        {/* Live Input Preview */}
        <div className="p-4 bg-[#F4FAFB] border-b border-cyan-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-bold">
            <span>النص المكتوب:</span>
            <div className="flex items-center gap-2">
              {currentText && onClearText && (
                <button
                  id="clear-keyboard-text"
                  onClick={onClearText}
                  className="text-rose-600 hover:text-rose-700 flex items-center gap-1 text-xs font-black"
                >
                  <Delete className="w-3.5 h-3.5" /> مسح
                </button>
              )}
              {currentText && (
                <button
                  id="copy-keyboard-text"
                  onClick={handleCopy}
                  className="text-cyan-800 hover:text-cyan-950 flex items-center gap-1 text-xs font-black"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'تم النسخ' : 'نسخ'}
                </button>
              )}
            </div>
          </div>
          <div className="min-h-[44px] p-2.5 bg-white border-2 border-cyan-200 rounded-2xl text-slate-900 font-mono text-xl tracking-wider select-all break-all flex items-center shadow-inner">
            {currentText || <span className="text-slate-400 text-sm font-sans font-medium">انقر على أي حرف نوبي لإضافته هنا...</span>}
          </div>
        </div>

        {/* Special Nubian Characters Section */}
        <div className="px-4 pt-3 pb-2.5 bg-cyan-50/80 border-b border-cyan-100">
          <div className="text-xs font-black text-cyan-950 mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
            حروف صوتية نوبية مميزة وخاصة:
          </div>
          <div className="flex flex-wrap gap-2">
            {NUBIAN_ALPHABET.filter(l => l.isSpecialNubian).map(letter => (
              <button
                key={letter.char}
                id={`special-key-${letter.char}`}
                onClick={() => handleCharClick(letter.char, letter.nameArabic)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl shadow-xs hover:from-cyan-700 hover:to-teal-700 active:scale-95 transition-all text-base font-black border border-cyan-500"
                title={`${letter.nameArabic} - صوت ${letter.arabicSound}`}
              >
                <span className="text-xl font-mono">{letter.char}</span>
                <span className="text-xs font-medium opacity-95">{letter.nameArabic}</span>
              </button>
            ))}
          </div>
        </div>

        {/* All Alphabet Grid */}
        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
            {NUBIAN_ALPHABET.map(letter => (
              <button
                key={letter.char}
                id={`key-${letter.char}`}
                onClick={() => handleCharClick(letter.char, letter.nameArabic)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  letter.isSpecialNubian
                    ? 'bg-cyan-100 border-cyan-400 font-bold hover:bg-cyan-200 text-cyan-950'
                    : 'bg-[#F9FCFC] border-cyan-100 hover:border-cyan-400 hover:bg-cyan-50 active:scale-95 text-slate-800'
                }`}
                title={`${letter.nameArabic} (${letter.arabicSound})`}
              >
                <span className="text-2xl font-mono leading-none mb-1 font-black">{letter.char}</span>
                <span className="text-[10px] text-slate-500 truncate w-full text-center font-bold">{letter.nameArabic.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Space & Action Bar */}
        <div className="p-3 bg-cyan-50/70 border-t border-cyan-100 flex items-center justify-between gap-3">
          <button
            id="key-space"
            onClick={() => onInsertChar(' ')}
            className="flex-1 py-2.5 bg-white border border-cyan-200 hover:bg-cyan-50 active:scale-98 rounded-xl font-bold text-slate-700 shadow-2xs text-sm"
          >
            مسافة (Space)
          </button>
          <button
            id="key-done"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0a3254] hover:bg-[#07243c] text-white font-black rounded-xl shadow-xs text-sm transition-all"
          >
            تم وإغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
