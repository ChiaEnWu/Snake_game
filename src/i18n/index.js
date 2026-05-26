import { ref } from 'vue'
import messages from './messages.js'

const stored = localStorage.getItem('snake-locale')
const locale = ref(stored && messages[stored] ? stored : 'zh-TW')

export function useI18n() {
  function t(key, params = {}) {
    const keys = key.split('.')
    let value = messages[locale.value]
    for (const k of keys) {
      if (value == null) return key
      value = value[k]
    }
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? `{${name}}`)
    }
    return key
  }

  return { t, locale }
}

export function setLocale(l) {
  if (messages[l]) {
    locale.value = l
    localStorage.setItem('snake-locale', l)
  }
}

export { messages }
