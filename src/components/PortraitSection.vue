<template>
  <div class="portrait-section">
    <div class="portrait-container">
      <button
        :class="`portrait-wrapper ${
          characterStore.isEditMode ? 'editable' : ''
        }`"
        @click="characterStore.isEditMode ? refreshPortrait() : null"
      >
        <div
          v-if="isLoading"
          class="portrait-placeholder"
          id="portrait-placeholder"
        >
          <span>Loading portrait...</span>
        </div>
        <img
          v-else-if="characterStore.portrait"
          id="portrait-image"
          class="portrait-image"
          :src="characterStore.portrait.imageUrl"
          alt="Character Portrait"
          @error="handleImageError"
        />
        <div v-else class="portrait-placeholder" id="portrait-placeholder">
          <span>{{ error || "Loading portrait..." }}</span>
        </div>

        <!-- Social Standing Badge -->
        <div class="social-standing-badge">
          <svg
            class="curved-text"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path
                id="circlePath"
                d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              />
            </defs>
            <text class="curved-label">
              <textPath href="#circlePath">Social Standing</textPath>
            </text>
          </svg>
          <input
            id="social-standing-input"
            v-model.number="characterStore.socialStanding"
            type="number"
            class="social-standing-input"
            min="0"
            max="20"
          />
        </div>
      </button>

      <!-- <div v-if="characterStore.portrait && !isLoading" class="portrait-info" id="portrait-info">
        <p class="portrait-title">{{ characterStore.portrait.title }}</p>
        <p class="portrait-artist">{{ characterStore.portrait.artist }}</p>
      </div>
      
      <button 
        id="refresh-portrait" 
        class="refresh-portrait-btn"
        :disabled="!characterStore.isEditMode || isLoading"
        @click="refreshPortrait"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
        </svg>
        New Portrait
      </button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCharacterStore } from "../stores/character";
import { usePortrait } from "../composables/usePortrait";

const characterStore = useCharacterStore();
const { isLoading, error, loadRandomPortrait } = usePortrait();

const handleImageError = () => {
  error.value = "Failed to load portrait";
};

const refreshPortrait = async () => {
  const portraitData = await loadRandomPortrait(characterStore.gender);
  if (portraitData) {
    characterStore.setPortrait(portraitData);
  }
};

onMounted(async () => {
  // Load portrait if not already loaded
  if (!characterStore.portrait) {
    await refreshPortrait();
  }
});
</script>

<style scoped>
.portrait-section {
  display: flex;
  justify-content: flex-start;
}

.portrait-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.portrait-wrapper {
  position: relative;
  display: inline-block;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
}

.portrait-wrapper.editable {
  cursor: pointer;
  transition: all 0.2s ease;
}
.portrait-wrapper.editable:hover {
  transform: scale(1.05);
}
.portrait-wrapper.editable:active {
  transform: scale(0.95);
}

.portrait-placeholder {
  width: 200px;
  height: 200px;
  border: 3px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.9rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.portrait-image {
  width: 200px;
  height: 200px;
  border: 3px solid var(--border-color);
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.social-standing-badge {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 60px;
  height: 60px;
  background: var(--white);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px;
}

.curved-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.curved-label {
  fill: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: "Texturina", serif;
  font-optical-sizing: auto;
}

.social-standing-input {
  font-family: "Texturina", serif;
  font-optical-sizing: auto;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  border: none;
  background: none;
  outline: none;
}

/* Remove number input arrows */
.social-standing-input::-webkit-inner-spin-button,
.social-standing-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

.social-standing-input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .portrait-section {
    justify-content: center;
  }
}
</style>
