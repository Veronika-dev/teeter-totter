<template>
  <component :is="isFalling ? gameFalling : 'div'" :bending="bending">
    <div
      class="game-tt-element"
      :class="[`element-${data.type}`, `bgcolor-${data.color}`, data.side, { 'is-falling': isFalling }]"
      :style="{ width: `${size}px`, height: `${size}px`, borderWidth: countedBorder, left: `${left}%` }"
    >
      <span :style="{ fontSize: `${fontSize}rem` }">{{ data.weight }}</span>
    </div>
  </component>
</template>
<script lang="ts" setup>
import {
  computed, defineProps, PropType, toRef,
} from 'vue';
import gameFalling from '@/components/game/game-falling.vue';
import { IGameElement } from '@/types/game';

const props = defineProps({
  data: { type: Object as PropType<IGameElement>, required: true },
  isFalling: { type: Boolean, default: false },
  bending: { type: Number, default: null },
});
const data = toRef(props, 'data');
const { weight } = data.value;
const size = ((): number => {
  const min = 24;
  const max = 80;
  let result = weight * 15;
  if (result < min) result = min;
  if (result > max) result = max;
  return result;
})();
const fontSize = ((): number => {
  const min = 1;
  const max = 3;
  let result = weight / 3;
  if (result < min) result = min;
  if (result > max) result = max;
  return result;
})();
const countedBorder = ((): string => {
  if (data.value.type !== 'triangle') return '';
  return `0 ${size / 2}px ${size}px ${size / 2}px`;
})();
const left = computed((): number => {
  if (data.value.side === 'left') {
    return Math.max(50 - data.value.offset * 10, 0);
  }
  return Math.min(50 + data.value.offset * 10, 100);
});
</script>
<style lang="scss" scoped>
@import "../../assets/styles/vars";
@mixin bgColor($theme, $color, $isTriangle: false) {
  &.bgcolor-#{$theme} {
    @if $isTriangle {
      border-color: transparent transparent $color;
    } @else {
      background-color: $color;
    }
  }
}
.game-tt-element {
  border: .1rem solid;
  position: absolute;
  bottom: .5rem;
  &.right {
    transform: translateX(-50%);
  }
  @include bgColor("primary", $primary);
  @include bgColor("warn", $warn);
  @include bgColor("success", $success);
  &.element-square {
    border-color: rgba(0, 0, 0, .1);
    border-radius: .3rem;
  }
  &.element-circle {
    border-color: rgba(0, 0, 0, .1);
    border-radius: 50%;
  }
  span {
    color: $white;
    font-weight: bold;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    min-height: 20px;
  }
  &.element-triangle {
    background: transparent;
    @include bgColor("primary", $primary, true);
    @include bgColor("warn", $warn, true);
    @include bgColor("success", $success, true);
    span {
      position: absolute;
      left: 50%;
      top: -6px;
      transform: translate(-50%);
      line-height: 2.75em;
      width: auto;
      height: auto;
      display: inline;
    }
  }
  &.is-falling {
    top: 0;
    bottom: auto;
    transform: translateY(-100%);
  }
}
</style>
