<template>
  <button v-bind="$attrs" :class="`${theme}-style`">
    <slot />
  </button>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  theme: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'warn', 'success', 'danger'].indexOf(value) !== -1,
  },
});
</script>
<style lang="scss" scoped>
@import "../assets/styles/vars";
@mixin buttonStyleByTheme($theme, $main, $hover, $focus, $active) {
  &.#{$theme}-style {
    background-color: $main;
    border-color: $main;
    &:hover {
      background-color: $hover;
      border-color: $hover;
    }
    &:focus {
      background-color: $focus;
      box-shadow: none;
    }
    &:active {
      background-color: $active;
    }
    &:active:focus {
      box-shadow: none;
    }
  }
}
button {
  appearance: button;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, .15), rgba(255, 255, 255, 0));
  border: 1px solid;
  border-radius: 1rem;
  box-shadow: rgba(255, 255, 255, 0.15) 0 1px 0 inset,rgba(46, 54, 80, 0.075) 0 1px 1px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: Inter,sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  padding: .2rem 1rem;
  text-align: center;
  text-transform: none;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,
  border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  @include buttonStyleByTheme('primary', $primary, #3733E5, #413FC5, #3E3BBA);
  @include buttonStyleByTheme('warn', $warn, #ff9d0a, #fda02c, #fca122);
  @include buttonStyleByTheme('success', $success, #28a745, #37bd51, #28a745);
  @include buttonStyleByTheme('danger', $danger, #d52e3e, #e13445, #d92e3f);
  &:active {
    background-image: none;
    box-shadow: rgba(46, 54, 80, 0.125) 0 0.188rem 0.313rem inset;
  }
  &:focus:not(:focus-visible),
  &:focus {
    outline: 0;
  }
  &:disabled {
    background-image: none;
    box-shadow: none;
    opacity: .65;
    pointer-events: none;
  }
}
</style>
