<template>
  <div class="character-sheet">
    <div class="header-container">
      <h1 class="title">High Societea</h1>
      <IconButton
        @click="characterStore.toggleEditMode()"
        style="margin-bottom: -1rem"
        :icon="
          characterStore.isEditMode
            ? 'fluent:checkmark-24-regular'
            : 'fluent:edit-24-regular'
        "
      />
    </div>
    <div class="top-section">
      <PortraitSection />
      <BasicInfoSection />
    </div>
    <div class="middle-section">
      <AbilityScores />
      <SkillsSection />
    </div>
    <InventorySection />

    <div v-if="characterStore.isEditMode" class="delete-section">
      <button class="delete-button" @click="characterStore.deleteCharacter()">
        Delete Character
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconButton from "./atom/IconButton.vue";
import { useCharacterStore } from "../stores/character";
import PortraitSection from "./PortraitSection.vue";
import BasicInfoSection from "./BasicInfoSection.vue";
import AbilityScores from "./AbilityScores/AbilityScores.vue";
import SkillsSection from "./SkillsSection.vue";
import InventorySection from "./InventorySection.vue";

const characterStore = useCharacterStore();
</script>

<style scoped>
.character-sheet {
  max-width: 800px;
  margin: 0 auto;
  background: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 2px solid var(--border-color);
}

.header-container {
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border-color);
}

.title {
  font-size: 3rem;
  text-align: center;
  color: var(--primary-color);
  margin: 0;
  margin-bottom: -1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  font-family: "Fleur De Leah", cursive;
}

.top-section {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: start;
}

.middle-section {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Delete Section */
.delete-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--border-color);
  display: flex;
  justify-content: center;
}

.delete-button {
  padding: 0.75rem 2rem;
  background: var(--red);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Texturina", serif;
  font-optical-sizing: auto;
}

.delete-button:hover {
  scale: 1.05;
}

.delete-button:active {
  scale: 0.95;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .top-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .middle-section {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
