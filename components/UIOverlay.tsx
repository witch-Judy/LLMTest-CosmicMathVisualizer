import React, { useState } from 'react';
import { ShapeType } from '../types';
import { Activity, Heart, Flower, Cat, Infinity as InfinityIcon, Cpu, Sigma, Zap, Globe, Ghost, Hexagon } from 'lucide-react';

interface UIOverlayProps {
  currentShape: ShapeType;
  onSwitchShape: (shape: ShapeType) => void;
  fps: number;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ currentShape, onSwitchShape, fps }) => {
  const shapes = Object.values(ShapeType);
  const [activeIdx, setActiveIdx] = useState(0);

  const handleNext = () => {
    const nextIdx = (activeIdx + 1) % shapes.length;
    setActiveIdx(nextIdx);
    onSwitchShape(shapes[nextIdx]);
  };

  const getIcon = (shape: ShapeType) => {
    switch (shape) {
      case ShapeType.CHAOS: return <Zap className="w-6 h-6 text-yellow-400" />;
      case ShapeType.HEART: return <Heart className="w-6 h-6 text-red-500" />;
      case ShapeType.ROSE: return <Flower className="w-6 h-6 text-pink-400" />;
      case ShapeType.CAT: return <Ghost className="w-6 h-6 text-purple-400" />;
      case ShapeType.LISSAJOUS: return <InfinityIcon className="w-6 h-6 text-blue-400" />;
      case ShapeType.MANDELBROT: return <Cpu className="w-6 h-6 text-green-400" />;
      case ShapeType.FIBONACCI: return <Hexagon className="w-6 h-6 text-orange-400" />;
      default: return <Globe className="w-6 h-6" />;
    }
  };

  const getDescription = (shape: ShapeType) => {
    switch (shape) {
      case ShapeType.CHAOS: return "Galactic Entropy: Spiral Dynamics";
      case ShapeType.HEART: return "Parametric Volumetric: (x²+9/4y²+z²-1)³...";
      case ShapeType.ROSE: return "Spherical Harmonics: Y(l,m)";
      case ShapeType.CAT: return "Schrödinger's Superposition: |Alive⟩ + |Dead⟩";
      case ShapeType.LISSAJOUS: return "Complex Harmonic Knot 3D";
      case ShapeType.MANDELBROT: return "Complex Plane Extrusion Z(n+1)";
      case ShapeType.FIBONACCI: return "Golden Angle Dyson Sphere φ";
      default: return "Analysing...";
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none font-sci-fi text-cyan-400 z-10 flex flex-col justify-between p-6 select-none">
      
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 p-4 rounded-sm shadow-[0_0_20px_rgba(0,255,255,0.15)] pointer-events-auto transform transition hover:scale-105 duration-300 group">
          <div className="flex items-center gap-2 mb-2 border-b border-cyan-800 pb-2">
            <Activity className="w-5 h-5 text-cyan-300 group-hover:animate-pulse" />
            <h1 className="text-xl font-bold tracking-widest uppercase text-cyan-100">System Metrics</h1>
          </div>
          <div className="space-y-1 text-sm font-mono text-cyan-200/80">
            <div className="flex justify-between w-56 border-b border-cyan-900/50 pb-1">
              <span>RENDER FPS:</span>
              <span className={fps < 30 ? "text-red-500 font-bold" : "text-green-400 font-bold drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]"}>{fps}</span>
            </div>
            <div className="flex justify-between w-56 border-b border-cyan-900/50 pb-1">
              <span>PARTICLE COUNT:</span>
              <span className="text-cyan-300">60,000</span>
            </div>
            <div className="flex justify-between w-56">
              <span>MODE:</span>
              <span className="text-white font-bold uppercase">{currentShape.split(' ')[0]}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right hidden md:block pointer-events-auto">
          <div className="text-xs text-cyan-500 tracking-[0.5em] animate-pulse">QUANTUM SIMULATION</div>
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_10px_rgba(0,200,255,0.5)]">
            HYPER-SPACE
          </div>
          <div className="text-sm text-purple-400 tracking-wider mt-1 opacity-80">{getDescription(currentShape)}</div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center items-end pointer-events-auto pb-8">
        <div className="bg-black/80 backdrop-blur-xl border-t border-l border-r border-cyan-500/50 p-8 rounded-2xl shadow-[0_-10px_50px_rgba(0,200,255,0.1)] max-w-3xl w-full relative overflow-hidden">
          {/* Scanning Line */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/50 animate-[scan_4s_linear_infinite] opacity-50" />

          <div className="flex items-center justify-between gap-8">
            
            <div className="flex-1">
              <div className="text-xs text-cyan-400 mb-1 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                Active Topology
              </div>
              <div className="text-3xl font-bold text-white flex items-center gap-4">
                <div className="p-2 bg-cyan-900/30 rounded-lg border border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  {getIcon(currentShape)}
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400 drop-shadow-lg">
                  {currentShape}
                </span>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="group relative px-10 py-4 bg-cyan-950/40 overflow-hidden border border-cyan-400/60 hover:border-cyan-300 transition-all duration-300 rounded-xl hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] active:scale-95"
            >
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-600/40 to-purple-600/40 transition-all duration-300 ease-out group-hover:w-full"></div>
              <span className="relative flex items-center gap-3 text-cyan-100 font-bold tracking-[0.15em] uppercase group-hover:text-white">
                <Zap className="w-5 h-5 group-hover:text-yellow-300 transition-colors" />
                Switch
              </span>
            </button>
            
          </div>
          
          {/* Timeline Indicators */}
          <div className="mt-6 flex gap-1.5 h-1.5">
            {shapes.map((s, i) => (
              <div 
                key={s} 
                className={`flex-1 rounded-full transition-all duration-500 ${s === currentShape ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-cyan-900/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;