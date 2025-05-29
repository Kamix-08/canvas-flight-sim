import { GameObject } from "../engine/GameObject.js"
import { Vec3 } from "../math/vec3.js"

export class Airplane extends GameObject {
    update(dt:number) {
        this.transform.rotate(new Vec3(.5,1,.25).scale(dt))

        // const cam = Camera.getInstance()
        // this.transform.setPosition(cam.transform.position.clone().add(cam.transform.front.clone().add(new Vec3(.01,0,0)).scale(50)))
    }

    constructor() {
        super({vertices:[
            new Vec3(-1, -1, -1), new Vec3(1, -1, -1), new Vec3(-1, -1, 1), new Vec3(1, -1, 1),
            new Vec3(-1,  1, -1), new Vec3(1,  1, -1), new Vec3(-1,  1, 1), new Vec3(1,  1, 1)
        ], indices:[
            [0,1,2], [1,2,3],
            [0,1,4], [1,4,5],
            [1,3,5], [3,5,7],
            [2,3,6], [3,6,7],
            [0,2,4], [2,4,6],
            [4,5,6], [5,6,7]
        ], colors:[
            new Vec3(1, 0, 0),
            new Vec3(0, 1, 0),
            new Vec3(0, 0, 1),
            new Vec3(1, 1, 0),
            new Vec3(1, 0, 1),
            new Vec3(0, 1, 1),
            new Vec3(1, 1, 1),
            new Vec3(0.5, 0.5, 0.5),
            new Vec3(0.5, 0, 0),
            new Vec3(0, 0.5, 0),
            new Vec3(0, 0, 0.5),
            new Vec3(0.5, 0.5, 0) 
        ]})

        this.transform.setScale(new Vec3(1.2,1.2,1.2)).setPosition(new Vec3(0,0,30))
    }
}