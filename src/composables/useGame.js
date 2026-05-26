import { ref, computed, onMounted, onUnmounted } from 'vue'
import { play } from './useSound.js'

export const GRID_SIZE = 20
const INITIAL_SPEED = 180
const MIN_SPEED = 60
const MAX_SPEED = 400

const DIR = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
}

const SKILLS = [
  { id: 'speedUp', name: '加速', icon: '🚀', key: '1', duration: 5, cooldown: 10, desc: '移動速度提升50%' },
  { id: 'slowDown', name: '減速', icon: '🐢', key: '2', duration: 5, cooldown: 10, desc: '移動速度降低50%' },
  { id: 'ghost', name: '無敵', icon: '👻', key: '3', duration: 5, cooldown: 15, desc: '穿透牆壁不死亡' },
  { id: 'doubleScore', name: '雙倍', icon: '💎', key: '4', duration: 5, cooldown: 15, desc: '得分加倍' }
]

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export { SKILLS as GAME_SKILLS }

export function useGame() {
  const snake = ref([])
  const food = ref(null)
  const specialFood = ref(null)
  const direction = ref({ x: 1, y: 0 })
  const nextDirection = ref({ x: 1, y: 0 })
  const score = ref(0)
  const combo = ref(0)
  const highScore = ref(parseInt(localStorage.getItem('snake-high-score') || '0'))
  const gameState = ref('start')
  const baseSpeed = ref(INITIAL_SPEED)
  const currentSpeed = ref(INITIAL_SPEED)
  const activeSkills = ref({})
  const ownedSkills = ref([])
  const cooldowns = ref({})
  const eatEffect = ref(null)
  const deathEffect = ref(null)
  const gameTick = ref(0)

  let gameLoop = null
  let isDying = false

  const snakeSet = computed(() => {
    const set = new Set()
    snake.value.forEach(s => set.add(`${s.x},${s.y}`))
    return set
  })

  function initGame() {
    const startX = randomInt(5, 14)
    const startY = randomInt(5, 14)
    snake.value = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ]
    const dirs = [DIR.RIGHT, DIR.LEFT, DIR.UP, DIR.DOWN]
    const dir = dirs[randomInt(0, 3)]
    direction.value = { ...dir }
    nextDirection.value = { ...dir }
    score.value = 0
    combo.value = 0
    baseSpeed.value = INITIAL_SPEED
    currentSpeed.value = INITIAL_SPEED
    activeSkills.value = {}
    ownedSkills.value = []
    cooldowns.value = {}
    eatEffect.value = null
    deathEffect.value = null
    specialFood.value = null
    isDying = false
    gameTick.value = 0
    spawnFood()
  }

  function spawnFood() {
    const maxAttempts = 2000
    for (let i = 0; i < maxAttempts; i++) {
      const pos = { x: randomInt(0, GRID_SIZE - 1), y: randomInt(0, GRID_SIZE - 1) }
      if (!snakeSet.value.has(`${pos.x},${pos.y}`)) {
        food.value = pos
        return
      }
    }
    // fallback: scan all cells linearly
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!snakeSet.value.has(`${x},${y}`)) {
          food.value = { x, y }
          return
        }
      }
    }
  }

  function spawnSpecialFood() {
    if (specialFood.value) return
    const maxAttempts = 2000
    let pos = null
    for (let i = 0; i < maxAttempts; i++) {
      const p = { x: randomInt(0, GRID_SIZE - 1), y: randomInt(0, GRID_SIZE - 1) }
      if (!snakeSet.value.has(`${p.x},${p.y}`) &&
          !(food.value && p.x === food.value.x && p.y === food.value.y)) {
        pos = p
        break
      }
    }
    if (!pos) {
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (!snakeSet.value.has(`${x},${y}`) &&
              !(food.value && x === food.value.x && y === food.value.y)) {
            pos = { x, y }
            break
          }
        }
        if (pos) break
      }
    }
    if (!pos) return
    specialFood.value = pos
    setTimeout(() => {
      if (specialFood.value && pos.x === specialFood.value.x && pos.y === specialFood.value.y) {
        specialFood.value = null
      }
    }, 5000)
  }

  function activateRandomSkill() {
    const skill = SKILLS[randomInt(0, SKILLS.length - 1)]
    if (!ownedSkills.value.find(s => s.id === skill.id)) {
      ownedSkills.value.push({ ...skill })
    }
  }

  function useSkill(skillId) {
    if (cooldowns.value[skillId]) return
    if (activeSkills.value[skillId]) return
    if (!ownedSkills.value.find(s => s.id === skillId)) return

    activeSkills.value = { ...activeSkills.value, [skillId]: 5 }
    play('skill')

    if (skillId === 'speedUp') {
      currentSpeed.value = Math.max(MIN_SPEED, Math.floor(baseSpeed.value * 0.5))
      scheduleNextTick()
    } else if (skillId === 'slowDown') {
      currentSpeed.value = Math.min(MAX_SPEED, Math.floor(baseSpeed.value * 2))
      scheduleNextTick()
    }
  }

  function updateSkills(dt) {
    const newActive = { ...activeSkills.value }
    for (const [id, remaining] of Object.entries(newActive)) {
      newActive[id] = remaining - dt
      if (newActive[id] <= 0) {
        delete newActive[id]
        const skill = SKILLS.find(s => s.id === id)
        cooldowns.value = { ...cooldowns.value, [id]: skill.cooldown }
        if (id === 'speedUp' || id === 'slowDown') {
          currentSpeed.value = baseSpeed.value
        }
        play('skillEnd')
      }
    }
    activeSkills.value = newActive

    const newCD = { ...cooldowns.value }
    for (const [id, remaining] of Object.entries(newCD)) {
      newCD[id] = remaining - dt
      if (newCD[id] <= 0) {
        delete newCD[id]
      }
    }
    cooldowns.value = newCD
  }

  function setDirection(dir) {
    if (direction.value.x + dir.x === 0 && direction.value.y + dir.y === 0) return
    nextDirection.value = dir
  }

  function handleKey(e) {
    const key = e.key
    const keyMap = {
      ArrowUp: DIR.UP, ArrowDown: DIR.DOWN, ArrowLeft: DIR.LEFT, ArrowRight: DIR.RIGHT,
      w: DIR.UP, W: DIR.UP,
      s: DIR.DOWN, S: DIR.DOWN,
      a: DIR.LEFT, A: DIR.LEFT,
      d: DIR.RIGHT, D: DIR.RIGHT
    }
    if (keyMap[key]) {
      e.preventDefault()
      if (gameState.value === 'start') {
        gameState.value = 'playing'
        startLoop()
      }
      if (gameState.value === 'playing') {
        setDirection(keyMap[key])
      }
    }

    if (gameState.value === 'playing' && ['1', '2', '3', '4'].includes(key)) {
      const skillMap = { '1': 'speedUp', '2': 'slowDown', '3': 'ghost', '4': 'doubleScore' }
      useSkill(skillMap[key])
    }

    if (key === 'p' || key === 'P') {
      if (gameState.value === 'playing') {
        gameState.value = 'paused'
        play('pause')
      }
      else if (gameState.value === 'paused') {
        gameState.value = 'playing'
        play('pause')
        scheduleNextTick()
      }
    }

    if (key === ' ' && gameState.value === 'gameover') {
      gameState.value = 'start'
    }
    if ((key === 'Enter' || key === ' ') && gameState.value === 'start') {
      e.preventDefault()
      gameState.value = 'playing'
      startLoop()
    }
  }

  function scheduleNextTick() {
    if (gameLoop) clearTimeout(gameLoop)
    gameLoop = setTimeout(function gameTick() {
      try {
        tick()
      } catch (e) {
        console.error('tick error:', e)
      }
      if (gameState.value === 'playing' && !isDying) {
        gameLoop = setTimeout(gameTick, currentSpeed.value)
      }
    }, currentSpeed.value)
  }

  function tick() {
    if (gameState.value !== 'playing') return
    if (isDying) return

    updateSkills(0.2)

    gameTick.value++

    direction.value = { ...nextDirection.value }

    const head = snake.value[0]
    let newHead = { x: head.x + direction.value.x, y: head.y + direction.value.y }

    const wallHit = newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE
    if (wallHit) {
      if (activeSkills.value.ghost) {
        newHead = { x: ((newHead.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE, y: ((newHead.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE }
      } else {
        isDying = true
        deathEffect.value = { ...head }
        play('death')
        setTimeout(() => {
          gameState.value = 'gameover'
          if (score.value > highScore.value) {
            highScore.value = score.value
            localStorage.setItem('snake-high-score', String(highScore.value))
          }
          stopLoop()
        }, 500)
        return
      }
    }

    if (!wallHit && snakeSet.value.has(`${newHead.x},${newHead.y}`)) {
      isDying = true
      deathEffect.value = { ...newHead }
      play('death')
      setTimeout(() => {
        gameState.value = 'gameover'
        if (score.value > highScore.value) {
          highScore.value = score.value
          localStorage.setItem('snake-high-score', String(highScore.value))
        }
        stopLoop()
      }, 500)
      return
    }

    snake.value = [{ ...newHead }, ...snake.value]

    let ate = false

    if (newHead.x === food.value.x && newHead.y === food.value.y) {
      ate = true
      combo.value += 1
      if (combo.value === 3) play('combo')
      else if (combo.value === 5) play('combo2')
      else if (combo.value === 10) play('combo3')
      const bonus = Math.floor(combo.value / 5) + 1
      const multiplier = activeSkills.value.doubleScore ? 2 : 1
      score.value += bonus * multiplier
      eatEffect.value = { x: newHead.x, y: newHead.y, type: 'normal', time: Date.now() }
      play('eat')
      spawnFood()
    }

    if (specialFood.value && newHead.x === specialFood.value.x && newHead.y === specialFood.value.y) {
      ate = true
      combo.value += 1
      const multiplier = activeSkills.value.doubleScore ? 2 : 1
      score.value += 10 * multiplier
      activateRandomSkill()
      specialFood.value = null
      eatEffect.value = { x: newHead.x, y: newHead.y, type: 'special', time: Date.now() }
      play('special')
    }

    if (!ate) {
      snake.value.pop()
    }

    if (!specialFood.value && Math.random() < 0.02 && gameTick.value > 10) {
      spawnSpecialFood()
    }
  }

  function startLoop() {
    stopLoop()
    initGame()
    gameState.value = 'playing'
    scheduleNextTick()
  }

  function startGame() {
    startLoop()
  }

  function stopLoop() {
    if (gameLoop) {
      clearTimeout(gameLoop)
      gameLoop = null
    }
  }

  onMounted(() => {
    initGame()
    window.addEventListener('keydown', handleKey)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKey)
    stopLoop()
  })

  return {
    GRID_SIZE,
    SKILLS,
    snake,
    food,
    specialFood,
    direction,
    score,
    combo,
    highScore,
    gameState,
    baseSpeed,
    currentSpeed,
    activeSkills,
    ownedSkills,
    cooldowns,
    eatEffect,
    deathEffect,
    gameTick,
    initGame,
    startGame,
    stopLoop,
    handleKey,
    useSkill,
    setDirection
  }
}
