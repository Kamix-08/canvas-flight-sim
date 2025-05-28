import { Camera } from "./camera.js"
import { Vec3 } from "../math/vec3.js"

const camera = Camera.getInstance()
const pressedKeys:Set<string> = new Set<string>()

export function handleInputs(dt:number) {
    const mspeed = 100 * dt
    const rspeed = 1   * dt

    if(pressedKeys.has('w')) camera.transform.move( mspeed)
    if(pressedKeys.has('s')) camera.transform.move(-mspeed)
        
    if(pressedKeys.has('a')) camera.transform.moveVec(new Vec3( mspeed,0,0))
    if(pressedKeys.has('d')) camera.transform.moveVec(new Vec3(-mspeed,0,0))

    if(pressedKeys.has('j')) camera.transform.rotate(new Vec3(0,-rspeed,0))
    if(pressedKeys.has('l')) camera.transform.rotate(new Vec3(0, rspeed,0))

    if(pressedKeys.has('i')) camera.transform.rotate(new Vec3( rspeed,0,0))
    if(pressedKeys.has('k')) camera.transform.rotate(new Vec3(-rspeed,0,0))

    if(pressedKeys.has(' '))     camera.transform.translate(new Vec3(0, mspeed,0))
    if(pressedKeys.has('Shift')) camera.transform.translate(new Vec3(0,-mspeed,0))
}

document.addEventListener('keydown', e => pressedKeys.add   (e.key))
document.addEventListener('keyup',   e => pressedKeys.delete(e.key))
