<template>
  <div class="game-tt--container" :class="{'is-game-over': isGameOver}">
    <div class="game-tt" :style="{ transform: `rotate(${rotateAngle}deg)` }">
      <game-element v-for="item in weights" :key="item.id" :data="item" />
    </div>
    <div class="game-tt--stand" />
  </div>
</template>
<script lang="ts" setup>
import {
  computed, defineProps, PropType, toRef,
} from 'vue';
import { GameStatus, IGameElement, TGameStatus } from '@/types/game';
import GameElement from '@/components/game/game-element.vue';
import calcRotateAngle from '@/utils/calcRotateAngle';

const props = defineProps({
  weights: { type: Array as PropType<IGameElement[]>, default: () => [] },
  bending: { type: Number, required: true },
  gameStatus: { type: String as PropType<TGameStatus> },
});

const bending = toRef(props, 'bending');
const rotateAngle = computed(() => calcRotateAngle(bending.value));

const gameStatus = toRef(props, 'gameStatus');
const isGameOver = computed(() => gameStatus.value === GameStatus.FAILED);

</script>
<style lang="scss" scoped>
.game-tt {
  height: .5rem;
  width: 46rem;
  background: #441c1c;
  transition: transform 1s linear;
  .is-game-over & {
    animation: fallTT .6s forwards cubic-bezier(.77,1.12,0,.16);
    animation-delay: 1s;
  }
  &--container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &--stand {
    width: 1rem;
    height: 10rem;
    border-style: solid;
    border-width: 0 1rem 10rem 1rem;
    border-color: transparent transparent #696969 transparent;
    margin-top: -5px;
    .is-game-over & {
      animation: fallStand .6s forwards cubic-bezier(.77,1.12,0,.16);
      animation-delay: 1s;
    }
  }
}
@keyframes fallTT {
  100% {
    transform: rotate(-5deg) translate(-25%, 100px);
  }
}
@keyframes fallStand {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(-80deg) skew(20deg,-40deg) translate(-120%, -50%);
  }
}
</style>
