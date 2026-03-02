
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Environment, Sphere, Points, PointMaterial, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { ViewState } from '../types';

const Group = 'group' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const SpotLight = 'spotLight' as any;
const Color = 'color' as any;
const Fog = 'fog' as any;

interface SceneProps {
  view: ViewState;
  scrollProgress: number;
  accentColor: string;
}

const Scene: React.FC<SceneProps> = ({ view, scrollProgress, accentColor }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const particleRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const { camera } = useThree();

  const targetColor = useMemo(() => new THREE.Color(accentColor), [accentColor]);
  const currentColor = useMemo(() => new THREE.Color('#1e293b'), []);

  // Dense particle field for depth, made more "misty" and less "linear"
  const particles = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Smooth color interpolation
    currentColor.lerp(targetColor, 0.06);
    
    // Camera Logic: More dynamic spatial movement
    let targetCamPos = new THREE.Vector3(0, 0, 5);
    let targetCamLook = new THREE.Vector3(0, 0, 0);

    if (view === ViewState.DETAIL) {
      targetCamPos.set(2.5, 0.8, 3.5);
      targetCamLook.set(-1.5, 0, 0);
    } else if (view === ViewState.SELECTOR) {
      targetCamPos.set(0, 0, 6.5);
    } else if (view === ViewState.TIMELINE || view === ViewState.FAVOURITES) {
      targetCamPos.set((scrollProgress - 0.5) * 3, Math.sin(time * 0.2) * 0.5, 5);
    }

    camera.position.lerp(targetCamPos, 0.04);
    state.camera.lookAt(targetCamLook);

    // Group Dynamics: Energetic rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, time * 0.15 + (scrollProgress * Math.PI * 0.5), 0.05);
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.15;
      
      const floatY = Math.sin(time * 0.5) * 0.3;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, floatY, 0.05);
    }

    // Morph Geometry & Shader Uniforms: High energy distortion
    if (coreRef.current) {
      const coreMat = coreRef.current.material as any;
      coreMat.color.copy(currentColor);
      
      // Increased distortion for "energetic" feel
      const isMoving = view === ViewState.TIMELINE || view === ViewState.SELECTOR;
      coreMat.distort = THREE.MathUtils.lerp(coreMat.distort, isMoving ? 0.6 : 0.4, 0.08);
      coreMat.speed = THREE.MathUtils.lerp(coreMat.speed, isMoving ? 5 : 2.5, 0.08);
      
      // Dynamic scale pulsing (slightly larger to punch through blur)
      const baseScale = 1.6;
      const pulse = Math.sin(time * 1.5) * 0.15 + baseScale;
      coreRef.current.scale.setScalar(THREE.MathUtils.lerp(coreRef.current.scale.x, pulse, 0.1));
    }

    if (outerRef.current) {
      const outerMat = outerRef.current.material as any;
      outerMat.color.copy(currentColor);
      outerMat.opacity = THREE.MathUtils.lerp(outerMat.opacity, view === ViewState.LANDING ? 0.2 : 0.08, 0.05);
      outerRef.current.rotation.z = time * 0.2;
    }

    // Particles: Drifting nebula feel
    if (particleRef.current) {
      particleRef.current.rotation.y = time * 0.02;
      particleRef.current.rotation.z = time * 0.01;
      const pMat = particleRef.current.material as THREE.PointsMaterial;
      pMat.color.lerp(currentColor, 0.02);
    }

    if (lightRef.current) {
      lightRef.current.color.copy(currentColor);
      lightRef.current.intensity = 4 + Math.sin(time * 1.2) * 2;
    }
  });

  return (
    <Group ref={groupRef}>
      {/* Inner Core: Highly dynamic fluid shape */}
      <Sphere ref={coreRef} args={[1.3, 160, 160]}>
        <MeshDistortMaterial
          distort={0.5}
          speed={3}
          roughness={0}
          metalness={1}
          transparent
          opacity={0.95}
          envMapIntensity={5}
        />
      </Sphere>

      {/* Outer Glow: Purely atmospheric, NO WIREFRAME/LINES */}
      <Sphere ref={outerRef} args={[2.0, 64, 64]}>
        <MeshWobbleMaterial
          factor={0.8}
          speed={2}
          transparent
          opacity={0.05}
          depthWrite={false}
        />
      </Sphere>

      {/* Atmospheric Nebula Particles */}
      <Points ref={particleRef} positions={particles}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      <AmbientLight intensity={0.5} />
      <PointLight ref={lightRef} position={[8, 8, 8]} intensity={5} />
      <SpotLight position={[-15, 15, 15]} angle={0.4} penumbra={1} intensity={3} color="#ffffff" />
      
      {/* Dynamic secondary lights */}
      <PointLight position={[-5, -5, -5]} intensity={2} color={accentColor} />
    </Group>
  );
};

interface Canvas3DProps {
  view: ViewState;
  scrollProgress: number;
  accentColor: string;
}

const Canvas3D: React.FC<Canvas3DProps> = ({ view, scrollProgress, accentColor }) => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
      >
        <Color attach="background" args={['#000000']} />
        <Fog attach="fog" args={['#000000', 2, 12]} />
        <Scene view={view} scrollProgress={scrollProgress} accentColor={accentColor} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default Canvas3D;
