<template>
  <div class="app">
    <Transition name="screen">
      <StartScreen
        v-if="gameState === 'start'"
        key="start"
        :highScore="highScore"
        @start="handleStart"
      />
    </Transition>

    <Transition name="screen">
      <div v-if="gameState !== 'start'" class="game-layout" :key="gameKey"
        :class="{ 'gameover-bg': gameState === 'gameover' }">
        <div class="game-header">
          <button class="back-btn" @click="backToMenu" :title="t('app.backTitle')">
            ← {{ t('app.back') }}
          </button>
          <div class="game-mode-badge" v-if="activeSkills.ghost">{{ t('app.ghostMode') }}</div>
          <div class="game-header-right">
            <LangSelector />
          </div>
        </div>

        <SkillBar
          :ownedSkills="ownedSkills"
          :activeSkills="activeSkills"
          :cooldowns="cooldowns"
          :gameState="gameState"
          @use-skill="useSkill"
        />

        <GameHUD
          :score="score"
          :highScore="highScore"
          :combo="combo"
          :activeSkills="activeSkills"
          :gameState="gameState"
        />

        <GameBoard
          :snake="snake"
          :food="food"
          :specialFood="specialFood"
          :direction="direction"
          :eatEffect="eatEffect"
          :deathEffect="deathEffect"
        />

        <div class="game-controls-hint">
          <span>{{ t('app.controls') }}</span>
          <span class="sep">|</span>
          <span>{{ t('app.pause') }}</span>
          <span class="sep">|</span>
          <span>{{ t('app.skillKeys') }}</span>
        </div>
      </div>
    </Transition>

    <Transition name="flash">
      <div v-if="showFlash" class="death-flash"></div>
    </Transition>

    <Transition name="overlay">
      <GameOver
        v-if="gameState === 'gameover'"
        key="gameover"
        :score="score"
        :highScore="highScore"
        :snakeLength="snake.length"
        :maxCombo="combo"
        :skillCount="ownedSkills.length"
        @restart="handleRestart"
        @menu="backToMenu"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import StartScreen from './components/StartScreen.vue'
import GameBoard from './components/GameBoard.vue'
import GameHUD from './components/GameHUD.vue'
import SkillBar from './components/SkillBar.vue'
import GameOver from './components/GameOver.vue'
import LangSelector from './components/LangSelector.vue'
import { useGame } from './composables/useGame.js'
import { useI18n } from './i18n/index.js'
import { useSound, preloadAudio } from './composables/useSound.js'

const { t } = useI18n()
const { play } = useSound()

const {
  snake,
  food,
  specialFood,
  direction,
  score,
  combo,
  highScore,
  gameState,
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
} = useGame()

const gameKey = ref(0)
const showFlash = ref(false)

watch(gameState, (val, old) => {
  if (val === 'gameover' && old === 'playing') {
    showFlash.value = true
    setTimeout(() => { showFlash.value = false }, 350)
  }
})

function handleStart() {
  preloadAudio()
  gameKey.value++
  startGame()
}

function backToMenu() {
  stopLoop()
  gameState.value = 'start'
  gameKey.value++
}

function handleRestart() {
  gameKey.value++
  startGame()
}
</script>

<style scoped>
.app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.game-layout.gameover-bg {
  filter: blur(3px) brightness(0.4);
  pointer-events: none;
  transition: filter 0.3s ease;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 500px;
}

.game-header-right {
  margin-left: auto;
}

.back-btn {
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.game-mode-badge {
  padding: 4px 12px;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  color: var(--neon-purple);
  animation: pulse 1.5s ease-in-out infinite;
}

.game-controls-hint {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
  padding: 6px 0;
}

.sep {
  color: rgba(255, 255, 255, 0.15);
}

/* -- Screen transitions -- */
.screen-enter-active {
  animation: fadeInScale 0.4s ease-out;
}
.screen-leave-active {
  animation: fadeOutScale 0.3s ease-in;
}

@keyframes fadeOutScale {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.92); }
}

/* -- Flash overlay -- */
.death-flash {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 200;
  pointer-events: none;
}

.flash-enter-active {
  animation: flashIn 0.15s ease-out;
}
.flash-leave-active {
  animation: flashOut 0.2s ease-in;
}

@keyframes flashIn {
  0% { opacity: 0; }
  100% { opacity: 0.3; }
}
@keyframes flashOut {
  0% { opacity: 0.3; }
  100% { opacity: 0; }
}

/* -- Overlay transitions -- */
.overlay-enter-active {
  animation: overlayIn 0.4s ease-out 0.2s both;
}
.overlay-leave-active {
  animation: overlayOut 0.25s ease-in;
}

@keyframes overlayIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes overlayOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
</style>
