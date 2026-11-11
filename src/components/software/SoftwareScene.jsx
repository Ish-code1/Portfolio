import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/* ─────────────────────────────────────────────────────────────────
   Software & Backend 3-D scene: a floating architecture map.
   Layered horizontal "tiers" (Client → API → Services → DB) are
   represented as glowing planes with connecting vertical beams.
   Small spheres flow upward along the beams like live requests.
   Accent: #f97316 (orange)
───────────────────────────────────────────────────────────────── */

const COLOR      = '#f97316'
const COLOR_DIM  = '#7c2d12'
const COLOR_GLOW = '#fdba74'

/* Three architecture tiers, each with N nodes */
const TIERS = [
  { y:  1.5, nodes: 3, label: 'API',      size: 0.10 },
  { y:  0.0, nodes: 4, label: 'Services', size: 0.085 },
  { y: -1.5, nodes: 3, label: 'DB',       size: 0.10 },
]

function tierNodePos(tier, j) {
  const count = tier.nodes
  const spread = 2.0
  const x = (j - (count - 1) / 2) * (spread / (count - 1 || 1))
  return [x, tier.y, 0]
}

/* ── Tier nodes + horizontal connectors ── */
function ArchNodes({ mouse }) {
  const groupRef = useRef()
  const meshRefs = useRef([])
  const phases   = useMemo(() => {
    const all = []
    TIERS.forEach(t => { for (let j = 0; j < t.nodes; j++) all.push(Math.random() * Math.PI * 2) })
    return all
  }, [])

  /* Build cross-tier vertical beam geometries once */
  const beamGeos = useMemo(() => {
    const geos = []
    // Connect middle tier nodes to top and bottom tier nodes (simple grid)
    const mid = TIERS[1]
    ;[TIERS[0], TIERS[2]].forEach(tier => {
      for (let m = 0; m < mid.nodes; m++) {
        for (let t = 0; t < tier.nodes; t++) {
          if ((m + t) % 2 !== 0) continue // sparse for readability
          const a = new THREE.Vector3(...tierNodePos(mid, m))
          const b = new THREE.Vector3(...tierNodePos(tier, t))
          geos.push(new THREE.BufferGeometry().setFromPoints([a, b]))
        }
      }
    })
    // Within same tier horizontal connectors
    TIERS.forEach(tier => {
      for (let j = 0; j < tier.nodes - 1; j++) {
        const a = new THREE.Vector3(...tierNodePos(tier, j))
        const b = new THREE.Vector3(...tierNodePos(tier, j + 1))
        geos.push(new THREE.BufferGeometry().setFromPoints([a, b]))
      }
    })
    return geos
  }, [])

  /* Dispose GPU resources on unmount */
  useEffect(() => () => { beamGeos.forEach(g => g.dispose()) }, [beamGeos])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, mouse.current.x * 0.3, 0.04
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, -mouse.current.y * 0.15, 0.04
    )
    // Slow autonomous rock
    groupRef.current.rotation.y += 0.0008

    // Pulse nodes
    meshRefs.current.forEach((m, i) => {
      if (!m) return
      const s = 1 + Math.sin(t * 1.2 + phases[i]) * 0.13
      m.scale.setScalar(s)
    })
  })

  let idx = 0
  return (
    <group ref={groupRef}>
      {/* Beam lines */}
      {beamGeos.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial color={COLOR} transparent opacity={0.14} />
        </lineSegments>
      ))}

      {/* Nodes */}
      {TIERS.map((tier, ti) =>
        Array.from({ length: tier.nodes }).map((_, j) => {
          const i = idx++
          return (
            <mesh key={`${ti}-${j}`} ref={el => (meshRefs.current[i] = el)} position={tierNodePos(tier, j)}>
              <sphereGeometry args={[tier.size, 16, 16]} />
              <meshBasicMaterial
                color={ti === 1 ? COLOR : COLOR_DIM}
                transparent
                opacity={ti === 1 ? 0.9 : 0.75}
              />
            </mesh>
          )
        })
      )}
    </group>
  )
}

/* ── Request packets flowing upward ── */
function RequestPackets({ mouse }) {
  const groupRef = useRef()
  const count    = 6
  const meshRefs = useRef([])
  const data = useMemo(() => Array.from({ length: count }, (_, i) => ({
    xBase:  (Math.random() - 0.5) * 2.4,
    speed:  0.5 + Math.random() * 0.4,
    offset: (i / count) * 2,
  })), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, mouse.current.x * 0.3, 0.04
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, -mouse.current.y * 0.15, 0.04
    )
    groupRef.current.rotation.y += 0.0008

    meshRefs.current.forEach((m, i) => {
      if (!m) return
      const d = data[i]
      const progress = ((t * d.speed + d.offset) % 2) / 2  // 0→1 loop
      m.position.y = -1.5 + progress * 3.0
      m.position.x = d.xBase
      m.position.z = 0.05
    })
  })

  return (
    <group ref={groupRef}>
      {data.map((_, i) => (
        <mesh key={i} ref={el => (meshRefs.current[i] = el)}>
          <sphereGeometry args={[0.032, 8, 8]} />
          <meshBasicMaterial color={COLOR_GLOW} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}

/* ── Ambient dust ── */
function AmbientDust() {
  const ref = useRef()
  const count = 80
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3 - 1.5
    }
    return arr
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.01
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color={COLOR} transparent opacity={0.18} sizeAttenuation />
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

export default function SoftwareScene() {
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
      <ArchNodes      mouse={mouse} />
      <RequestPackets mouse={mouse} />
    </Canvas>
  )
}
