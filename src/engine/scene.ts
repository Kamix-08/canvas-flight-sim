import { GameObject } from "./GameObject.js"
import { Renderer } from "./renderer.js"
import { Camera } from "./camera.js"
import { Mat4 } from "../math/mat4.js"
import { Vec3 } from "../math/vec3.js"

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
        this.camera.updateProjectionMatrix()

        const cameraMatrix:Mat4 = this.camera.projectionMatrix.clone().multiply(this.camera.viewMatrix)

        const camPos = this.camera.transform.position
        const triangles:Triangle[] = []

        for (const object of this.objects) {
            if(!object.mesh) continue
            // if(!this.isInViewFrustum(object)) continue
            
            object.transform.updateModelMatrix()

            const finalMatrix:Mat4 = cameraMatrix.clone().multiply(object.transform.modelMatrix)

            for (let i = 0; i < object.mesh.indices.length; i++) {
                const indices = object.mesh.indices[i]

                const vertices = indices.map(index => {
                    const vert = object.mesh!.vertices[index]
                    return finalMatrix.transformVec3(vert)
                })

                const color = object.mesh.colors && object.mesh.colors.length > i ? object.mesh.colors[i] : new Vec3(1, 1, 1)
                const depth = vertices.reduce((a, b) => a + b.z, 0) * 1/3

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