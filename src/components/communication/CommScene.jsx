import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/** Soundwave bars — warm amber glow pulsing in a stage-spotlight style */
function SoundwaveBars() {
  const groupRef = useRef(null)
  const COUNT    = 32
  const meshRefs = useRef([])

  // Pre-build random phase offsets so bars ripple independently
  const phases = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => (i / COUNT) * Math.PI * 2),
    []
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const wave   = Math.sin(t * 2.2 + phases[i]) * 0.5 + 0.55
      const pulse  = Math.sin(t * 0.9 + phases[i] * 0.4) * 0.3 + 0.7
      mesh.scale.y = wave * pulse * 1.6
      mesh.material.opacity = 0.35 + wave * 0.45
    })
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * Math.PI * 2
        const r     = 2.6
        const x     = Math.cos(angle) * r
        const z     = Math.sin(angle) * r
        return (
          <mesh
            key={i}
            ref={el => { meshRefs.current[i] = el }}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.08, 1, 0.08]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={1.2}
              transparent
              opacity={0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/** Dispose WebGL context on unmount */
function GlDisposer() {
  const { gl } = useThree()
  useEffect(() => () => { gl.dispose() }, [gl])
  return null
}

/** Spotlight cone emanating from above */
function SpotCone() {
  const meshRef = useRef(null)
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.material.opacity = 0.07 + Math.sin(t * 0.7) * 0.03
  })
  return (
    <mesh ref={meshRef} position={[0, 2.4, 0]} rotation={[Math.PI, 0, 0]}>
      <coneGeometry args={[2.4, 5, 32, 1, true]} />
      <meshStandardMaterial
        color="#fbbf24"
        transparent
        opacity={0.1}
        side={2}
        depthWrite={false}
      />
    </mesh>
  )
}

/** Central glowing orb — the "stage presence" anchor */
function StageOrb() {
  const meshRef = useRef(null)
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const s = 1 + Math.sin(t * 1.4) * 0.08
    meshRef.current.scale.setScalar(s)
    meshRef.current.material.emissiveIntensity = 1.0 + Math.sin(t * 2.1) * 0.4
  })
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.38, 32, 32]} />
      <meshStandardMaterial
        color="#fbbf24"
        emissive="#f59e0b"
        emissiveIntensity={1.2}
        roughness={0.1}
        metalness={0.4}
      />
    </mesh>
  )
}

export default function CommScene() {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-24 h-24 rounded-full"
          style={{ background: 'radial-gradient(circle, #f59e0b55, transparent)' }}
        />
      </div>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 1.2, 6], fov: 55 }}
      dpr={[1, 1.5]}
      aria-hidden="true"
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 4, 0]} color="#fbbf24" intensity={2.5} />
      <pointLight position={[3, -1, 2]} color="#f97316" intensity={0.8} />
      <pointLight position={[-3, -1, -2]} color="#f59e0b" intensity={0.6} />

      <GlDisposer />
      <SoundwaveBars />
      <SpotCone />
      <StageOrb />
    </Canvas>
  )
}
