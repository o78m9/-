'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

// Palette A — Warm Premium. Only two colors.
const GOLD = new THREE.Color('#D4A574')
const SAGE = new THREE.Color('#7FB5A8')

const PARTICLE_COUNT = 38
const ORBIT_MIN = 3.2
const ORBIT_MAX = 6.0

function randFarVec(): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2
  const phi = (Math.random() * 0.6 + 0.2) * Math.PI // avoid poles
  const r = ORBIT_MIN + Math.random() * (ORBIT_MAX - ORBIT_MIN)
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi) * 0.45, // flatten to disc
    r * Math.sin(phi) * Math.sin(theta),
  )
}

interface Particle {
  pos: THREE.Vector3
  speed: number
  startDelay: number
  arrivedAt: number
  wobblePhase: number
}

function ReturnParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        pos: randFarVec(),
        speed: 0.004 + Math.random() * 0.005,
        startDelay: i * 0.18,
        arrivedAt: 0,
        wobblePhase: Math.random() * Math.PI * 2,
      })),
    [],
  )

  const geo = useMemo(() => new THREE.SphereGeometry(1, 6, 6), [])
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: SAGE,
        transparent: true,
        opacity: 0.85,
      }),
    [],
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]!

      if (t < p.startDelay) {
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        continue
      }

      const dist = p.pos.length()

      if (dist < 0.18) {
        if (p.arrivedAt === 0) p.arrivedAt = t
        const elapsed = t - p.arrivedAt

        if (elapsed > 1.8) {
          // Reset to new far position
          p.pos.copy(randFarVec())
          p.arrivedAt = 0
          p.speed = 0.004 + Math.random() * 0.005
        } else {
          // Pulse at center — shrink and fade
          const fade = Math.max(0, 1 - elapsed / 0.4)
          dummy.position.set(0, 0, 0)
          dummy.scale.setScalar(fade * 0.06)
          dummy.updateMatrix()
          meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        continue
      }

      // Move toward center
      const dir = p.pos.clone().negate().normalize()
      p.pos.addScaledVector(dir, p.speed)

      // Subtle wobble perpendicular to travel
      p.pos.x += Math.sin(t * 0.25 + p.wobblePhase) * 0.004
      p.pos.y += Math.cos(t * 0.18 + p.wobblePhase * 1.3) * 0.003

      // Proximity drives size — bigger as they return
      const proximity = 1 - Math.min(dist / ORBIT_MAX, 1)
      const scale = 0.022 + proximity * 0.055

      dummy.position.copy(p.pos)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[geo, mat, PARTICLE_COUNT]} />
}

function OrbitalRings() {
  return (
    <>
      {[3.4, 5.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + 0.2, 0, i * 0.6]}>
          <ringGeometry args={[r - 0.012, r + 0.012, 80]} />
          <meshBasicMaterial
            color={i === 0 ? GOLD : SAGE}
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  )
}

function CentralClinic() {
  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.12}>
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.4}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
      {/* Inner glow halo */}
      <mesh scale={1.6}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.07} side={THREE.BackSide} />
      </mesh>
    </Float>
  )
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.06
    }
  })

  return (
    <>
      <fog attach="fog" args={['#0A1F1C', 7, 18]} />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 0, 0]} intensity={2.5} color={GOLD} distance={4} decay={2} />
      <pointLight position={[2, 3, 2]} intensity={0.4} color={SAGE} distance={8} decay={2} />

      <group ref={groupRef}>
        <OrbitalRings />
        <ReturnParticles />
      </group>

      <CentralClinic />

      {/* Ambient sparkle in gold */}
      <Sparkles
        count={60}
        scale={9}
        size={1.2}
        speed={0.15}
        opacity={0.35}
        color={GOLD}
        noise={0.3}
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.6} intensity={1.4} mipmapBlur />
      </EffectComposer>
    </>
  )
}

export function HeroOrbitReturn() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 9], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  )
}
