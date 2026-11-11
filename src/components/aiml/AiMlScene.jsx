import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/* ─────────────────────────────────────────────────────────────────
   AI/ML 3-D scene: a rotating point-cloud shaped like a brain/
   data manifold — scattered dots in a spherical shell that pulse
   and re-sort as if running gradient descent.
   Accent: #00e5ff (cyan)
───────────────────────────────────────────────────────────────── */

const COUNT = 320

function DataCloud({ mouse }) {
  const ref  = useRef()
  const posRef = useRef()

  /* Generate initial sphere-distributed positions */
  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const phases    = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      /* Fibonacci sphere */
      const theta = Math.acos(1 - (2 * (i + 0.5)) / COUNT)
      const phi   = Math.PI * (1 + Math.sqrt(5)) * i
      const r     = 1.6 + Math.random() * 0.5
      positions[i * 3]     = r * Math.sin(theta) * Math.cos(phi)
      positions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi)
      positions[i * 3 + 2] = r * Math.cos(theta)
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, phases }
  }, [])

  /* Clone so we can mutate */
  const livePos = useMemo(() => new Float32Array(positions), [positions])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t   = clock.getElapsedTime()
    const geo = ref.current.geometry

    for (let i = 0; i < COUNT; i++) {
      const phase = phases[i]
      const ox    = positions[i * 3]
      const oy    = positions[i * 3 + 1]
      const oz    = positions[i * 3 + 2]
      const pulse = Math.sin(t * 0.9 + phase) * 0.08
      livePos[i * 3]     = ox + Math.sin(t * 0.3 + phase) * 0.04
      livePos[i * 3 + 1] = oy + pulse
      livePos[i * 3 + 2] = oz + Math.cos(t * 0.4 + phase) * 0.04
    }
    geo.attributes.position.array.set(livePos)
    geo.attributes.position.needsUpdate = true

    /* Slow spin + mouse tilt */
    ref.current.rotation.y += 0.0015
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x, mouse.current.y * 0.25, 0.04
    )
    ref.current.rotation.y += mouse.current.x * 0.002
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#00e5ff"
        transparent
        opacity={0.75}
        sizeAttenuation
      />
    </points>
  )
}

/* Connecting edges — thin lines between nearby particles */
function EdgeLines() {
  const geo = useMemo(() => {
    const pts = []
    for (let i = 0; i < 90; i++) {
      const theta = Math.acos(1 - (2 * (i + 0.5)) / COUNT)
      const phi   = Math.PI * (1 + Math.sqrt(5)) * i
      const r     = 1.65
      pts.push(
        new THREE.Vector3(
          r * Math.sin(theta) * Math.cos(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(theta)
        )
      )
    }
    /* Connect consecutive pairs */
    const linePoints = []
    for (let i = 0; i < pts.length - 1; i += 2) {
      linePoints.push(pts[i], pts[i + 1])
    }
    return new THREE.BufferGeometry().setFromPoints(linePoints)
  }, [])

  /* Dispose GPU resource on unmount */
  useEffect(() => () => { geo.dispose() }, [geo])

  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#00e5ff" transparent opacity={0.12} />
    </lineSegments>
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

export default function AiMlScene() {
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
      camera={{ position: [0, 0, 4.5], fov: 52 }}
      gl={{ alpha: true, antialias: false }}
      aria-hidden="true"
    >
      <DprCap />
      <DataCloud mouse={mouse} />
      <EdgeLines />
    </Canvas>
  )
}
