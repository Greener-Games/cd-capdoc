<template>
  <button
      @click="$emit('click', $event)"
      class=" flex items-center justify-center space-x-2 rounded-full transition-all duration-500 cursor-pointer pointer-events-auto border h-5 lg:h-10"
      :class="[
          computedClasses,
          iconOnly ? 'w-7.5 lg:w-13 p-0' : 'px-3 lg:px-6',
          textClass
        ]"
  >
    <slot name="icon"></slot>
    <slot>
      <span v-if="label">{{ label }}</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  active?: boolean;
  label?: string;
  iconOnly?: boolean;
  variant?: 'glass' | 'solid-white' | 'solid-black';
}>(), {
  active: false,
  iconOnly: false,
  variant: 'glass'
});

defineEmits(['click']);

const computedClasses = computed(() => {
  if (props.variant === 'solid-white') {
    return 'bg-white text-black border-transparent';
  }
  if (props.variant === 'solid-black') {
    return 'bg-black text-white border-transparent';
  }

  // Default glass variant
  return props.active
      ? 'bg-white text-black border-transparent'
      : 'bg-white/10 border-transparent text-white hover:bg-white/10 hover:text-white';
});

const textClass = computed(() => {
  return props.iconOnly ? '' : 'font-bienvenue text-xs lg:text-sm  uppercase font-black font-normal';
});
</script>