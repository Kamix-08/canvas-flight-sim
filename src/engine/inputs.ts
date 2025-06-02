import { Airplane } from "../game/airplane.js"
import { lerp } from "../math/utils.js"
import { Vec3 } from "../math/vec3.js"

let plane:Airplane|null = null
const pressedKeys:Set<string> = new Set<string>()

export function init_inputs(airplane:Airplane) {
    plane = airplane
}

export function handleInputs(dt:number) {
    if(!plane) return

    const rspeed = 1 * dt

    if(pressedKeys.has('j')) {
        plane.transform.rotate(new Vec3(0,-rspeed,0))
        plane.transform.rotate(new Vec3(0,0, rspeed))
    }
    
    if(pressedKeys.has('l')) {
        plane.transform.rotate(new Vec3(0, rspeed,0))
        plane.transform.rotate(new Vec3(0,0,-rspeed))
    }

    if(pressedKeys.has('i')) plane.transform.rotate(new Vec3( rspeed,0,0))
    if(pressedKeys.has('k')) plane.transform.rotate(new Vec3(-rspeed,0,0))

    plane.transform.rotation = new Vec3(
        plane.transform.rotation.x,
        plane.transform.rotation.y,
        lerp(
            plane.transform.rotation.z,
            0,
            dt
        )
    )
}

document.addEventListener('keydown', e => pressedKeys.add   (e.key.toLowerCase()))
document.addEventListener('keyup',   e => pressedKeys.delete(e.key.toLowerCase()))

export function handleResize() {
    const maxWidth  = 1920
    const maxHeight = 1080

    const windowRatio = window.innerWidth / window.innerHeight
    const targetRatio = maxWidth / maxHeight

    let w:number
    let h:number

    if(windowRatio > targetRatio) {
        h = Math.min(window.innerHeight, maxHeight)
        w = h * targetRatio
    } else {
        w = Math.min(window.innerWidth, maxWidth)
        h = w / targetRatio
    }

    const canvas = document.getElementById('game') as HTMLCanvasElement
    canvas.width  = w
    canvas.height = h
}

window.addEventListener('resize', handleResize)