<template>
  <TresFog :args="['#000000', 2, 12]" />

  <Suspense>
    <Environment preset="night" />
  </Suspense>

  <TresGroup ref="groupRef">
    <!-- Inner Core -->
    <TresMesh ref="coreRef">
      <TresSphereGeometry :args="[1.3, 160, 160]" />
      <Suspense>
        <MeshWobbleMaterial
          :factor="coreDistort"
          :speed="coreSpeed"
          :roughness="0"
          :metalness="1"
          :transparent="true"
          :opacity="0.95"
          :color="currentColor"
        />
      </Suspense>
    </TresMesh>

    <!-- Outer Glow -->
    <TresMesh ref="outerRef">
      <TresSphereGeometry :args="[2.0, 64, 64]" />
      <Suspense>
        <MeshWobbleMaterial
          :factor="0.8"
          :speed="2"
          :transparent="true"
          :opacity="outerOpacity"
          :depthWrite="false"
          :color="currentColor"
        />
      </Suspense>
    </TresMesh>

    <!-- Particles -->
    <TresPoints ref="particleRef">
      <TresBufferGeometry :position="[particles, 3]" />
      <TresPointsMaterial
        :transparent="true"
        :color="currentColor"
        :size="0.03"
        :sizeAttenuation="true"
        :depthWrite="false"
        :opacity="0.5"
        :blending="THREE.AdditiveBlending"
      />
    </TresPoints>

    <TresAmbientLight :intensity="0.5" />
    <TresPointLight ref="lightRef" :position="[8, 8, 8]" :intensity="5" :color="currentColor" />
    <TresSpotLight :position="[-15, 15, 15]" :angle="0.4" :penumbra="1" :intensity="3" color="#ffffff" />
    <TresPointLight :position="[-5, -5, -5]" :intensity="2" :color="accentColor" />
  </TresGroup>
</template>

<script setup lang="ts">
import { ref, computed, watch, shallowRef } from 'vue';
import { useLoop, useTresContext } from '@tresjs/core';
import { Environment, MeshWobbleMaterial } from '@tresjs/cientos';
import * as THREE from 'three';
import { useAppStore } from '../store';
import { ViewState } from '../types';

const store = useAppStore();

const groupRef = shallowRef<THREE.Group | null>(null);
const coreRef = shallowRef<THREE.Mesh | null>(null);
const outerRef = shallowRef<THREE.Mesh | null>(null);
const particleRef = shallowRef<THREE.Points | null>(null);
const lightRef = shallowRef<THREE.PointLight | null>(null);

const accentColor = computed(() => store.currentOrbColor);
const view = computed(() => store.view);
const scrollProgress = computed(() => store.scrollProgress);

const targetColor = ref(new THREE.Color(accentColor.value));
const currentColor = ref(new THREE.Color('#1e293b'));

watch(accentColor, (newColor) => {
  targetColor.value.set(newColor);
});

// Dense particle field
const particles = new Float32Array(2000 * 3);
for (let i = 0; i < 2000; i++) {
  particles[i * 3] = (Math.random() - 0.5) * 20;
  particles[i * 3 + 1] = (Math.random() - 0.5) * 15;
  particles[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
}

const coreDistort = ref(0.4);
const coreSpeed = ref(2.5);
const outerOpacity = ref(0.2);

const { onBeforeRender } = useLoop();
const { camera } = useTresContext();

onBeforeRender(({ elapsed }) => {
  if (!camera.value) return;
  // Smooth color interpolation
  if (currentColor.value && targetColor.value) {
    currentColor.value.lerp(targetColor.value, 0.06);
  }

  // Camera Logic
  const targetCamPos = new THREE.Vector3(0, 0, 5);
  const targetCamLook = new THREE.Vector3(0, 0, 0);

  if (view.value === ViewState.DETAIL) {
    targetCamPos.set(2.5, 0.8, 3.5);
    targetCamLook.set(-1.5, 0, 0);
  } else if (view.value === ViewState.SELECTOR) {
    targetCamPos.set(0, 0, 6.5);
  } else if (view.value === ViewState.TIMELINE || view.value === ViewState.FAVOURITES) {
    targetCamPos.set((scrollProgress.value - 0.5) * 3, Math.sin(elapsed * 0.2) * 0.5, 5);
  }

  camera.value.position.lerp(targetCamPos, 0.04);
  camera.value.lookAt(targetCamLook);

  // Group Dynamics
  if (groupRef.value) {
    groupRef.value.rotation.y = THREE.MathUtils.lerp(groupRef.value.rotation.y, elapsed * 0.15 + (scrollProgress.value * Math.PI * 0.5), 0.05);
    groupRef.value.rotation.x = Math.sin(elapsed * 0.2) * 0.15;

    const floatY = Math.sin(elapsed * 0.5) * 0.3;
    groupRef.value.position.y = THREE.MathUtils.lerp(groupRef.value.position.y, floatY, 0.05);
  }

  // Morph Geometry & Shader Uniforms
  const isMoving = view.value === ViewState.TIMELINE || view.value === ViewState.SELECTOR;
  coreDistort.value = THREE.MathUtils.lerp(coreDistort.value, isMoving ? 0.6 : 0.4, 0.08);
  coreSpeed.value = THREE.MathUtils.lerp(coreSpeed.value, isMoving ? 5 : 2.5, 0.08);

  if (coreRef.value) {
    const baseScale = 1.6;
    const pulse = Math.sin(elapsed * 1.5) * 0.15 + baseScale;
    coreRef.value.scale.setScalar(THREE.MathUtils.lerp(coreRef.value.scale.x, pulse, 0.1));
  }

  outerOpacity.value = THREE.MathUtils.lerp(outerOpacity.value, view.value === ViewState.LANDING ? 0.2 : 0.08, 0.05);

  if (outerRef.value) {
    outerRef.value.rotation.z = elapsed * 0.2;
  }

  // Particles
  if (particleRef.value) {
    particleRef.value.rotation.y = elapsed * 0.02;
    particleRef.value.rotation.z = elapsed * 0.01;
  }

  if (lightRef.value) {
    lightRef.value.intensity = 4 + Math.sin(elapsed * 1.2) * 2;
  }
});
</script>