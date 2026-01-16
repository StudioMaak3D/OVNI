'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import AIInfoButton from '@/components/AIInfoButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { BASE_PATH } from '@/lib/config';
import '@/styles/technical-map.css';

// Preload the model for better performance
useGLTF.preload(`${BASE_PATH}/vaisseaux/vaisseaux_model/futuristic gun 3d model.glb`);

function SpaceshipModel() {
  const { scene } = useGLTF(`${BASE_PATH}/vaisseaux/vaisseaux_model/futuristic gun 3d model.glb`);
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
  useFrame((_state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.8}
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

export default function Spaceship3D({ caseData }: Spaceship3DProps) {
  const [error, setError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const { language, t } = useLanguage();

  // Translate case data content
  const translateContent = (text: string): string => {
    if (language === 'FR') return text;

    // Translation map for the Prémanon case
    const translations: Record<string, string> = {
      "Le 27 septembre 1954 à 20h30, trois enfants (de 12, 9 et 8 ans) observent à proximité de leur maison un engin étrange de couleur aluminium de forme rectangulaire fendu partiellement en son milieu dans le sens de la hauteur.":
        "On September 27, 1954 at 8:30 PM, three children (aged 12, 9, and 8) observed near their home a strange aluminum-colored rectangular craft partially split in the middle along its height.",
      "aluminium": "aluminum",
      "rectangulaire": "rectangular",
      "environ 2 mètres de haut sur 1 mètre de large": "approximately 2 meters high by 1 meter wide",
      "Fendu partiellement en son milieu (dans le sens de la hauteur)": "Partially split in the middle (along its height)",
      "Deux supports coudés de chaque côté à sa base (sortes de \"pieds\" extérieurs)": "Two bent supports on each side at its base (like exterior \"feet\")",
      "Un enfant lance une pierre puis une fléchette contre l'engin": "A child throws a stone then a dart at the craft",
      "L'engin s'avance lentement et renverse l'enfant": "The craft moves forward slowly and knocks down the child",
      "L'enfant effrayé rentre chez lui": "The frightened child goes home",
      "Deux sœurs verront également l'engin et iront se cacher": "Two sisters also saw the craft and went to hide",
      "Aucun témoin ne verra l'engin disparaître": "No witness saw the craft disappear",
      "Les sœurs ont vu une lueur rouge se balancer au ras du sol près de l'habitation": "The sisters saw a red glow swaying close to the ground near the house",
      "Large couronne dans l'herbe couchée, orientée dans le sens des aiguilles d'une montre": "Large ring in flattened grass, oriented clockwise",
      "Quatre trous dans cette couronne": "Four holes in this ring",
      "Traces non identifiées comme du piétinement": "Traces not identified as trampling"
    };

    return translations[text] || text;
  };

  return (
    <div className="w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* 3D Canvas Container */}
        <div
          className="relative w-full"
          style={{ height: '600px' }}
        >
          {/* Controls Info Button - Top Left */}
          <div className="absolute top-3 left-3 z-10">
            <button
              onClick={() => setShowControls(true)}
              className="w-8 h-8 rounded-full bg-tech-dark border border-tech hover:border-tech-bright transition-colors flex items-center justify-center group"
              title="Controls"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-tech-grey group-hover:text-tech-white transition-colors"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </button>
          </div>

          {/* AI Info Button - Bottom Left */}
          <div className="absolute bottom-3 left-3 z-10">
            <AIInfoButton type="3d" />
          </div>

          {/* Controls Modal */}
          {showControls && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{ background: 'rgba(0, 0, 0, 0.8)' }}
              onClick={() => setShowControls(false)}
            >
              <div
                className="control-panel bg-tech-dark border-tech p-6 max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-tech-grey text-xs font-bold uppercase tracking-wider">
                    {'//'} 3D CONTROLS
                  </div>
                  <button
                    onClick={() => setShowControls(false)}
                    className="text-tech-grey hover:text-tech-white text-xl leading-none"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="text-tech-dim min-w-[80px]">ROTATE:</div>
                    <div className="text-tech-white">Click and drag to rotate the model</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-tech-dim min-w-[80px]">ZOOM:</div>
                    <div className="text-tech-white">Scroll or pinch to zoom in/out</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-tech-dim min-w-[80px]">PAN:</div>
                    <div className="text-tech-white">Right-click and drag to move</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-tech">
                  <p className="text-tech-dim text-xs">
                    &gt; The model auto-rotates. Click to take control.
                  </p>
                </div>
              </div>
            </div>
          )}
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-tech-grey text-xs mb-2">3D MODEL LOAD FAILED</div>
              <div className="text-tech-dim text-xs">/vaisseaux/vaisseaux_model/futuristic gun 3d model.glb</div>
            </div>
          </div>
        ) : (
          <Canvas
            camera={{ position: [0, 0.4, 2], fov: 60 }}
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
        {caseData && (
          <div className="space-y-5 text-tech-white font-mono">
            {/* Case ID and Title */}
            <div className="mb-6">
              <div className="text-tech-dim text-sm mb-2 uppercase tracking-wider">
                {t("// CASE ID", "// CASE ID")}
              </div>
              <div className="text-tech-white text-xl font-bold">
                {caseData.cas_numero || '1954-09-09112'}
              </div>
              {caseData.titre && (
                <div className="text-tech-grey text-sm mt-2">
                  {caseData.titre}
                </div>
              )}
            </div>

            {/* Témoignage Original */}
            {caseData.description_complete && (
              <div className="mb-6">
                <div className="text-tech-white text-sm leading-relaxed">
                  {translateContent(caseData.description_complete)}
                </div>
              </div>
            )}

            {/* Caractéristiques Physiques */}
            {caseData.caracteristiques && (
              <div>
                <div className="text-tech-dim text-xs mb-2 uppercase tracking-wider">
                  {t("// DESCRIPTION PHYSIQUE", "// PHYSICAL DESCRIPTION")}
                </div>
                <div className="space-y-1 text-xs">
                  {caseData.caracteristiques.couleur && (
                    <div className="flex">
                      <span className="text-tech-dim w-28">{t('Couleur:', 'Color:')}</span>
                      <span className="text-tech-white flex-1">
                        {translateContent(caseData.caracteristiques.couleur)}
                      </span>
                    </div>
                  )}
                  {caseData.caracteristiques.forme && (
                    <div className="flex">
                      <span className="text-tech-dim w-28">{t('Forme:', 'Shape:')}</span>
                      <span className="text-tech-white flex-1">
                        {translateContent(caseData.caracteristiques.forme)}
                      </span>
                    </div>
                  )}
                  {caseData.caracteristiques.dimensions && (
                    <div className="flex">
                      <span className="text-tech-dim w-28">{t('Dimensions:', 'Dimensions:')}</span>
                      <span className="text-tech-white flex-1">
                        {translateContent(caseData.caracteristiques.dimensions)}
                      </span>
                    </div>
                  )}
                  {caseData.caracteristiques.details?.map((detail, i) => (
                    <div key={i} className="flex">
                      <span className="text-tech-dim mr-2">•</span>
                      <span className="text-tech-grey flex-1">
                        {translateContent(detail)}
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
                  {t("// COMPORTEMENT OBSERVÉ", "// OBSERVED BEHAVIOR")}
                </div>
                <div className="space-y-1 text-xs">
                  {caseData.comportement.map((item, i) => (
                    <div key={i} className="flex">
                      <span className="text-tech-dim mr-2">•</span>
                      <span className="text-tech-grey flex-1">
                        {translateContent(item)}
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
                  {t("// AUTRES PHÉNOMÈNES", "// OTHER PHENOMENA")}
                </div>
                <div className="space-y-1 text-xs">
                  {caseData.phenomenes.map((item, i) => (
                    <div key={i} className="flex">
                      <span className="text-tech-dim mr-2">•</span>
                      <span className="text-tech-grey flex-1">
                        {translateContent(item)}
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
                  {t("// TRACES AU SOL", "// GROUND TRACES")}
                </div>
                <div className="space-y-1 text-xs">
                  {caseData.traces.map((item, i) => (
                    <div key={i} className="flex">
                      <span className="text-tech-dim mr-2">•</span>
                      <span className="text-tech-grey flex-1">
                        {translateContent(item)}
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
