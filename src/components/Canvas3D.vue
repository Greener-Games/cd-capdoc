<template>
  <div class="fixed inset-0 w-full h-full pointer-events-none">
    <TresCanvas
      clear-color="#000000"
      window-size
    >
      <TresPerspectiveCamera :position="[0, 0, 5]" :fov="35" :near="0.1" :far="1000" />
      <SceneContent />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import SceneContent from './SceneContent.vue';
</script>