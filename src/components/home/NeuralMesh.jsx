import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/* ─── Shader: vertex displaces with cursor + time ─────────────────── */
const vertexShader = `
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uStrength;
  varying vec3  vNormal;
  varying float vDist;

  void main() {
    vec3 pos = position;
    // cursor repulsion
    vec2 toMouse = uv - (uMouse * 0.5 + 0.5);
    float d = length(toMouse);
    float influence = exp(-d * 4.0) * uStrength;
    pos += normal * influence;
    // gentle wave
    pos.z += sin(pos.x * 3.0 + uTime * 0.6) * 0.04;
    pos.y += cos(pos.z * 2.5 + uTime * 0.5) * 0.03;
    vNormal = normalize(normalMatrix * normal);
    vDist   = influence;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec3  vNormal;
  varying float vDist;

  void main() {
    vec3 baseColor   = vec3(0.0, 0.898, 1.0);   // #00e5ff aiml cyan
    vec3 accentColor = vec3(0.659, 0.333, 0.969); // #a855f7 genai violet
    vec3 color = mix(baseColor, accentColor, vDist * 2.0);
    float rim  = 1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0);
    color += rim * 0.15 * baseColor;
    float alpha = 0.18 + rim * 0.25 + vDist * 0.4;
    gl_FragColor = vec4(color, alpha);
  }
`

/* ─── Inner mesh scene component ─────────────────────────────────── */
function NeuralMeshInner({ mouse }) {
  const meshRef  = useRef()
  const edgesRef = useRef()

  const geo = useMemo(() => {
    const g = new THREE.IcosahedronGeometry(2.1, 5)
    return g
  }, [])

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime:     { value: 0 },
      uMouse:    { value: new THREE.Vector2(0, 0) },
      uStrength: { value: 0.28 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    wireframe: true,
  }), [])

  /* Dispose GPU resources on unmount */
  useEffect(() => () => { geo.dispose(); mat.dispose() }, [geo, mat])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    mat.uniforms.uTime.value  = clock.getElapsedTime()
    mat.uniforms.uMouse.value.lerp(mouse.current, 0.05)
    meshRef.current.rotation.y += 0.0012
    meshRef.current.rotation.x += 0.0005
  })

  return (
    <mesh ref={meshRef} geometry={geo} material={mat} />
  )
}

/* ─── Floating particles ──────────────────────────────────────────── */
function Particles({ count = 180 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.015
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#00e5ff" transparent opacity={0.55} sizeAttenuation />
    </points>
  )
}

/* ─── Camera DPR cap + GL disposal on unmount ────────────────────── */
function DprCap() {
  const { gl } = useThree()
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    return () => { gl.dispose() }
  }, [gl])
  return null
}

/* ─── Public component ───────────────────────────────────────────── */
export default function NeuralMesh() {
  const reduced  = useReducedMotion()
  const mouse    = useRef(new THREE.Vector2(0, 0))
  const canvasRef = useRef()

  useEffect(() => {
    if (reduced) return
    const onMove = (e) => {
      mouse.current.x =  (e.clientX / window.innerWidth)  * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced])

  if (reduced) {
    // Static CSS fallback — grid + glow
    return (
      <div className="absolute inset-0 bg-grid-neural opacity-30 pointer-events-none" aria-hidden="true" />
    )
  }

  return (
    <Canvas
      ref={canvasRef}
      className="absolute inset-0 !w-full !h-full"
      camera={{ position: [0, 0, 5], fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      aria-hidden="true"
    >
      <DprCap />
      <NeuralMeshInner mouse={mouse} />
      <Particles count={160} />
    </Canvas>
  )
}
