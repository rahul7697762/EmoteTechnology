import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function AbstractShape() {
    const meshRef = useRef();
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
            <Sphere ref={meshRef} args={[1.4, 64, 64]}>
                <MeshDistortMaterial
                    color="#3B4FD8"
                    envMapIntensity={1}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    metalness={0.3}
                    roughness={0.2}
                    distort={0.4}
                    speed={1.5}
                    wireframe={true}
                />
            </Sphere>
        </Float>
    );
}

export default function HeroCanvas() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-40 dark:opacity-60 mix-blend-multiply dark:mix-blend-screen">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={2} color="#6C7EF5" />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#F5A623" />
                <AbstractShape />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
