import { Camera } from "../engine/camera.js"
import { hash, lerp } from "../math/utils.js"

export class Terrain {
    seed:number
    camera:Camera = Camera.getInstance()

    constructor(seed:number) {
        this.seed = seed
    }

    getHeight(x:number, z:number): number {
        const ix = Math.floor(x)
        const iz = Math.floor(z)
        
        const h00 = (hash(ix, iz, this.seed) & 0xFFFF) / 0xFFFF
        const h10 = (hash(ix + 1, iz, this.seed) & 0xFFFF) / 0xFFFF
        const h01 = (hash(ix, iz + 1, this.seed) & 0xFFFF) / 0xFFFF
        const h11 = (hash(ix + 1, iz + 1, this.seed) & 0xFFFF) / 0xFFFF
        
        const fx = x - ix
        const fz = z - iz
        
        const tx = lerp(h00, h10, fx)
        const ty = lerp(h01, h11, fx)
        const height = lerp(tx, ty, fz)
        
        return (height - 0.5) * 100
    }
}