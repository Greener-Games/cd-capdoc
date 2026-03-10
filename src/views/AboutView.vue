<template>
  <ContentPage
      title="Creative Design"
      description="We are a global creative collective specializing in high-end digital craftsmanship, cinematic storytelling, and immersive environmental design."
      :blocks="aboutBlocks"
      :metadata="aboutMetadata"
  />
</template>

<script setup lang="ts">
import ContentPage from "@/components/Layouts/ContentPage.vue";
import { ContentBlock, PageMetadata } from '../types';

const aboutMetadata: PageMetadata = {
  left: ['Strategy', 'Design', 'Technology'],
  right: ['AtkinsRéalis', 'EST. 2026']
};

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
    leftContent: {
      html: '<p>We believe that complexity should lead to clarity. Our mission is to transform intricate challenges into elegant, intuitive experiences that resonate on a global scale. By merging strategic thinking with technical excellence, we push the boundaries of what is possible in the digital and physical realms.</p>'
    },
    rightContent: {
      html: '<p>Every project is an opportunity to redefine the standard. We combine deep technical expertise with a human-centric approach to ensure that the solutions we build are not only functional but also emotionally resonant.</p>'
    }
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
    leftContent: {
      html: '<p>Our team is comprised of world-class designers, engineers, and strategists. As part of the AtkinsRéalis Group, we leverage global expertise to deliver flagship developments across transportation, energy, and infrastructure, all while maintaining the agile soul of a boutique creative studio.</p>'
    },
    rightContent: {
      html: '<p>By working at the intersection of architecture, technology, and media, we create immersive environments that tell stories and connect people with the spaces they inhabit.</p>'
    }
  }
];
</script>
