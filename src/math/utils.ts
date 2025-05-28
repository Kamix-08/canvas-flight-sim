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