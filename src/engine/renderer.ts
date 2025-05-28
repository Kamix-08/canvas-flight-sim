import { Vec3 } from "../math/vec3.js"
import { Triangle } from "./scene.js"

export class Renderer {
    private static instance: Renderer | null = null

    private canvas:HTMLCanvasElement = HTMLCanvasElement.prototype
    private ctx:CanvasRenderingContext2D = CanvasRenderingContext2D.prototype

    private constructor() {
        this.canvas = document.getElementById('game') as HTMLCanvasElement
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
        Renderer.instance = this
    }

    static getInstance(): Renderer {
        if (!Renderer.instance) Renderer.instance = new Renderer()
        return Renderer.instance
    }

    clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    toScreenSpace(vec:Vec3): Vec3 {
        const screenX = ( vec.x + 1) * this.canvas.width  / 2
        const screenY = (-vec.y + 1) * this.canvas.height / 2
        return new Vec3(screenX, screenY, 0)
    }

    drawTriangle(triangle:Triangle): void {
        const screenVertices = triangle.vertices.map(v => this.toScreenSpace(v))
        this.ctx.fillStyle = `rgb(${triangle.color.x * 255}, ${triangle.color.y * 255}, ${triangle.color.z * 255})`

        this.ctx.beginPath()
        this.ctx.moveTo(screenVertices[0].x, screenVertices[0].y)
        this.ctx.lineTo(screenVertices[1].x, screenVertices[1].y)
        this.ctx.lineTo(screenVertices[2].x, screenVertices[2].y)
        this.ctx.closePath()
        this.ctx.fill()
    }
}