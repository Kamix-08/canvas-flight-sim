import { Scene } from "./engine/scene.js"
import { Airplane } from "./game/airplane.js"

let lastTime = 0

const scene = new Scene()
scene.addObject(new Airplane())

function gameLoop(time:number) {
    const dt = (time - lastTime)/1000.0
    lastTime = time
    
    scene.objects.forEach(obj => obj.update(dt))
    scene.render()

    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)