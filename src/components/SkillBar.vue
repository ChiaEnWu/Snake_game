<template>
  <div class="skill-bar">
    <div class="skill-bar-label">⚡ 技能</div>
    <div class="skills">
      <button v-for="skill in SKILLS" :key="skill.id" class="skill-btn"
        :class="{
          owned: isOwned(skill.id),
          active: isActive(skill.id),
          cooldown: isCooldown(skill.id),
          locked: !isOwned(skill.id)
        }"
        :disabled="!isOwned(skill.id) || isActive(skill.id) || isCooldown(skill.id)"
        @click="$emit('use-skill', skill.id)"
        :title="skillTooltip(skill)">
        <div class="skill-icon">{{ skill.icon }}</div>
        <div class="skill-name">{{ skill.name }}</div>
        <div class="skill-key">{{ skill.key }}</div>
        <div v-if="isActive(skill.id)" class="skill-timer">
          <div class="timer-bar" :style="{ width: activePercent(skill.id) + '%' }"></div>
        </div>
        <div v-if="isCooldown(skill.id)" class="skill-cooldown-overlay">
          <span>{{ cooldownRemaining(skill.id) }}s</span>
        </div>
        <div v-if="!isOwned(skill.id)" class="skill-lock">🔒</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GAME_SKILLS as SKILLS } from '../composables/useGame.js'

const props = defineProps({
  ownedSkills: { type: Array, default: () => [] },
  activeSkills: { type: Object, default: () => ({}) },
  cooldowns: { type: Object, default: () => ({}) },
  gameState: { type: String, default: 'start' }
})

defineEmits(['use-skill'])



function isOwned(id) {
  return props.ownedSkills.some(s => s.id === id)
}

function isActive(id) {
  return !!props.activeSkills[id]
}

function isCooldown(id) {
  return !!props.cooldowns[id]
}

function activePercent(id) {
  const remaining = props.activeSkills[id]
  if (!remaining) return 0
  const total = SKILL_DURATIONS[id]
  return (remaining / total) * 100
}

function cooldownRemaining(id) {
  return Math.ceil(props.cooldowns[id] || 0)
}

function skillTooltip(skill) {
  if (isActive(skill.id)) return `${skill.name} 進行中`
  if (isCooldown(skill.id)) return `冷卻中 ${cooldownRemaining(skill.id)}s`
  if (isOwned(skill.id)) return `按 ${skill.key} 使用 ${skill.name}`
  return '吃掉金色食物解鎖'
}
</script>

<style scoped>
.skill-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid rgba(0, 255, 136, 0.1);
  border-radius: 12px;
  min-width: 500px;
}

.skill-bar-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
  white-space: nowrap;
}

.skills {
  display: flex;
  gap: 8px;
  flex: 1;
}

.skill-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 70px;
  flex: 1;
  overflow: hidden;
  font-family: inherit;
  color: var(--text-primary);
}

.skill-btn:not(.locked):hover {
  border-color: var(--neon-purple);
  background: rgba(168, 85, 247, 0.1);
  transform: translateY(-2px);
}

.skill-btn.active {
  border-color: var(--neon-purple);
  background: rgba(168, 85, 247, 0.15);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.2);
}

.skill-btn.cooldown {
  opacity: 0.5;
}

.skill-btn.locked {
  opacity: 0.3;
  cursor: not-allowed;
}

.skill-btn:disabled {
  cursor: not-allowed;
}

.skill-icon {
  font-size: 20px;
  line-height: 1;
}

.skill-name {
  font-size: 11px;
  font-weight: 700;
}

.skill-key {
  font-family: 'Orbitron', monospace;
  font-size: 10px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 0 6px;
  border-radius: 4px;
  line-height: 16px;
}

.skill-timer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: rgba(168, 85, 247, 0.2);
}

.timer-bar {
  height: 100%;
  background: var(--neon-purple);
  transition: width 0.1s linear;
  border-radius: 0 0 0 10px;
}

.skill-cooldown-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  font-family: 'Orbitron', monospace;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-secondary);
}

.skill-lock {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>
