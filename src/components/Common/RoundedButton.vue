<template>
  <button
      @click="$emit('click', $event)"
      class="flex items-center justify-center space-x-2 rounded-full transition-all duration-500 cursor-pointer pointer-events-auto border focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-accent focus-visible:transition-none"
      :class="[
          variantClasses,
          sizeClasses,
          textClass
        ]"
      :aria-label="ariaLabel || label"
  >
    <div v-if="$slots.icon" class="flex items-center justify-center">
      <slot name="icon"></slot>
    </div>
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
  ariaLabel?: string;
  iconOnly?: boolean;
  variant?: 'glass' | 'solid-white' | 'solid-black' | 'outline-white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}>(), {
  active: false,
  iconOnly: false,
  variant: 'glass',
  size: 'md'
});

defineEmits(['click']);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'solid-white':
      return 'bg-white text-black border-transparent hover:bg-white/90';
    case 'solid-black':
      return 'bg-black text-white border-transparent hover:bg-black/80';
    case 'outline-white':
      return 'bg-transparent text-white border-white hover:bg-white hover:text-black';
    case 'glass':
    default:
      return props.active
          ? 'bg-white text-black border-transparent'
          : 'bg-white/10 border-white/5 text-white hover:bg-white/20 hover:border-white/20';
  }
});

const sizeClasses = computed(() => {
  if (props.iconOnly) {
    switch (props.size) {
      case 'sm':
        return 'h-7 w-9 p-0';
      case 'lg':
        return 'h-10 w-13 lg:h-12 lg:w-16 p-0';
      case 'xl':
        return 'h-12 w-16 lg:h-16 lg:w-21 p-0';
      case 'md':
      default:
        return 'h-6 w-10 lg:h-10 lg:w-13 p-0';
    }
  }

  switch (props.size) {
    case 'sm':
      return 'h-7 px-3';
    case 'lg':
      return 'h-10 lg:h-12 px-5 lg:px-8';
    case 'xl':
      return 'h-12 lg:h-16 px-6 lg:px-10';
    case 'md':
    default:
      return 'h-6 lg:h-10 px-4 lg:px-6';
  }
});

const textClass = computed(() => {
  if (props.iconOnly) return '';
  
  let baseText = 'text-button font-normal';
  if (props.size === 'sm') baseText += ' text-[10px]';
  if (props.size === 'lg') baseText += ' text-sm lg:text-base';
  if (props.size === 'xl') baseText += ' text-base lg:text-lg';
  
  return baseText;
});
</script>