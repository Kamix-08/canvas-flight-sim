import { Camera } from "../engine/camera.js"
import { GameObject } from "../engine/GameObject.js"
import { hash, lerp, randomFromHash, modifyColorVector } from "../math/utils.js"
import { Vec3 } from "../math/vec3.js"

export class Terrain extends GameObject {
    seed:number = 841
    camera:Camera = Camera.getInstance()
    tileSize:number = 50
    cloudChunkSize:number = 750

    static instance:Terrain|null = null

    lastPos:number[] = [Infinity, Infinity]

    static getInstance(): Terrain {
        if(!Terrain.instance) Terrain.instance = new Terrain()
        return Terrain.instance
    }

    update(dt:number) {
        const camX = this.camera.transform.position.x
        const camZ = this.camera.transform.position.z

        if((this.lastPos[0]-camX)**2 + (this.lastPos[1]-camZ)**2 < Camera.renderDistance ** 2)
            return

        this.lastPos = [camX, camZ]

        const renderTiles = Math.ceil(Camera.renderDistance / this.tileSize      ) * 2
        const cloudTiles  = Math.ceil(Camera.renderDistance / this.cloudChunkSize) * 2

        this.mesh = {vertices: [], indices: [], colors: []}

        // --- terrain --
        for(let x = -renderTiles; x < renderTiles; x++) {
            for(let z = -renderTiles; z < renderTiles; z++) {
                const worldX = this.worldCoords(x, this.tileSize, camX)
                const worldZ = this.worldCoords(z, this.tileSize, camZ)

                const y = this.getHeight(worldX, worldZ)
                this.mesh.vertices.push(new Vec3(worldX, y, worldZ))

                if(x === -renderTiles || z === -renderTiles) continue
                
                const cur = this.mesh.vertices.length - 1
                const opp = cur - 2 * renderTiles - 1

                const idxs = [
                    [opp, opp + 1, cur],
                    [opp, cur - 1, cur]
                ]

                this.mesh.indices.push(...idxs)
                this.mesh.colors!.push(...idxs.map(l => { 
                    const avgPos = l.reduce((a,b) => a.add(this.mesh!.vertices[b]), new Vec3(0,0,0)).scale(1/3)
                    return modifyColorVector(this.getColorForHeight(avgPos.y), avgPos.x, avgPos.z, this.seed)
                }))
            }
        }

        // --- clouds ---
        for(let x = -cloudTiles; x < cloudTiles; x++) {
            for(let z = -cloudTiles; z < cloudTiles; z++) {
                const worldX = this.worldCoords(x, this.cloudChunkSize, camX)
                const worldZ = this.worldCoords(z, this.cloudChunkSize, camZ)

                const padding  = Math.floor(0.1 * this.cloudChunkSize)
                const paddings = [padding, this.cloudChunkSize - padding]

                const pos = new Vec3(
                    worldX + randomFromHash(paddings[0], paddings[1], worldX, worldZ, this.seed),
                    randomFromHash(420, 690, worldX, worldZ, this.seed),
                    worldZ + randomFromHash(paddings[0], paddings[1], worldX+1, worldZ+1, this.seed)
                )

                const rot = randomFromHash(0, 360, worldX, worldZ, this.seed)
                const verticesCount = Math.floor(randomFromHash(4, 12, worldX, worldZ, this.seed))

                const h = randomFromHash(25, 75, worldX, worldZ, this.seed)
                const r = randomFromHash(100, 250, worldX, worldZ, this.seed)

                const startIdx = this.mesh.vertices.length

                this.mesh.vertices.push(...[new Vec3(0,h,0), new Vec3(0,-h,0)].map(v => v.add(pos)))

                const angleOffset = 2 * Math.PI / verticesCount
                for(let y=0; y<2; y++) {
                    for(let i=0; i<verticesCount; i++) {
                        const angle = angleOffset * i + rot

                        this.mesh.vertices.push(new Vec3(
                            Math.cos(angle) * (r + randomFromHash(-25, 25, worldX + i - y, worldZ - i + y, this.seed)),
                            y * (h + (randomFromHash(-h, h, worldX + i, worldZ + i, this.seed) - 1) / 2),
                            Math.sin(angle) * (r + randomFromHash(-25, 25, worldX - i + y, worldZ + i - y, this.seed))
                        ).add(pos))

                        const currentVertex = startIdx + 2 + i + y * verticesCount;
                        const nextVertex = startIdx + 2 + ((i + 1) % verticesCount) + y * verticesCount;

                        if (y === 1) this.mesh.indices.push([startIdx    , nextVertex, currentVertex])
                        else         this.mesh.indices.push([startIdx + 1, currentVertex, nextVertex])

                        const current = startIdx + 2 + i
                        const next = (i < verticesCount - 1) ? (current + 1) : (startIdx + 2)

                        this.mesh.indices.push(
                            [current, next, current + verticesCount],
                            [next, next + verticesCount, current + verticesCount]
                        )

                        for(let _=0; _<3; _++)
                            this.mesh.colors!.push(modifyColorVector(new Vec3(1,1,1), worldX+i+y+_, worldZ+i+y+_, this.seed, .1))
                    }
                }
            }
        }
    }

    private worldCoords(tileId:number, tileSize:number, coordinateOffset:number): number {
        return Math.floor((tileId * tileSize + coordinateOffset)/tileSize) * tileSize
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
        return this.getNoise(x, z, 1/200, 400) + 
               this.getNoise(x, z, 1/100, 10 ) + 
               this.getNoise(x, z, 1/10 , 1  )
    }

    private getColorForHeight(height: number): Vec3 {
        if (height < -25)  return new Vec3(0.4 , 0.55, 0.3 )  // Lower grass
        if (height < -10)  return new Vec3(0.45, 0.6 , 0.3 )  // Light grass
        if (height < 5)    return new Vec3(0.35, 0.5 , 0.25)  // Dense grass/forest
        if (height < 35)   return new Vec3(0.45, 0.45, 0.35)  // Light rocky terrain
        if (height < 80)   return new Vec3(0.5 , 0.5 , 0.45)  // Rocky terrain
        if (height < 155)  return new Vec3(0.65, 0.65, 0.65)  // Mountain
        return new Vec3(0.95, 0.95, 0.95)                     // Snow peaks
    }
}