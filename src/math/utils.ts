import { Vec3 } from "./vec3.js"

export function hash(x:number, z:number, seed:number): number {
    let h = seed + x * 374761393 + z * 668265263
    h = (h ^ (h >>> 13)) * 1274126177
    h = (h ^ (h >>> 16))
    return h
}

export function lerp(a:number, b:number, t:number): number {
    return a + (b - a) * t
}

export function lerpVec(a:Vec3, b:Vec3, t:number): Vec3 {
    const r = new Vec3()
    r.x = lerp(a.x, b.x, t)
    r.y = lerp(a.y, b.y, t)
    r.z = lerp(a.z, b.z, t)
    return r
}

export function random(min:number, max:number): number {
    return Math.random() * (max - min) + min
}

export function randomFromHash(min:number, max:number, x:number, z:number, seed:number): number {
    return ((hash(x, z, seed) >>> 0) + 0.5) / 2**32 * (max - min) + min
}

export function modifyColorVector(color:Vec3, x:number, z:number, seed:number, displacement:number = 0.03): Vec3 {
    return color.add(new Vec3(
        randomFromHash(-displacement, displacement, x, z, seed),
        randomFromHash(-displacement, displacement, x, z, seed),
        randomFromHash(-displacement, displacement, x, z, seed)
    ))
}