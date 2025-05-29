import { Camera } from "../engine/camera.js"
import { GameObject } from "../engine/GameObject.js"
import { hash, lerp } from "../math/utils.js"
import { Vec3 } from "../math/vec3.js"

export class Terrain extends GameObject {
    seed:number
    camera:Camera = Camera.getInstance()
    tileSize:number = 50

    lastPos:number[] = [Infinity, Infinity]

    constructor(seed:number) {
        super()
        this.seed = seed
    }

    update(dt:number) {
        const camX = this.camera.transform.position.x
        const camZ = this.camera.transform.position.z

        if((this.lastPos[0]-camX)**2 + (this.lastPos[1]-camZ)**2 < Camera.renderDistance ** 2)
            return

        this.lastPos = [camX, camZ]

        const renderTiles = Math.ceil(Camera.renderDistance / this.tileSize) * 2
        this.mesh = {vertices: [], indices: [], colors: []}

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

    private getHash(ix:number, iz:number): number {
        return (hash(ix, iz, this.seed) & 0xFFFF) / 0xFFFF
    }

    private getNoise(x:number, z:number, s:number, a:number): number {
        const ix = Math.floor(x * s)
        const iz = Math.floor(z * s)

        const h00 = this.getHash(ix    , iz    )
        const h10 = this.getHash(ix + 1, iz    )
        const h01 = this.getHash(ix    , iz + 1)
        const h11 = this.getHash(ix + 1, iz + 1)

        const fx = x * s - ix
        const fz = z * s - iz

        const tx = lerp(h00, h10, fx)
        const ty = lerp(h01, h11, fx)

        return (lerp(tx, ty, fz) - 0.5) * a
    }

    getHeight(x:number, z:number): number {
        return this.getNoise(x, z, 0.002, 200) + this.getNoise(x, z, 0.01, 100)
    }
}