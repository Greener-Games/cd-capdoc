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
        return 'h-5 w-7 md:h-6 md:w-8 lg:h-7 lg:w-9 xl:h-8 xl:w-10 2xl:h-9 2xl:w-12 p-0';
      case 'lg':
        return 'h-9 w-12 md:h-10 md:w-13 lg:h-11 lg:w-14 xl:h-12 xl:w-16 2xl:h-14 2xl:w-18 p-0';
      case 'xl':
        return 'h-11 w-14 md:h-12 md:w-16 lg:h-14 lg:w-18 xl:h-16 xl:w-20 2xl:h-18 2xl:w-24 p-0';
      case 'md':
      default:
        return 'h-5 w-8 lg:h-7 lg:w-12 xl:h-10 xl:w-13  p-0';
    }
  }

  switch (props.size) {
    case 'sm':
      return 'h-5 px-2 md:h-6 px-3 lg:h-7 lg:px-4 xl:h-8 xl:px-5 2xl:h-9 2xl:px-6';
    case 'lg':
      return 'h-9 px-4 md:h-10 md:px-5 lg:h-11 lg:px-6 xl:h-12 xl:px-8 2xl:h-14 2xl:px-9';
    case 'xl':
      return 'h-11 px-5 md:h-12 md:px-6 lg:h-14 lg:px-8 xl:h-16 xl:px-10 2xl:h-18 2xl:px-11';
    case 'md':
    default:
      return 'h-5 px-2 lg:h-7 lg:px-5 xl:h-10 xl:px-6';
  }
});

const textClass = computed(() => {
  if (props.iconOnly) return '';

  let baseText = 'text-button font-normal';

  if (props.size === 'sm') {
    baseText += ' text-[8px] md:text-[9px] lg:text-[10px] xl:text-xs 2xl:text-sm';
  } else if (props.size === 'lg') {
    baseText += ' text-xs md:text-sm lg:text-[15px] xl:text-base 2xl:text-lg';
  } else if (props.size === 'xl') {
    baseText += ' text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl';
  } else {
    // md size (default)
    baseText += ' text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-[15px]';
  }

  return baseText;
});

</script>