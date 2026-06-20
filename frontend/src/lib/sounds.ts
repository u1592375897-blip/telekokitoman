let globalVolume = 100
let soundMuted = false
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

export function playClickSound() {
  try {
    if (globalVolume === 0 || soundMuted) return
    const ctx = getCtx()
    const vol = 0.12 * (globalVolume / 100)
    const osc = ctx.createOscillator(), gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(700, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.06)
    gain.gain.setValueAtTime(Math.min(vol, 1), ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.09)
  } catch { /* audio not supported */ }
}
