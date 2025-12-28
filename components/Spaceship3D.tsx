'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import '@/styles/technical-map.css';

// Preload the model for better performance
useGLTF.preload('/vaisseaux/vaisseaux_model/futuristic gun 3d model.glb');

function SpaceshipModel() {
  const { scene } = useGLTF('/vaisseaux/vaisseaux_model/futuristic gun 3d model.glb');
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Apply metallic properties while keeping original colors/textures
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Check if material exists
        if (child.material) {
          // If it's an array of materials
          if (Array.isArray(child.material)) {
            child.material = child.material.map((mat) => {
              const newMat = mat.clone();
              // Darken the color slightly
              if (newMat.color) {
                newMat.color.multiplyScalar(0.7);
              }
              newMat.metalness = 0.75;
              newMat.roughness = 0.35;
              newMat.envMapIntensity = 0.7;
              return newMat;
            });
          } else {
            // Single material
            const newMat = child.material.clone();
            // Darken the color slightly
            if (newMat.color) {
              newMat.color.multiplyScalar(0.7);
            }
            newMat.metalness = 0.75;
            newMat.roughness = 0.35;
            newMat.envMapIntensity = 0.7;
            child.material = newMat;
          }
        }
      }
    });
  }, [scene]);

  // Auto rotation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={2.2}
      position={[0, 0, 0]}
      rotation={[0, Math.PI / -3, -3]}
    />
  );
}

interface Spaceship3DProps {
  caseData?: {
    cas_numero?: string;
    titre?: string;
    date_observation?: string;
    resume_enquete?: string;
    description_complete?: string;
    caracteristiques?: {
      couleur?: string;
      forme?: string;
      dimensions?: string;
      details?: string[];
    };
    comportement?: string[];
    phenomenes?: string[];
    traces?: string[];
    temoignages?: Array<{
      forme_phenomene?: string;
      couleur?: string;
      vitesse?: string;
      description?: string;
    }>;
  };
}

// Animated text component
function TypewriterText({ text, delay = 20 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, delay]);

  return <span>{displayedText}</span>;
}

export default function Spaceship3D({ caseData }: Spaceship3DProps) {
  const [error, setError] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Start text animation after a short delay
    const timer = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* 3D Canvas Container */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: '600px' }}
        >
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-tech-grey text-xs mb-2">3D MODEL LOAD FAILED</div>
              <div className="text-tech-dim text-xs">/vaisseaux/vaisseaux_model/futuristic gun 3d model.glb</div>
            </div>
          </div>
        ) : (
          <Canvas
            camera={{ position: [0, 0.5, 2], fov: 60 }}
            style={{ background: '#000000' }}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance'
            }}
            dpr={[1, 2]}
            onError={() => setError(true)}
          >
            {/* Lighting Setup */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 1, 5]} intensity={1.5} />
            <directionalLight position={[-5, -1, -5]} intensity={0.8} />
            <directionalLight position={[0, -3, 5]} intensity={1} />
            <pointLight position={[2, 2, 3]} intensity={0.8} color="#ffffff" />

            {/* Night Environment */}
            <Environment preset="night" environmentIntensity={2} />

            {/* 3D Model with Loading State */}
            <Suspense fallback={null}>
              <SpaceshipModel />
            </Suspense>

            {/* Interactive Controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              maxDistance={8}
              minDistance={1}
              target={[0, 0, 0]}
            />
          </Canvas>
        )}
        </div>

        {/* Case Data Display */}
        {caseData && showText && (
          <div className="space-y-5 text-tech-white font-mono max-h-[600px] overflow-y-auto pr-4">
            {/* Case ID and Title */}
            <div className="border-b border-tech pb-3">
              <div className="text-tech-dim text-xs mb-1 uppercase tracking-wider">
                <TypewriterText text="// CASE ID" delay={30} />
              </div>
              <div className="text-tech-white text-base font-bold">
                <TypewriterText text={caseData.cas_numero || '1954-09-09112'} delay={40} />
              </div>
              {caseData.titre && (
                <div className="text-tech-grey text-xs mt-1">
                  <TypewriterText text={caseData.titre} delay={15} />
                </div>
              )}
            </div>

            {/* Témoignage Original */}
            {caseData.description_complete && (
              <div>
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">
                  <TypewriterText text="// TÉMOIGNAGE ORIGINAL" delay={30} />
                </div>
                <div className="text-tech-grey text-xs leading-relaxed">
                  <TypewriterText text={caseData.description_complete} delay={10} />
                </div>
              </div>
            )}

            {/* Caractéristiques Physiques */}
            {caseData.caracteristiques && (
              <div>
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">
                  <TypewriterText text="// DESCRIPTION PHYSIQUE" delay={30} />
                </div>
                <div className="space-y-1 text-xs">
                  {caseData.caracteristiques.couleur && (
                    <div className="flex">
                      <span className="text-tech-dim w-28">Couleur:</span>
                      <span className="text-tech-white flex-1">
                        <TypewriterText text={caseData.caracteristiques.couleur} delay={15} />
                      </span>
                    </div>
                  )}
                  {caseData.caracteristiques.forme && (
                    <div className="flex">
                      <span className="text-tech-dim w-28">Forme:</span>
                      <span className="text-tech-white flex-1">
                        <TypewriterText text={caseData.caracteristiques.forme} delay={15} />
                      </span>
                    </div>
                  )}
                  {caseData.caracteristiques.dimensions && (
                    <div className="flex">
                      <span className="text-tech-dim w-28">Dimensions:</span>
                      <span className="text-tech-white flex-1">
                        <TypewriterText text={caseData.caracteristiques.dimensions} delay={15} />
                      </span>
                    </div>
                  )}
                  {caseData.caracteristiques.details?.map((detail, i) => (
                    <div key={i} className="flex">
                      <span className="text-tech-dim mr-2">•</span>
                      <span className="text-tech-grey flex-1">
                        <TypewriterText text={detail} delay={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comportement */}
            {caseData.comportement && caseData.comportement.length > 0 && (
              <div>
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">
                  <TypewriterText text="// COMPORTEMENT OBSERVÉ" delay={30} />
                </div>
                <div className="space-y-1 text-xs">
                  {caseData.comportement.map((item, i) => (
                    <div key={i} className="flex">
                      <span className="text-tech-dim mr-2">•</span>
                      <span className="text-tech-grey flex-1">
                        <TypewriterText text={item} delay={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Autres Phénomènes */}
            {caseData.phenomenes && caseData.phenomenes.length > 0 && (
              <div>
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">
                  <TypewriterText text="// AUTRES PHÉNOMÈNES" delay={30} />
                </div>
                <div className="space-y-1 text-xs">
                  {caseData.phenomenes.map((item, i) => (
                    <div key={i} className="flex">
                      <span className="text-tech-dim mr-2">•</span>
                      <span className="text-tech-grey flex-1">
                        <TypewriterText text={item} delay={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traces au Sol */}
            {caseData.traces && caseData.traces.length > 0 && (
              <div>
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">
                  <TypewriterText text="// TRACES AU SOL" delay={30} />
                </div>
                <div className="space-y-1 text-xs">
                  {caseData.traces.map((item, i) => (
                    <div key={i} className="flex">
                      <span className="text-tech-dim mr-2">•</span>
                      <span className="text-tech-grey flex-1">
                        <TypewriterText text={item} delay={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
