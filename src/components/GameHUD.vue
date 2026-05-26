<template>
  <div class="hud">
    <div class="hud-left">
      <div class="score-display">
        <div class="score-label">{{ t('hud.score') }}</div>
        <div class="score-value" :key="score">{{ score }}</div>
        <div v-if="combo >= 3" class="combo-badge">
          🔥 x{{ combo }}
        </div>
      </div>
    </div>

    <div class="hud-center">
      <div class="game-status">
        <div v-if="ghostActive" class="status-badge ghost">
          {{ t('hud.ghost') }}
        </div>
        <div v-if="doubleActive" class="status-badge double">
          {{ t('hud.double') }}
        </div>
        <div v-if="speedActive" class="status-badge speed">
          {{ t('hud.speed') }}
        </div>
        <div v-if="slowActive" class="status-badge slow">
          {{ t('hud.slow') }}
        </div>
      </div>
      <div class="pause-hint" v-if="paused">
        <span class="pause-text">{{ t('hud.paused') }}</span>
        <span class="pause-sub">{{ t('hud.pauseSub') }}</span>
      </div>
    </div>

    <div class="hud-right">
      <div class="high-score">
        <span class="hs-label">🏆</span>
        <span class="hs-value">{{ highScore }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'

const { t } = useI18n()

const props = defineProps({
  score: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
  combo: { type: Number, default: 0 },
  activeSkills: { type: Object, default: () => ({}) },
  gameState: { type: String, default: 'start' }
})

const ghostActive = computed(() => props.activeSkills?.ghost)
const doubleActive = computed(() => props.activeSkills?.doubleScore)
const speedActive = computed(() => props.activeSkills?.speedUp)
const slowActive = computed(() => props.activeSkills?.slowDown)
const paused = computed(() => props.gameState === 'paused')
</script>

<style scoped>
.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--bg-card);
  border: 1px solid rgba(0, 255, 136, 0.1);
  border-radius: 12px;
  min-width: 500px;
  gap: 20px;
}

.hud-left, .hud-center, .hud-right {
  display: flex;
  align-items: center;
}

.hud-left { flex: 1; }
.hud-center {
  flex: 2;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
}
.hud-right {
  flex: 1;
  justify-content: flex-end;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-label {
  font-size: 12px;
  color: var(--text-secondary);
  font-family: 'Orbitron', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.score-value {
  font-family: 'Orbitron', monospace;
  font-size: 28px;
  font-weight: 900;
  color: var(--neon-green);
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
  animation: scorePop 0.3s ease-out;
}

@keyframes scorePop {
  0% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.combo-badge {
  font-size: 14px;
  font-weight: 700;
  color: var(--neon-gold);
  animation: wobble 0.5s ease-in-out;
}

.high-score {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Orbitron', monospace;
  font-size: 16px;
}

.hs-label { font-size: 18px; }

.hs-value {
  color: var(--neon-gold);
  font-weight: 700;
}

.game-status {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
}

.status-badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  animation: fadeInScale 0.3s ease-out;
}

.status-badge.ghost {
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.5);
  color: var(--neon-purple);
}

.status-badge.double {
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.5);
  color: var(--neon-gold);
}

.status-badge.speed {
  background: rgba(0, 212, 255, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.5);
  color: var(--neon-cyan);
}

.status-badge.slow {
  background: rgba(34, 211, 238, 0.2);
  border: 1px solid rgba(34, 211, 238, 0.5);
  color: var(--neon-cyan);
}

.pause-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.pause-text {
  font-family: 'Orbitron', monospace;
  font-size: 18px;
  font-weight: 700;
  color: var(--neon-gold);
  animation: pulse 1s ease-in-out infinite;
}

.pause-sub {
  font-size: 11px;
  color: var(--text-secondary);
}
</style>
