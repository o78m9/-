'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// ─── Palette ────────────────────────────────────────────────────────────────
const GOLD = new THREE.Color('#D4A574')
const SAGE = new THREE.Color('#7FB5A8')

// ─── Performance flags (evaluated once at module load, SSR-safe) ─────────────
const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const prefersReduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const PARTICLE_COUNT = isMobile ? 30 : 80
const ORBIT_MIN = 3.2
const ORBIT_MAX = 6.0

// ─── Helpers ─────────────────────────────────────────────────────────────────
function randFarVec(): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2
  const phi = (Math.random() * 0.6 + 0.2) * Math.PI
  const r = ORBIT_MIN + Math.random() * (ORBIT_MAX - ORBIT_MIN)
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi) * 0.45,
    r * Math.sin(phi) * Math.sin(theta),
  )
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface ReturnParticle {
  pos: THREE.Vector3
  startPos: THREE.Vector3
  progress: number
  speed: number
  startDelay: number
  wobblePhase: number
}

interface OrbitalRingConfig {
  radius: number
  tiltDeg: number
  rotSpeed: number
  count: number
  color: THREE.Color
}

// ─── CentralClinic ───────────────────────────────────────────────────────────
function CentralClinic({ burstRef }: { burstRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const breathe = 1.0 + Math.sin(t * 0.4) * 0.04
    if (meshRef.current) meshRef.current.scale.setScalar(breathe)
    if (matRef.current) {
      matRef.current.emissiveIntensity = 1.4 + burstRef.current * 1.2
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.12}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.4}
          roughness={0.12}
          metalness={0.65}
        />
      </mesh>
      {/* Fresnel-style halo layers */}
      <mesh scale={2.2}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.6}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.09} side={THREE.BackSide} />
      </mesh>
    </Float>
  )
}

// ─── OrbitalRings (static ring lines) ────────────────────────────────────────
function OrbitalRings() {
  const rings: { r: number; tilt: number; color: THREE.Color; rotZ: number }[] = [
    { r: 2.8, tilt: (15 * Math.PI) / 180, color: GOLD, rotZ: 0 },
    { r: 4.2, tilt: (30 * Math.PI) / 180, color: SAGE, rotZ: 0.5 },
    { r: 5.8, tilt: (8 * Math.PI) / 180, color: SAGE, rotZ: 1.1 },
  ]

  // On mobile, skip Ring C
  const visible = isMobile ? rings.slice(0, 2) : rings

  return (
    <>
      {visible.map((ring, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + ring.tilt, 0, ring.rotZ]}>
          <ringGeometry args={[ring.r - 0.012, ring.r + 0.012, 80]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  )
}

// ─── OrbitalParticles (particles that stay on their ring) ────────────────────
function OrbitalParticles({ config }: { config: OrbitalRingConfig }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const geo = useMemo(() => new THREE.SphereGeometry(1, 5, 5), [])
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: config.color,
        transparent: true,
        opacity: 0.75,
      }),
    [config.color],
  )

  // Angle offsets for each particle
  const offsets = useMemo(
    () => Array.from({ length: config.count }, (_, i) => (i / config.count) * Math.PI * 2),
    [config.count],
  )

  const tiltRad = (config.tiltDeg * Math.PI) / 180

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < config.count; i++) {
      const offset = offsets[i] ?? 0
      const angle = offset + config.rotSpeed * t
      const x = config.radius * Math.cos(angle)
      const y = Math.sin(tiltRad) * config.radius * Math.sin(angle)
      const z = config.radius * Math.sin(angle)

      // Every 5th particle gets a VIP gold-blend scale bump
      const isVip = i % 5 === 0
      const scale = isVip ? 0.038 : 0.025 + Math.random() * 0.005

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return <instancedMesh ref={meshRef} args={[geo, mat, config.count]} />
}

