import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture } from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { latLonToVec3 } from '@/lib/globe'
import { sunDirection } from '@/lib/sun'
import { assetUrl } from '@/lib/assets'

export type EarthFocus = { lat: number; lon: number }

const TEXTURES = {
  day: assetUrl('textures-opt/earth-blue-marble.webp'),
  night: assetUrl('textures-opt/earth-night.webp'),
  bump: assetUrl('textures-opt/earth-topology.webp'),
  specular: assetUrl('textures-opt/earth-water.webp'),
  clouds: assetUrl('textures-opt/clouds.webp'),
} as const

const RADIUS = 1.6
/** Hero pose: a gentle tilt so the sunset side reads well. */
const heroPose = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.41, 2.3, 0))
const identity = new THREE.Quaternion()

function useReducedMotion() {
  const reduced = useRef(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.current = mq.matches
    const onChange = () => {
      reduced.current = mq.matches
    }
    mq.addEventListener('change', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
    }
  }, [])
  return reduced
}

/** The sun sits at the real subsolar point, so the day/night line is astronomically true. */
function SunLight({ night }: { night: boolean }) {
  const sun = useRef<THREE.DirectionalLight>(null)
  const reduced = useReducedMotion()
  const sinceUpdate = useRef(99)
  const dir = useRef(new THREE.Vector3(...Object.values(sunDirection())))

  useFrame((_, delta) => {
    sinceUpdate.current += delta
    if (sinceUpdate.current > 5) {
      sinceUpdate.current = 0
      const d = sunDirection()
      dir.current.set(d.x, d.y, d.z)
    }
    if (!sun.current) return
    sun.current.position.copy(dir.current).multiplyScalar(10)
    const target = night ? 0.28 : 2.6
    if (reduced.current) {
      sun.current.intensity = target
    } else {
      sun.current.intensity = THREE.MathUtils.damp(sun.current.intensity, target, 4, delta)
    }
  })

  return <directionalLight ref={sun} color="#ffd9a0" intensity={2.6} />
}

/** Slow cinematic dolly-in on the home screen, once per session. */
function IntroCam({ enabled }: { enabled: boolean }) {
  const done = useRef(!enabled)
  useFrame(({ camera, size }, delta) => {
    if (done.current) return
    const targetZ = size.width >= 1024 ? 4.9 : 5.6
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 1.4, delta)
    if (Math.abs(camera.position.z - targetZ) < 0.02) done.current = true
  })
  return null
}

