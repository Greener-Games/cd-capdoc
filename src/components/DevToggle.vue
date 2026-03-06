<template>
  <div class="fixed bottom-4 right-4 z-[9999] flex items-center bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 shadow-lg pointer-events-auto">
    <span class="text-xs font-mono text-white/70 mr-3 uppercase">Local Data</span>
    <button
      @click="toggleLocalData"
      class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black cursor-pointer"
      :class="isLocal ? 'bg-green-500' : 'bg-white/20'"
      role="switch"
      :aria-checked="isLocal"
    >
      <span class="sr-only">Toggle local data</span>
      <span
        class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-300 ease-in-out"
        :class="isLocal ? 'translate-x-4.5' : 'translate-x-1'"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDataStore } from '../store';

const dataStore = useDataStore();

const isLocal = computed(() => dataStore.useLocalData);

const toggleLocalData = () => {
  dataStore.setUseLocalData(!isLocal.value);
};
</script>