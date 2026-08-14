/**
 * UI audio — mostly synthesised oscillators, plus a sampled mouse click for
 * the in-scene OS.
 */

const MOUSE_CLICK_URL = "/sounds/mouse-click.mp3";
const OFFICE_AMBIENCE_URL = "/sounds/office-ambience.mp3";
const WIN95_STARTUP_URL = "/sounds/win95-startup.mp3";

const AMBIENCE_PROFILE = {
  desk: { gain: 5.0, filterHz: 16000 },
  /** Distant, muffled room tone while you're locked into the CRT. */
  monitor: { gain: 0.05, filterHz: 380 },
} as const;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let hum: { osc: OscillatorNode; gain: GainNode } | null = null;
let mouseClickBuffer: AudioBuffer | null = null;
let mouseClickLoading: Promise<AudioBuffer> | null = null;
let startupBuffer: AudioBuffer | null = null;
let startupLoading: Promise<AudioBuffer> | null = null;
let ambienceBuffer: AudioBuffer | null = null;
let ambienceLoading: Promise<AudioBuffer> | null = null;
let ambiencePendingFocus: boolean | null = null;
let ambience: {
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
} | null = null;

function context() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return { ctx, master: master! };
}

export function setMuted(muted: boolean) {
  const { ctx, master } = context();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(
    muted ? 0.0001 : 0.5,
    ctx.currentTime + 0.25,
  );
}

/** Low mains-style hum, as if the CRT is warming up. */
export function startHum() {
  const { ctx, master } = context();
  if (hum) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = "sawtooth";
  osc.frequency.value = 60;
  filter.type = "lowpass";
  filter.frequency.value = 220;
  gain.gain.value = 0.06;
  osc.connect(filter).connect(gain).connect(master);
  osc.start();
  hum = { osc, gain };
}

type BlipOptions = {
  frequency?: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
};

export function blip({
  frequency = 660,
  duration = 0.045,
  type = "square",
  gain = 0.12,
}: BlipOptions = {}) {
  const { ctx, master } = context();
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  env.gain.setValueAtTime(0, ctx.currentTime);
  env.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.005);
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(env).connect(master);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

export const click = () => blip({ frequency: 880, duration: 0.03 });
export const clack = () => blip({ frequency: 320, duration: 0.06, type: "triangle" });

function loadMouseClickBuffer() {
  if (mouseClickBuffer) return Promise.resolve(mouseClickBuffer);
  if (mouseClickLoading) return mouseClickLoading;

  mouseClickLoading = (async () => {
    const { ctx } = context();
    const response = await fetch(MOUSE_CLICK_URL);
    if (!response.ok) throw new Error(`Failed to load ${MOUSE_CLICK_URL}`);
    const data = await response.arrayBuffer();
    mouseClickBuffer = await ctx.decodeAudioData(data);
    return mouseClickBuffer;
  })();

  return mouseClickLoading;
}

/** Warm the sample so the first OS click is instant. */
export function preloadMouseClick() {
  void loadMouseClickBuffer().catch(() => {
    mouseClickLoading = null;
  });
}

function loadStartupBuffer() {
  if (startupBuffer) return Promise.resolve(startupBuffer);
  if (startupLoading) return startupLoading;

  startupLoading = (async () => {
    const { ctx } = context();
    const response = await fetch(WIN95_STARTUP_URL);
    if (!response.ok) throw new Error(`Failed to load ${WIN95_STARTUP_URL}`);
    const data = await response.arrayBuffer();
    startupBuffer = await ctx.decodeAudioData(data);
    return startupBuffer;
  })();

  return startupLoading;
}

/** Decode early so START plays without waiting on the fetch. */
export function preloadStartupSound() {
  void loadStartupBuffer().catch(() => {
    startupLoading = null;
  });
}

/** Windows 95 startup jingle — plays when the user hits START. */
export function playStartupSound() {
  const { ctx, master } = context();
  void loadStartupBuffer()
    .then((buffer) => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.85;
      source.connect(gain).connect(master);
      source.start();
    })
    .catch(() => {
      startupLoading = null;
    });
}

/** Sampled mouse click, routed through the master bus so mute works. */
export function mouseClick() {
  const { ctx, master } = context();
  void loadMouseClickBuffer()
    .then((buffer) => {
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.65;
      source.connect(gain).connect(master);
      source.start();
    })
    .catch(() => {
      mouseClickLoading = null;
    });
}

