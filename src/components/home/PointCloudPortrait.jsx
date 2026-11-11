import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { IDENTITY } from '../../content'

/**
 * PointCloudPortrait — full-hero WebGL particle portrait.
 *
 * • Absolutely fills its parent container (hero section).
 * • Cyan ramp colour mode (uMode = 1).
 * • Tracks cursor across the entire window → particles scatter
 *   wherever the user moves, not just over the canvas.
 * • No visible border or background — pure transparent canvas.
 * • Proper disposal on unmount.
 */

const NT       = 20   // trail length
const N_POINTS = 48000

export default function PointCloudPortrait() {
  const mountRef = useRef(null)
  const reduced  = useReducedMotion()

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    /* ── Renderer ─────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    Object.assign(renderer.domElement.style, {
      display:  'block',
      position: 'absolute',
      inset:    '0',
      width:    '100%',
      height:   '100%',
    })
    container.appendChild(renderer.domElement)

    /* ── Scene / camera ───────────────────────────────────────── */
    const scene  = new THREE.Scene()
    const asp    = () => container.clientWidth / container.clientHeight
    const camZ   = () => (asp() < 0.8 ? 4.6 : 3.4)
    const camera = new THREE.PerspectiveCamera(45, asp(), 0.1, 50)
    camera.position.z = camZ()

    /* ── Uniforms ─────────────────────────────────────────────── */
    const uniforms = {
      uTime:    { value: 0 },
      uProgress:{ value: 1.0 },           // Start immediately assembled in exact frame
      uSize:    { value: 2.1 },
      uPR:      { value: renderer.getPixelRatio() },
      uRadius:  { value: 0.35 },          // larger cursor reach
      uMode:    { value: 1 },             // 1 = cyan ramp
      uStyle:   { value: 0 },             // wind smear
      uScatter: { value: 2.2 },           // heavy scatter
      uTrail:   { value: Array.from({ length: NT }, () => new THREE.Vector3(99, 99, 0)) },
    }

    /* ── Shader material ──────────────────────────────────────── */
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite:  false,
      vertexShader: `
  #define NT ${NT}
  uniform float uTime, uProgress, uSize, uPR, uRadius, uStyle, uScatter;
  uniform vec3 uTrail[NT];
  attribute vec3 aStart; attribute vec3 aColor; attribute float aRand; attribute float aLum;
  varying vec3 vColor; varying float vLum; varying float vGlow;
  void main(){
    float t = clamp(uProgress * 1.6 - aRand * 0.6, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(aStart, position, t);
    float a = (1.0 - t) * (1.5 + aRand * 2.5);
    float ca = cos(a), sa = sin(a);
    p.xy = vec2(p.x * ca - p.y * sa, p.x * sa + p.y * ca);
    p.x += sin(uTime * 0.8 + aRand * 40.0) * 0.003;
    p.y += cos(uTime * 0.7 + aRand * 55.0) * 0.003;

    float w0 = step(uStyle, 0.5);
    float w1 = step(0.5, uStyle) * step(uStyle, 1.5);
    float w2 = step(1.5, uStyle);
    vec2 turb = vec2(cos(aRand * 91.0), sin(aRand * 57.0));
    float reach = uRadius * (0.4 + aRand * 1.4);
    vec2 off = vec2(0.0); float glow = 0.0; float lift = 0.0;
    for (int i = 0; i < NT; i++) {
      vec3 tr = uTrail[i];
      if (tr.z < 0.001) continue;
      vec2 d = p.xy - tr.xy;
      float dist = length(d);
      float f = smoothstep(reach, 0.0, dist);
      f = f * f * tr.z;
      if (f < 0.0005) continue;
      vec2 dir  = d / (dist + 1e-4);
      vec2 tang = vec2(-dir.y, dir.x);
      vec2 vel  = (i < NT - 1) ? (tr.xy - uTrail[i + 1].xy) : vec2(0.0);
      if (length(vel) > 0.6) vel = vec2(0.0);
      vec2 vdir = vel / (length(vel) + 1e-4);
      vec2 push = w0 * (vdir * 1.0 + dir * 0.3 + turb * 0.7)
                + w1 * (dir  * 1.0 + turb * 0.9)
                + w2 * (tang * 1.3 + dir * 0.2 + turb * 0.4);
      off  += push * f * (0.5 + aRand);
      glow  = max(glow, f);
      lift += f * (0.15 + aRand * 0.5);
    }
    p.xy += off * 0.35 * uScatter;
    p.z  += lift * uScatter;
    vGlow = glow;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position  = projectionMatrix * mv;
    gl_PointSize = uSize * (0.8 + aRand * 0.5) * (1.0 + glow * 1.4) * uPR * (3.0 / -mv.z);
    vColor = aColor; vLum = aLum;
  }`,
      fragmentShader: `
  uniform float uMode; varying vec3 vColor; varying float vLum; varying float vGlow;
  void main(){
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    vec3 ramp = mix(vec3(0.02, 0.25, 0.5), vec3(0.6, 1.0, 1.0), vLum);
    vec3 c = uMode < 0.5 ? vColor : (uMode < 1.5 ? ramp : vec3(vLum));
    c += vec3(0.0, 0.6, 0.7) * vGlow * 1.2;
    gl_FragColor = vec4(c, smoothstep(0.5, 0.15, r));
  }`,
    })

    /* ── Dust sparks ──────────────────────────────────────────── */
    const SN = 300
    const sp = new Float32Array(SN * 3).fill(99)
    const sv = new Float32Array(SN * 3)
    const sc = new Float32Array(SN * 3)
    const sl = new Float32Array(SN)
    const sgeo = new THREE.BufferGeometry()
    sgeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
    sgeo.setAttribute('color',    new THREE.BufferAttribute(sc, 3))
    const sparksMesh = new THREE.Points(sgeo, new THREE.PointsMaterial({
      size: 2.8, sizeAttenuation: false, vertexColors: true,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    sparksMesh.frustumCulled = false
    scene.add(sparksMesh)
    let sCur = 0

    function emit(x, y, dx, dy, n) {
      for (let k = 0; k < n; k++) {
        const i = sCur++ % SN
        sp[i*3]   = x + (Math.random() - 0.5) * 0.06
        sp[i*3+1] = y + (Math.random() - 0.5) * 0.06
        sp[i*3+2] = 0.4
        sv[i*3]   = dx * 0.4 + (Math.random() - 0.5) * 0.018
        sv[i*3+1] = dy * 0.4 + (Math.random() - 0.5) * 0.018
        sv[i*3+2] = (Math.random() - 0.5) * 0.006
        sl[i]     = 0.8 + Math.random() * 0.2
      }
    }
    function updateSparks() {
      for (let i = 0; i < SN; i++) {
        if (sl[i] > 0) {
          sp[i*3]   += sv[i*3];   sp[i*3+1] += sv[i*3+1]; sp[i*3+2] += sv[i*3+2]
          sv[i*3]   *= 0.94;      sv[i*3+1] *= 0.94
          sl[i]     -= 0.018
          const l = Math.max(sl[i], 0)
          sc[i*3] = 0.1*l; sc[i*3+1] = 0.85*l; sc[i*3+2] = l   // cyan sparks
        } else {
          sp[i*3] = 99
          sc[i*3] = sc[i*3+1] = sc[i*3+2] = 0
        }
      }
      sgeo.attributes.position.needsUpdate = true
      sgeo.attributes.color.needsUpdate    = true
    }

    /* ── Build point cloud from image ─────────────────────────── */
    let points   = null
    let startTime = 0
    const replay = () => { startTime = performance.now() }

    function build(img) {
      if (points) { scene.remove(points); points.geometry.dispose() }
      const MAXD = 420
      const s = Math.min(1, MAXD / Math.max(img.width, img.height))
      const iw = Math.max(2, Math.round(img.width * s))
      const ih = Math.max(2, Math.round(img.height * s))

      const cv  = document.createElement('canvas')
      cv.width  = iw; cv.height = ih
      const ctx = cv.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0, iw, ih)
      const d = ctx.getImageData(0, 0, iw, ih).data

      const L = new Float32Array(iw * ih), vals = []
      for (let i = 0; i < iw * ih; i++) {
        L[i] = 0.299 * d[i*4] + 0.587 * d[i*4+1] + 0.114 * d[i*4+2]
        if (d[i*4+3] > 40) vals.push(L[i])
      }
      vals.sort((a, b) => a - b)
      const lo = vals[Math.floor(vals.length * 0.02)] ?? 0
      const hi = vals[Math.floor(vals.length * 0.98)] ?? 255
      const LS = new Float32Array(iw * ih)
      for (let i = 0; i < iw * ih; i++)
        LS[i] = Math.pow(Math.min(1, Math.max(0, (L[i] - lo) / Math.max(1, hi - lo))), 1)

      const E = new Float32Array(iw * ih)
      const at = (x, y) => LS[Math.min(ih-1, Math.max(0,y))*iw + Math.min(iw-1, Math.max(0,x))]
      for (let y = 0; y < ih; y++)
        for (let x = 0; x < iw; x++) {
          const gx = -at(x-1,y-1) - 2*at(x-1,y) - at(x-1,y+1) + at(x+1,y-1) + 2*at(x+1,y) + at(x+1,y+1)
          const gy = -at(x-1,y-1) - 2*at(x,y-1) - at(x+1,y-1) + at(x-1,y+1) + 2*at(x,y+1) + at(x+1,y+1)
          E[y*iw+x] = Math.min(1, Math.hypot(gx, gy) * 0.9)
        }

      const thr = 25, eb = 0.65
      const idx = [], cum = []
      let total = 0
      for (let y = 0; y < ih; y++) {
        const ny = (y / ih - 0.5) * 2
        for (let x = 0; x < iw; x++) {
          const i = y*iw + x
          if (d[i*4+3] <= 40 || L[i] <= thr) continue

          const nx = (x / iw - 0.5) * 2
          // Elliptical falloff mask: completely eliminates rectangular frame edges
          const dist = Math.hypot(nx, ny * 1.05)
          if (dist >= 0.92) continue
          const falloff = Math.cos((dist / 0.92) * (Math.PI / 2))

          const weight = (LS[i] * 0.9 + 0.1) * (1 + eb * 3 * E[i]) * falloff
          if (weight <= 0.01) continue

          total += weight
          idx.push(i); cum.push(total)
        }
      }
      if (!idx.length) return

      const isMobile = container.clientWidth < 768
      // Low, airy density on mobile (14,000 points); smooth fidelity on desktop
      const N_POINTS = isMobile ? 14000 : 52000
      uniforms.uSize.value = isMobile ? 1.5 : 2.1

      const pos = new Float32Array(N_POINTS*3), st = new Float32Array(N_POINTS*3)
      const col = new Float32Array(N_POINTS*3), rnd = new Float32Array(N_POINTS), lum = new Float32Array(N_POINTS)

      // Calculate camera frustum dimensions at z = 0
      const fovRad = (camera.fov * Math.PI) / 180
      const vh = 2 * Math.tan(fovRad / 2) * camera.position.z
      const vw = vh * camera.aspect

      let W, H, xOff, yOff
      const imgAspect = iw / ih

      if (isMobile) {
        // On mobile: organic ambient background layer across the hero
        // Softly framing the scene without being trapped in an isolated box
        H = vh * 1.25
        W = H * imgAspect
        xOff = 0
        yOff = vh * 0.04
      } else {
        // Desktop: bold close-up crop on the right side, text anchored on left
        H = vh * 1.55
        W = H * imgAspect
        xOff = Math.max(0.65, vw * 0.18)
        yOff = vh * 0.05
      }

      for (let k = 0; k < N_POINTS; k++) {
        const r = Math.random() * total
        let a = 0, b = cum.length - 1
        while (a < b) { const m = (a + b) >> 1; if (cum[m] < r) a = m+1; else b = m }
        const i = idx[a], x = i % iw, y = (i / iw) | 0
        const sc2 = Math.min(3, LS[i] / Math.max(L[i]/255, 0.03))
        const R = Math.min(1, (d[i*4]/255) * sc2)
        const G = Math.min(1, (d[i*4+1]/255) * sc2)
        const B = Math.min(1, (d[i*4+2]/255) * sc2)
        pos.set([
          ((x + Math.random())/iw - 0.5)*W + xOff,
          -((y + Math.random())/ih - 0.5)*H + yOff,
          (LS[i]-0.5)*0.35
        ], k*3)
        const an = Math.random() * 6.283, rad = 1.6 + Math.random() * 4.5
        st.set([
          Math.cos(an)*rad + xOff,
          Math.sin(an)*rad + yOff,
          -Math.random()*2
        ], k*3)
        col.set([R, G, B], k*3)
        lum[k] = LS[i]; rnd[k] = Math.random()
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('aStart',   new THREE.BufferAttribute(st,  3))
      geo.setAttribute('aColor',   new THREE.BufferAttribute(col, 3))
      geo.setAttribute('aRand',    new THREE.BufferAttribute(rnd, 1))
      geo.setAttribute('aLum',     new THREE.BufferAttribute(lum, 1))
      points = new THREE.Points(geo, material)
      points.frustumCulled = false
      scene.add(points)
      replay()
    }

    /* ── Load photo from public/ with auto-fallback & cache-busting ── */
    const candidates = [IDENTITY.photo, '/photo.jpg', '/photo.png', '/photo.jpeg']
    const sources = [...new Set(candidates.filter(Boolean))]

    let attemptIndex = 0
    let cachedImg = null

    function loadNext() {
      if (attemptIndex >= sources.length) {
        console.warn('[PointCloudPortrait] All photo sources failed to load')
        return
      }
      const candidate = sources[attemptIndex++]
      const testImg = new Image()
      testImg.crossOrigin = 'anonymous'
      testImg.onload = () => {
        cachedImg = testImg
        build(testImg)
      }
      testImg.onerror = () => {
        // Try next format candidate if this one isn't found
        loadNext()
      }
      // Cache-buster query param ensures replacing /public/photo.jpg immediately reflects on reload
      testImg.src = `${candidate}?t=${Date.now()}`
    }
    loadNext()

    /* ── Cursor & Touch tracking — WINDOW-WIDE ───────────────── */
    const mouseN = new THREE.Vector2()
    let active   = false

    const updateCoord = (clientX, clientY) => {
      const rect = container.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return
      const nx = ((clientX - rect.left) / rect.width)  * 2 - 1
      const ny = -(((clientY - rect.top)  / rect.height) * 2 - 1)
      mouseN.set(nx, ny)
      active = true
    }

    const onPointerMove = (e) => updateCoord(e.clientX, e.clientY)
    const onPointerDown = (e) => updateCoord(e.clientX, e.clientY)
    const onPointerUp   = () => { active = false }
    const onPointerLeave= () => { active = false }

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updateCoord(e.touches[0].clientX, e.touches[0].clientY)
      }
    }
    const onTouchEnd = () => { active = false }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('touchstart', onTouchMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })

    /* ── Resize ───────────────────────────────────────────────── */
    let lastIsMobile = container.clientWidth < 768
    const ro = new ResizeObserver(() => {
      const W = container.clientWidth, H = container.clientHeight
      if (W === 0 || H === 0) return
      renderer.setSize(W, H)
      camera.aspect = W / H
      camera.position.z = camZ()
      camera.updateProjectionMatrix()

      const currentIsMobile = W < 768
      if (currentIsMobile !== lastIsMobile && cachedImg) {
        lastIsMobile = currentIsMobile
        build(cachedImg)
      }
    })
    ro.observe(container)

    /* ── Render loop ──────────────────────────────────────────── */
    const hist = Array.from({ length: NT }, () => ({ x: 99, y: 99, s: 0 }))
    let frame = 0, lx = null, ly = null, px = null, py = null
    let rafId
    const v = new THREE.Vector3()

    const loop = (now) => {
      rafId = requestAnimationFrame(loop)
      uniforms.uTime.value     = reduced ? 0 : now / 1000
      uniforms.uProgress.value = 1.0

      v.set(mouseN.x, mouseN.y, 0.5).unproject(camera).sub(camera.position).normalize()
      const t  = -camera.position.z / v.z
      const wx = camera.position.x + v.x * t
      const wy = camera.position.y + v.y * t

      if (active && px !== null) {
        const dx = wx - px, dy = wy - py, sp2 = Math.hypot(dx, dy)
        if (!reduced && sp2 > 0.002)
          emit(wx, wy, dx, dy, Math.min(10, 2 + Math.floor(sp2 * 120)))
      }
      px = active ? wx : null
      py = active ? wy : null

      frame++
      if (frame % 2 === 0) {
        if (active && !reduced) {
          const sd = lx === null ? 0 : Math.hypot(wx - lx, wy - ly)
          hist.unshift({ x: wx, y: wy, s: Math.min(1, sd * 10) * 0.8 + 0.25 })
          lx = wx; ly = wy
        } else {
          hist.unshift({ x: 99, y: 99, s: 0 }); lx = null
        }
        hist.pop()
      }
      for (let i = 0; i < NT; i++) {
        const h = hist[i]
        uniforms.uTrail.value[i].set(h.x, h.y, h.s * Math.pow(1 - i / NT, 1.4))
      }
      updateSparks()

      if (points && !reduced) {
        points.rotation.y += (mouseN.x * 0.10 - points.rotation.y) * 0.04
        points.rotation.x += (-mouseN.y * 0.07 - points.rotation.x) * 0.04
      }
      renderer.render(scene, camera)
    }
    rafId = requestAnimationFrame(loop)

    /* ── Cleanup ──────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('touchstart', onTouchMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      if (points) { scene.remove(points); points.geometry.dispose() }
      sgeo.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container)
        container.removeChild(renderer.domElement)
    }
  }, [reduced])

  return (
    <div
      ref={mountRef}
      aria-label={`Particle portrait of ${IDENTITY.fullName}`}
      /* Absolutely fills the hero section — no visible border or bg */
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="false"
    />
  )
}
