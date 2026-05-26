let ctx = null

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

function tone(freq, endFreq, duration, type = 'sine', volume = 0.12, delay = 0) {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, c.currentTime + delay)
  if (endFreq !== freq) {
    osc.frequency.exponentialRampToValueAtTime(endFreq, c.currentTime + delay + duration)
  }
  gain.gain.setValueAtTime(volume, c.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration * 0.9)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime + delay)
  osc.stop(c.currentTime + delay + duration)
}

function noise(duration, volume = 0.08) {
  const c = getCtx()
  const bufferSize = Math.floor(c.sampleRate * duration)
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
  }
  const source = c.createBufferSource()
  source.buffer = buffer
  const gain = c.createGain()
  gain.gain.setValueAtTime(volume, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  source.connect(gain)
  gain.connect(c.destination)
  source.start()
}

const sounds = {
  eat() {
    tone(600, 900, 0.08, 'sine', 0.1)
  },
  special() {
    tone(500, 800, 0.18, 'sine', 0.1)
    tone(750, 1200, 0.18, 'sine', 0.08, 0.04)
  },
  skill() {
    tone(300, 1200, 0.28, 'square', 0.08)
  },
  skillEnd() {
    tone(800, 200, 0.25, 'triangle', 0.06)
  },
  death() {
    tone(150, 60, 0.35, 'sawtooth', 0.12)
    noise(0.3, 0.1)
  },
  combo() {
    const notes = [523, 659, 784]
    notes.forEach((f, i) => {
      tone(f, f, 0.06, 'sine', 0.1, i * 0.05)
    })
  },
  combo2() {
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) => {
      tone(f, f, 0.07, 'sine', 0.1, i * 0.05)
    })
  },
  combo3() {
    const notes = [523, 659, 784, 1047, 1319]
    notes.forEach((f, i) => {
      tone(f, f, 0.08, 'sine', 0.1, i * 0.05)
    })
  },
  pause() {
    tone(400, 400, 0.04, 'sine', 0.04)
  },
  countdown() {
    tone(600, 600, 0.06, 'sine', 0.06)
  },
}

function _play(name) {
  const fn = sounds[name]
  if (fn) fn()
}

export function play(name) {
  _play(name)
}

export function useSound() {
  return { play: _play }
}

export function preloadAudio() {
  getCtx()
}