function Globe({ focus, night }: { focus?: EarthFocus; night?: boolean }) {
  const [day, nightMap, bump, specular, clouds] = useTexture([
    TEXTURES.day,
    TEXTURES.night,
    TEXTURES.bump,
    TEXTURES.specular,
    TEXTURES.clouds,
  ])

  const spin = useRef<THREE.Group>(null)
  const nightMesh = useRef<THREE.Mesh>(null)
  const cloudLayer = useRef<THREE.Mesh>(null)
  const reduced = useReducedMotion()

  useMemo(() => {
    day.colorSpace = THREE.SRGBColorSpace
    nightMap.colorSpace = THREE.SRGBColorSpace
    clouds.colorSpace = THREE.SRGBColorSpace
  }, [day, nightMap, clouds])

  useEffect(() => {
    return () => {
      for (const t of [day, nightMap, bump, specular, clouds]) t.dispose()
    }
  }, [day, nightMap, bump, specular, clouds])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    if (!reduced.current) {
      if (focus) {
        // Gently unwind the spin so the focused location ends up centred.
        spin.current?.quaternion.slerp(identity, 0.08)
      } else if (spin.current) {
        spin.current.rotation.y += delta * 0.022
      }
      if (cloudLayer.current) cloudLayer.current.rotation.y += delta * 0.029
    }
    // Crossfade day -> night-lights. The sun dims with it (SunLight).
    const nightTarget = night ? 1 : 0
    if (nightMesh.current) {
      const mat = nightMesh.current.material as THREE.MeshBasicMaterial
      mat.opacity = THREE.MathUtils.damp(mat.opacity, nightTarget * 0.95, 4, delta)
    }
  })

  return (
    <group>
      <ambientLight color="#2e4a3a" intensity={0.45} />
      <directionalLight position={[6, 1, -6]} color="#3f5f8f" intensity={0.4} />
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[RADIUS, 96, 96]} />
          <meshPhongMaterial
            map={day}
            bumpMap={bump}
            bumpScale={0.08}
            specularMap={specular}
            specular="#3d5248"
            shininess={12}
          />
        </mesh>
        {/* City lights, faded in above the day map */}
        <mesh ref={nightMesh} scale={1.001}>
          <sphereGeometry args={[RADIUS, 96, 96]} />
          <meshBasicMaterial map={nightMap} transparent opacity={0} depthWrite={false} />
        </mesh>
        {focus && <Marker lat={focus.lat} lon={focus.lon} />}
      </group>
      <mesh ref={cloudLayer} scale={1.01}>
        <sphereGeometry args={[RADIUS, 96, 96]} />
        <meshPhongMaterial map={clouds} transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Marker({ lat, lon }: { lat: number; lon: number }) {
  const halo = useRef<THREE.Mesh>(null)
  const reduced = useReducedMotion()

  const { position, orientation } = useMemo(() => {
    const p = latLonToVec3(lat, lon, RADIUS * 1.012)
    const normal = p.clone().normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    return { position: p, orientation: q }
  }, [lat, lon])

  useFrame((state) => {
    if (!halo.current || reduced.current) return
    const t = state.clock.elapsedTime
    const s = 1 + 0.18 * Math.sin(t * 2.4)
    halo.current.scale.setScalar(s)
    ;(halo.current.material as THREE.MeshBasicMaterial).opacity = 0.55 - 0.25 * Math.sin(t * 2.4)
  })

  return (
    <group>
      <mesh position={position}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshBasicMaterial color="#e0a458" />
      </mesh>
      <mesh ref={halo} position={position} quaternion={orientation}>
        <ringGeometry args={[0.05, 0.062, 32]} />
        <meshBasicMaterial color="#e0a458" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
      gl_FragColor = vec4(0.48, 0.80, 0.74, 1.0) * max(intensity, 0.0);
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
  depthWrite: false,
})

function Atmosphere() {
  return (
    <mesh scale={1.12} material={atmosphereMaterial}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
    </mesh>
  )
}

function Rig({ focus, children }: { focus?: EarthFocus; children: React.ReactNode }) {
  const width = useThree((s) => s.size.width)
  const ref = useRef<THREE.Group>(null)
  const target = useRef<THREE.Quaternion>(heroPose.clone())
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!ref.current) return
    if (width >= 1024) {
      ref.current.position.set(1.05, -0.05, 0)
    } else if (width >= 640) {
      ref.current.position.set(0.45, 0.35, 0)
    } else {
      ref.current.position.set(0, 0.55, 0)
    }
  }, [width])

  useLayoutEffect(() => {
    if (!focus) {
      target.current = heroPose.clone()
      return
    }
    // Rotate the whole globe so the focused location faces the camera,
    // tilted slightly upward for a cinematic angle.
    const p = latLonToVec3(focus.lat, focus.lon, 1).normalize()
    const view = new THREE.Vector3(0, 0.16, 0.99).normalize()
    target.current = new THREE.Quaternion().setFromUnitVectors(p, view)
  }, [focus])

  useFrame(() => {
    if (ref.current && !reduced.current) {
      ref.current.quaternion.slerp(target.current, 0.06)
    }
  })

  return <group ref={ref}>{children}</group>
}

export default function Earth({
  focus,
  night = false,
  intro = false,
}: {
  focus?: EarthFocus
  night?: boolean
  intro?: boolean
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={`h-full w-full transition-opacity duration-[1200ms] ease-out ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-label="Interactive 3D globe of Earth — drag to spin, scroll to zoom"
    >
      <Canvas
        onCreated={() => setVisible(true)}
        dpr={[1, 2]}
        camera={{ position: [0, 0.15, intro ? 8.8 : 4.9], fov: 42 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#060d09']} />
        <SunLight night={night} />
        <IntroCam enabled={intro} />
        <Suspense fallback={null}>
          <Rig focus={focus}>
            <Globe focus={focus} night={night} />
            <Atmosphere />
          </Rig>
        </Suspense>
        <Stars radius={70} depth={35} count={2400} factor={3} saturation={0} fade speed={0.6} />
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          rotateSpeed={0.45}
          zoomSpeed={0.6}
          minDistance={3.2}
          maxDistance={9.5}
        />
      </Canvas>
    </div>
  )
}
