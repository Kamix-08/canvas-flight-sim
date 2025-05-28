import { Mat4 } from "../math/mat4.js"
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

    frameCount:number = 0

    constructor() {
        this.transform = new Transform()
        this.viewMatrix = new Mat4()
        this.projectionMatrix = new Mat4()
    }

    updateViewMatrix(): void {
        this.frameCount++

        this.viewMatrix.identity()
            .translate(this.transform.position.scale(-1))
            .rotate(this.transform.rotation)
            .scale(this.transform.scale)
    }

    updateProjectionMatrix(): void {
        this.projectionMatrix.identity()
            .perspective(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    }
}