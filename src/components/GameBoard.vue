<template>
  <div class="board-wrapper">
    <div class="board-container" :style="boardStyle">
      <div class="board-border"></div>
      <div class="board-bg"></div>
      <div class="grid-overlay">
        <div v-for="(_, i) in GRID_SIZE * GRID_SIZE" :key="i" class="grid-cell"
          :class="cellClasses(i)">
        </div>
      </div>

      <div v-if="eatEffect" class="eat-particle"
        :style="{
          '--x': `${(eatEffect.x / GRID_SIZE) * 100}%`,
          '--y': `${(eatEffect.y / GRID_SIZE) * 100}%`
        }">
        <div v-for="n in 8" :key="n" class="particle"
          :style="{ '--i': n, '--color': eatEffect.type === 'special' ? 'var(--neon-gold)' : 'var(--neon-green)' }">
        </div>
      </div>

      <div v-if="deathEffect" class="death-effect"
        :style="{
          '--x': `${(deathEffect.x / GRID_SIZE) * 100}%`,
          '--y': `${(deathEffect.y / GRID_SIZE) * 100}%`
        }">
        <div class="death-ring"></div>
        <div class="death-ring r2"></div>
        <div class="death-ring r3"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GRID_SIZE } from '../composables/useGame.js'

const props = defineProps({
  snake: { type: Array, required: true },
  food: { type: Object, required: true },
  specialFood: { type: Object, default: null },
  direction: { type: Object, required: true },
  eatEffect: { type: Object, default: null },
  deathEffect: { type: Object, default: null }
})

const boardStyle = computed(() => ({
  '--grid-size': GRID_SIZE,
  '--cell-size': `${480 / GRID_SIZE}px`
}))

function cellClasses(index) {
  const x = index % GRID_SIZE
  const y = Math.floor(index / GRID_SIZE)
  const classes = {}

  const snakePart = props.snake.findIndex(s => s.x === x && s.y === y)
  if (snakePart === 0) {
    classes['snake-head'] = true
    classes[`dir-${dirClass(props.direction)}`] = true
  } else if (snakePart > 0) {
    classes['snake-body'] = true
    const idx = Math.min(snakePart, 5)
    classes[`body-${idx}`] = true
  }

  if (props.food && props.food.x === x && props.food.y === y) {
    classes['food-cell'] = true
  }

  if (props.specialFood && props.specialFood.x === x && props.specialFood.y === y) {
    classes['special-food'] = true
  }

  if (x === 0 || x === GRID_SIZE - 1 || y === 0 || y === GRID_SIZE - 1) {
    classes['edge-cell'] = true
  }

  return classes
}

function dirClass(dir) {
  if (dir.x === 1) return 'right'
  if (dir.x === -1) return 'left'
  if (dir.y === -1) return 'up'
  if (dir.y === 1) return 'down'
  return 'right'
}
</script>

<style scoped>
.board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.board-container {
  position: relative;
  --cell-size: 24px;
  width: calc(var(--grid-size) * var(--cell-size));
  height: calc(var(--grid-size) * var(--cell-size));
}

.board-border {
  position: absolute;
  inset: -6px;
  border: 2px solid rgba(0, 255, 136, 0.4);
  border-radius: 16px;
  animation: borderPulse 3s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.15), inset 0 0 15px rgba(0, 255, 136, 0.05);
}

.board-bg {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
}

.grid-overlay {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--grid-size), var(--cell-size));
  grid-template-rows: repeat(var(--grid-size), var(--cell-size));
  gap: 1px;
  padding: 0;
}

.grid-cell {
  width: var(--cell-size);
  height: var(--cell-size);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.02);
  transition: background 0.1s, box-shadow 0.1s, transform 0.1s;
  position: relative;
}

.grid-cell.snake-head {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.6), 0 0 16px rgba(0, 255, 136, 0.3);
  z-index: 2;
}

.grid-cell.snake-head.dir-up::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  box-shadow: 8px 0 0 0 rgba(0, 0, 0, 0.4);
}
.grid-cell.snake-head.dir-down::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  box-shadow: 8px 0 0 0 rgba(0, 0, 0, 0.4);
}
.grid-cell.snake-head.dir-left::after {
  content: '';
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.4);
}
.grid-cell.snake-head.dir-right::after {
  content: '';
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.4);
}

.grid-cell.snake-body {
  border-radius: 3px;
  z-index: 1;
}

.body-1 { background: linear-gradient(135deg, #00e67a, #00b8e6); box-shadow: 0 0 4px rgba(0, 230, 122, 0.3); }
.body-2 { background: linear-gradient(135deg, #00cc6a, #00a3cc); box-shadow: 0 0 3px rgba(0, 204, 106, 0.25); }
.body-3 { background: linear-gradient(135deg, #00b35c, #008fb3); box-shadow: 0 0 2px rgba(0, 179, 92, 0.2); }
.body-4 { background: linear-gradient(135deg, #00994d, #007a99); box-shadow: 0 0 2px rgba(0, 153, 77, 0.15); }
.body-5 { background: linear-gradient(135deg, #008040, #006680); }

.grid-cell.food-cell {
  background: radial-gradient(circle at 35% 35%, #ff6b9d, #ff2d78);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 45, 120, 0.6), 0 0 20px rgba(255, 45, 120, 0.3);
  animation: foodPulse 0.8s ease-in-out infinite;
  z-index: 3;
}

@keyframes foodPulse {
  0%, 100% { transform: scale(0.85); opacity: 1; }
  50% { transform: scale(1); opacity: 0.8; }
}

.grid-cell.special-food {
  background: radial-gradient(circle at 35% 35%, #ffe44d, #ffd700);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.4);
  animation: specialPulse 0.6s ease-in-out infinite, shimmer 1.5s linear infinite;
  z-index: 3;
}

@keyframes specialPulse {
  0%, 100% { transform: scale(0.85) rotate(0deg); }
  50% { transform: scale(1.05) rotate(10deg); }
}

.grid-cell.edge-cell:not(.food-cell):not(.special-food) {
  background: rgba(0, 255, 136, 0.05);
}

.eat-particle {
  position: absolute;
  top: var(--y);
  left: var(--x);
  width: 0;
  height: 0;
  z-index: 10;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color);
  animation: particleBurst 0.6s ease-out forwards;
}

.particle:nth-child(1) { --tx: 30px; --ty: 0px; }
.particle:nth-child(2) { --tx: 21px; --ty: 21px; }
.particle:nth-child(3) { --tx: 0px; --ty: 30px; }
.particle:nth-child(4) { --tx: -21px; --ty: 21px; }
.particle:nth-child(5) { --tx: -30px; --ty: 0px; }
.particle:nth-child(6) { --tx: -21px; --ty: -21px; }
.particle:nth-child(7) { --tx: 0px; --ty: -30px; }
.particle:nth-child(8) { --tx: 21px; --ty: -21px; }

@keyframes particleBurst {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
}

.death-effect {
  position: absolute;
  top: var(--y);
  left: var(--x);
  width: 0;
  height: 0;
  z-index: 10;
  pointer-events: none;
}

.death-ring {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid var(--neon-pink);
  border-radius: 50%;
  animation: ringExpand 0.5s ease-out forwards;
}

.death-ring.r2 {
  animation-delay: 0.1s;
  border-color: var(--neon-gold);
}

.death-ring.r3 {
  animation-delay: 0.2s;
  border-color: var(--neon-green);
}

@keyframes ringExpand {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
}
</style>
