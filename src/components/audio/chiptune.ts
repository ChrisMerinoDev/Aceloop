"use client";

/**
 * A tiny Web Audio chiptune engine: original 8-bit loops
 * (square-wave lead + triangle bass), no audio assets needed.
 * Multiple selectable tracks — switch with `chiptune.setTrack(i)`.
 */

const midi = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export interface ChiptuneTrack {
  name: string;
  tempo: number; // bpm
  lead: number[]; // eighth notes, MIDI; 0 = rest
  bass: number[]; // quarter-ish notes, MIDI; 0 = rest
  sparkle: number[]; // arpeggio layer on the repeat
}

// A-minor overworld theme — bright, adventurous.
const OVERWORLD: ChiptuneTrack = {
  name: "Overworld",
  tempo: 152,
  lead: [
    69, 72, 76, 81, 79, 76, 72, 76,
    77, 81, 79, 77, 76, 72, 74, 76,
    69, 72, 76, 79, 77, 76, 74, 72,
    71, 74, 67, 71, 72, 76, 69, 0,
  ],
  bass: [
    45, 0, 45, 0, 41, 0, 41, 0,
    41, 0, 41, 0, 43, 0, 43, 0,
    45, 0, 45, 0, 41, 0, 41, 0,
    43, 0, 43, 0, 45, 0, 45, 0,
  ],
  sparkle: [
    0, 0, 84, 0, 0, 0, 88, 0,
    0, 0, 89, 0, 0, 0, 88, 0,
    0, 0, 84, 0, 0, 0, 86, 0,
    0, 0, 83, 0, 0, 0, 81, 0,
  ],
};

// D-minor dungeon crawl — slower, moodier, sparse.
const DUNGEON: ChiptuneTrack = {
  name: "Dungeon",
  tempo: 104,
  lead: [
    62, 0, 65, 0, 69, 0, 65, 62,
    60, 0, 62, 0, 65, 0, 0, 0,
    62, 0, 65, 0, 70, 0, 69, 65,
    64, 0, 62, 0, 61, 0, 62, 0,
  ],
  bass: [
    38, 0, 0, 0, 38, 0, 0, 0,
    36, 0, 0, 0, 36, 0, 0, 0,
    41, 0, 0, 0, 41, 0, 0, 0,
    37, 0, 0, 0, 38, 0, 0, 0,
  ],
  sparkle: [
    0, 0, 0, 74, 0, 0, 0, 77,
    0, 0, 0, 72, 0, 0, 0, 74,
    0, 0, 0, 77, 0, 0, 0, 81,
    0, 0, 0, 74, 0, 0, 0, 73,
  ],
};

// C-major boss rush — fast, driving, tense.
const BOSS: ChiptuneTrack = {
  name: "Boss Rush",
  tempo: 176,
  lead: [
    72, 72, 75, 72, 79, 0, 75, 72,
    70, 70, 72, 70, 77, 0, 72, 70,
    72, 72, 75, 79, 84, 0, 82, 79,
    77, 75, 74, 72, 71, 74, 72, 0,
  ],
  bass: [
    48, 48, 0, 48, 48, 0, 48, 0,
    46, 46, 0, 46, 46, 0, 46, 0,
    48, 48, 0, 48, 48, 0, 48, 0,
    43, 43, 0, 43, 43, 0, 43, 0,
  ],
  sparkle: [
    0, 87, 0, 0, 0, 91, 0, 0,
    0, 84, 0, 0, 0, 89, 0, 0,
    0, 87, 0, 0, 0, 91, 0, 0,
    0, 86, 0, 0, 0, 83, 0, 0,
  ],
};

export const TRACKS: ChiptuneTrack[] = [OVERWORLD, DUNGEON, BOSS];

class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextStepTime = 0;
  private step = 0;
  private pass = 0;
  private trackIndex = 0;

  private get track(): ChiptuneTrack {
    return TRACKS[this.trackIndex] ?? TRACKS[0];
  }

  private get stepSeconds(): number {
    return 60 / this.track.tempo / 2; // eighth-note seconds
  }

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
    const { lead: LEAD, bass: BASS, sparkle: SPARKLE } = this.track;
    const STEP = this.stepSeconds;
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

  /** Switch the active track. If playing, restarts the new loop cleanly. */
  setTrack(index: number) {
    const next = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
    if (next === this.trackIndex) return;
    this.trackIndex = next;
    if (this.timer !== null && this.ctx) {
      // Restart the sequence so the new tempo/notes line up.
      this.step = 0;
      this.pass = 0;
      this.nextStepTime = this.ctx.currentTime + 0.05;
    }
  }

  getTrackIndex(): number {
    return this.trackIndex;
  }

  /**
   * Create + resume the AudioContext. MUST be called synchronously from a
   * user-gesture handler (e.g. the mute button's onClick) — browsers,
   * especially Safari, only unlock audio inside the gesture's call stack,
   * not from an async React effect that runs after the click.
   */
  unlock() {
    const ctx = this.ensure();
    void ctx.resume();
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
