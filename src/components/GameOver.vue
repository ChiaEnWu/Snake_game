<template>
  <div class="game-over-overlay">
    <div class="game-over-modal">
      <div class="game-over-icon">💀</div>
      <h2 class="game-over-title">遊戲結束</h2>

      <div class="results">
        <div class="result-row">
          <span class="result-label">得分</span>
          <span class="result-value score" :key="score">{{ score }}</span>
        </div>
        <div class="result-row" v-if="score >= highScore && score > 0">
          <span class="result-label">🏆</span>
          <span class="result-value new-record">新紀錄！</span>
        </div>
        <div class="result-row">
          <span class="result-label">最高紀錄</span>
          <span class="result-value hs">{{ highScore }}</span>
        </div>
      </div>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-icon">📏</span>
          <span class="stat-label">蛇身長度</span>
          <span class="stat-value">{{ snakeLength }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-label">最大 Combo</span>
          <span class="stat-value">{{ maxCombo }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">⚡</span>
          <span class="stat-label">技能解鎖</span>
          <span class="stat-value">{{ skillCount }}</span>
        </div>
      </div>

      <div class="game-over-actions">
        <button class="action-btn primary" @click="$emit('restart')">
          🔄 再玩一次
        </button>
        <button class="action-btn secondary" @click="$emit('menu')">
          🏠 回到主選單
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  snakeLength: { type: Number, default: 3 },
  maxCombo: { type: Number, default: 0 },
  skillCount: { type: Number, default: 0 }
})

defineEmits(['restart', 'menu'])
</script>

<style scoped>
.game-over-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 100;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-over-modal {
  background: var(--bg-card);
  border: 1px solid rgba(255, 45, 120, 0.3);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: fadeInScale 0.4s ease-out;
  box-shadow: 0 0 40px rgba(255, 45, 120, 0.1);
}

.game-over-icon {
  font-size: 60px;
  margin-bottom: 10px;
  animation: wobble 0.6s ease-in-out;
}

.game-over-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  font-weight: 900;
  background: linear-gradient(135deg, var(--neon-pink), var(--neon-gold));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.result-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.result-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.result-value {
  font-family: 'Orbitron', monospace;
  font-size: 24px;
  font-weight: 900;
}

.result-value.score {
  color: var(--neon-green);
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.result-value.new-record {
  color: var(--neon-gold);
  font-size: 18px;
  animation: pulse 1s ease-in-out infinite;
}

.result-value.hs {
  color: var(--neon-gold);
}

.stats {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-icon {
  font-size: 20px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.stat-value {
  font-family: 'Orbitron', monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--neon-blue);
}

.game-over-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--neon-green), var(--neon-blue));
  color: var(--bg-primary);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}
</style>
