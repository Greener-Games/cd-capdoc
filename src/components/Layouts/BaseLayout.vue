<template>
  <div
      class="relative structure-gap items-start w-full h-full pt-safe-top z-10"
      :class="[
          disablePaddingBottom ? 'pb-0' : 'pb-safe-bottom-footer',
          disablePaddingSide ? 'px-0' : 'px-safe-side'
      ]"
  >
    <!-- Use our unified PageHeader -->
    <PageHeader
        v-if="$slots['header-controls'] || $slots['title'] || $slots['title-right'] || $slots['header-bottom']"
        :title-key="titleKey"
        :force-padding="disablePaddingSide"
    >
      <template v-if="$slots['header-controls']" #controls>
        <slot name="header-controls"></slot>
      </template>

      <template v-if="$slots['title']" #title>
        <slot name="title"></slot>
      </template>

      <template v-if="$slots['title-right']" #title-right>
        <slot name="title-right"></slot>
      </template>

      <template v-if="$slots['header-bottom']" #bottom>
        <slot name="header-bottom"></slot>
      </template>
    </PageHeader>

    <!-- Main content area -->
    <main class="relative flex-1 w-full min-h-0">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';
import PageHeader from "@/components/Common/PageHeader.vue";

defineProps<{
  titleKey?: string | number;
  disablePaddingBottom?: boolean;
  disablePaddingSide?: boolean;
}>();

const slots = useSlots();
</script>
