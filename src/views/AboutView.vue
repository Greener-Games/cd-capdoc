<template>
  <ContentPage
      title="Creative Design"
      description="We are a global creative collective specializing in high-end digital craftsmanship, cinematic storytelling, and immersive environmental design."
      :blocks="aboutBlocks"
  >
    <template #metadata>
      <div class="grid grid-cols-2 gap-x-16 gap-y-4 text-[10px] uppercase text-white/50">
        <div class="flex flex-col space-y-2">
          <span>Strategy</span>
          <span>Design</span>
          <span>Technology</span>
        </div>
        <div class="flex flex-col space-y-2">
          <span>AtkinsRéalis</span>
          <span>EST. 2026</span>
        </div>
      </div>
    </template>
  </ContentPage>
</template>

<script setup lang="ts">
import ContentPage from "@/components/Layouts/ContentPage.vue";
import { ContentBlock } from '../types';

const aboutBlocks: ContentBlock[] = [
  {
    id: 'a1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2400&h=1200',
    alt: 'Studio Space'
  },
  {
    id: 'a2',
    type: 'text',
    title: 'OUR PHILOSOPHY',
    content: 'We believe that complexity should lead to clarity. Our mission is to transform intricate challenges into elegant, intuitive experiences that resonate on a global scale. By merging strategic thinking with technical excellence, we push the boundaries of what is possible in the digital and physical realms.'
  },
  {
    id: 'a3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522071823991-b1ae5e6a3048?auto=format&fit=crop&q=80&w=2400&h=1200',
    alt: 'Team Collaboration'
  },
  {
    id: 'a4',
    type: 'text',
    title: 'THE COLLECTIVE',
    content: 'Our team is comprised of world-class designers, engineers, and strategists. As part of the AtkinsRéalis Group, we leverage global expertise to deliver flagship developments across transportation, energy, and infrastructure, all while maintaining the agile soul of a boutique creative studio.'
  }
];
</script>
