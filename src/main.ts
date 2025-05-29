import { handleInputs, handleResize } from "./engine/inputs.js"
import { Scene } from "./engine/scene.js"
import { Airplane } from "./game/airplane.js"
import { Terrain } from "./game/terrain.js"

let lastTime:number = 0

const scene = new Scene()
scene.addObject(new Airplane())
scene.addObject(new Terrain(841))

function gameLoop(time:number) {
    const dt = (time - lastTime)/1000.0
    lastTime = time

    console.log(1/dt)
    
    handleInputs(dt)
    
    scene.objects.forEach(obj => obj.update(dt))
    scene.render()

    requestAnimationFrame(gameLoop)
}

handleResize()
gameLoop(0)