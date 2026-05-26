<template>
  <div class="lang-selector">
    <button v-for="l in langs" :key="l.code" class="lang-btn"
      :class="{ active: locale === l.code }"
      @click="setLocale(l.code)">
      {{ l.label }}
    </button>
  </div>
</template>

<script setup>
import { useI18n, setLocale } from '../i18n/index.js'

const { locale, t } = useI18n()

const langs = [
  { code: 'zh-TW', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日' },
]
</script>

<style scoped>
.lang-selector {
  display: flex;
  gap: 4px;
}

.lang-btn {
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.lang-btn:hover {
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.3);
  color: var(--text-primary);
}

.lang-btn.active {
  background: rgba(0, 255, 136, 0.15);
  border-color: var(--neon-green);
  color: var(--neon-green);
}
</style>
