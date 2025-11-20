import React, { useState } from 'react';
import Scene from './components/Scene';
import UIOverlay from './components/UIOverlay';
import { ShapeType } from './types';

const App: React.FC = () => {
  const [currentShape, setCurrentShape] = useState<ShapeType>(ShapeType.CHAOS);
  const [fps, setFps] = useState(0);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Scene currentShape={currentShape} setFps={setFps} />
      </div>

      {/* UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <UIOverlay 
          currentShape={currentShape} 
          onSwitchShape={setCurrentShape} 
          fps={fps} 
        />
      </div>
    </div>
  );
};

export default App;
