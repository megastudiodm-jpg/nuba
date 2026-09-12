import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Translation Endpoint
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang = "ar", targetLang = "nubian", dialect = "both" } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      res.status(400).json({ error: "النص المطلوب ترجمته فارغ" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback translation response if no API key is set yet
      res.json({
        translation: text,
        phonetic: "يرجى إضافة مفتاح GEMINI_API_KEY في لوحة الإعدادات للترجمة الحية المتقدمة",
        nubianScript: "",
        dialect: dialect === "kenzi" ? "الكنزي (الماتوكي)" : dialect === "fadicha" ? "الفاديجا (النوبين)" : "فاديجا / كنزي",
        notes: "تم استخدام النظام المحلي. لتفعيل المترجم الذكي المدعوم بالذكاء الاصطناعي، يرجى تفعيل مفتاح Gemini.",
        breakdown: [],
      });
      return;
    }

    const prompt = `أنت خبير لغوي وباحث متخصص في اللغات النوبية (النوبين / الفاديجا، والكَنزي / الماتوكي، والدنقلاوي / الأنداندي).
المطلوب منك ترجمة النص التالي بدقة وبأسلوب نوبي أصيل:

النص الأصلي: "${text.trim()}"
اللغة المصدر: ${sourceLang === "ar" ? "العربية" : sourceLang === "en" ? "الإنجليزية" : "النوبية"}
اللغة الهدف: ${targetLang === "nubian" ? "النوبية" : "العربية"}
اللهجة المفضلة: ${dialect === "fadicha" ? "الفاديجا (نوبين - Nobiin)" : dialect === "kenzi" ? "الكنزي (ماتوكي - Kenzi/Mattokki)" : "كلتا اللهجتين النوبيتين (فاديجا وكنزي)"}

أجب بدقة بصيغة JSON فقط متطابقة مع هذا المخطط:
{
  "translation": "الترجمة بالحروف العربية الدارجة المستخدمة عند النوبيين (مع التشكيل لضبط النطق)",
  "nubianScript": "الترجمة بالأبجدية النوبية القديمة الصحيحة (حروف كوبتية نوبية مثل ⲁ, ⲃ, ⲅ, ⲇ, ⲉ, ⲓ, ⲕ, ⲗ, ⲙ, ⲛ, ⲟ, ⲡ, ⲣ, ⲥ, ⲧ, ⲱ, ϣ, ϩ, ϫ, ϭ, ϯ, ⳝ, ⳟ, ⳡ, ⳣ)",
  "phonetic": "كتابة النطق بالإنجليزية الصوتية (Latin transcription)",
  "dialect": "اسم اللهجة (فاديجا أو كنزي أو كلاهما)",
  "dialectComparison": "إذا كان هناك اختلاف بين لهجة الفاديجا والكنزي اذكر الصيغتين هنا باختصار",
  "notes": "شرح لغوي أو سياق ثقافي نوبي لطيف للاستخدام",
  "breakdown": [
    {"word": "الكلمة بالنوبية", "meaning": "معناها بالعربية", "role": "اسم/فعل/ضمير/صفة"}
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || "{}";
    const parsed = JSON.parse(responseText);
    res.json(parsed);
  } catch (error: any) {
    console.error("Translation API error:", error);
    res.status(500).json({
      error: "حدث خطأ أثناء الترجمة. يرجى المحاولة مرة أخرى.",
      details: error.message,
    });
  }
});

// Interactive AI Nubian Tutor Chat
app.post("/api/tutor/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "الرسالة فارغة" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        reply: "مسكاقرو! أنا معلمك للغة النوبية. يرجى تفعيل مفتاح GEMINI_API_KEY للتحدث المباشر معي عبر الذكاء الاصطناعي. يمكنك تصفح الدروس والقاموس التفاعلي المدمج مجاناً!",
        suggestedQuestions: [
          "كيف أقول مرحباً بالنوبية؟",
          "ما هو الفرق بين لغة الفاديجا والكنزي؟",
          "علمني الأرقام النوبية من 1 إلى 5",
        ],
      });
      return;
    }

    const systemInstruction = `أنت "عمّنا صالح" أو "المعلم النوبي" (The Nubian Tutor) - معلم لغة نوبية ودود ومضياف وفخور بتراث بلاد النوبة العريق (بلاد الذهب وتاريخ كوش وحضارة كرمة والنيل العظيم).
- تتحدث باللغة العربية بأسلوب نوبي دافئ ومحبب (تستخدم أحياناً تحيات مثل "مسكاقرو" Meskagro أو "مسكاجلو" Meskajlo أو "أونبا" Onba).
- تجيد اللهجتين الرئيسيتين:
  1. لهجة الفاديجا (النوبين / Nobiin)
  2. لهجة الكنزي (الماتوكي / Kenzi-Mattokki)
  3. والدنقلاوي / الأنداندي عند الحاجة.
- عندما يسألك المتعلم عن كلمة أو عبارة:
  1. وضح نطقها بالعربية مع التشكيل.
  2. اكتبها بالأبجدية النوبية القديمة إذا لزم.
  3. وضح الاختلاف إن وجد بين الفاديجا والكنزي.
  4. أعطِ مثالاً توضيحياً بسيطاً وسهل التكرار.
- شجع المتعلم بحرارة عندما يجيب أو يحاول التحدث بالنوبية.
- قدم نصائح ثقافية نوبية ممتعة (عن البيوت النوبية، كرم الضيافة، النيل، الزخارف، الأغاني التراثية).
- اختم دائماً باقتراح سؤالين أو تمرين خفيف يواصل به التعلم.`;

    const formattedContents = [
      ...conversationHistory.slice(-8).map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || "مسكاقرو! عذراً، لم أستطع تكوين الرد.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Tutor API error:", error);
    res.status(500).json({
      error: "تعذر الاتصال بالمعلم النوبي في الوقت الحالي.",
      details: error.message,
    });
  }
});

// Quiz Generator Endpoint
app.post("/api/quiz/generate", async (req, res) => {
  try {
    const { category = "عام", difficulty = "beginner" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      res.status(503).json({ error: "Gemini API key not configured" });
      return;
    }

    const prompt = `أنشئ 3 أسئلة تدريبية ممتعة لاختبار تعلم اللغة النوبية في مجال "${category}" ومستوى "${difficulty}".
لكل سؤال:
- السؤال باللغة العربية
- 4 خيارات
- رقم الخيار الصحيح (0, 1, 2, 3)
- شرح قصير مشجع يوضح معنى الكلمة واللهجة (فاديجا أو كنزي)

أجب بصيغة JSON فقط:
{
  "questions": [
    {
      "id": 1,
      "question": "ما معنى كلمة 'إيسي' (Eesi) في النوبية؟",
      "options": ["ماء", "شمس", "نخيل", "بيت"],
      "correctIndex": 0,
      "explanation": "إيسي تعني الماء أو النهر في النوبية، وهي كلمة أساسية مرتبطة بحياة النوبيين حول النيل."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{"questions":[]}');
    res.json(parsed);
  } catch (error: any) {
    console.error("Quiz generate error:", error);
    res.status(500).json({ error: "فشل توليد الاختبار" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nubian Language App running on port ${PORT}`);
  });
}

startServer();
