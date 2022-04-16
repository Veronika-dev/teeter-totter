<template>
  <div class="game-timer">
    <svg class="game-timer--svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="game-timer--circle">
        <circle class="game-timer--path-elapsed" cx="50" cy="50" r="45" />
        <path
          :stroke-dasharray="circleDasharray"
          class="game-timer--path-remaining"
          d="M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
        ></path>
      </g>
    </svg>
    <span class="game-timer--label">{{ timer }}</span>
  </div>
</template>
<script lang="ts" setup>
import { watch, computed } from 'vue';
import store from '@/store';
import { GameStatus } from '@/types/game';
import { TIMER_INITIAL } from '@/utils/constants';

const timer = computed(() => store.getters['game/timer']);
const gameStatus = computed(() => store.getters['game/gameStatus']);
const decreaseTimer = () => store.dispatch('game/decreaseTimer');
let interval: null | number = null;

const FULL_DASH_ARRAY = 283;
const circleDasharray = computed(() => `${(
  (timer.value / TIMER_INITIAL) * FULL_DASH_ARRAY
).toFixed(0)} 283`);

const stopTimer = () => {
  if (interval) clearInterval(interval);
};
const runTimer = () => {
  interval = setInterval(() => {
    decreaseTimer();
    if (timer.value === 0) stopTimer();
  }, 1000);
};

watch(gameStatus, (nv) => {
  console.log(nv);
  if (nv === GameStatus.PLAYING) {
    runTimer();
  } else {
    stopTimer();
  }
});
</script>
<style lang="scss" scoped>
@import "../../assets/styles/vars";
$side: 100px;
.game-timer {
  position: relative;
  height: $side;
  width: $side;
  &--circle {
    fill: none;
    stroke: none;
  }
  &--path-elapsed {
    stroke-width: 7px;
    stroke: $backgroundColor;
  }
  &--label {
    position: absolute;
    width: $side;
    height: $side;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: bold;
    color: #18168f;
  }
  &--path-remaining {
    stroke-width: 7px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    stroke: $primary;
  }
  &--svg {
    transform: scaleX(-1);
  }
}
</style>