function loadAmbienceBuffer() {
  if (ambienceBuffer) return Promise.resolve(ambienceBuffer);
  if (ambienceLoading) return ambienceLoading;

  ambienceLoading = (async () => {
    const { ctx } = context();
    const response = await fetch(OFFICE_AMBIENCE_URL);
    if (!response.ok) throw new Error(`Failed to load ${OFFICE_AMBIENCE_URL}`);
    const data = await response.arrayBuffer();
    ambienceBuffer = await ctx.decodeAudioData(data);
    return ambienceBuffer;
  })();

  return ambienceLoading;
}

/** Decode the loop early so START doesn't wait on a 4 MB fetch. */
export function preloadAmbience() {
  void loadAmbienceBuffer().catch(() => {
    ambienceLoading = null;
  });
}

function applyAmbienceFocus(atMonitor: boolean, ramp = 0.75) {
  if (!ambience) return;
  const { ctx } = context();
  const profile = atMonitor ? AMBIENCE_PROFILE.monitor : AMBIENCE_PROFILE.desk;
  const t = ctx.currentTime;
  ambience.gain.gain.cancelScheduledValues(t);
  ambience.gain.gain.linearRampToValueAtTime(profile.gain, t + ramp);
  ambience.filter.frequency.cancelScheduledValues(t);
  ambience.filter.frequency.linearRampToValueAtTime(profile.filterHz, t + ramp);
}

/** Looping workshop/office bed — full at the desk, muffled at the monitor. */
export function startAmbience() {
  if (ambience) return;

  void loadAmbienceBuffer()
    .then((buffer) => {
      if (ambience) return;
      const { ctx, master } = context();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.value = 0.707;

      const gain = ctx.createGain();
      source.connect(filter).connect(gain).connect(master);
      source.start();

      ambience = { source, filter, gain };

      const atMonitor = ambiencePendingFocus ?? false;
      ambiencePendingFocus = null;
      const t = ctx.currentTime;
      const profile = atMonitor ? AMBIENCE_PROFILE.monitor : AMBIENCE_PROFILE.desk;
      const ramp = atMonitor ? 0.75 : 2.5;
      filter.frequency.setValueAtTime(profile.filterHz, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(profile.gain, t + ramp);
    })
    .catch(() => {
      ambienceLoading = null;
    });
}

/** Pull ambience back when the user sits down at the CRT. */
export function setAmbienceFocus(atMonitor: boolean) {
  ambiencePendingFocus = atMonitor;
  applyAmbienceFocus(atMonitor);
}

export const keypress = () =>
  blip({
    frequency: 1200 + Math.random() * 400,
    duration: 0.018,
    gain: 0.05,
  });

/** The single PC-speaker beep a machine gives when it passes its self test. */
export const beep = () =>
  blip({ frequency: 1046, duration: 0.12, type: "square", gain: 0.07 });

/**
 * Startup chime: a soft major chord that blooms and decays, in the spirit of
 * a mid-nineties desktop waking up.
 */
export function startupChime() {
  const { ctx, master } = context();
  const bus = ctx.createGain();
  bus.gain.value = 0.5;
  bus.connect(master);

  // C3 - G3 - C4 - E4, each entering a beat after the last.
  const notes = [130.81, 196.0, 261.63, 329.63];
  notes.forEach((frequency, index) => {
    const start = ctx.currentTime + index * 0.16;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = index > 1 ? "triangle" : "sine";
    osc.frequency.value = frequency;
    env.gain.setValueAtTime(0.0001, start);
    env.gain.linearRampToValueAtTime(0.09, start + 0.12);
    env.gain.exponentialRampToValueAtTime(0.0001, start + 1.9);
    osc.connect(env).connect(bus);
    osc.start(start);
    osc.stop(start + 2);
  });
}

/** Descending sweep for the CRT powering on. */
export function powerOn() {
  const { ctx, master } = context();
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(140, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.28);
  env.gain.setValueAtTime(0.0001, ctx.currentTime);
  env.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.06);
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
  osc.connect(env).connect(master);
  osc.start();
  osc.stop(ctx.currentTime + 0.45);
}
