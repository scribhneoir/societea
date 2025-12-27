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
          <!-- Group skills by ability score -->
          <div
            v-for="ability in characterStore.isEditMode
              ? abilityScores
              : abilityScores.filter(
                  (ability) =>
                    getAcceptableSkillsByAbility(ability).filter((skill) =>
                      characterStore.skills.has(skill.name.toLowerCase())
                    ).length > 0
                )"
            :key="`acceptable-${ability}`"
            class="ability-group"
          >
            <h4 class="ability-header">{{ getAbilityLabel(ability) }}</h4>
            <div
              v-for="skill in characterStore.isEditMode
                ? getAcceptableSkillsByAbility(ability)
                : getAcceptableSkillsByAbility(ability).filter((skill) =>
                    characterStore.skills.has(skill.name.toLowerCase())
                  )"
              :key="skill.name"
              class="skill-item"
              :class="{
                rollable:
                  !characterStore.isEditMode &&
                  characterStore.skills.has(skill.name.toLowerCase()),
              }"
              @click="handleSkillClick(skill)"
            >
              <input
                type="checkbox"
                :id="`skill-${skill.name.toLowerCase()}`"
                :name="`skill-${skill.name.toLowerCase()}`"
                :checked="characterStore.skills.has(skill.name.toLowerCase())"
                :disabled="
                  !characterStore.isEditMode ||
                  (!characterStore.skills.has(skill.name.toLowerCase()) &&
                    characterStore.skills.size >= characterStore.accomplishment)
                "
                @change.stop="toggleSkill(skill.name)"
              />
              <label :for="`skill-${skill.name.toLowerCase()}`">{{
                skill.name
              }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="skill-column forbidden">
        <h3>Forbidden</h3>
        <div class="skill-list" id="forbidden-skills">
          <!-- Group skills by ability score -->
          <div
            v-for="ability in characterStore.isEditMode
              ? abilityScores
              : abilityScores.filter(
                  (ability) =>
                    getForbiddenSkillsByAbility(ability).filter((skill) =>
                      characterStore.skills.has(skill.name.toLowerCase())
                    ).length > 0
                )"
            :key="`forbidden-${ability}`"
            class="ability-group"
          >
            <h4 class="ability-header">{{ getAbilityLabel(ability) }}</h4>
            <div
              v-for="skill in characterStore.isEditMode
                ? getForbiddenSkillsByAbility(ability)
                : getForbiddenSkillsByAbility(ability).filter((skill) =>
                    characterStore.skills.has(skill.name.toLowerCase())
                  )"
              :key="skill.name"
              class="skill-item"
              :class="{
                rollable:
                  !characterStore.isEditMode &&
                  characterStore.skills.has(skill.name.toLowerCase()),
              }"
              @click="handleSkillClick(skill)"
            >
              <input
                type="checkbox"
                :id="`skill-${skill.name.toLowerCase()}`"
                :name="`skill-${skill.name.toLowerCase()}`"
                :checked="characterStore.skills.has(skill.name.toLowerCase())"
                :disabled="
                  !characterStore.isEditMode ||
                  (!characterStore.skills.has(skill.name.toLowerCase()) &&
                    characterStore.skills.size >= characterStore.accomplishment)
                "
                @change.stop="toggleSkill(skill.name)"
              />
              <label :for="`skill-${skill.name.toLowerCase()}`">{{
                skill.name
              }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useDiceRoller } from "../composables/useDiceRoller";
import {
  getAcceptableSkills,
  getForbiddenSkills,
  type AbilityScore,
  type SkillWithAbility
} from "../data/skills";
import { useCharacterStore } from "../stores/character";

const characterStore = useCharacterStore();
const { rollWithAdvantage } = useDiceRoller();

const abilityScores: AbilityScore[] = [
  "beauty",
  "wit",
  "constitution",
  "accomplishment",
];

const acceptableSkills = computed(() => {
  if (!characterStore.gender) return [];
  return getAcceptableSkills(characterStore.gender as "male" | "female");
});

const forbiddenSkills = computed(() => {
  if (!characterStore.gender) return [];
  return getForbiddenSkills(characterStore.gender as "male" | "female");
});

const getAcceptableSkillsByAbility = (
  ability: AbilityScore
): SkillWithAbility[] => {
  return acceptableSkills.value.filter((skill) => skill.ability === ability);
};

const getForbiddenSkillsByAbility = (
  ability: AbilityScore
): SkillWithAbility[] => {
  return forbiddenSkills.value.filter((skill) => skill.ability === ability);
};

const getAbilityLabel = (ability: AbilityScore): string => {
  const labels: Record<AbilityScore, string> = {
    beauty:
      characterStore.gender === "female"
        ? "Beauty"
        : characterStore.gender === "male"
        ? "Wealth"
        : "Beauty/Wealth",
    wit: "Wit",
    constitution: "Constitution",
    accomplishment: "Accomplishment",
  };
  return labels[ability];
};

const toggleSkill = (skillName: string) => {
  if (characterStore.isEditMode) {
    characterStore.toggleSkill(skillName.toLowerCase());
  }
};

const handleSkillClick = (skill: SkillWithAbility) => {
  if (
    !characterStore.isEditMode &&
    characterStore.skills.has(skill.name.toLowerCase())
  ) {
    // Get the target value for the skill based on its ability score
    const target = getAbilityTarget(skill.ability);

    // Roll with advantage (3d6, drop highest)
    rollWithAdvantage(skill.name, target, true);

    // If skill is forbidden, decrease Social Standing
    if (skill.isForbidden) {
      characterStore.decreaseSocialStanding(1);
    }
  }
};

// Helper function to get the ability score value
const getAbilityTarget = (ability: AbilityScore): number => {
  switch (ability) {
    case "beauty":
      return characterStore.genderSpecificScore;
    case "wit":
      return characterStore.wit;
    case "constitution":
      return characterStore.constitution;
    case "accomplishment":
      return characterStore.accomplishment;
    default:
      return 10;
  }
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
  margin: 0;
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

.ability-group {
  display: flex;
  flex-direction: column;
}

.ability-header {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.3rem 0.6rem;
  margin: 0 0 0.25rem 0;
  background: rgba(71, 46, 63, 0.05);
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  padding-left: 1.2rem;
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

  .ability-header {
    font-size: 0.8rem;
  }
}
</style>
