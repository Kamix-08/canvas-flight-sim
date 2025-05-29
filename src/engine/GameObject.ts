import { Vec3 } from "../math/vec3.js"
import { Mat4 } from "../math/mat4.js"

export interface Mesh {
    vertices:Vec3[]
    indices:number[][]
    colors?:Vec3[]
}

export class Transform {
    position:Vec3
    rotation:Vec3
    scale:Vec3
    front:Vec3
    up:Vec3
    modelMatrix:Mat4

    constructor() {
        this.position = new Vec3()
        this.rotation = new Vec3()
        this.scale = new Vec3(1, 1, 1)
        this.front = new Vec3()
        this.up = new Vec3()
        this.modelMatrix = new Mat4()
        this.updateModelMatrix()
        this.modRot()
    }

    updateLocals(): void {
        const rotationMatrix = new Mat4().rotate(this.rotation)
        this.front = rotationMatrix.transformVec3(new Vec3(0, 0, 1)).normalize()
        this.up    = rotationMatrix.transformVec3(new Vec3(0, 1, 0)).normalize()
    }

    updateModelMatrix(): void {
        this.modelMatrix.identity()
            .translate(this.position)
            .rotate(this.rotation)
            .scale(this.scale)

        this.updateLocals()
    }

    setPosition(pos:Vec3): Transform {
        this.position = pos
        return this
    }

    private modVal(v:number, m:number): number {
        while(v < 0) v += m
        return v % m
    }

    private modRot() {
        this.rotation.x = this.modVal(this.rotation.x, 2 * Math.PI)
        this.rotation.y = this.modVal(this.rotation.y, 2 * Math.PI)
        this.rotation.z = this.modVal(this.rotation.z, 2 * Math.PI)
    }

    setRotation(rot:Vec3): Transform {
        this.rotation = rot
        this.modRot()
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
        this.modRot()
        return this
    }

    scaleBy(v:Vec3): Transform {
        this.scale.add(v)
        return this
    }

    move(v:number): Transform {
        this.translate(this.front.clone().scale(v))
        return this
    }

    moveVec(v:Vec3): Transform {
        this.translate(new Mat4().rotate(this.rotation).transformVec3(v))
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