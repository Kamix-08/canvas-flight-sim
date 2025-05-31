import { GameObject } from "../engine/GameObject.js"
import { Vec3 } from "../math/vec3.js"
import { lerpVec, modifyColorVector } from "../math/utils.js"
import { Camera } from "../engine/camera.js"

export class Airplane extends GameObject {
    cam:Camera = Camera.getInstance()
    offset:Vec3 = new Vec3(0, 10, -50)
    followSpeed:number = 2

    update(dt:number) {
        const targetPos = this.transform.position.clone()
            .add(this.offset)

        this.cam.transform.position = lerpVec(
            this.cam.transform.position,
            targetPos,
            dt * this.followSpeed
        )
    }

    constructor() {
        super({vertices:[
            // front
            new Vec3(-4,-4, 34), new Vec3(4,-4, 34), new Vec3(-4,4, 34), new Vec3(4,4, 34), // 0, 1, 2, 3
            new Vec3(-6,-6, 31), new Vec3(6,-6, 31), new Vec3(-6,6, 31), new Vec3(6,6, 31), // 4, 5, 6, 7
            // back
            new Vec3(-6,-6,-20), new Vec3(6,-6,-20), new Vec3(-6,6,-20), new Vec3(6,6,-20), // 8, 9,10,11
            // wings
            new Vec3(-23,-1.5, 5), new Vec3(23,-1.5, 5), new Vec3(-25,1.5, 7), new Vec3(25,1.5, 7), // 12,13,14,15
            new Vec3(-23,-1.5,-5), new Vec3(23,-1.5,-5), new Vec3(-25,1.5,-7), new Vec3(25,1.5,-7), // 16,17,18,19
            // back wing
            new Vec3(-6,-4,-24), new Vec3(6,-4,-24), new Vec3(-6,12,-28), new Vec3(6,12,-28), // 20,21,22,23
            // middle wings (edit 1)
            new Vec3(-6.001,-1.5, 5), new Vec3(6.001,-1.5, 5), new Vec3(-6.001,1.5, 7), new Vec3(6.001,1.5, 7), // 24,25,26,27
            new Vec3(-6.001,-1.5,-5), new Vec3(6.001,-1.5,-5), new Vec3(-6.001,1.5,-7), new Vec3(6.001,1.5,-7)  // 28,29,30,31
        ], indices:[
            // front
            [0,1,2], [1,2,3], // 0,1
            [0,4,5], [0,1,5], // 2,3
            [1,3,7], [1,5,7], // 4,5
            [3,6,7], [2,3,6], // 6,7
            [2,4,6], [0,2,4], // 8,9
            // sides
            [4, 5, 9], [4,8, 9], // 10,11
            [5, 9,11], [5,7,11], // 12,13
            [7,10,11], [6,7,10], // 14,15
            [6, 8,10], [4,6, 8], // 16,17
            // wings
            [12,24,26], [12,14,26], // 18,19
            [13,17,19], [13,15,19], // 20,21
            [13,15,25], [15,25,27], // 22,23
            [14,16,18], [12,14,16], // 24,25
            [14,26,30], [14,18,30], // 26,27
            [15,19,27], [19,27,31], // 28,29
            // back wing
            [ 9,21,23], [ 9,11,23], // 30,31
            [21,22,23], [20,21,22], // 32,33
            [ 8,10,20], [10,20,22], // 34,35
            [ 8, 9,21], [ 8,20,21], // 36,37
            [10,11,23], [10,22,23], // 38,39
            // wings (edit 1)
            [16,18,30], [16,28,30], // 40,41
            [17,19,29], [19,29,31], // 42,43
            [12,16,24], [16,24,28], // 44,45
            [13,17,29], [13,25,29], // 46,47
        ], colors:[
            ...Array(48).fill(null).map((_,i) => modifyColorVector(new Vec3(.6,.6,.6), i, 42, 2447, .025))
        ]})

        this.transform.setScale(new Vec3(.75,.75,.75))
    }
}

export class AirplaneIndicator extends Airplane {
    plane:Airplane

    update() {
        this.transform.rotation = this.plane.transform.rotation.clone()
        this.transform.rotation.y *= -1
    }

    constructor(indicates:Airplane) {
        super()

        this.onTop = true
        this.transform.setPosition(new Vec3((1920 - 250)/1920, (1080 - 250)/1080, .5))
        this.transform.setScale(new Vec3(5/1920, 5/1080, 5*2/(1920+1080)))
        this.plane = indicates
    }
}