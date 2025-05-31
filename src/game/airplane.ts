import { GameObject } from "../engine/GameObject.js"
import { Vec3 } from "../math/vec3.js"
import { Camera } from "../engine/camera.js"

export class Airplane extends GameObject {
    cam:Camera = Camera.getInstance()

    update(dt:number) {
        this.transform.setPosition(this.cam.transform.position.clone().add(this.cam.transform.front.clone().add(new Vec3(.01,0,0)).scale(50)))
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
            new Vec3(1, 0, 0),
            new Vec3(0, 1, 0),
            new Vec3(0, 0, 1),
            new Vec3(1, 0, 0),
            new Vec3(0, 1, 0),
            new Vec3(0, 0, 1),
            new Vec3(1, 0, 0),
            new Vec3(0, 1, 0),
            new Vec3(0, 0, 1),
        ]})
    }
}