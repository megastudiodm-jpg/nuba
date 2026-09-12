import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Sparkles, Loader2, Keyboard, User, Bot } from 'lucide-react';
import { ChatMessage } from '../types/nubian';
import { audioManager } from '../utils/audio';

interface TutorChatViewProps {
  onOpenKeyboard: () => void;
}

const PRESET_PROMPTS = [
  'مسكاقرو! كيف أحيي شخصاً بالنوبية في الصباح والمساء؟',
  'علمني الأرقام النوبية من 1 إلى 5 مع نطقها',
  'ما هو الفرق اللغوي بين الفاديجا والكنزي؟',
  'ما قصة بيوت النوبة الملونة وزخارفها الهندسية في أسوان؟',
  'كيف أقول لأمي "أنا أحبك" بالنوبية؟',
  'ما هي أشهر الأمثال الشعبية في النوبة؟',
];

export const TutorChatView: React.FC<TutorChatViewProps> = ({ onOpenKeyboard }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: 'مِسْكاقْرو وأَوْنَبَّا بك يا ولدي في ساحة التراث النوبي المصري! 🌿\nأنا "عمّنا صالح" مُعلّمك للغة النوبية (الفاديجا والكَنزي). يسعدني أن أصحبك في هذه الرحلة الممتعة لنطق الكلمات، وفهم المعاني، واكتشاف أسرار بلاد الذهب وجزر النيل في أسوان.\n\nعمّ تبحث اليوم أو ما العبارة التي تود أن نتعلمها معاً؟',
      timestamp: 'الآن',
    },
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || loading) return;

    audioManager.playClickTone();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });

      if (!res.ok) throw new Error('فشل الرد من المعلم النوبي');

      const data = await res.json();
      const tutorReply = data.reply || 'مسكاقرو! سعيد بمحاولتك، استمر في التعلم!';

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: tutorReply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
      audioManager.playSuccessTone();
    } catch {
      // Fallback warm response
      let fallbackText = `مسكاقرو! بالنسبة لـ "${query}" في النوبية:\nتذكر أن تحية الصباح والمساء المشهورة هي "مسكاقرو" (Meskagro) في الفاديجا، و"مسكاجلو" (Meskajlo) في الكنزي، والماء هو "إيسي" (Eesi). يمكنك مراجعة القاموس المدمج أيضاً لمعرفة المزيد!`;

      if (query.includes('كادول') || query.includes('kadoli') || query.includes('احبك') || query.includes('بحبك')) {
        fallbackText = `💖 «آي كادولي» (Ay Kadoli) هي أشهر وأعذب عبارة حب في التراث النوبي المصري!\n\n• معناها: "أنا أحبك" أو "بحبك / أهواك".\n• تركيبها: «آي» (Aay) تعني "أنا"، و«كادولي» (Kadoli) تعني "أحبك / أريدك / أهواك".\n• شهرتها: تغنى بها الكينج محمد منير وفنانو النوبة وأصبحت أشهر كلمة حب نوبية في مصر والعالم العربي. تجدها الآن في قاموس النوبة والمترجم الصوتي!`;
      }

      const fallbackMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handlePronounceMessage = (text: string) => {
    const cleanText = text.replace(/[\n\r]+/g, ' ').slice(0, 120);
    audioManager.playClickTone();
    audioManager.speak(cleanText);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header Profile with Authentic Aswan Nubian House Visual Identity */}
      <div className="bg-gradient-to-r from-[#072d4c] via-[#0a3f6a] to-[#0d558d] rounded-3xl p-5 text-white shadow-xl border-2 border-cyan-400/80 flex items-center justify-between gap-4 relative overflow-hidden">
        {/* Top Decorative Geometric Band */}
        <div className="absolute top-0 left-0 right-0 h-1.5 nubian-stripe-accent" />

        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-amber-300 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-md border-2 border-amber-300">
            𓉐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black">عمّنا صالح - المُعلّم النوبي</h2>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-xs text-cyan-100 font-medium">
              رفيقك الذكي لتعلم نطق وقواعد وثقافة نوبة مصر في أسوان
            </p>
          </div>
        </div>

        <button
          id="keyboard-btn-chat"
          onClick={onOpenKeyboard}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black text-amber-300 border border-white/20 transition-all flex items-center gap-1.5"
        >
          <Keyboard className="w-4 h-4" />
          <span className="hidden sm:inline">لوحة النوبية</span>
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-cyan-100 shadow-sm h-[480px] overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-[88%] sm:max-w-[80%] ${
                isTutor ? 'self-start' : 'self-end flex-row-reverse'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  isTutor ? 'bg-cyan-100 text-cyan-900 border border-cyan-200' : 'bg-[#082a47] text-amber-300'
                }`}
              >
                {isTutor ? <Bot className="w-4 h-4 text-cyan-800" /> : <User className="w-4 h-4 text-amber-300" />}
              </div>

              <div
                className={`p-4 rounded-2xl shadow-xs text-sm leading-relaxed ${
                  isTutor
                    ? 'bg-[#F4FAFB] text-slate-800 border-2 border-cyan-200/80 rounded-tr-none'
                    : 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tl-none border border-cyan-700 shadow-md font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div
                  className={`flex items-center justify-between gap-2 mt-2 pt-1.5 text-[10px] ${
                    isTutor ? 'text-slate-400 border-t border-cyan-100' : 'text-cyan-100 border-t border-cyan-500/60'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isTutor && (
                    <button
                      onClick={() => handlePronounceMessage(msg.text)}
                      className="hover:text-cyan-950 p-1 flex items-center gap-1 text-[11px] font-bold text-cyan-800 transition-colors"
                      title="استمع إلى الرد"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>استمع</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-cyan-800 text-xs self-start p-3 bg-cyan-50 rounded-2xl border border-cyan-200 font-bold">
            <Loader2 className="w-4 h-4 text-cyan-600 animate-spin" />
            <span>عمّنا صالح يكتب لك الآن...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions Quick Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[11px] font-black text-cyan-900 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> اقتراحات:
        </span>
        {PRESET_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            id={`preset-prompt-${i}`}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-cyan-50 border border-cyan-100 hover:border-cyan-300 text-xs font-bold text-slate-700 whitespace-nowrap transition-all shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-white rounded-2xl p-2.5 border-2 border-cyan-200/90 shadow-sm flex items-center gap-2">
        <input
          id="tutor-chat-input"
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="اسأل عمّنا صالح عن أي كلمة أو معنى أو قاعدة نوبية..."
          className="flex-1 px-3 py-2 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 font-medium"
        />

        <button
          id="send-chat-msg-btn"
          onClick={() => handleSendMessage()}
          disabled={!inputVal.trim() || loading}
          className="p-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-all active:scale-95 shrink-0 border border-cyan-500"
          title="إرسال"
        >
          <Send className="w-4 h-4 rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
};
