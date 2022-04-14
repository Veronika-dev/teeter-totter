<template>
  <div class="game-state">
    <table>
      <thead>
      <tr>
        <th />
        <th>Left</th>
        <th>Right</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>Weight</td>
        <td>{{ totalLeftWeight }}</td>
        <td>{{ totalRightWeight }}</td>
      </tr>
      <tr>
        <td>Torque</td>
        <td>{{ leftTorque }}</td>
        <td>{{ rightTorque }}</td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <td>Bending</td>
        <td colspan="2">{{ totalLeftWeight > 0 ? `${bending}%` : '-' }}</td>
      </tr>
      </tfoot>
    </table>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import store from '@/store';

const totalLeftWeight = computed(() => store.getters['game/totalLeftWeight']);
const totalRightWeight = computed(() => store.getters['game/totalRightWeight']);
const leftTorque = computed(() => store.getters['game/leftTorque']);
const rightTorque = computed(() => store.getters['game/rightTorque']);
const bending = computed(() => store.getters['game/bending']);
</script>
<style lang="scss" scoped>
@import "../../assets/styles/vars";
.game-state {
  border: 1px solid #ddd;
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  display: inline-block;
  table {
    border-spacing: 0;
    width: 100%;
    tr {
      th {
        font-weight: 600;
        border-bottom: 1px solid $primary;
        padding-bottom: 4px;
      }
      td {
        min-width: 45px;
        text-align: right;
        padding: 5px 3px 5px 0;
        &:first-child {
          min-width: 90px;
          text-align: left;
        }
      }
      &:nth-child(2) {
        td {
          padding-bottom: 10px;
        }
      }
    }
    tfoot {
      td {
        border-top: 1px solid #ddd;
      }
    }
  }
}
</style>
