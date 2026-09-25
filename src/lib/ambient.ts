export type Ambience = 'mountain' | 'rainforest' | 'desert' | 'ice' | 'ocean'

type LayerConfig = {
  freq: number
  q: number
  gain: number
  lfoRate: number
  lfoDepth: number
}

type AmbienceConfig = {
  wind: LayerConfig
  /** Optional second band (rain shimmer, wave wash, low rumble). */
  extra?: LayerConfig & { type: BiquadFilterType }
}

const CONFIGS: Record<Ambience, AmbienceConfig> = {
  mountain: {
    wind: { freq: 340, q: 0.9, gain: 0.14, lfoRate: 0.065, lfoDepth: 170 },
  },
  rainforest: {
    wind: { freq: 260, q: 0.8, gain: 0.08, lfoRate: 0.05, lfoDepth: 90 },
    // steady fine rain shimmer
    extra: { type: 'bandpass', freq: 1900, q: 0.5, gain: 0.045, lfoRate: 0.09, lfoDepth: 300 },
  },
  desert: {
    // dry gusts: brighter, faster-breathing wind
    wind: { freq: 520, q: 1.1, gain: 0.15, lfoRate: 0.14, lfoDepth: 340 },
  },
  ice: {
    wind: { freq: 300, q: 0.8, gain: 0.1, lfoRate: 0.045, lfoDepth: 120 },
    // deep glacier rumble
    extra: { type: 'lowpass', freq: 110, q: 0.7, gain: 0.09, lfoRate: 0.03, lfoDepth: 30 },
  },
  ocean: {
    wind: { freq: 420, q: 0.8, gain: 0.09, lfoRate: 0.08, lfoDepth: 160 },
    // slow wave wash, breathing every ~10 seconds
    extra: { type: 'lowpass', freq: 600, q: 0.6, gain: 0.07, lfoRate: 0.1, lfoDepth: 0 },
  },
}

let ctx: AudioContext | null = null
let master: GainNode | null = null
let windSource: AudioBufferSourceNode | null = null
let windFilter: BiquadFilterNode | null = null
let windLfo: OscillatorNode | null = null
let windLfoGain: GainNode | null = null
let extra: {
  source: AudioBufferSourceNode
  filter: BiquadFilterNode
  gain: GainNode
  lfo: OscillatorNode
  lfoGain: GainNode
} | null = null
let extraStopTimer: ReturnType<typeof setTimeout> | null = null
let suspendTimer: ReturnType<typeof setTimeout> | null = null
let currentKind: Ambience = 'mountain'
let running = false

function makeNoiseBuffer(c: AudioContext) {
  const seconds = 4
  const buffer = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  return buffer
}

function fadeMasterTo(level: number) {
  if (!ctx || !master) return
  if (suspendTimer) {
    clearTimeout(suspendTimer)
    suspendTimer = null
  }
  const t = ctx.currentTime
  master.gain.cancelScheduledValues(t)
  master.gain.setValueAtTime(master.gain.value, t)
  master.gain.linearRampToValueAtTime(level, t + 1.5)
  if (level === 0) {
    suspendTimer = setTimeout(() => {
      ctx?.suspend().catch(() => {})
    }, 1700)
  }
}

function ramp(param: AudioParam, value: number, seconds = 1.2) {
  if (!ctx) return
  const t = ctx.currentTime
  param.cancelScheduledValues(t)
  param.setValueAtTime(param.value, t)
  param.linearRampToValueAtTime(value, t + seconds)
}

function buildWind(c: AudioContext) {
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = CONFIGS[currentKind].wind.freq
  filter.Q.value = CONFIGS[currentKind].wind.q

  const source = c.createBufferSource()
  source.buffer = makeNoiseBuffer(c)
  source.loop = true
  source.connect(filter)
  filter.connect(master!)

  const lfo = c.createOscillator()
  lfo.frequency.value = CONFIGS[currentKind].wind.lfoRate
  const lfoGain = c.createGain()
  lfoGain.gain.value = CONFIGS[currentKind].wind.lfoDepth
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  source.start()
  lfo.start()
  return { source, filter, lfo, lfoGain }
}

function buildExtra(c: AudioContext, cfg: NonNullable<AmbienceConfig['extra']>) {
  const filter = c.createBiquadFilter()
  filter.type = cfg.type
  filter.frequency.value = cfg.freq
  filter.Q.value = cfg.q

  const source = c.createBufferSource()
  source.buffer = makeNoiseBuffer(c)
  source.loop = true
  source.connect(filter)

  const gain = c.createGain()
  gain.gain.value = 0
  filter.connect(gain)
  gain.connect(master!)

  const lfo = c.createOscillator()
  lfo.frequency.value = cfg.lfoRate
  const lfoGain = c.createGain()
  lfoGain.gain.value = cfg.type === 'lowpass' && cfg.lfoDepth === 0 ? 0 : cfg.lfoDepth
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)

  // for wave wash: LFO breathes the gain instead of the filter
  if (cfg.type === 'lowpass' && cfg.lfoDepth === 0) {
    lfoGain.disconnect(filter.frequency)
    lfoGain.connect(gain.gain)
  }

  source.start()
  lfo.start()
  ramp(gain.gain, cfg.gain, 2)
  return { source, filter, gain, lfo, lfoGain }
}

function teardownExtra(keepForMs = 0) {
  if (extraStopTimer) {
    clearTimeout(extraStopTimer)
    extraStopTimer = null
  }
  const old = extra
  if (!old) return
  extra = null
  ramp(old.gain.gain, 0, 1.2)
  extraStopTimer = setTimeout(() => {
    try {
      old.source.stop()
      old.lfo.stop()
    } catch {
      // already stopped
    }
  }, keepForMs + 1400)
}

/** Choose the soundscape. Safe to call anytime; crossfades if audio is playing. */
export function setAmbience(kind: Ambience) {
  if (kind === currentKind) return
  currentKind = kind
  if (!running || !ctx) return
  const cfg = CONFIGS[kind]
  if (windFilter) {
    ramp(windFilter.frequency, cfg.wind.freq)
    windFilter.Q.value = cfg.wind.q
  }
  if (windLfo) ramp(windLfo.frequency, cfg.wind.lfoRate, 0.5)
  if (windLfoGain) ramp(windLfoGain.gain, cfg.wind.lfoDepth)
  if (master) ramp(master.gain, cfg.wind.gain, 1.2)
  teardownExtra(1600)
  if (cfg.extra) extra = buildExtra(ctx, cfg.extra)
}

export async function startAmbient() {
  if (!ctx) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
  }
  await ctx.resume().catch(() => {})
  const cfg = CONFIGS[currentKind]
  if (running && windSource) {
    fadeMasterTo(cfg.wind.gain)
    if (cfg.extra && ctx && !extra) extra = buildExtra(ctx, cfg.extra)
    return
  }
  ;({ source: windSource, filter: windFilter, lfo: windLfo, lfoGain: windLfoGain } = buildWind(ctx))
  if (cfg.extra) extra = buildExtra(ctx, cfg.extra)
  running = true
  fadeMasterTo(cfg.wind.gain)
}

export function stopAmbient() {
  fadeMasterTo(0)
}
