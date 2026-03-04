<template>
  <TresFog :args="['#02050a', 2, 20]" />

  <TresGroup ref="groupRef">
    <TresMesh ref="waveRef" :position="[0, 0, -2]">
      <TresPlaneGeometry :args="[50, 25, 512, 128]" />
      <TresShaderMaterial
          :vertexShader="vertexShader"
          :fragmentShader="fragmentShader"
          :uniforms="uniforms"
          :transparent="true"
          :side="THREE.DoubleSide"
          :depthWrite="false"
      />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted, watch } from 'vue';
import { useLoop, useTresContext } from '@tresjs/core';
import * as THREE from 'three';
import { useAppStore } from '../store';

const waveRef = shallowRef<THREE.Mesh | null>(null);
const groupRef = shallowRef<THREE.Group | null>(null);
const { camera } = useTresContext();

const store = useAppStore();
const defaultColor = new THREE.Color('#0044ff');
const targetColor = new THREE.Color('#0044ff');

// --- Uniforms ---
const uniforms = {
  uTime: { value: 0 },
  uColor: { value: new THREE.Color('#0044ff') },
  uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },

  uLineWidth: { value: 15 },   // Width of the bright strips

  // Now exactly maps to hardware screen pixels!
  uGapWidth: { value: 0 },

  uDistortionZ: { value: 0.25 },
  uDistortionX: { value: 0.5 },
  uChaos: { value: 0.75 }
};

watch(() => store.hoveredColor, (newColor) => {
  if (newColor) {
    targetColor.set(newColor);
  } else {
    targetColor.copy(defaultColor);
  }
});

const handleResize = () => {
  uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
};
onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));

// --- Vertex Shader ---
const vertexShader = `
  uniform float uTime;
  uniform float uDistortionX;
  uniform float uDistortionZ;
  uniform float uChaos;

  varying vec2 vUv;
  varying float vZ;
  varying float vWaveX;

  // 3D Simplex Noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vec3 pos = position;

    float baseWaveZ = sin(pos.y * 0.15 + uTime * 0.5) * 2.5;
    float baseWaveX = sin(pos.y * 0.12 + uTime * 0.4) * 2.0;

    float noiseZ = snoise(vec3(pos.x * 0.1, pos.y * 0.2, uTime * 0.3)) * 2.0;
    float noiseX = snoise(vec3(pos.y * 0.2, pos.z * 0.1, uTime * 0.25)) * 1.5;

    float finalWaveZ = baseWaveZ + (noiseZ * uChaos);
    float finalWaveX = baseWaveX + (noiseX * uChaos);

    pos.z += finalWaveZ * uDistortionZ;
    pos.x += finalWaveX * uDistortionX;

    vZ = pos.z;
    vWaveX = finalWaveX * uDistortionX;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// --- Fragment Shader ---
const fragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uLineWidth;
  uniform float uGapWidth;

  varying vec2 vUv;
  varying float vZ;
  varying float vWaveX;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float segments = uResolution.x / uLineWidth;

    float xPos = vUv.x * segments + (vWaveX * 0.15);
    float stripId = floor(xPos);
    float localX = fract(xPos);

    float stripUvX = (stripId + 0.5) / segments;
    vec2 stripUv = vec2(stripUvX, vUv.y);

    vec2 lightPos = vec2(
      0.5 + cos(uTime * 0.6) * 0.35,
      0.5 + sin(uTime * 0.4) * 0.25
    );

    float distToLight = distance(stripUv, lightPos);
    float spotlight = smoothstep(0.6, 0.0, distToLight);

    float zBoost = smoothstep(-2.0, 3.0, vZ) * 0.6;
    float combinedLight = spotlight + (zBoost * spotlight);

    vec3 darkBackground = vec3(0.01, 0.02, 0.05);
    vec3 brightCyan = vec3(0.6, 0.85, 1.0);

    vec3 stripColor = mix(darkBackground, uColor * 0.6, combinedLight);
    stripColor += brightCyan * pow(combinedLight, 3.0);

    // --- PIXEL PERFECT GAP MATH ---
    // fwidth tells us exactly how much 'xPos' changes from one physical screen pixel to the next.
    // This allows us to draw a line that completely ignores 3D camera scaling.
    float px = fwidth(xPos);

    // We want the total gap to be 'uGapWidth' pixels wide.
    // Half of that gap belongs on the left edge (0.0), half on the right edge (1.0).
    float halfGap = (uGapWidth * px) * 0.5;

    // We use 'px' as the smoothing blend to give the line exactly 1 screen pixel of anti-aliasing.
    // This keeps the line incredibly sharp, but prevents it from looking jagged.
    float edge = smoothstep(halfGap, halfGap + px, localX) *
                 smoothstep(1.0 - halfGap, 1.0 - halfGap - px, localX);

    vec3 finalColor = mix(darkBackground * 0.2, stripColor, edge);

    float vignette = smoothstep(0.8, 0.1, distance(vUv, vec2(0.5)));
    finalColor *= vignette;

    float grain = (hash(vUv + uTime * 0.01) - 0.5) * 0.1;
    finalColor += grain;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const { onBeforeRender } = useLoop();

onBeforeRender(({ elapsed }) => {
  uniforms.uTime.value = elapsed;

  // Smoothly transition to the target color
  uniforms.uColor.value.lerp(targetColor, 0.05);

  if (camera.value) {
    camera.value.position.lerp(new THREE.Vector3(0, 0, 8), 0.04);
    camera.value.lookAt(0, 0, 0);
  }
});
</script>