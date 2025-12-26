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
