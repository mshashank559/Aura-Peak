import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// Memoized procedural luxury apartment model
const ApartmentModel: React.FC = React.memo(() => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  // Cached materials to avoid creating new object instances on every render
  const floorMat = useRef(new THREE.MeshStandardMaterial({ color: '#6B4F2A', roughness: 0.5, metalness: 0.05 })).current;
  const wallMat = useRef(new THREE.MeshStandardMaterial({ color: '#2a2420', roughness: 0.9 })).current;
  const woodMat = useRef(new THREE.MeshStandardMaterial({ color: '#8B6914', roughness: 0.7, metalness: 0.1 })).current;
  const goldMat = useRef(new THREE.MeshStandardMaterial({ color: '#D4B16A', roughness: 0.2, metalness: 0.9 })).current;
  const glassMat = useRef(new THREE.MeshStandardMaterial({ color: '#aaccee', roughness: 0, metalness: 0.1, transparent: true, opacity: 0.3 })).current;
  const sofaMat = useRef(new THREE.MeshStandardMaterial({ color: '#3a3530', roughness: 0.8 })).current;

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* Floor */}
      <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 3.5]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.8, -1.75]}>
        <boxGeometry args={[4, 1.6, 0.08]} />
        <primitive object={wallMat} attach="material" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-2, 0.8, 0]}>
        <boxGeometry args={[0.08, 1.6, 3.5]} />
        <primitive object={wallMat} attach="material" />
      </mesh>

      {/* Living room sofa */}
      <group position={[0.3, 0.2, -0.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.25, 0.7]} />
          <primitive object={sofaMat} attach="material" />
        </mesh>
        <mesh castShadow position={[0, 0.25, -0.3]}>
          <boxGeometry args={[1.8, 0.5, 0.1]} />
          <primitive object={sofaMat} attach="material" />
        </mesh>
      </group>

      {/* Coffee table */}
      <group position={[0.3, 0.07, 0.1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.06, 0.5]} />
          <primitive object={woodMat} attach="material" />
        </mesh>
        {[[-0.35, -0.07, -0.18], [0.35, -0.07, -0.18], [-0.35, -0.07, 0.18], [0.35, -0.07, 0.18]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Bedroom bed */}
      <group position={[-1.0, 0.18, -0.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.22, 1.4]} />
          <meshStandardMaterial color="#F7F5F2" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0, 0.15, -0.65]}>
          <boxGeometry args={[1.1, 0.4, 0.08]} />
          <primitive object={woodMat} attach="material" />
        </mesh>
      </group>

      {/* Dining table */}
      <group position={[1.2, 0.17, 0.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.06, 0.6]} />
          <primitive object={woodMat} attach="material" />
        </mesh>
        {[[-0.3, -0.17, -0.2], [0.3, -0.17, -0.2], [-0.3, -0.17, 0.2], [0.3, -0.17, 0.2]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <cylinderGeometry args={[0.02, 0.02, 0.34, 8]} />
            <primitive object={goldMat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Kitchen island */}
      <group position={[1.5, 0.2, -0.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.4, 0.9]} />
          <meshStandardMaterial color="#1a1814" roughness={0.5} />
        </mesh>
      </group>

      {/* Window pane */}
      <mesh position={[0.5, 0.75, -1.72]}>
        <boxGeometry args={[1.2, 0.9, 0.02]} />
        <primitive object={glassMat} attach="material" />
      </mesh>

      {/* Gold accent trim along floor */}
      <mesh position={[0, 0.02, -1.71]}>
        <boxGeometry args={[4, 0.03, 0.03]} />
        <primitive object={goldMat} attach="material" />
      </mesh>

      {/* Room divider pillar */}
      <mesh position={[-0.3, 0.75, 0]}>
        <boxGeometry args={[0.08, 1.5, 0.08]} />
        <primitive object={woodMat} attach="material" />
      </mesh>
    </group>
  );
});

// Memoized rotating armchair model
const ChairModel: React.FC = React.memo(() => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  const leatherMat = useRef(new THREE.MeshStandardMaterial({ color: '#1a1008', roughness: 0.5, metalness: 0.05 })).current;
  const woodMat2 = useRef(new THREE.MeshStandardMaterial({ color: '#6B4414', roughness: 0.4, metalness: 0.1 })).current;
  const goldMat2 = useRef(new THREE.MeshStandardMaterial({ color: '#D4B16A', roughness: 0.15, metalness: 0.95 })).current;

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
      <group ref={meshRef}>
        {/* Seat */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.0, 0.18, 0.9]} />
          <primitive object={leatherMat} attach="material" />
        </mesh>
        {/* Back */}
        <mesh castShadow position={[0, 0.5, -0.4]}>
          <boxGeometry args={[1.0, 0.9, 0.12]} />
          <primitive object={leatherMat} attach="material" />
        </mesh>
        {/* Left arm */}
        <mesh castShadow position={[-0.46, 0.18, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.8]} />
          <primitive object={woodMat2} attach="material" />
        </mesh>
        {/* Right arm */}
        <mesh castShadow position={[0.46, 0.18, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.8]} />
          <primitive object={woodMat2} attach="material" />
        </mesh>
        {/* Legs */}
        {[[-0.38, -0.22, -0.32], [0.38, -0.22, -0.32], [-0.38, -0.22, 0.32], [0.38, -0.22, 0.32]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.035, 0.025, 0.45, 12]} />
            <primitive object={goldMat2} attach="material" />
          </mesh>
        ))}
        {/* Gold stitch line on seat */}
        <mesh position={[0, 0.092, 0]}>
          <boxGeometry args={[0.85, 0.005, 0.75]} />
          <meshStandardMaterial color="#D4B16A" roughness={0.3} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
});

interface ThreeSceneProps {
  type: 'apartment' | 'chair';
}

export const ThreeScene: React.FC<ThreeSceneProps> = React.memo(({ type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [shadowMapSize, setShadowMapSize] = useState(512);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Adaptive shadow quality:
    // Desktop/Tablet: shadows ON @ 512px map
    // Mobile (<=768px): shadows DISABLED entirely for max GPU efficiency
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShadowMapSize(mobile ? 256 : 512);
    };
    handleResize();

    // Debounced resize to prevent rapid state thrash during orientation changes
    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };
    window.addEventListener('resize', debouncedResize, { passive: true });

    // Intersection observer: pause R3F render loop when off-screen
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.02 });
    observer.observe(el);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        // Disable shadow pipeline entirely on mobile — major GPU saving
        shadows={!isMobile}
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: type === 'apartment' ? [4, 3, 4] : [2.5, 1.5, 2.5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: !isMobile, // Disable AA on mobile for performance
          alpha: true,
          powerPreference: 'high-performance',
          precision: isMobile ? 'lowp' : 'mediump', // Lowest shader precision on mobile
        }}
      >
        {/* Raise ambient on mobile to compensate for disabled directional shadow */}
        <ambientLight intensity={isMobile ? 0.75 : 0.4} color="#fff5e0" />
        <directionalLight
          castShadow={!isMobile}
          position={[5, 8, 5]}
          intensity={isMobile ? 0.9 : 1.2}
          color="#ffe8c0"
          shadow-mapSize={[shadowMapSize, shadowMapSize]}
        />
        <pointLight position={[-3, 2, -3]} intensity={0.6} color="#D4B16A" />
        <pointLight position={[2, 1, 2]} intensity={0.3} color="#ff9040" />

        <Suspense fallback={null}>
          <Environment preset="night" />
          {type === 'apartment' ? (
            <>
              <ApartmentModel />
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
              />
            </>
          ) : (
            <ChairModel />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
});
