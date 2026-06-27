import { Track } from "../types";

class LofiAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private currentTrack: Track | null = null;

  // Gain nodes for mixing
  private masterGain: GainNode | null = null;
  private synthGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;

  // Node references for control
  private rainSource: AudioWorkletNode | ScriptProcessorNode | null = null;
  private vinylSource: AudioWorkletNode | ScriptProcessorNode | null = null;
  private sequencerTimer: any = null;
  private currentStep: number = 0;

  // Cozy volume settings (persisted in session)
  private mixVolumes = {
    master: 0.5,
    synth: 0.6,
    rain: 0.3,
    vinyl: 0.4,
  };

  constructor() {
    // Lazy loaded upon click
  }

  private initContext() {
    if (this.ctx) return;
    
    // Create audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Create Main Bandpass Filter to emulate 1970s underground lofi radio
    const radioFilter = this.ctx.createBiquadFilter();
    radioFilter.type = "bandpass";
    radioFilter.frequency.value = 1200; // roll off high and low frequencies
    radioFilter.Q.value = 0.8;

    // Create Gain Nodes
    this.masterGain = this.ctx.createGain();
    this.synthGain = this.ctx.createGain();
    this.rainGain = this.ctx.createGain();
    this.vinylGain = this.ctx.createGain();

    // Set initial volumes
    this.masterGain.gain.setValueAtTime(this.mixVolumes.master, this.ctx.currentTime);
    this.synthGain.gain.setValueAtTime(this.mixVolumes.synth, this.ctx.currentTime);
    this.rainGain.gain.setValueAtTime(this.mixVolumes.rain, this.ctx.currentTime);
    this.vinylGain.gain.setValueAtTime(this.mixVolumes.vinyl, this.ctx.currentTime);

    // Connections:
    // Sources -> Gains -> Radio Filter -> Master Gain -> Destination
    this.synthGain.connect(radioFilter);
    this.rainGain.connect(radioFilter);
    this.vinylGain.connect(radioFilter);

    radioFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    // Start background ambient loops
    this.startAmbientGenerators();
  }

  // Generates cozy rain noise and vinyl pops programmatically!
  private startAmbientGenerators() {
    if (!this.ctx || !this.rainGain || !this.vinylGain) return;

    const bufferSize = 2 * this.ctx.sampleRate;
    
    // 1. Cozy Rain Noise Buffer (Low-passed white noise with volume modulation)
    const rainBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const rainData = rainBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      rainData[i] = Math.random() * 2 - 1;
    }

    const rainNoise = this.ctx.createBufferSource();
    rainNoise.buffer = rainBuffer;
    rainNoise.loop = true;

    // Lowpass filter for the rain to make it deep and muffled
    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = "lowpass";
    rainFilter.frequency.value = 450; // cozy muffling

    rainNoise.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    rainNoise.start();

    // 2. Vintage Vinyl Crackle (Periodic dust crackle and slow needle hum)
    const vinylBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const vinylData = vinylBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      // Steady background pink-ish needle rumble
      let r = Math.random() * 2 - 1;
      vinylData[i] = r * 0.05;

      // Random pops and scratch impulses
      if (Math.random() < 0.00015) {
        const popValue = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5);
        // Draw a tiny decay curve
        for (let j = 0; j < 30 && (i + j) < bufferSize; j++) {
          vinylData[i + j] += popValue * Math.exp(-j * 0.3);
        }
      }
    }

    const vinylNoise = this.ctx.createBufferSource();
    vinylNoise.buffer = vinylBuffer;
    vinylNoise.loop = true;

    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = "bandpass";
    vinylFilter.frequency.value = 1000;
    vinylFilter.Q.value = 1.0;

    vinylNoise.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    vinylNoise.start();
  }

  // Synthesizes dynamic cozy jazz chords programmatically matching the current track BPM
  private playLofiStep() {
    if (!this.ctx || !this.synthGain || !this.isRunning || !this.currentTrack) return;

    const time = this.ctx.currentTime;
    const bpm = this.currentTrack.tempo || 75;
    const stepDuration = 60 / bpm; // duration of a quarter note beat

    // Lofi progression: Jazz II-V-I-VI progression or soft moody seventh chords
    // Chords defined as arrays of midi note numbers
    const trackIdNum = parseInt(this.currentTrack.id.split("-")[1]) || 1;
    
    // Choose chord sequence based on track ID to give each song a unique melody!
    let chordProgression = [
      [57, 60, 64, 67], // Am7
      [50, 53, 57, 60], // Dm7
      [55, 59, 62, 65], // G7
      [48, 52, 55, 59]  // Cmaj7
    ];

    if (trackIdNum % 3 === 0) {
      chordProgression = [
        [53, 57, 60, 64], // Fmaj7
        [52, 55, 59, 62], // Em7
        [48, 52, 55, 59], // Cmaj7
        [57, 60, 64, 67]  // Am7
      ];
    } else if (trackIdNum % 2 === 0) {
      chordProgression = [
        [50, 53, 57, 60], // Dm7
        [55, 59, 62, 65], // G7
        [52, 55, 59, 62], // Em7
        [57, 60, 64, 67]  // Am7
      ];
    }

    // Every 4 steps (beats), play a new chord
    const chordIndex = Math.floor(this.currentStep / 4) % chordProgression.length;
    const chord = chordProgression[chordIndex];

    // On beat 1 (step % 4 === 0), play the main chord pad
    if (this.currentStep % 4 === 0) {
      chord.forEach((midiNote) => {
        const freq = this.midiToFreq(midiNote);
        this.triggerSoftPad(freq, time, stepDuration * 3.8);
      });

      // Occasional sub-bass note
      const bassMidiNote = chord[0] - 12; // octave lower
      this.triggerBass(this.midiToFreq(bassMidiNote), time, stepDuration * 3.5);
    }

    // Play a gentle, relaxing electric piano melody on some of the steps
    // Gives that classic dreamy lounge vibe
    const melodySteps = [0, 2, 3, 5, 6, 8, 10, 11, 13, 14];
    if (melodySteps.includes(this.currentStep % 16) && Math.random() > 0.4) {
      // Pick a random note from the chord to guarantee harmony, plus an octave
      const randomChordNote = chord[Math.floor(Math.random() * chord.length)] + 12;
      const melodyFreq = this.midiToFreq(randomChordNote);
      this.triggerSoftMelody(melodyFreq, time, stepDuration * 1.5);
    }

    this.currentStep = (this.currentStep + 1) % 16;
  }

  private triggerSoftPad(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.synthGain) return;

    // Use gentle triangle oscillators for vintage electric piano feeling
    const osc = this.ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    // Filter to roll off upper harmonics
    const lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(500, startTime);
    lp.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    // Slow Attack
    gain.gain.linearRampToValueAtTime(0.08, startTime + 0.3);
    // Smooth decay
    gain.gain.setValueAtTime(0.08, startTime + duration - 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(this.synthGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private triggerBass(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.synthGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = "sine"; // deep clean sub-bass
    osc.frequency.setValueAtTime(freq, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1);
    gain.gain.setValueAtTime(0.12, startTime + duration - 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.synthGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private triggerSoftMelody(freq: number, startTime: number, duration: number) {
    if (!this.ctx || !this.synthGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    // Frequency vibrato for "wow & flutter" analog tape tape warble
    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.value = 4.5; // 4.5Hz vibrato
    const vibratoGain = this.ctx.createGain();
    vibratoGain.gain.value = 1.2; // subtle frequency change
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.04, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.synthGain);

    osc.start(startTime);
    vibrato.stop(startTime + duration);
    osc.stop(startTime + duration);
  }

  private midiToFreq(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // --- External Control APIs ---

  public play(track: Track) {
    this.initContext();
    if (!this.ctx) return;

    // Resume context if suspended
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.currentTrack = track;
    this.isRunning = true;

    // Clear existing sequencer timer
    if (this.sequencerTimer) {
      clearInterval(this.sequencerTimer);
    }

    // Trigger steps based on BPM
    const bpm = track.tempo || 75;
    const intervalMs = (60 / bpm) * 1000; // quarter note interval

    this.currentStep = 0;
    this.playLofiStep(); // Play step zero immediately

    this.sequencerTimer = setInterval(() => {
      this.playLofiStep();
    }, intervalMs);
  }

  public pause() {
    this.isRunning = false;
    if (this.sequencerTimer) {
      clearInterval(this.sequencerTimer);
      this.sequencerTimer = null;
    }
  }

  public stop() {
    this.pause();
    this.currentTrack = null;
  }

  // Set Master volume
  public setVolume(val: number) {
    this.mixVolumes.master = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.mixVolumes.master, this.ctx.currentTime);
    }
  }

  // Set procedural instruments volume
  public setSynthVolume(val: number) {
    this.mixVolumes.synth = Math.max(0, Math.min(1, val));
    if (this.synthGain && this.ctx) {
      this.synthGain.gain.setValueAtTime(this.mixVolumes.synth, this.ctx.currentTime);
    }
  }

  // Set rain hum volume
  public setRainVolume(val: number) {
    this.mixVolumes.rain = Math.max(0, Math.min(1, val));
    if (this.rainGain && this.ctx) {
      this.rainGain.gain.setValueAtTime(this.mixVolumes.rain, this.ctx.currentTime);
    }
  }

  // Set vinyl crackle volume
  public setVinylVolume(val: number) {
    this.mixVolumes.vinyl = Math.max(0, Math.min(1, val));
    if (this.vinylGain && this.ctx) {
      this.vinylGain.gain.setValueAtTime(this.mixVolumes.vinyl, this.ctx.currentTime);
    }
  }

  // Get current volume mix states
  public getVolumes() {
    return { ...this.mixVolumes };
  }
}

export const lofiAudio = new LofiAudioEngine();
export default lofiAudio;
