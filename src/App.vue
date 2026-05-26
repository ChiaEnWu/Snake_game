<template>
  <div class="app">
    <StartScreen
      v-if="gameState === 'start'"
      :highScore="highScore"
      @start="startGame"
    />

    <div v-else class="game-layout">
      <div class="game-header">
        <button class="back-btn" @click="backToMenu" title="回到主選單">
          ← 離開
        </button>
        <div class="game-mode-badge" v-if="activeSkills.ghost">👻 無敵模式</div>
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
        <span>WASD / 方向鍵 移動</span>
        <span class="sep">|</span>
        <span>P 暫停</span>
        <span class="sep">|</span>
        <span>1-4 使用技能</span>
      </div>
    </div>

    <GameOver
      v-if="gameState === 'gameover'"
      :score="score"
      :highScore="highScore"
      :snakeLength="snake.length"
      :maxCombo="combo"
      :skillCount="ownedSkills.length"
      @restart="handleRestart"
      @menu="backToMenu"
    />
  </div>
</template>

<script setup>
import StartScreen from './components/StartScreen.vue'
import GameBoard from './components/GameBoard.vue'
import GameHUD from './components/GameHUD.vue'
import SkillBar from './components/SkillBar.vue'
import GameOver from './components/GameOver.vue'
import { useGame } from './composables/useGame.js'

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

function backToMenu() {
  stopLoop()
  gameState.value = 'start'
}

function handleRestart() {
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
  animation: fadeInScale 0.4s ease-out;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 500px;
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
</style>