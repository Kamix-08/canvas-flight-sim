import { GameObject } from "./GameObject"
import { Renderer } from "./renderer"
import { Camera } from "./camera"
import { Mat4 } from "../math/mat4"
import { Vec3 } from "../math/vec3"

export interface Triangle {
    vertices:Vec3[]
    color:Vec3
    depth:number
}

export class Scene {
    objects:GameObject[] = []
    camera:Camera = Camera.getInstance()

    addObject(object:GameObject): Scene {
        this.objects.push(object)
        return this
    }

    isInViewFrustum(object: GameObject): boolean {
        if (!object.mesh) return false

        const radius = Math.max(
            object.transform.scale.x,
            object.transform.scale.y,
            object.transform.scale.z
        ) * object.mesh.furthest_vertex.length()

        if (!this._cachedViewProjection || this._frameCount !== this.camera.frameCount) {
            this._cachedViewProjection = this.camera.projectionMatrix.multiply(this.camera.viewMatrix)
            this._frameCount = this.camera.frameCount
        }

        const clipSpace = this._cachedViewProjection.transformVec3(object.transform.position)

        return clipSpace.z >= -radius && clipSpace.z <= radius &&
               Math.abs(clipSpace.x) <= 1 + radius && 
               Math.abs(clipSpace.y) <= 1 + radius  
    }

    render(): void {
        const renderer = Renderer.getInstance()
        renderer.clear()

        this.camera.updateViewMatrix()
        const camPos = this.camera.transform.position
        const triangles:Triangle[] = []

        for (const object of this.objects) {
            if(!object.mesh) continue
            if(!this.isInViewFrustum(object)) continue
            
            object.transform.updateModelMatrix()

            for (let i = 0; i < object.mesh.indices.length; i++) {
                const indices = object.mesh.indices[i]

                const vertices = indices.map(index => {
                    const vert = object.mesh!.vertices[index]
                    return object.transform.modelMatrix.transformVec3(vert)
                })

                const color = object.mesh.colors ? object.mesh.colors[i] : new Vec3(1, 1, 1)

                const center = vertices.reduce((a, b) => a.add(b), new Vec3()).scale(1 / vertices.length)
                const depth = camPos.sub(center).lengthSq()

                triangles.push({ vertices, color, depth })
            }
        }

        triangles.sort((a, b) => b.depth - a.depth)

        for (const tri of triangles)
            renderer.drawTriangle(tri)
    }

    private _cachedViewProjection?:Mat4
    private _frameCount:number = -1
}