import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { Character } from "../types";

const STORAGE_KEY = "societea_character";
const EDIT_MODE_KEY = "societea_edit_mode";
const PORTRAIT_KEY = "character-portrait";

export interface PortraitData {
  artworkId: number;
  title: string;
  artist: string;
  imageId: string;
  imageUrl: string;
  dateDisplay: string;
}

export const useCharacterStore = defineStore("character", () => {
  // Character state
  const name = ref("");
  const age = ref(0);
  const gender = ref<"male" | "female" | "">("");
  const abillityPoints = ref(16);
  const constitution = ref(4);
  const wit = ref(4);
  const genderSpecificScore = ref(4);
  const accomplishment = ref(4);
  const socialStanding = ref(5);
  const skills = ref<Set<string>>(new Set());
  const inventory = ref("");

  // Portrait state
  const portrait = ref<PortraitData | null>(null);

  // Edit mode state
  const isEditMode = ref(true);

  // Computed properties
  const genderSpecificScoreLabel = computed(() => {
    if (gender.value === "female") return "Beauty";
    if (gender.value === "male") return "Wealth";
    return "Beauty/Wealth";
  });

  const characterData = computed<Partial<Character>>(() => ({
    name: name.value,
    age: age.value,
    gender: gender.value,
    constitution: constitution.value,
    wit: wit.value,
    genderSpecificScore: genderSpecificScore.value,
    accomplishment: accomplishment.value,
    socialStanding: socialStanding.value,
    abillityPoints: abillityPoints.value,
    skills: skills.value,
    inventory: inventory.value,
  }));

  // Actions
  function toggleSkill(skillName: string) {
    if (skills.value.has(skillName)) {
      skills.value.delete(skillName);
    } else {
      skills.value.add(skillName);
    }
    // Trigger reactivity
    skills.value = new Set(skills.value);
  }

  function setPortrait(portraitData: PortraitData) {
    portrait.value = portraitData;
    localStorage.setItem(PORTRAIT_KEY, JSON.stringify(portraitData));
  }

  function toggleEditMode() {
    isEditMode.value = !isEditMode.value;
    localStorage.setItem(EDIT_MODE_KEY, isEditMode.value.toString());
  }

  function saveCharacter() {
    try {
      const characterToSave = {
        ...characterData.value,
        skills: Array.from(skills.value),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characterToSave));
    } catch (error) {
      console.error("Failed to save character:", error);
    }
  }

  function loadCharacter() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return;

      const character = JSON.parse(data);
      if (character.name) name.value = character.name;
      if (character.age) age.value = character.age;
      if (character.gender) gender.value = character.gender;
      if (character.abillityPoints !== undefined)
        abillityPoints.value = character.abillityPoints;
      if (character.constitution !== undefined)
        constitution.value = character.constitution;
      if (character.wit !== undefined) wit.value = character.wit;
      if (character.genderSpecificScore !== undefined)
        genderSpecificScore.value = character.genderSpecificScore;
      if (character.accomplishment !== undefined)
        accomplishment.value = character.accomplishment;
      if (character.socialStanding !== undefined)
        socialStanding.value = character.socialStanding;
      if (character.inventory !== undefined)
        inventory.value = character.inventory;

      if (character.skills && Array.isArray(character.skills)) {
        skills.value = new Set(character.skills);
      }

      console.log("Character loaded from local storage");
    } catch (error) {
      console.error("Failed to load character:", error);
    }
  }

  function loadPortrait() {
    try {
      const data = localStorage.getItem(PORTRAIT_KEY);
      if (data) {
        portrait.value = JSON.parse(data);
      }
    } catch (error) {
      console.error("Error loading saved portrait:", error);
    }
  }

  function loadEditMode() {
    const stored = localStorage.getItem(EDIT_MODE_KEY);
    isEditMode.value = stored === "true";
  }

  function clearCharacter() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear character:", error);
    }
  }

  function deleteCharacter() {
    if (
      confirm(
        "Are you sure you want to delete this character? This action cannot be undone."
      )
    ) {
      // Clear all character data
      name.value = "";
      age.value = 0;
      gender.value = "";
      abillityPoints.value = 16;
      constitution.value = 4;
      wit.value = 4;
      genderSpecificScore.value = 4;
      accomplishment.value = 4;
      socialStanding.value = 5;
      skills.value = new Set();
      inventory.value = "";
      portrait.value = null;

      // Clear from localStorage
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PORTRAIT_KEY);

      console.log("Character deleted");
    }
  }

  function setAbilityPoints(points: number) {
    abillityPoints.value = points;
  }

  function decreaseSocialStanding(amount: number = 1) {
    socialStanding.value = Math.max(0, socialStanding.value - amount);
  }

  // Auto-save on character data changes
  watch(
    characterData,
    () => {
      saveCharacter();
    },
    { deep: true }
  );

  // Initialize
  loadCharacter();
  loadPortrait();
  loadEditMode();

  return {
    // State
    name,
    age,
    gender,
    abillityPoints,
    constitution,
    wit,
    genderSpecificScore,
    accomplishment,
    socialStanding,
    skills,
    inventory,
    portrait,
    isEditMode,

    // Computed
    genderSpecificScoreLabel,
    characterData,

    // Actions
    toggleSkill,
    setPortrait,
    toggleEditMode,
    saveCharacter,
    loadCharacter,
    loadPortrait,
    loadEditMode,
    clearCharacter,
    deleteCharacter,
    setAbilityPoints,
    decreaseSocialStanding,
  };
});
