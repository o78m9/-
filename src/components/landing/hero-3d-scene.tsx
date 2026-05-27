'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Float, MeshDistortMaterial, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import type * as THREE from 'three'

// Customer node colors mapped to status
const STATUS_COLORS = {
  active: '#278070', // brand teal
  dormant: '#B8743D', // copper/amber
  lost: '#8B3A1F', // rust
  returning: '#4A9689', // lighter teal
}

interface CustomerNode {
  id: number
  position: [number, number, number]
  status: keyof typeof STATUS_COLORS
  scale: number
}

function generateNodes(count: number): CustomerNode[] {
  const statuses = Object.keys(STATUS_COLORS) as (keyof typeof STATUS_COLORS)[]
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    position: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4] as [
      number,
      number,
      number,
    ],
    status: statuses[i % statuses.length]!,
    scale: 0.08 + Math.random() * 0.18,
  }))
}

function ConnectionLines({ nodes }: { nodes: CustomerNode[] }) {
  const ref = useRef<THREE.LineSegments>(null)

  const { positions, colors } = useMemo(() => {
    const pts: number[] = []
    const cols: number[] = []

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]!
        const b = nodes[j]!
        const dist = Math.hypot(
          a.position[0] - b.position[0],
          a.position[1] - b.position[1],
          a.position[2] - b.position[2],
        )
        if (dist < 3.5) {
          pts.push(...a.position, ...b.position)
          const alpha = 1 - dist / 3.5
          cols.push(0.16, 0.24, 0.21, alpha, 0.16, 0.24, 0.21, alpha)
        }
      }
    }

    return {
      positions: new Float32Array(pts),
      colors: new Float32Array(cols),
    }
  }, [nodes])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 4]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.4} />
    </lineSegments>
  )
}

function CustomerSphere({ node }: { node: CustomerNode }) {
  const color = STATUS_COLORS[node.status]
  const floatSpeed = 0.8 + Math.random() * 0.6
  const floatRange = 0.15 + Math.random() * 0.1

  return (
    <Float
      speed={floatSpeed}
      rotationIntensity={0.3}
      floatIntensity={floatRange}
      position={node.position}
    >
      <Sphere args={[node.scale, 24, 24]}>
        <MeshDistortMaterial
          color={color}
          distort={0.2}
          speed={1.5}
          roughness={0.3}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </Sphere>
    </Float>
  )
}

function CentralOrb() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <MeshDistortMaterial
        color="#1F3D36"
        distort={0.35}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        emissive="#0F4C44"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function Scene() {
  const nodes = useMemo(() => generateNodes(24), [])
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.04
    }
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4A9689" />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#B8743D" />
      <directionalLight position={[0, 5, 5]} intensity={0.8} />

      <Stars radius={80} depth={50} count={1200} factor={3} saturation={0} fade speed={0.5} />

      <group ref={groupRef}>
        <ConnectionLines nodes={nodes} />
        {nodes.map((node) => (
          <CustomerSphere key={node.id} node={node} />
        ))}
      </group>

      <CentralOrb />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.8} mipmapBlur />
        <Vignette eskil={false} offset={0.3} darkness={0.6} />
      </EffectComposer>
    </>
  )
}

export function HeroScene3D() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      role="presentation"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
