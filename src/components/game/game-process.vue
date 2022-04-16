<template>
  <div class="game-process">
    <div class="game-process--top">
      <game-element v-if="fallingWeight" :key="fallingWeight.id" :data="fallingWeight"
                    is-falling :bending="bending" @end="onFallElementEnd" />
    </div>
    <div class="game-process--bottom">
      <game-tt :bending="bending" :weights="weights" :game-status="gameStatus" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  computed, onMounted, onBeforeUnmount, provide, watch,
} from 'vue';
import GameElement from '@/components/game/game-element.vue';
import GameTt from '@/components/game/game-tt.vue';
import store from '@/store';
import { GameStatus, TSide } from '@/types/game';

const bending = computed(() => store.getters['game/bending']);
const weights = computed(() => store.getters['game/weights']);
const fallingWeight = computed(() => store.getters['game/fallingWeight']);
const gameStatus = computed(() => store.getters['game/gameStatus']);
provide('gameStatus', gameStatus);
const isDemoMode = computed(() => gameStatus.value === GameStatus.DEMO);

let value = 0;
const delayInitial = computed(() => {
  const decr = 5200 - weights.value.length * 200;
  value += decr;
  return decr > 1000 ? decr : 1000;
});
provide('delayInitial', delayInitial);

const moveFallingElementToRightArray = () => store.dispatch('game/moveFallingElementToRightArray');
const moveElement = (direction: TSide) => store.dispatch('game/moveFallingElement', direction);

const changeOffsetFalling = ({ key }: { key: string }) => {
  if (isDemoMode.value || !fallingWeight.value || ['ArrowLeft', 'ArrowRight'].indexOf(key) === -1) return;
  moveElement(key === 'ArrowLeft' ? 'left' : 'right');
};

let timeoutDemo: null | number = null;
const directions: TSide[] = ['left', 'right'];
const startDemo = () => {
  timeoutDemo = setTimeout(() => {
    const direction = directions[Math.floor(Math.random() * directions.length)];
    moveElement(direction);
    startDemo();
  }, Math.random() * delayInitial.value);
};
const stopDemo = () => {
  if (timeoutDemo) {
    clearTimeout(timeoutDemo);
  }
};
const restartDemo = () => {
  stopDemo();
  startDemo();
};
watch(gameStatus, (nv) => {
  if (nv === GameStatus.DEMO) {
    startDemo();
  } else {
    stopDemo();
  }
});

const onFallElementEnd = () => {
  moveFallingElementToRightArray();
  if (isDemoMode.value) {
    restartDemo();
  }
};

onMounted(() => {
  document.addEventListener('keyup', changeOffsetFalling);
});
onBeforeUnmount(() => {
  stopDemo();
  document.removeEventListener('keyup', changeOffsetFalling);
});
</script>
<style lang="scss" scoped>
@import "../../assets/styles/vars";
.game-process {
  height: 100vh;
  min-height: 400px;
  background: $backgroundColor;
  padding-top: 200px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  &--top {
    flex-grow: 1;
  }
  &--bottom {
    padding-bottom: 2rem;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: #6ad283;
    }
  }
}
</style>