// ─── ReturnParticles (Bezier flight toward center) ────────────────────────────
function ReturnParticles({ burstRef }: { burstRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo<ReturnParticle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const sp = randFarVec()
        return {
          pos: sp.clone(),
          startPos: sp.clone(),
          progress: 0,
          speed: 0.003 + Math.random() * 0.004,
          startDelay: i * 0.18,
          wobblePhase: Math.random() * Math.PI * 2,
        }
      }),
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

  // Reusable vectors to avoid per-frame allocation
  const controlPt = useMemo(() => new THREE.Vector3(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]
      if (!p) continue

      if (t < p.startDelay) {
        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        continue
      }

      // Arrival: progress reached 1
      if (p.progress >= 1.0) {
        // Trigger burst
        burstRef.current = 1.0

        // Reset particle to new random far position
        const np = randFarVec()
        p.pos.copy(np)
        p.startPos.copy(np)
        p.progress = 0
        p.speed = 0.003 + Math.random() * 0.004
        p.wobblePhase = Math.random() * Math.PI * 2

        dummy.scale.setScalar(0)
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
        continue
      }

      // Advance along Bezier
      p.progress = Math.min(p.progress + p.speed * 0.5, 1.0)
      const bT = p.progress

      // Quadratic Bezier control point — S-curve via perpendicular wobble
      controlPt.set(
        p.startPos.x * 0.3 + Math.sin(p.wobblePhase) * 1.5,
        p.startPos.y * 0.3 + Math.cos(p.wobblePhase) * 0.8,
        p.startPos.z * 0.3,
      )

      const oneMinusT = 1 - bT
      p.pos.set(
        oneMinusT * oneMinusT * p.startPos.x + 2 * oneMinusT * bT * controlPt.x,
        oneMinusT * oneMinusT * p.startPos.y + 2 * oneMinusT * bT * controlPt.y,
        oneMinusT * oneMinusT * p.startPos.z + 2 * oneMinusT * bT * controlPt.z,
      )

      // Proximity-based scale
      const dist = p.pos.length()
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

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  const groupRef = useRef<THREE.Group>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const burstRef = useRef<number>(0)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04
    }

    // Decay burst
    burstRef.current = Math.max(0, burstRef.current - 0.03)

    // Smooth camera parallax — max ~3°
    const targetX = mouseRef.current.y * -0.05
    const targetY = mouseRef.current.x * 0.08
    state.camera.rotation.x += (targetX - state.camera.rotation.x) * 0.04
    state.camera.rotation.y += (targetY - state.camera.rotation.y) * 0.04
  })

  // Orbital ring configs
  const ringConfigs = useMemo<OrbitalRingConfig[]>(() => {
    const all: OrbitalRingConfig[] = [
      { radius: 2.8, tiltDeg: 15, rotSpeed: 0.03, count: 25, color: SAGE },
      { radius: 4.2, tiltDeg: 30, rotSpeed: 0.018, count: 30, color: SAGE },
      { radius: 5.8, tiltDeg: 8, rotSpeed: 0.012, count: 25, color: SAGE },
    ]
    return isMobile ? all.slice(0, 2) : all
  }, [])

  return (
    <>
      <fog attach="fog" args={['#0A1F1C', 7, 18]} />

      {/* Lighting */}
      <ambientLight intensity={0.06} color={SAGE} />
      <pointLight position={[0, 0, 0]} intensity={3.0} color={GOLD} distance={5} decay={2} />
      <pointLight position={[-3, 4, 3]} intensity={0.6} color={SAGE} distance={10} decay={2} />
      <pointLight position={[0, -2, -6]} intensity={0.35} color="#F5EFE6" distance={12} decay={2} />

      {/* Rotating group: rings + orbital + returning particles */}
      <group ref={groupRef}>
        <OrbitalRings />
        {ringConfigs.map((cfg, i) => (
          <OrbitalParticles key={i} config={cfg} />
        ))}
        <ReturnParticles burstRef={burstRef} />
      </group>

      {/* Central orb — outside rotating group so it floats independently */}
      <CentralClinic burstRef={burstRef} />

      {/* Ambient sparkles */}
      <Sparkles
        count={isMobile ? 30 : 60}
        scale={9}
        size={1.2}
        speed={0.15}
        opacity={0.35}
        color={GOLD}
        noise={0.3}
      />

      {/* Post-processing */}
      {isMobile ? (
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.75} intensity={0.8} mipmapBlur />
        </EffectComposer>
      ) : (
        <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.75} intensity={1.6} mipmapBlur />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0004, 0.0004)}
            radialModulation={false}
            modulationOffset={0.5}
          />
          <Vignette darkness={0.55} offset={0.4} blendFunction={BlendFunction.NORMAL} />
          <Noise opacity={0.04} blendFunction={BlendFunction.SCREEN} />
        </EffectComposer>
      )}
    </>
  )
}

// ─── Static fallback for prefers-reduced-motion ───────────────────────────────
function StaticScene() {
  return (
    <Canvas
      camera={{ position: [0, 2.5, 9], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={1}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.1} color={SAGE} />
      <pointLight position={[0, 0, 0]} intensity={2} color={GOLD} distance={5} decay={2} />
      {/* Just the central orb, no animation */}
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={1.2}
          roughness={0.15}
          metalness={0.6}
        />
      </mesh>
      {/* Static rings */}
      {[3.4, 5.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + 0.2, 0, i * 0.6]}>
          <ringGeometry args={[r - 0.012, r + 0.012, 80]} />
          <meshBasicMaterial
            color={i === 0 ? GOLD : SAGE}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.7} intensity={1.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function HeroOrbitReturn() {
  if (prefersReduced) return <StaticScene />

  return (
    <Canvas
      camera={{ position: [0, 2.5, 9], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)]}
      performance={{ min: 0.5 }}
      style={{ background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  )
}
