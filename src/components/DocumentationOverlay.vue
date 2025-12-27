<template>
  <Transition name="overlay">
    <div v-if="isVisible" class="overlay-backdrop" @click="close">
      <div class="overlay-content" @click.stop>
        <div class="overlay-header">
          <h2>{{ currentTitle }}</h2>
          <button class="close-button" @click="close">
            <Icon icon="fluent:dismiss-24-regular" />
          </button>
        </div>
        
        <div class="overlay-body">
          <nav v-if="showNav" class="doc-nav">
            <button 
              v-for="doc in availableDocs" 
              :key="doc.path"
              :class="['nav-item', { active: currentDoc === doc.path }]"
              @click="loadDoc(doc.path)"
            >
              {{ doc.title }}
            </button>
          </nav>
          
          <div class="doc-content" v-html="renderedContent"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { marked } from 'marked';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

interface DocInfo {
  path: string;
  title: string;
}

const availableDocs: DocInfo[] = [
  { path: 'index', title: 'Home' },
  { path: 'getting-started', title: 'Getting Started' },
  { path: 'character-creation', title: 'Character Creation' },
  { path: 'gameplay-rules', title: 'Gameplay Rules' },
];

const currentDoc = ref('index');
const content = ref('');
const showNav = ref(true);

const currentTitle = computed(() => {
  const doc = availableDocs.find(d => d.path === currentDoc.value);
  return doc?.title || 'Documentation';
});

const renderedContent = computed(() => {
  return marked(content.value);
});

// Configure marked for better link handling
marked.use({
  renderer: {
    link: ( args: { href: string, title?: string | null, text: string } ) => {
        const { href, text } = args;
         // Handle internal links to other docs
      if (href.startsWith('./') && href.endsWith('.md')) {
        const docName = href.replace('./', '').replace('.md', '');
        return `<a href="#" class="internal-link" data-doc="${docName}">${text}</a>`;
      }
      // External links open in new tab
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
  }
});

async function loadDoc(docPath: string) {
  try {
    const response = await fetch(`/docs/${docPath}.md`);
    if (!response.ok) throw new Error('Doc not found');
    content.value = await response.text();
    currentDoc.value = docPath;
  } catch (error) {
    content.value = `# Error\n\nCould not load documentation file: ${docPath}.md`;
    console.error('Error loading documentation:', error);
  }
}

function close() {
  emit('close');
}

// Handle internal link clicks
function handleInternalLinks(e: Event) {
  const target = e.target as HTMLElement;
  if (target.classList.contains('internal-link')) {
    e.preventDefault();
    const docName = target.getAttribute('data-doc');
    if (docName) {
      loadDoc(docName);
    }
  }
}

// Load initial doc when overlay opens
watch(() => props.isVisible, (visible) => {
  if (visible && !content.value) {
    loadDoc('index');
  }
});

// Add event listener for internal links
watch(() => renderedContent.value, () => {
  setTimeout(() => {
    const contentEl = document.querySelector('.doc-content');
    if (contentEl) {
      contentEl.removeEventListener('click', handleInternalLinks);
      contentEl.addEventListener('click', handleInternalLinks);
    }
  }, 0);
});
</script>

<style scoped>
.overlay-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.overlay-content {
  background: var(--card-background);
  border-radius: 12px;
  border: 2px solid var(--border-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.overlay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  background: var(--primary-color);
  color: var(--white);
}

.overlay-header h2 {
  margin: 0;
  font-size: 1.8rem;
  font-family: "Fleur De Leah", cursive;
}

.close-button {
  background: none;
  border: none;
  color: var(--white);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.close-button svg {
  width: 1.5rem;
  height: 1.5rem;
}

.overlay-body {
  display: flex;
  overflow: hidden;
  flex: 1;
}

.doc-nav {
  width: 200px;
  border-right: 2px solid var(--border-color);
  padding: 1rem;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.02);
}

.nav-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  text-align: left;
  background: none;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Texturina", serif;
  font-size: 0.95rem;
}

.nav-item:hover {
  background: var(--hover-background, rgba(0, 0, 0, 0.05));
  border-color: var(--border-color);
}

.nav-item.active {
  background: var(--primary-color);
  color: var(--white);
  font-weight: 600;
}

.doc-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  line-height: 1.7;
}

/* Markdown Styles */
.doc-content :deep(h1) {
  color: var(--primary-color);
  font-size: 2.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  font-family: "Fleur De Leah", cursive;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.doc-content :deep(h2) {
  color: var(--primary-color);
  font-size: 1.8rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-family: "Texturina", serif;
  font-weight: 600;
}

.doc-content :deep(h3) {
  color: var(--text-color);
  font-size: 1.4rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-family: "Texturina", serif;
  font-weight: 600;
}

.doc-content :deep(h4) {
  color: var(--text-color);
  font-size: 1.2rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-family: "Texturina", serif;
  font-weight: 600;
}

.doc-content :deep(p) {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.doc-content :deep(ul),
.doc-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.doc-content :deep(li) {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.doc-content :deep(code) {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.doc-content :deep(pre) {
  background: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.doc-content :deep(pre code) {
  background: none;
  padding: 0;
}

.doc-content :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.doc-content :deep(a:hover) {
  border-bottom-color: var(--primary-color);
}

.doc-content :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  margin: 1rem 0;
  padding-left: 1rem;
  color: var(--text-color);
  font-style: italic;
}

.doc-content :deep(hr) {
  border: none;
  border-top: 2px solid var(--border-color);
  margin: 2rem 0;
}

.doc-content :deep(strong) {
  font-weight: 600;
  color: var(--primary-color);
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-active .overlay-content,
.overlay-leave-active .overlay-content {
  transition: transform 0.3s ease;
}

.overlay-enter-from .overlay-content,
.overlay-leave-to .overlay-content {
  transform: scale(0.9);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .overlay-backdrop {
    padding: 0;
  }
  
  .overlay-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .overlay-body {
    flex-direction: column;
  }
  
  .doc-nav {
    width: 100%;
    border-right: none;
    border-bottom: 2px solid var(--border-color);
    padding: 0.5rem;
    display: flex;
    overflow-x: auto;
    flex-shrink: 0;
  }
  
  .nav-item {
    white-space: nowrap;
    margin-right: 0.5rem;
    margin-bottom: 0;
  }
  
  .doc-content {
    padding: 1rem;
  }
}
</style>

