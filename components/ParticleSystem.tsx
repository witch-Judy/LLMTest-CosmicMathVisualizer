import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ShapeType } from '../types';
import { PARTICLE_COUNT, ANIMATION_SPEED } from '../constants';

interface ParticleSystemProps {
  shape: ShapeType;
}

// 1. Chaos Universe: Spiral Galaxy
const generateChaos = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const arms = 5;
  const armWidth = 0.5;
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Distribution: more in center
    const rRand = Math.random();
    const r = Math.pow(rRand, 2) * 40; // Exponential distribution for dense core
    
    const spin = r * 0.2;
    const armAngle = (Math.floor(Math.random() * arms) / arms) * Math.PI * 2;
    const angle = spin + armAngle + (Math.random() - 0.5) * armWidth * (40/(r+0.1)); // Spread increases near center
    
    // Disk flattening
    const verticalSpread = Math.max(0.5, (40 - r) * 0.1); 
    const y = (Math.random() - 0.5) * verticalSpread;

    positions[i3] = r * Math.cos(angle);
    positions[i3 + 1] = y;
    positions[i3 + 2] = r * Math.sin(angle);
  }
  return positions;
};

// 2. Descartes Heart: 3D Parametric Volume
const generateHeart = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    // Parametric Heart Surface
    // x = 16sin^3(u)
    // y = 13cos(u) - 5cos(2u) - 2cos(3u) - cos(4u)
    // z variation for volume
    
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI; // 0 to PI for volume filling
    
    // Base Heart Curve
    const hx = 16 * Math.pow(Math.sin(u), 3);
    const hy = 13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
    
    // Volumetric scaling
    const scale = Math.sqrt(Math.random()); // Uniform distribution in sphere-like volume
    const thickness = 6 * (1 - Math.abs(u - Math.PI) / Math.PI) + 2; // Thicker at top
    const z = (Math.random() - 0.5) * thickness;

    positions[i3] = hx * scale;
    positions[i3 + 1] = (hy * scale) + 5; // Center it
    positions[i3 + 2] = z * scale;
  }
  return positions;
};

// 3. Agora Rose: 3D Spherical Harmonic Flower
const generateRose = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const k = 7; // Petals
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    // 3D Rose formula modulation
    // r varies with angle to create petals in 3D space
    const rBase = 15;
    const modulation = Math.sin(k * theta) * Math.sin(k * phi);
    const r = rBase * (0.8 + 0.4 * modulation);
    
    // Volume filling
    const vol = Math.pow(Math.random(), 0.5); // concentrate on surface
    
    positions[i3] = r * vol * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * vol * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * vol * Math.cos(phi);
  }
  return positions;
};

// 4. Schrödinger Cat: Geometric Quantum Cloud
const generateCat = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  
  const headR = 7;
  const bodyH = 14;
  const bodyR = 8;
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const rand = Math.random();
    
    let x=0, y=0, z=0;
    
    if (rand < 0.25) {
      // Head (Sphere)
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = headR * Math.cbrt(Math.random()); // solid sphere
      x = r * Math.sin(v) * Math.cos(u);
      y = r * Math.sin(v) * Math.sin(u) + 12;
      z = r * Math.cos(v);
      
      // Ears
      if (y > 16 && Math.abs(x) > 2) {
        y += 3 * Math.random();
      }
    } else if (rand < 0.75) {
      // Body (Cylinder/Ellipsoid)
      const angle = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * bodyH;
      const r = bodyR * Math.sqrt(Math.random()) * (1 - (h/bodyH + 0.5)*0.4); // Taper top
      x = r * Math.cos(angle);
      y = h;
      z = r * Math.sin(angle);
    } else {
      // Tail (Sine Wave Tube)
      const t = Math.random() * Math.PI;
      const rTail = 1.5 * Math.random();
      const tailAngle = Math.random() * Math.PI * 2;
      
      const pathX = Math.sin(t) * 8;
      const pathY = -6 + Math.cos(t) * 6;
      const pathZ = -8 - t*2;
      
      x = pathX + rTail * Math.cos(tailAngle);
      y = pathY + rTail * Math.sin(tailAngle);
      z = pathZ;
    }

    // Quantum Jitter (Superposition effect)
    // Split slightly into two silhouettes
    if (Math.random() > 0.8) {
        x += (Math.random() - 0.5) * 2;
        y += (Math.random() - 0.5) * 2;
        z += (Math.random() - 0.5) * 2;
    }

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
  }
  return positions;
};

