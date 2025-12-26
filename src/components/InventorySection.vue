<template>
  <div class="inventory-section">
    <h2>Inventory</h2>
    <textarea
      id="inventory"
      v-model="characterStore.inventory"
      placeholder="List your character's possessions and belongings..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
</script>

<style scoped>
.inventory-section {
  margin-top: 1.5rem;
}

.inventory-section h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0 0 1rem 0;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.inventory-section textarea {
  width: 100%;
  min-height: 150px;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--background);
  color: var(--text-primary);
  resize: vertical;
  transition: border-color 0.3s;
}

.inventory-section textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.inventory-section textarea:disabled {
  background: var(--white);
  cursor: not-allowed;
  opacity: 0.7;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .inventory-section h2 {
    font-size: 1.25rem;
  }
}

@media (max-width: 400px) {
  .inventory-section textarea {
    min-height: 100px;
    font-size: 0.95rem;
  }
}
</style>
