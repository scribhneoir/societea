<template>
  <div class="skills-section">
    <h2>
      Skills
      {{
        characterStore.isEditMode
          ? ` - ${characterStore.accomplishment - characterStore.skills.size}`
          : ""
      }}
    </h2>
    <div class="skills-columns">
      <div class="skill-column socially-acceptable">
        <h3>Acceptable</h3>
        <div class="skill-list" id="acceptable-skills">
          <div
            v-for="skill in acceptableSkills"
            :key="skill"
            class="skill-item"
            :class="{
              rollable:
                !characterStore.isEditMode &&
                characterStore.skills.has(skill.toLowerCase()),
            }"
            @click="handleSkillClick(skill)"
          >
            <input
              type="checkbox"
              :id="`skill-${skill.toLowerCase()}`"
              :name="`skill-${skill.toLowerCase()}`"
              :checked="characterStore.skills.has(skill.toLowerCase())"
              :disabled="
                !characterStore.isEditMode ||
                (!characterStore.skills.has(skill.toLowerCase()) &&
                  characterStore.skills.size >= characterStore.accomplishment)
              "
              @change.stop="toggleSkill(skill)"
            />
            <label :for="`skill-${skill.toLowerCase()}`">{{ skill }}</label>
          </div>
        </div>
      </div>
      <div class="skill-column forbidden">
        <h3>Forbidden</h3>
        <div class="skill-list" id="forbidden-skills">
          <div
            v-for="skill in forbiddenSkills"
            :key="skill"
            class="skill-item"
            :class="{
              rollable:
                !characterStore.isEditMode &&
                characterStore.skills.has(skill.toLowerCase()),
            }"
            @click="handleSkillClick(skill)"
          >
            <input
              type="checkbox"
              :id="`skill-${skill.toLowerCase()}`"
              :name="`skill-${skill.toLowerCase()}`"
              :checked="characterStore.skills.has(skill.toLowerCase())"
              :disabled="
                !characterStore.isEditMode ||
                (!characterStore.skills.has(skill.toLowerCase()) &&
                  characterStore.skills.size >= characterStore.accomplishment)
              "
              @change.stop="toggleSkill(skill)"
            />
            <label :for="`skill-${skill.toLowerCase()}`">{{ skill }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useCharacterStore } from "../stores/character";
import { useDiceRoller } from "../composables/useDiceRoller";
import { feminineSkills, masculineSkills } from "../data/skills";

const characterStore = useCharacterStore();
const { rollDice } = useDiceRoller();

const acceptableSkills = computed(() => {
  return characterStore.gender === "female" ? feminineSkills : masculineSkills;
});

const forbiddenSkills = computed(() => {
  return characterStore.gender === "female" ? masculineSkills : feminineSkills;
});

const toggleSkill = (skill: string) => {
  if (characterStore.isEditMode) {
    characterStore.toggleSkill(skill.toLowerCase());
  }
};

const handleSkillClick = (skill: string) => {
  if (
    !characterStore.isEditMode &&
    characterStore.skills.has(skill.toLowerCase())
  ) {
    // Get the target value for the skill (you might need to determine this based on your game logic)
    const target = getSkillTarget();
    rollDice(skill, target, true);
  }
};

// Helper function to determine skill target value
const getSkillTarget = (): number => {
  // Map skills to their relevant ability scores
  // For now, using a default value - you may want to customize this based on your game rules
  return 10;
};
</script>

<style scoped>
.skills-section {
  display: flex;
  flex-direction: column;
}

.skills-section h2 {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin: 0 0 1rem 0;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

.skills-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.skill-column {
  background: var(--background);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 0;
  padding-bottom: 1rem;
  overflow-x: hidden;
}

.skill-column h3 {
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  font-weight: 600;
  text-align: center;
  padding: 0.2rem;
  border-bottom: 2px solid var(--border-color);
  color: var(--white);
}

.skill-column.socially-acceptable h3 {
  background: var(--acceptable-accent);
}

.skill-column.forbidden h3 {
  background: var(--forbidden-accent);
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.skill-item:hover {
  background-color: rgba(71, 46, 63, 0.1);
}

.skill-item.rollable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-item.rollable:hover {
  background-color: rgba(71, 46, 63, 0.2);
  transform: translateX(4px);
}

.skill-item.rollable:active {
  transform: translateX(2px);
}

.skill-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.skill-item input[type="checkbox"]:disabled {
  opacity: 0.6;
}

.skill-item.rollable input[type="checkbox"]:disabled {
  opacity: 1;
}

.skill-item label {
  cursor: pointer;
  flex: 1;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.skill-item:has(input:disabled) label {
  opacity: 0.7;
}

.skill-item.rollable:has(input:disabled) label {
  opacity: 1;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .skills-columns {
    grid-template-columns: 1fr;
  }

  .skills-section h2 {
    font-size: 1.25rem;
  }

  .skill-column h3 {
    font-size: 1rem;
  }
}
</style>
