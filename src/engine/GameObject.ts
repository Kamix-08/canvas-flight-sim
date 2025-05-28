import { Vec3 } from "../math/vec3"
import { Mat4 } from "../math/mat4"

export class Mesh {
    vertices:Vec3[]
    indices:number[][]
    colors?:Vec3[]

    furthest_vertex:Vec3 = new Vec3(0, 0, 0)

    constructor(vertices:Vec3[], indices:number[][], colors?:Vec3[]) {
        this.vertices = vertices
        this.indices = indices
        this.colors = colors

        vertices.forEach(v => {
            if (v.lengthSq() > this.furthest_vertex.lengthSq())
                this.furthest_vertex = v.clone()
        })
    }
}

export class Transform {
    position:Vec3
    rotation:Vec3
    scale:Vec3
    modelMatrix:Mat4

    constructor() {
        this.position = new Vec3()
        this.rotation = new Vec3()
        this.scale = new Vec3(1, 1, 1)
        this.modelMatrix = new Mat4()
        this.updateModelMatrix()
    }

    updateModelMatrix(): void {
        this.modelMatrix.identity()
            .translate(this.position)
            .rotate(this.rotation)
            .scale(this.scale)
    }

    setPosition(pos:Vec3): Transform {
        this.position = pos
        return this
    }

    setRotation(rot:Vec3): Transform {
        this.rotation = rot
        return this
    }

    setScale(scale:Vec3): Transform {
        this.scale = scale
        return this
    }

    translate(v:Vec3): Transform {
        this.position.add(v)
        return this
    }

    rotate(v:Vec3): Transform {
        this.rotation.add(v)
        return this
    }

    scaleBy(v:Vec3): Transform {
        this.scale.add(v)
        return this
    }

    move(v:Vec3): Transform {
        const rotMat = new Mat4()
        rotMat.rotate(this.rotation)
        this.position.add(rotMat.transformVec3(v))
        return this
    }
}

export abstract class GameObject {
    transform:Transform
    mesh?:Mesh

    constructor(mesh?:Mesh) {
        this.transform = new Transform()
        this.mesh = mesh
    }

    abstract update(dt:number): void
}