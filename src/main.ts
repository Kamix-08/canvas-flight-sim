import { handleInputs, handleResize, init_inputs } from "./engine/inputs.js"
import { Scene } from "./engine/scene.js"
import { Airplane, AirplaneIndicator } from "./game/airplane.js"
import { Terrain } from "./game/terrain.js"

let lastTime:number = 0

const scene = new Scene()
const airplane = new Airplane()

scene.addObject(airplane)
scene.addObject(new AirplaneIndicator(airplane))
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

init_inputs(airplane)
handleResize()
gameLoop(0)