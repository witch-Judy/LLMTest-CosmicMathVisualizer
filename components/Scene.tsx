import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import ParticleSystem from './ParticleSystem';
import { ShapeType } from '../types';
import { CAMERA_POSITION } from '../constants';

interface SceneProps {
  currentShape: ShapeType;
  setFps: (fps: number) => void;
}

const FPSCounter = ({ setFps }: { setFps: (v: number) => void }) => {
  const lastTime = useRef(performance.now());
  const frames = useRef(0);

  useFrame(() => {
    frames.current++;
    const time = performance.now();
    if (time >= lastTime.current + 1000) {
      setFps(frames.current);
      frames.current = 0;
      lastTime.current = time;
    }
  });
  return null;
};

const Scene: React.FC<SceneProps> = ({ currentShape, setFps }) => {
  return (
    <div className="w-full h-full relative bg-black">
      <Canvas dpr={[1, 2]} gl={{ antialias: false, stencil: false, alpha: false }}>
        <color attach="background" args={['#000000']} />
        
        <PerspectiveCamera makeDefault position={[...CAMERA_POSITION]} fov={60} />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={10} 
          maxDistance={120}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <FPSCounter setFps={setFps} />

        {/* Deep Space Background */}
        <Stars radius={150} depth={80} count={12000} factor={5} saturation={1} fade speed={0.8} />
        
        {/* Ambient Light to lift shadows slightly */}
        <ambientLight intensity={0.2} />

        <ParticleSystem shape={currentShape} />

        {/* Sci-Fi Post Processing Pipeline */}
        <EffectComposer disableNormalPass>
          {/* Intense Glow */}
          <Bloom 
            luminanceThreshold={0.15} 
            mipmapBlur 
            intensity={2.5} 
            radius={0.6} 
            levels={8}
          />
          
          {/* Holographic/Glitch Edge Effect */}
          <ChromaticAberration 
            offset={new THREE.Vector2(0.002, 0.002)} 
            radialModulation={true}
            modulationOffset={0.5}
          />

          {/* Film Grain */}
          <Noise opacity={0.1} blendFunction={BlendFunction.OVERLAY} />
          
          {/* Cinematic Dark Corners */}
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Scene;