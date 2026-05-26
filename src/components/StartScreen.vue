<template>
  <div class="start-screen">
    <div class="stars"></div>

    <div class="title-section">
      <div class="title-icon">🐍</div>
      <h1 class="title">
        <span class="title-line" v-for="(char, i) in titleChars" :key="i"
          :style="{ animationDelay: `${i * 0.08}s` }">{{ char }}</span>
      </h1>
      <p class="subtitle">{{ t('start.subtitle') }}</p>
    </div>

    <div class="start-content">
      <div class="game-preview">
        <div class="preview-grid">
          <div v-for="(_, i) in 100" :key="i" class="preview-cell"
            :class="{ 'preview-snake': previewSnake.includes(i), 'preview-food': previewFood === i }">
          </div>
        </div>
      </div>

      <div class="info-panel">
        <div class="info-section">
          <h3 class="info-title">{{ t('start.controls') }}</h3>
          <div class="key-bindings">
            <div class="key-row">
              <kbd>W</kbd><kbd>↑</kbd>
            </div>
            <div class="key-row">
              <kbd>A</kbd><kbd>←</kbd>
              <kbd>S</kbd><kbd>↓</kbd>
              <kbd>D</kbd><kbd>→</kbd>
            </div>
          </div>
          <p class="info-text">{{ t('start.controlsDesc') }}</p>
        </div>

        <div class="info-section">
          <h3 class="info-title">{{ t('start.skills') }}</h3>
          <div class="skills-preview">
            <div v-for="skill in previewSkills" :key="skill.id" class="skill-tag">
              <span class="skill-icon">{{ skill.icon }}</span>
              <span class="skill-name">{{ t('skill.' + skill.id) }}</span>
              <span class="skill-key">{{ skill.key }}</span>
            </div>
          </div>
          <p class="info-text">{{ t('start.skillDesc') }}</p>
        </div>

        <div class="info-section">
          <h3 class="info-title">{{ t('start.tips') }}</h3>
          <ul class="tips">
            <li>{{ t('start.comboTip') }}</li>
            <li>{{ t('start.pauseTip') }} <kbd>P</kbd></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="start-actions">
      <button class="start-btn" @click="$emit('start')">
        <span class="btn-text">{{ t('start.startBtn') }}</span>
        <span class="btn-hint">{{ t('start.startHint') }}</span>
      </button>

      <div class="high-score-display" v-if="highScore > 0">
        {{ t('start.highScore') }} {{ highScore }}
      </div>
    </div>

    <div class="lang-wrapper">
      <LangSelector />
    </div>

    <div class="decorations">
      <div class="deco-circle c1"></div>
      <div class="deco-circle c2"></div>
      <div class="deco-circle c3"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import LangSelector from './LangSelector.vue'

defineProps({
  highScore: { type: Number, default: 0 }
})

defineEmits(['start'])

const { t } = useI18n()

const titleChars = computed(() => t('start.title').split(''))

const previewSkills = [
  { id: 'speedUp', icon: '🚀', key: '1' },
  { id: 'slowDown', icon: '🐢', key: '2' },
  { id: 'ghost', icon: '👻', key: '3' },
  { id: 'doubleScore', icon: '💎', key: '4' }
]

const previewSnake = [32, 33, 34, 35, 45, 55, 65, 66, 67]
const previewFood = 23
</script>

<style scoped>
.start-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 40px;
  position: relative;
  min-height: 100vh;
  justify-content: center;
  gap: 30px;
}

.stars {
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
    radial-gradient(2px 2px at 50px 160px, rgba(255,255,255,0.3), transparent),
    radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.2), transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.3), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.2), transparent),
    radial-gradient(1px 1px at 300px 200px, rgba(255,255,255,0.4), transparent),
    radial-gradient(1px 1px at 400px 100px, rgba(255,255,255,0.3), transparent),
    radial-gradient(1px 1px at 500px 300px, rgba(255,255,255,0.2), transparent),
    radial-gradient(1px 1px at 600px 150px, rgba(255,255,255,0.3), transparent);
  background-size: 200px 200px;
  animation: twinkle 3s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes twinkle {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

.title-section {
  text-align: center;
  animation: fadeInScale 0.8s ease-out;
}

.title-icon {
  font-size: 60px;
  animation: float 3s ease-in-out infinite;
  margin-bottom: 10px;
}

.title {
  font-family: 'Orbitron', sans-serif;
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 8px;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.title-line {
  display: inline-block;
  background: linear-gradient(135deg, var(--neon-green), var(--neon-blue), var(--neon-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.5s ease-out backwards;
  text-shadow: none;
  filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.5));
}

.subtitle {
  font-size: 18px;
  color: var(--text-secondary);
  margin-top: 10px;
  letter-spacing: 4px;
  animation: fadeInUp 0.6s ease-out 0.5s backwards;
}

.start-content {
  display: flex;
  gap: 40px;
  align-items: center;
  animation: fadeInUp 0.6s ease-out 0.3s backwards;
}

.game-preview {
  flex-shrink: 0;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(10, 18px);
  grid-template-rows: repeat(10, 18px);
  gap: 2px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  border: 1px solid rgba(0, 255, 136, 0.15);
}

.preview-cell {
  width: 18px;
  height: 18px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.2s;
}

.preview-snake {
  background: linear-gradient(135deg, var(--neon-green), var(--neon-blue));
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.4);
}

.preview-food {
  background: var(--neon-pink);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(255, 45, 120, 0.6);
  animation: pulse 1s ease-in-out infinite;
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-section {
  background: var(--bg-card);
  border: 1px solid rgba(0, 255, 136, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 260px;
  transition: border-color 0.3s;
}

.info-section:hover {
  border-color: var(--border-glow);
}

.info-title {
  font-size: 15px;
  color: var(--neon-green);
  margin-bottom: 10px;
  font-weight: 700;
}

.key-bindings {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;
}

.key-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 6px;
  font-family: 'Orbitron', monospace;
  font-size: 12px;
  color: var(--neon-green);
}

.skills-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 20px;
  font-size: 13px;
}

.skill-icon { font-size: 14px; }
.skill-name { color: var(--neon-purple); font-weight: 700; }
.skill-key {
  font-family: 'Orbitron', monospace;
  font-size: 10px;
  color: var(--text-secondary);
  margin-left: 2px;
}

.info-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.tips {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.tips li kbd {
  min-width: 24px;
  height: 22px;
  padding: 0 6px;
  font-size: 10px;
  display: inline-flex;
}

.start-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: fadeInUp 0.6s ease-out 0.6s backwards;
}

.start-btn {
  position: relative;
  padding: 16px 60px;
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: var(--bg-primary);
  background: linear-gradient(135deg, var(--neon-green), var(--neon-blue));
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  animation: glow 2s ease-in-out infinite;
}

.start-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 212, 255, 0.3);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-hint {
  display: block;
  font-size: 11px;
  font-weight: 400;
  opacity: 0.7;
  margin-top: 4px;
}

.high-score-display {
  font-size: 16px;
  color: var(--neon-gold);
  font-weight: 700;
}

.lang-wrapper {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 10;
}

.decorations {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.15;
}

.c1 {
  width: 300px;
  height: 300px;
  background: var(--neon-green);
  top: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite;
}

.c2 {
  width: 250px;
  height: 250px;
  background: var(--neon-blue);
  bottom: -80px;
  right: -80px;
  animation: float 10s ease-in-out infinite reverse;
}

.c3 {
  width: 200px;
  height: 200px;
  background: var(--neon-purple);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float 12s ease-in-out infinite 2s;
}
</style>