// 5. Lissajous: Complex 3D Knot
const generateLissajous = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const segments = count;
  
  // Frequencies
  const nx = 3;
  const ny = 4;
  const nz = 5;
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = (i / count) * Math.PI * 2 * 20; // 20 loops
    
    // Base curve
    const Ax = 18, Ay = 18, Az = 18;
    const bx = Ax * Math.sin(nx * t + Math.PI/2);
    const by = Ay * Math.sin(ny * t);
    const bz = Az * Math.sin(nz * t);
    
    // Add tube volume around the curve
    const tubeR = 3 * Math.random();
    const tubeAng = Math.random() * Math.PI * 2;
    const tubePhi = Math.random() * Math.PI;

    positions[i3] = bx + tubeR * Math.sin(tubePhi) * Math.cos(tubeAng);
    positions[i3 + 1] = by + tubeR * Math.sin(tubePhi) * Math.sin(tubeAng);
    positions[i3 + 2] = bz + tubeR * Math.cos(tubePhi);
  }
  return positions;
};

// 6. Mandelbrot: Extruded Canyon
const generateMandelbrot = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  let i = 0;
  let attempts = 0;
  
  // We generate points until we fill the buffer
  while (i < count && attempts < count * 10) {
    attempts++;
    
    // Pick a point in complex plane
    const cx = (Math.random() * 3.5) - 2.5; // -2.5 to 1
    const cy = (Math.random() * 3) - 1.5; // -1.5 to 1.5
    
    let zx = 0;
    let zy = 0;
    let iter = 0;
    const maxIter = 60;
    
    while (zx*zx + zy*zy < 4 && iter < maxIter) {
      const tmp = zx*zx - zy*zy + cx;
      zy = 2*zx*zy + cy;
      zx = tmp;
      iter++;
    }
    
    // We want to visualize the boundary/escape time
    if (iter > 2 && iter < maxIter) {
       const i3 = i * 3;
       const height = (iter / maxIter) * 25 - 12.5;
       
       positions[i3] = cx * 10 + 5; // Scale X
       positions[i3 + 1] = height; // Height
       positions[i3 + 2] = cy * 10; // Scale Z
       
       // Add a mirror floor for "Canyon" effect
       if (i + 1 < count) {
           const i3next = (i+1) * 3;
           positions[i3next] = cx * 10 + 5;
           positions[i3next + 1] = -height; // Mirror
           positions[i3next + 2] = cy * 10;
           i++;
       }
       i++;
    }
  }
  // Fill remaining with noise if loop exits early
  while (i < count) {
      const i3 = i*3;
      positions[i3] = (Math.random()-0.5)*30;
      positions[i3+1] = (Math.random()-0.5)*30;
      positions[i3+2] = (Math.random()-0.5)*30;
      i++;
  }
  
  return positions;
};

// 7. Fibonacci Sphere: Dyson Shell
const generateFibonacci = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden Angle
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    
    // Base Sphere
    let r = 20;
    
    // Add geometric layers (Dyson sphere look)
    // Modulate radius based on index patterns
    if (i % 50 < 5) r += 2; // Rings
    if (i % 300 < 20) r += 5; // Large Equators
    
    // Random noise for "energy field"
    r += (Math.random() - 0.5) * 0.5;

    positions[i3] = Math.cos(theta) * radiusAtY * r;
    positions[i3 + 1] = y * r;
    positions[i3 + 2] = Math.sin(theta) * radiusAtY * r;
  }
  return positions;
};

const generateShapePositions = (type: ShapeType, count: number): Float32Array => {
    switch (type) {
        case ShapeType.CHAOS: return generateChaos(count);
        case ShapeType.HEART: return generateHeart(count);
        case ShapeType.ROSE: return generateRose(count);
        case ShapeType.CAT: return generateCat(count);
        case ShapeType.LISSAJOUS: return generateLissajous(count);
        case ShapeType.MANDELBROT: return generateMandelbrot(count);
        case ShapeType.FIBONACCI: return generateFibonacci(count);
        default: return generateChaos(count);
    }
};

const getParticleTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 32; 
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Sharp bright core for additive mixing
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

