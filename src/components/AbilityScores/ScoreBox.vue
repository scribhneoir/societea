<template>
  <div
    class="score-box"
    :class="{ rollable: !isEdit }"
    @click="score && handleScoreClick(label, score)"
  >
    <label>{{ label }}</label>
    <input
      v-if="isEdit"
      type="number"
      inputmode="numeric"
      id="accomplishment"
      v-model="score"
      min="0"
      max="20"
    />
    <p v-else>{{ score }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  isEdit: boolean;
  handleScoreClick: (label: string, score: number) => void;
}>();
const score = defineModel<number>();
</script>

<style scoped>
.score-box {
  background: var(--background);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 0rem;
  padding-bottom: 0.5rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.score-box.rollable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.score-box.rollable:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 16px rgba(71, 46, 63, 0.3);
  background: var(--white);
}

.score-box.rollable:active {
  transform: translateY(0) scale(0.98);
}

.score-box label {
  margin: 0;
  padding: 0.2rem;
  display: block;
  font-weight: 600;
  color: var(--white);
  background: var(--black);
  font-size: 1 rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score-box input {
  width: 100%;
  border: none;
  outline: none;
  font-family: "Texturina", serif;
  font-optical-sizing: auto;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  background: var(--white);
  color: var(--text-primary);
  margin: 0;
  padding: 0;
}

.score-box input:disabled {
  background: var(--white);
  cursor: not-allowed;
  opacity: 0.7;
}

.score-box p {
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
  padding: 0;
}
</style>
