import { Vec3 } from "../math/vec3"
import { Triangle } from "./scene"

export class Renderer {
    private static instance: Renderer | null = null
    private static canvas:HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement

    private ctx:CanvasRenderingContext2D = CanvasRenderingContext2D.prototype

    private constructor() {
        this.ctx = Renderer.canvas.getContext('2d') as CanvasRenderingContext2D
        Renderer.instance = this
    }

    static getInstance(): Renderer {
        if (!Renderer.instance) Renderer.instance = new Renderer()
        return Renderer.instance
    }

    clear(): void {
        this.ctx.clearRect(0, 0, Renderer.canvas.width, Renderer.canvas.height)
    }

    toScreenSpace(vec:Vec3): Vec3 {
        const screenX = ( vec.x + 1) * Renderer.canvas.width  / 2
        const screenY = (-vec.y + 1) * Renderer.canvas.height / 2
        return new Vec3(screenX, screenY, vec.z)
    }

    drawTriangle(triangle:Triangle): void {
        const screenVertices = triangle.vertices.map(v => this.toScreenSpace(v))
        this.ctx.fillStyle = `rgb(${triangle.color.x * 255}, ${triangle.color.y * 255}, ${triangle.color.z * 255})`

        this.ctx.moveTo(screenVertices[0].x, screenVertices[0].y)
        this.ctx.beginPath()
        this.ctx.lineTo(screenVertices[1].x, screenVertices[1].y)
        this.ctx.lineTo(screenVertices[2].x, screenVertices[2].y)
        this.ctx.closePath()
        this.ctx.fill()
    }
}