<template>
  <div class="d-flex justify-between content-block">
    <div>
      <game-state />
      <game-timer />
    </div>
    <div>
      <game-controllers />
    </div>
  </div>
  <div>
    <game-process />
  </div>
  <img src="./assets/images/logo-insider.png" width="80" height="36" alt="Insider" class="logo" />
</template>

<script lang="ts" setup>
import GameControllers from '@/components/game/game-controllers.vue';
import GameState from '@/components/game/game-state.vue';
import GameProcess from '@/components/game/game-process.vue';
import GameTimer from '@/components/game/game-timer.vue';
</script>

<style lang="scss">
@import "assets/styles/global";
</style>
<style lang="scss" scoped>
@import "assets/styles/mixins";
.content-block {
  padding: 20px;
  position: absolute;
  left: 0;
  right: 0;
  @include innerBlock;
}
.logo {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
