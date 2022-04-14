<template>
  <div class="game-falling" :class="{ 'paused': gameStatus === GameStatus.PAUSED }"
       ref="gamefalling"
       :style="{ transform: `rotate(${rotateAngle}deg)`, animationDuration: `${delay}ms`, top: pausedTop }"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup>
import {
  computed, defineProps, onMounted, ref, defineEmits, onBeforeUnmount, inject, watch, Ref,
} from 'vue';
import calcRotateAngle from '@/utils/calcRotateAngle';
import { GameStatus, TGameStatus } from '@/types/game';

const props = defineProps({
  bending: { type: Number, required: true },
  gameStatus: { type: String },
});
const emits = defineEmits(['end']);

const delayInitial = inject('delayInitial') as Ref<number>;
const bending = ref(props.bending);
const rotateAngle = computed(() => calcRotateAngle(bending.value));
let timeoutEnd: null | number = null;
const delay = ref(delayInitial.value);
let startAt = Date.now();
const startAnimation = () => {
  startAt = Date.now();
  timeoutEnd = setTimeout(() => {
    emits('end');
  }, delay.value);
};
onMounted(() => {
  startAnimation();
});
onBeforeUnmount(() => {
  if (timeoutEnd) {
    clearTimeout(timeoutEnd);
  }
});

const pausedTop = ref('');
const gamefalling = ref<HTMLDivElement>();
const gameStatus = inject('gameStatus') as Ref<TGameStatus>;
let restTime: number = delayInitial.value;
const pauseGame = () => {
  if (timeoutEnd) clearTimeout(timeoutEnd);
  restTime = Date.now() - startAt;
  pausedTop.value = `${gamefalling.value?.offsetTop}px`;
};
const restartGame = () => {
  delay.value -= restTime;
  startAnimation();
};
watch(gameStatus, (nv, ov) => {
  if (nv === GameStatus.PAUSED) {
    pauseGame();
  } else if (nv === GameStatus.PLAYING && ov === GameStatus.PAUSED) {
    restartGame();
  }
});
</script>
<style lang="scss" scoped>
.game-falling {
  transition: transform 1s linear;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: .5rem;
  width: 46rem;
  max-width: 100%;
  margin: 0 auto;
  animation: fallAnimation linear forwards;
  &.paused {
    animation: none;
  }
}
@keyframes fallAnimation {
  100% {
    top: calc(100vh - 195px);
  }
}
</style>
