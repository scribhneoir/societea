<template>
  <div class="basic-info">
    <div class="form-group">
      <label for="char-name">Name</label>
      <input
        type="text"
        id="char-name"
        v-model="characterStore.name"
        :disabled="!characterStore.isEditMode"
        placeholder="Enter character name"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="char-age">Age</label>
        <input
          type="number"
          id="char-age"
          v-model.number="characterStore.age"
          :disabled="!characterStore.isEditMode"
          placeholder="Age"
          min="18"
        />
      </div>

      <div class="form-group">
        <label for="char-gender">Gender</label>
        <select
          id="char-gender"
          v-model="characterStore.gender"
          :disabled="!characterStore.isEditMode"
        >
          <option value="">Select...</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
</script>

<style scoped>
.basic-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: -0.1rem;
  color: var(--accent-color);
  font-size: 0.95rem;
  font-style: italic;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  background: var(--background);
  color: var(--text-primary);
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group input:disabled,
.form-group select:disabled {
  background: var(--white);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@media (max-width: 400px) {
  .form-group input,
  .form-group select {
    padding: 0.6rem;
    font-size: 0.95rem;
  }
}
</style>
