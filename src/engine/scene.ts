import { GameObject } from "./GameObject.js"
import { Renderer } from "./renderer.js"
import { Camera } from "./camera.js"
import { Mat4 } from "../math/mat4.js"
import { Vec3 } from "../math/vec3.js"

export interface Triangle {
    vertices:Vec3[]
    color:Vec3
    depth:number
    onTop:boolean
}

export class Scene {
    objects:GameObject[] = []
    camera:Camera = Camera.getInstance()

    addObject(object:GameObject): Scene {
        this.objects.push(object)
        return this
    }

    render(): void {
        const renderer = Renderer.getInstance()
        renderer.clear()
        renderer.skybox()

        this.camera.updateViewMatrix()

        const cameraMatrix:Mat4 = this.camera.projectionMatrix.clone().multiply(this.camera.viewMatrix)

        const triangles:Triangle[] = []

        for (const object of this.objects) {
            if(!object.mesh) continue
            
            object.transform.updateModelMatrix()
            const finalMatrix:Mat4 = !object.onTop ? cameraMatrix.clone().multiply(object.transform.modelMatrix) : object.transform.modelMatrix.clone()

            for (let i = 0; i < object.mesh.indices.length; i++) {
                const indices = object.mesh.indices[i]

                const vertices = indices.map(index => {
                    const vert = object.mesh!.vertices[index]
                    return finalMatrix.transformVec3(vert)
                })

                if(vertices.every(v => v.x < -1 || v.x > 1 ||
                                       v.y < -1 || v.y > 1 ||
                                       v.z <  0 || v.z > 1)) continue

                const color = object.mesh.colors && object.mesh.colors.length > i ? object.mesh.colors[i] : new Vec3(1, 1, 1)
                const depth = vertices.reduce((a, b) => a + b.z, 0) * 1/3

                triangles.push({ vertices, color, depth, onTop:object.onTop })
            }
        }

        triangles.sort((a, b) => {
            if((a.onTop || b.onTop) && (a.onTop !== b.onTop))
                return b.onTop ? -1 : 1
            return b.depth - a.depth
        })

        for (const tri of triangles)
            renderer.drawTriangle(tri)
    }
}