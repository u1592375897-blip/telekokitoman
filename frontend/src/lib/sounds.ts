let globalVolume = 100
let soundMuted = false
let currentTheme = 'cyborg'
let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function setGlobalVolume(v: number) { globalVolume = v }
export function getGlobalVolume() { return globalVolume }
export function setSoundMuted(m: boolean) { soundMuted = m }
export function setSoundTheme(t: string) { currentTheme = t }

function playDefault(ctx: AudioContext) {
  const vol = 0.15 * (globalVolume / 100)
  const osc = ctx.createOscillator(), gain = ctx.createGain()
  osc.connect(gain); gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05)
  gain.gain.setValueAtTime(Math.min(vol, 1), ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
  osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08)
}

function playPS2(ctx: AudioContext) {
  const vol = 0.1 * (globalVolume / 100)
  const o1 = ctx.createOscillator(), g1 = ctx.createGain()
  o1.connect(g1); g1.connect(ctx.destination)
  o1.type = 'sine'; o1.frequency.setValueAtTime(330, ctx.currentTime)
  g1.gain.setValueAtTime(Math.min(vol, 1), ctx.currentTime)
  g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
  o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.12)

  const o2 = ctx.createOscillator(), g2 = ctx.createGain()
  o2.connect(g2); g2.connect(ctx.destination)
  o2.type = 'sine'; o2.frequency.setValueAtTime(440, ctx.currentTime + 0.06)
  g2.gain.setValueAtTime(0.001, ctx.currentTime + 0.06)
  g2.gain.linearRampToValueAtTime(Math.min(vol * 0.7, 1), ctx.currentTime + 0.07)
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
  o2.start(ctx.currentTime + 0.06); o2.stop(ctx.currentTime + 0.15)
}

function playAurora(ctx: AudioContext) {
  const vol = 0.08 * (globalVolume / 100)
  const o1 = ctx.createOscillator(), g1 = ctx.createGain()
  o1.connect(g1); g1.connect(ctx.destination)
  o1.type = 'sine'
  o1.frequency.setValueAtTime(880, ctx.currentTime)
  o1.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.18)
  g1.gain.setValueAtTime(Math.min(vol, 1), ctx.currentTime)
  g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
  o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.2)

  const o2 = ctx.createOscillator(), g2 = ctx.createGain()
  o2.connect(g2); g2.connect(ctx.destination)
  o2.type = 'triangle'
  o2.frequency.setValueAtTime(1320, ctx.currentTime + 0.03)
  o2.frequency.exponentialRampToValueAtTime(990, ctx.currentTime + 0.2)
  g2.gain.setValueAtTime(Math.min(vol * 0.3, 1), ctx.currentTime + 0.03)
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
  o2.start(ctx.currentTime + 0.03); o2.stop(ctx.currentTime + 0.22)
}

function playCyborg(ctx: AudioContext) {
  const vol = 0.1 * (globalVolume / 100)
  const o1 = ctx.createOscillator(), g1 = ctx.createGain()
  o1.connect(g1); g1.connect(ctx.destination)
  o1.type = 'square'
  o1.frequency.setValueAtTime(1200, ctx.currentTime)
  o1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.06)
  g1.gain.setValueAtTime(Math.min(vol * 0.4, 1), ctx.currentTime)
  g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
  o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.08)

  const o2 = ctx.createOscillator(), g2 = ctx.createGain()
  o2.connect(g2); g2.connect(ctx.destination)
  o2.type = 'sine'
  o2.frequency.setValueAtTime(800, ctx.currentTime + 0.04)
  o2.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.18)
  g2.gain.setValueAtTime(Math.min(vol * 0.6, 1), ctx.currentTime + 0.04)
  g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
  o2.start(ctx.currentTime + 0.04); o2.stop(ctx.currentTime + 0.2)
}

export function playClickSound() {
  try {
    if (globalVolume === 0 || soundMuted) return
    const ctx = getCtx()
    switch (currentTheme) {
      case 'ps2':    playPS2(ctx);    break
      case 'aurora': playAurora(ctx); break
      case 'cyborg': playCyborg(ctx); break
      default:       playDefault(ctx)
    }
  } catch { /* audio not supported */ }
}
