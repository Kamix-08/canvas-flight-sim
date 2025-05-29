import { Camera } from "../engine/camera.js"
import { GameObject } from "../engine/GameObject.js"
import { hash, lerp } from "../math/utils.js"
import { Vec3 } from "../math/vec3.js"

export class Terrain extends GameObject {
    seed:number
    camera:Camera = Camera.getInstance()
    tileSize:number = 50

    constructor(seed:number) {
        super()
        this.seed = seed
    }

    update(dt:number) {
        const renderTiles = Math.ceil(Camera.renderDistance / this.tileSize) + 2
        this.mesh = {vertices: [], indices: [], colors: []}

        const camX = this.camera.transform.position.x
        const camZ = this.camera.transform.position.z

        for(let x = -renderTiles; x < renderTiles; x++) {
            for(let z = -renderTiles; z < renderTiles; z++) {
                const worldX = Math.floor((x * this.tileSize + camX)/this.tileSize) * this.tileSize
                const worldZ = Math.floor((z * this.tileSize + camZ)/this.tileSize) * this.tileSize

                const y = this.getHeight(worldX, worldZ)
                this.mesh.vertices.push(new Vec3(worldX, y, worldZ))

                if(x === -renderTiles || z === -renderTiles) continue
                
                const cur = this.mesh.vertices.length - 1
                const opp = cur - 2 * renderTiles - 1

                this.mesh.indices.push(
                    [opp, opp + 1, cur],
                    [opp, cur - 1, cur]
                )

                this.mesh.colors!.push(
                    new Vec3(0.3,0.3,0.3),
                    new Vec3(0.6,0.6,0.6)
                )
            }
        }
    }

    getHeight(x:number, z:number): number {
        const ix = Math.floor(x)
        const iz = Math.floor(z)
        
        const h00 = (hash(ix    , iz    , this.seed) & 0xFFFF) / 0xFFFF
        const h10 = (hash(ix + 1, iz    , this.seed) & 0xFFFF) / 0xFFFF
        const h01 = (hash(ix    , iz + 1, this.seed) & 0xFFFF) / 0xFFFF
        const h11 = (hash(ix + 1, iz + 1, this.seed) & 0xFFFF) / 0xFFFF
        
        const fx = x - ix
        const fz = z - iz
        
        const tx =     lerp(h00, h10, fx)
        const ty =     lerp(h01, h11, fx)
        const height = lerp(tx, ty, fz)
        
        return (height - 0.5) * 100
    }
}