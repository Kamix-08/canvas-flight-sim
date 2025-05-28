import { Mat4 } from "../math/mat4.js"
import { Vec3 } from "../math/vec3.js"
import { Transform } from "./GameObject.js"

export class Camera {
    private static instance:Camera | null = null
    static getInstance():Camera {
        if (!Camera.instance) Camera.instance = new Camera()
        return Camera.instance
    }

    transform:Transform
    viewMatrix:Mat4
    projectionMatrix:Mat4

    constructor() {
        this.transform = new Transform()
        this.viewMatrix = new Mat4()
        this.projectionMatrix = new Mat4()
        
        this.updateProjectionMatrix()
    }

    updateViewMatrix(): void {
        this.transform.updateFront()

        this.viewMatrix.identity()
            .lookAt(
                this.transform.position,
                this.transform.position.clone().add(this.transform.front),
                new Vec3(0,1,0)
            )
    }

    updateProjectionMatrix(): void {
        this.projectionMatrix.identity()
            .perspective(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    }
}