// Audio utility for Nubian pronunciation and interactive sound effects

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  slow?: boolean;
}

class AudioManager {
  private audioCtx: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voicesLoaded: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    this.cachedVoices = window.speechSynthesis.getVoices();
    this.voicesLoaded = this.cachedVoices.length > 0;
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Play pleasant chime on correct quiz answer or interaction
  public playSuccessTone(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  // Play gentle pop sound on letter click or button press
  public playClickTone(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Play acoustic melody for pronunciation cue
  public playPronounceCue(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // Stop any ongoing speech
  public stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  // Speak Nubian using SpeechSynthesis with state callbacks
  public speak(
    arabicText: string,
    phoneticText?: string,
    options?: SpeakOptions
  ): void {
    this.playPronounceCue();

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      options?.onStart?.();
      setTimeout(() => options?.onEnd?.(), 1000);
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop ongoing speech

      const textToSpeak = arabicText.trim();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      this.currentUtterance = utterance;

      // Select best voice
      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
      const arVoice =
        voices.find((v) => v.lang === 'ar-EG') ||
        voices.find((v) => v.lang.startsWith('ar')) ||
        voices.find((v) => v.lang.includes('ar'));

      if (arVoice) {
        utterance.voice = arVoice;
        utterance.lang = arVoice.lang || 'ar-EG';
      } else if (phoneticText) {
        // Fallback to phonetic English voice if no Arabic voice is present
        utterance.text = phoneticText;
        utterance.lang = 'en-US';
      }

      utterance.rate = options?.slow ? 0.65 : 0.82; // Slower for distinct phoneme clarity
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('TTS error:', e);
      options?.onEnd?.();
    }
  }
}

export const audioManager = new AudioManager();
