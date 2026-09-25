import * as THREE from 'three'

/**
 * Convert latitude / longitude to a position on the three.js sphere.
 * Matches the UV layout of an equirectangular Earth texture on SphereGeometry:
 * u = (lon + 180) / 360 runs west -> east, v = (90 - lat) / 180 runs north -> south.
 */
export function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = ((lon + 180) / 360) * Math.PI * 2
  const theta = ((90 - lat) / 180) * Math.PI
  return new THREE.Vector3(
    -radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

/**
 * CSS background styles that zoom the equirectangular NASA blue-marble texture
 * into a crop centred on a given lat / lon, inside an aspect-[4/3] container.
 * `zoom` controls magnification (width of the full texture relative to container width).
 */
export function satelliteCrop(lat: number, lon: number, zoom = 6.4) {
  const u = (lon + 180) / 360
  const v = (90 - lat) / 180
  // Container is 4:3; texture is 2:1 (width 100% -> height 50%).
  const kx = 1 / zoom
  const ky = 1.5 / zoom
  const x = ((u - kx / 2) / (1 - kx)) * 100
  const y = ((v - ky / 2) / (1 - ky)) * 100
  return {
    backgroundSize: `${zoom * 100}%`,
    backgroundPosition: `${x}% ${y}%`,
  }
}