const ParticleSystem: React.FC<ParticleSystemProps> = ({ shape }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const [geometry] = useState(() => new THREE.BufferGeometry());
  
  const currentPositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const targetPositions = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const colors = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  
  // Initial Setup
  useEffect(() => {
    const initialPos = generateShapePositions(ShapeType.CHAOS, PARTICLE_COUNT);
    currentPositions.current.set(initialPos);
    targetPositions.current.set(initialPos);

    // Initialize White
    colors.current.fill(1); 

    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions.current, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors.current, 3));
  }, [geometry]);

  // Handle Shape Switch & Coloring
  useEffect(() => {
    const newTargets = generateShapePositions(shape, PARTICLE_COUNT);
    targetPositions.current.set(newTargets);
    
    const cArray = geometry.attributes.color.array as Float32Array;
    
    // Define Color Palettes (RGB)
    let r1=1, g1=1, b1=1;
    let r2=0, g2=0, b2=0;
    
    switch(shape) {
        case ShapeType.CHAOS: 
          // Galaxy: Orange/Blue
          r1=1.0; g1=0.6; b1=0.1;
          r2=0.1; g2=0.4; b2=1.0;
          break;
        case ShapeType.HEART: 
          // Crimson / Pink
          r1=1.0; g1=0.0; b1=0.3;
          r2=1.0; g2=0.2; b2=0.8;
          break;
        case ShapeType.ROSE: 
          // Magenta / Cyan
          r1=1.0; g1=0.0; b1=1.0;
          r2=0.0; g2=1.0; b2=1.0;
          break;
        case ShapeType.CAT: 
          // Quantum: Purple / Green
          r1=0.6; g1=0.0; b1=1.0;
          r2=0.0; g2=1.0; b2=0.5;
          break;
        case ShapeType.LISSAJOUS: 
          // Electric Blue / White
          r1=0.0; g1=0.8; b1=1.0;
          r2=1.0; g2=1.0; b2=1.0;
          break;
        case ShapeType.MANDELBROT: 
          // Fractal: Green / Gold
          r1=0.0; g1=1.0; b1=0.4;
          r2=1.0; g2=0.8; b2=0.1;
          break;
        case ShapeType.FIBONACCI: 
          // Gold / Red
          r1=1.0; g1=0.8; b1=0.0;
          r2=1.0; g2=0.2; b2=0.0;
          break;
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
       const i3 = i*3;
       const mix = Math.random();
       cArray[i3] = r1 * mix + r2 * (1-mix);
       cArray[i3+1] = g1 * mix + g2 * (1-mix);
       cArray[i3+2] = b1 * mix + b2 * (1-mix);
       
       // Add sparkle intensity
       if (Math.random() > 0.95) {
           cArray[i3] = 1; cArray[i3+1] = 1; cArray[i3+2] = 1; 
       }
    }
    geometry.attributes.color.needsUpdate = true;

  }, [shape, geometry]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = geometry.attributes.position.array as Float32Array;
    const target = targetPositions.current;
    
    // Physics / Animation variables
    const time = state.clock.elapsedTime;
    const speed = ANIMATION_SPEED; 
    
    let hasUpdates = false;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      
      // 1. Interpolate to Target
      const tx = target[i3];
      const ty = target[i3+1];
      const tz = target[i3+2];
      
      const px = positions[i3];
      const py = positions[i3+1];
      const pz = positions[i3+2];
      
      // Simple ease-out
      positions[i3] += (tx - px) * speed;
      positions[i3+1] += (ty - py) * speed;
      positions[i3+2] += (tz - pz) * speed;
      
      // 2. Add Micro-movement (Brownian Motion / Quantum Jitter)
      const jitter = 0.02;
      positions[i3] += (Math.random() - 0.5) * jitter;
      positions[i3+1] += (Math.random() - 0.5) * jitter;
      positions[i3+2] += (Math.random() - 0.5) * jitter;

      // 3. Optional: Swirling noise could go here
      
      hasUpdates = true;
    }

    // Global Rotation
    // Rotate faster for Chaos, slower for specific shapes
    const rotSpeed = shape === ShapeType.CHAOS ? 0.1 : 0.05;
    pointsRef.current.rotation.y = time * rotSpeed;
    
    // Gentle Breathing
    const scale = 1 + Math.sin(time * 0.5) * 0.02;
    pointsRef.current.scale.set(scale, scale, scale);

    if (hasUpdates) {
      geometry.attributes.position.needsUpdate = true;
    }
  });

  const texture = useMemo(() => getParticleTexture(), []);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.15} // Smaller size for high density
        vertexColors
        map={texture}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default ParticleSystem;