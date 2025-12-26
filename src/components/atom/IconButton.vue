<template>
  <button class="icon-button">
    <Icon :icon="icon" />
  </button>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  icon: string;
}>();
</script>

<style scoped>
.icon-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: none;
  color: var(--red);
}

.icon-button:hover {
  transform: scale(1.1);
}

.icon-button:active {
  transform: scale(0.9);
}

.icon-button svg {
  width: 2rem;
  height: 2rem;
}

.icon-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
