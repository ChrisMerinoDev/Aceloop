"use client";

/**
 * A tiny Web Audio chiptune engine: an original 8-bit RPG overworld loop
 * (square-wave lead + triangle bass), no audio assets needed.
 */

const TEMPO = 152; // bpm
const STEP = 60 / TEMPO / 2; // eighth-note seconds

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// A-minor overworld theme, 4 bars of eighth notes. 0 = rest.
const LEAD: number[] = [
  69, 72, 76, 81, 79, 76, 72, 76,
  77, 81, 79, 77, 76, 72, 74, 76,
  69, 72, 76, 79, 77, 76, 74, 72,
  71, 74, 67, 71, 72, 76, 69, 0,
];

// Bass: quarter notes (every 2 steps).
const BASS: number[] = [
  45, 0, 45, 0, 41, 0, 41, 0,
  41, 0, 41, 0, 43, 0, 43, 0,
  45, 0, 45, 0, 41, 0, 41, 0,
  43, 0, 43, 0, 45, 0, 45, 0,
];

// Arpeggio sparkle layer on the repeat for variety.
const SPARKLE: number[] = [
  0, 0, 84, 0, 0, 0, 88, 0,
  0, 0, 89, 0, 0, 0, 88, 0,
  0, 0, 84, 0, 0, 0, 86, 0,
  0, 0, 83, 0, 0, 0, 81, 0,
];

class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextStepTime = 0;
  private step = 0;
  private pass = 0;

  private ensure(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.gain = this.ctx.createGain();
      this.gain.gain.value = 0.16;
      this.gain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private note(
    freq: number,
    time: number,
    dur: number,
    type: OscillatorType,
    vol: number
  ) {
    if (!this.ctx || !this.gain || freq <= 0) return;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    // Chippy envelope: instant attack, stepped decay.
    env.gain.setValueAtTime(vol, time);
    env.gain.setValueAtTime(vol * 0.6, time + dur * 0.5);
    env.gain.setValueAtTime(vol * 0.3, time + dur * 0.75);
    env.gain.setValueAtTime(0.0001, time + dur * 0.95);
    osc.connect(env);
    env.connect(this.gain);
    osc.start(time);
    osc.stop(time + dur);
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextStepTime < ctx.currentTime + 0.15) {
      const i = this.step % LEAD.length;
      const t = this.nextStepTime;
      const lead = LEAD[i];
      if (lead > 0) this.note(midi(lead), t, STEP * 0.9, "square", 0.28);
      const bass = BASS[i];
      if (bass > 0) this.note(midi(bass), t, STEP * 1.8, "triangle", 0.5);
      if (this.pass % 2 === 1) {
        const sp = SPARKLE[i];
        if (sp > 0) this.note(midi(sp), t, STEP * 0.45, "square", 0.1);
      }
      this.step++;
      if (this.step % LEAD.length === 0) this.pass++;
      this.nextStepTime += STEP;
    }
  }

  start() {
    const ctx = this.ensure();
    void ctx.resume();
    if (this.timer !== null) return;
    this.nextStepTime = ctx.currentTime + 0.05;
    this.timer = setInterval(() => this.schedule(), 40);
  }

  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx) void this.ctx.suspend();
  }

  /** One-shot victory jingle (also used by confetti moments). */
  jingle() {
    const ctx = this.ensure();
    void ctx.resume();
    const t0 = ctx.currentTime + 0.02;
    const notes = [72, 76, 79, 84];
    notes.forEach((n, i) => this.note(midi(n), t0 + i * 0.09, 0.12, "square", 0.3));
    this.note(midi(48), t0, 0.4, "triangle", 0.5);
  }

  buzz() {
    const ctx = this.ensure();
    void ctx.resume();
    const t0 = ctx.currentTime + 0.02;
    this.note(midi(46), t0, 0.18, "sawtooth", 0.25);
    this.note(midi(44), t0 + 0.18, 0.28, "sawtooth", 0.25);
  }
}

export const chiptune = new ChiptuneEngine();
