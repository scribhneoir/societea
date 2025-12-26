<template>
  <div class="ability-scores">
    <h2>
      Ability Scores{{
        characterStore.isEditMode
          ? ` - ${
              characterStore.abillityPoints -
              characterStore.constitution -
              characterStore.wit -
              characterStore.genderSpecificScore -
              characterStore.accomplishment
            }`
          : ""
      }}
      <IconButton
        v-if="characterStore.isEditMode"
        icon="mdi:die-5"
        @click="rollForAbilityPoints"
      />
    </h2>
    <div class="scores-grid">
      <ScoreBox
        label="Constitution"
        v-model="characterStore.constitution"
        :isEdit="characterStore.isEditMode"
        :handleScoreClick="handleScoreClick"
      />
      <ScoreBox
        label="Wit"
        v-model="characterStore.wit"
        :isEdit="characterStore.isEditMode"
        :handleScoreClick="handleScoreClick"
      />
      <ScoreBox
        :label="characterStore.genderSpecificScoreLabel"
        v-model="characterStore.genderSpecificScore"
        :isEdit="characterStore.isEditMode"
        :handleScoreClick="handleScoreClick"
      />
      <ScoreBox
        label="Accomplishment"
        v-model="characterStore.accomplishment"
        :isEdit="characterStore.isEditMode"
        :handleScoreClick="handleScoreClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCharacterStore } from "../../stores/character";
import { useDiceRoller } from "../../composables/useDiceRoller";
import { roll3d6ForAbilityPoints } from "../../utils/diceRoller";
import ScoreBox from "./ScoreBox.vue";
import IconButton from "../atom/IconButton.vue";

const characterStore = useCharacterStore();
const { rollDice } = useDiceRoller();

const handleScoreClick = (label: string, target: number) => {
  if (!characterStore.isEditMode) {
    rollDice(label, target);
  }
};

const rollForAbilityPoints = async () => {
  await roll3d6ForAbilityPoints((total: number) => {
    characterStore.setAbilityPoints(total);
  });
};
</script>

<style scoped>
.ability-scores {
  display: flex;
  flex-direction: column;
}

.ability-scores h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0 0 1rem 0;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.scores-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
