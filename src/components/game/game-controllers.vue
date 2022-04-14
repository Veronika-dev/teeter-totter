<template>
  <div class="game-controllers--container">
    <div v-bind="$attrs" class="game-controllers">
      <custom-button v-if="isGamePlaying" class="mr-2" theme="success" @click="pauseGame">Pause</custom-button>
      <custom-button v-else-if="!isGamePaused" class="mr-2" theme="success" @click="startGame">Start</custom-button>
      <custom-button v-else class="mr-2" @click="continueGame">Continue</custom-button>
      <custom-button v-if="!isGameDemo" class="mr-2" theme="danger" @click="restartGame">Restart</custom-button>
      <custom-button v-if="!isGameDemo" @click="startDemo">Show demo</custom-button>
    </div>
    <div v-if="displayingGameStatus" class="game-controllers game-status">
      {{ displayingGameStatus }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import CustomButton from '@/components/custom-button.vue';
import { computed } from 'vue';
import store from '@/store';
import { GameStatus } from '@/types/game';

const gameStatus = computed(() => store.getters['game/gameStatus']);
const isGamePaused = computed(() => gameStatus.value === GameStatus.PAUSED);
const isGamePlaying = computed(() => gameStatus.value === GameStatus.PLAYING);
const isGameDemo = computed(() => gameStatus.value === GameStatus.DEMO);

const startGame = () => store.dispatch('game/startGame');
const pauseGame = () => store.dispatch('game/pauseGame');
const restartGame = () => store.dispatch('game/restartGame');
const startDemo = () => store.dispatch('game/startDemo');
const continueGame = () => store.dispatch('game/continueGame');

const displayingGameStatus = computed(() => {
  switch (gameStatus.value) {
    case GameStatus.PAUSED:
      return 'Paused';
    case GameStatus.FAILED:
      return 'Game Over';
    case GameStatus.DEMO:
      return 'Demo Mode';
    default:
      return '';
  }
});
</script>
<style lang="scss" scoped>
@import "../../assets/styles/vars";
.game-controllers {
  border: 1px solid #ddd;
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 0.875rem;
  display: inline-block;
  margin-bottom: .5rem;
  &--container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
.game-status {
  font-size: 1.5rem;
  font-weight: bold;
  color: $danger;
}
</style>
