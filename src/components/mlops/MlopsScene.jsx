import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/* ─────────────────────────────────────────────────────────────────
   MLOps 3-D scene: a rotating hexagonal pipeline ring.
   Six hexagonal "stage" clusters float in a ring around a bright
   core. Data packets (small spheres) travel along the ring,
   conveying the idea of a CI/CD model lifecycle.
   Accent: #10b981 (emerald green)
───────────────────────────────────────────────────────────────── */

const COLOR      = '#10b981'
const COLOR_DIM  = '#065f46'
const COLOR_GLOW = '#6ee7b7'
const STAGES     = 6          // Data · Train · Track · Package · Serve · CI/CD
const RING_R     = 1.9        // radius of the pipeline ring
const PACKETS    = 8          // travelling data packets

/* ── Build stage positions evenly on a circle ── */
function stagePos(i) {
  const angle = (i / STAGES) * Math.PI * 2 - Math.PI / 2
  return [Math.cos(angle) * RING_R, Math.sin(angle) * RING_R, 0]
}

/* ── Stage nodes (hexagonal torus + inner sphere) ── */
function StageNodes({ mouse }) {
  const groupRef = useRef()
  const meshRefs = useRef([])
  const phases   = useMemo(() => Array.from({ length: STAGES }, () => Math.random() * Math.PI * 2), [])

  /* Pre-build spoke geometries once — avoids per-render GPU allocation leak */
  const spokeGeos = useMemo(() =>
    Array.from({ length: STAGES }, (_, i) => {
      const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...stagePos(i))]
      return new THREE.BufferGeometry().setFromPoints(pts)
    }), [])

  /* Dispose on unmount */
  useEffect(() => () => { spokeGeos.forEach(g => g.dispose()) }, [spokeGeos])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    groupRef.current.rotation.z = t * 0.08   // whole ring slowly spins

    /* Mouse tilt on X/Y */
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, mouse.current.y * 0.2, 0.04
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, mouse.current.x * 0.2, 0.04
    )

    /* Individual node pulse */
    meshRefs.current.forEach((m, i) => {
      if (!m) return
      const s = 1 + Math.sin(t * 1.1 + phases[i]) * 0.14
      m.scale.setScalar(s)
    })
  })

  return (
    <group ref={groupRef}>
      {/* ── Ring track ── */}
      <mesh>
        <torusGeometry args={[RING_R, 0.012, 8, 128]} />
        <meshBasicMaterial color={COLOR_DIM} transparent opacity={0.5} />
      </mesh>

      {/* ── Stage spheres ── */}
      {Array.from({ length: STAGES }).map((_, i) => (
        <mesh key={i} ref={el => (meshRefs.current[i] = el)} position={stagePos(i)}>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshBasicMaterial
            color={COLOR}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* ── Bright core ── */}
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshBasicMaterial color={COLOR_GLOW} transparent opacity={0.65} />
      </mesh>

      {/* ── Spokes from core to each stage ── */}
      {spokeGeos.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial color={COLOR} transparent opacity={0.12} />
        </lineSegments>
      ))}
    </group>
  )
}

/* ── Travelling data packets — small spheres orbiting the ring ── */
function DataPackets({ mouse }) {
  const groupRef = useRef()
  const meshRefs = useRef([])
  const offsets  = useMemo(
    () => Array.from({ length: PACKETS }, (_, i) => (i / PACKETS) * Math.PI * 2),
    []
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    groupRef.current.rotation.z = t * 0.08
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, mouse.current.y * 0.2, 0.04
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, mouse.current.x * 0.2, 0.04
    )

    meshRefs.current.forEach((m, i) => {
      if (!m) return
      const angle = t * 0.65 + offsets[i]
      m.position.x = Math.cos(angle) * RING_R
      m.position.y = Math.sin(angle) * RING_R
      m.position.z = Math.sin(angle * 2) * 0.12
    })
  })

  return (
    <group ref={groupRef}>
      {offsets.map((_, i) => (
        <mesh key={i} ref={el => (meshRefs.current[i] = el)}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshBasicMaterial color={COLOR_GLOW} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Ambient grid dust ── */
function AmbientDust() {
  const ref   = useRef()
  const count = 90
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 7
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1.5
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.012
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.016} color={COLOR} transparent opacity={0.2} sizeAttenuation />
    </points>
  )
}

function DprCap() {
  const { gl } = useThree()
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    return () => { gl.dispose() }
  }, [gl])
  return null
}

export default function MlopsScene() {
  const reduced = useReducedMotion()
  const mouse   = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    if (reduced) return
    const onMove = (e) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  if (reduced) return null

  return (
    <Canvas
      className="absolute inset-0 !w-full !h-full"
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ alpha: true, antialias: false }}
      aria-hidden="true"
    >
      <DprCap />
      <AmbientDust />
      <StageNodes  mouse={mouse} />
      <DataPackets mouse={mouse} />
    </Canvas>
  )
}
