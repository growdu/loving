<template>
  <div class="fxq-fullscreen">
    <FlightChessGame />
  </div>
</template>

<script setup lang="ts">
import FlightChessGame from '@/components/game/FlightChessGame.vue'
</script>

<style scoped>
.fxq-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
}
</style>