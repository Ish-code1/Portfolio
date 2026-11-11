import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/* ─────────────────────────────────────────────────────────────────
   GenAI 3-D scene: a floating knowledge-graph + RAG flow.
   Nodes pulse at different rhythms, edges light up in sequence
   to simulate a retrieval → reasoning → generation pipeline.
   Accent: #a855f7 (violet/purple)
───────────────────────────────────────────────────────────────── */

const COLOR      = '#a855f7'
const COLOR_DIM  = '#6b21a8'
const COLOR_EDGE = '#c084fc'

/* Fixed node positions representing: User → Retriever → KG nodes → LLM → Response */
const NODES = [
  { id: 'user',      pos: [-3.2,  0.0, 0],  size: 0.10, label: 'user'      },
  { id: 'retriever', pos: [-1.6,  0.0, 0],  size: 0.13, label: 'retriever' },
  { id: 'kg1',       pos: [ 0.0,  1.1, 0.4], size: 0.09, label: 'node'     },
  { id: 'kg2',       pos: [ 0.0, -0.3, -0.3],size: 0.09, label: 'node'    },
  { id: 'kg3',       pos: [ 0.4,  0.6, -0.5],size: 0.07, label: 'node'    },
  { id: 'kg4',       pos: [-0.3, -1.0,  0.4],size: 0.08, label: 'node'    },
  { id: 'llm',       pos: [ 1.7,  0.0, 0],  size: 0.16, label: 'llm'      },
  { id: 'response',  pos: [ 3.2,  0.0, 0],  size: 0.10, label: 'response'  },
]

/* Edges: [from-index, to-index] */
const EDGES = [
  [0, 1],  // user → retriever
  [1, 2],  // retriever → kg1
  [1, 3],  // retriever → kg2
  [1, 4],  // retriever → kg3
  [1, 5],  // retriever → kg4
  [2, 6],  // kg1 → llm
  [3, 6],  // kg2 → llm
  [4, 6],  // kg3 → llm
  [5, 6],  // kg4 → llm
  [6, 7],  // llm → response
]

/* Build a reusable sphere geometry */
function NodeSpheres({ mouse }) {
  const groupRef = useRef()
  const meshRefs = useRef([])

  const phases = useMemo(() => NODES.map(() => Math.random() * Math.PI * 2), [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()

    /* Slow whole-graph tilt with mouse */
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.current.x * 0.3,
      0.03
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.current.y * 0.15,
      0.03
    )

    /* Pulse each node */
    meshRefs.current.forEach((m, i) => {
      if (!m) return
      const pulse = 1 + Math.sin(t * 1.4 + phases[i]) * 0.12
      m.scale.setScalar(pulse)
    })
  })

  return (
    <group ref={groupRef}>
      {NODES.map((n, i) => (
        <mesh
          key={n.id}
          ref={el => (meshRefs.current[i] = el)}
          position={n.pos}
        >
          <sphereGeometry args={[n.size, 16, 16]} />
          <meshBasicMaterial
            color={n.id === 'llm' ? COLOR : n.id === 'user' || n.id === 'response' ? COLOR_EDGE : COLOR_DIM}
            transparent
            opacity={n.id === 'llm' ? 0.95 : 0.75}
          />
        </mesh>
      ))}
    </group>
  )
}

/* Animated edges that pulse in sequence (light travelling along the pipeline) */
function PipelineEdges({ mouse }) {
  const groupRef = useRef()
  const lineRefs = useRef([])

  /* Pre-build geometries */
  const geos = useMemo(() =>
    EDGES.map(([a, b]) => {
      const pts = [
        new THREE.Vector3(...NODES[a].pos),
        new THREE.Vector3(...NODES[b].pos),
      ]
      return new THREE.BufferGeometry().setFromPoints(pts)
    }), [])

  /* Dispose GPU resources on unmount */
  useEffect(() => () => { geos.forEach(g => g.dispose()) }, [geos])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      mouse.current.x * 0.3,
      0.03
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouse.current.y * 0.15,
      0.03
    )

    /* Sequential pulse: edges light up in order */
    lineRefs.current.forEach((l, i) => {
      if (!l) return
      const phase = (t * 0.7 - i * 0.22) % (Math.PI * 2)
      const alpha = Math.max(0.05, (Math.sin(phase) + 1) * 0.5) * 0.7
      l.material.opacity = alpha
    })
  })

  return (
    <group ref={groupRef}>
      {geos.map((geo, i) => (
        <lineSegments key={i} ref={el => (lineRefs.current[i] = el)} geometry={geo}>
          <lineBasicMaterial color={COLOR_EDGE} transparent opacity={0.15} />
        </lineSegments>
      ))}
    </group>
  )
}

/* Ambient floating particles in background */
function AmbientDust() {
  const ref = useRef()
  const count = 120
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color={COLOR} transparent opacity={0.25} sizeAttenuation />
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

export default function GenAiScene() {
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
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      gl={{ alpha: true, antialias: false }}
      aria-hidden="true"
    >
      <DprCap />
      <AmbientDust />
      <PipelineEdges mouse={mouse} />
      <NodeSpheres   mouse={mouse} />
    </Canvas>
  )
}
