'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Trail } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import * as THREE from 'three'

// Performance flags
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// CoreOrb: icosahedron with MeshDistortMaterial, breathes
function CoreOrb() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (prefersReduced) return
    const t = clock.getElapsedTime()
    const s = 1 + Math.sin(t * 0.8) * 0.05
    if (meshRef.current) meshRef.current.scale.setScalar(s)
    if (glowRef.current) glowRef.current.scale.setScalar(s * 1.15)
  })
  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color="#D4A574"
          distort={0.32}
          speed={1.2}
          roughness={0.15}
          metalness={0.85}
          envMapIntensity={1.5}
        />
      </mesh>
      <mesh ref={glowRef} scale={1.15}>
        <icosahedronGeometry args={[1, 4]} />
        <meshBasicMaterial color="#D4A574" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

// OrbitRings: 3 rings of particles using InstancedMesh
const RING_CONFIGS = [
  { radius: 2.5, count: isMobile ? 15 : 30, speed: 0.08, tiltX: 0.3, tiltZ: 0.1, color: '#7FB5A8' },
  {
    radius: 3.5,
    count: isMobile ? 12 : 25,
    speed: -0.05,
    tiltX: -0.2,
    tiltZ: 0.4,
    color: '#7FB5A8',
  },
  { radius: 4.5, count: isMobile ? 0 : 25, speed: 0.06, tiltX: 0.5, tiltZ: -0.2, color: '#7FB5A8' },
]

function OrbitRing({ radius, count, speed, tiltX, tiltZ, color }: (typeof RING_CONFIGS)[0]) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const col = useMemo(() => new THREE.Color(color), [color])

  useEffect(() => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      meshRef.current.setColorAt(i, col)
    }
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [count, col])

  useFrame(({ clock }) => {
    if (!meshRef.current || prefersReduced) return
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + t * speed
      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 0.5) * 0.3,
        Math.sin(angle) * radius,
      )
      dummy.rotation.set(tiltX, 0, tiltZ)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  if (count === 0) return null
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  )
}

function OrbitRings() {
  return (
    <>
      {RING_CONFIGS.map((cfg, i) => (
        <OrbitRing key={i} {...cfg} />
      ))}
    </>
  )
}

// ReturnFlow: 8 particles flying Bezier curve from outer -> core, with Trail
const POOL_SIZE = 8

function ReturnParticle({
  index,
  lightRef,
}: {
  index: number
  lightRef: React.MutableRefObject<THREE.PointLight | null>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const state = useRef({
    active: false,
    t: 0,
    start: new THREE.Vector3(),
    ctrl: new THREE.Vector3(),
    duration: 2.5,
    delay: index * 1.8,
  })

  const randOuter = () => {
    const theta = Math.random() * Math.PI * 2
    const phi = (Math.random() * 0.6 + 0.2) * Math.PI
    const r = 5 + Math.random() * 2
    return new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi) * 0.4,
      r * Math.sin(phi) * Math.sin(theta),
    )
  }

  const resetParticle = () => {
    const s = randOuter()
    state.current.start.copy(s)
    state.current.ctrl.set(
      s.x * 0.5 + (Math.random() - 0.5) * 2,
      s.y * 0.5 + (Math.random() - 0.5) * 2,
      s.z * 0.5 + (Math.random() - 0.5) * 2,
    )
    state.current.t = 0
    state.current.active = true
  }

  useEffect(() => {
    const timer = setTimeout(resetParticle, state.current.delay * 1000)
    return () => clearTimeout(timer)
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current || prefersReduced) return
    const s = state.current
    if (!s.active) return

    s.t += delta / s.duration
    if (s.t >= 1) {
      s.active = false
      if (meshRef.current) meshRef.current.visible = false
      // light spike
      if (lightRef.current) {
        lightRef.current.intensity = 5
        setTimeout(() => {
          if (lightRef.current) lightRef.current.intensity = 3
        }, 300)
      }
      setTimeout(resetParticle, 1800 + Math.random() * 1000)
      return
    }

    // Quadratic Bezier
    const t = s.t
    const ot = 1 - t
    meshRef.current.position.set(
      ot * ot * s.start.x + 2 * ot * t * s.ctrl.x + t * t * 0,
      ot * ot * s.start.y + 2 * ot * t * s.ctrl.y + t * t * 0,
      ot * ot * s.start.z + 2 * ot * t * s.ctrl.z + t * t * 0,
    )
    meshRef.current.visible = true
  })

  return (
    <Trail
      width={0.3}
      length={20}
      color={new THREE.Color('#D4A574')}
      decay={2}
      attenuation={(t) => t}
    >
      <mesh ref={meshRef} visible={false}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#D4A574" />
      </mesh>
    </Trail>
  )
}

function ReturnFlow({ lightRef }: { lightRef: React.MutableRefObject<THREE.PointLight | null> }) {
  return (
    <>
      {Array.from({ length: POOL_SIZE }, (_, i) => (
        <ReturnParticle key={i} index={i} lightRef={lightRef} />
      ))}
    </>
  )
}

// ParallaxRig: mouse-driven camera movement
function ParallaxRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (prefersReduced) return
    camera.position.x += (mouse.current.x * 0.4 - camera.position.x) * 0.04
    camera.position.y += (mouse.current.y * 0.25 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Static scene for prefers-reduced-motion
function StaticScene() {
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1, 4]} />
        <meshBasicMaterial color="#D4A574" />
      </mesh>
      {[2.5, 3.5].map((r, i) => (
        <mesh key={i} rotation={[0.3 * (i + 1), 0, 0.2 * (i + 1)]}>
          <torusGeometry args={[r, 0.015, 8, 64]} />
          <meshBasicMaterial color="#7FB5A8" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// Scene skeleton for SSR loading state — exported for use in dynamic import
export function SceneSkeleton() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="w-32 h-32 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #D4A574 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// Main Scene
function Scene() {
  const lightRef = useRef<THREE.PointLight>(null)

  if (prefersReduced) {
    return <StaticScene />
  }

  return (
    <>
      <fog attach="fog" args={['#0A1F1C', 8, 22]} />
      <ambientLight intensity={0.15} color="#7FB5A8" />
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={3} color="#D4A574" distance={6} />

      <CoreOrb />
      <OrbitRings />
      <ReturnFlow lightRef={lightRef as React.MutableRefObject<THREE.PointLight | null>} />
      <ParallaxRig />

      {isMobile ? (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.9} mipmapBlur />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0006, 0.0006)}
            radialModulation={false}
            modulationOffset={0.5}
          />
          <Vignette darkness={0.55} eskil={false} />
          <Noise opacity={0.04} />
        </EffectComposer>
      )}
    </>
  )
}

// Main export
export default function HeroScene() {
  // Visibility-based pause
  useEffect(() => {
    const onVisibility = () => {
      // Canvas will pause on hidden via Next.js/React lifecycle
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  return (
    <Canvas
      dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 2)]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.5 }}
    >
      <Scene />
    </Canvas>
  )
}
