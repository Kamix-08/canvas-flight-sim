import { Vec3 } from './vec3.js'

export class Mat4 {
    m:Float32Array

    constructor() {
        this.m = new Float32Array(16)
        this.identity()
    }

    identity(): Mat4 {
        this.m.set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this
    }

    multiply(b:Mat4): Mat4 {
        const a = this.m
        const result = new Float32Array(16)

        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                result[j * 4 + i] =
                    b.m[j * 4 + 0] * a[0 * 4 + i] +
                    b.m[j * 4 + 1] * a[1 * 4 + i] +
                    b.m[j * 4 + 2] * a[2 * 4 + i] +
                    b.m[j * 4 + 3] * a[3 * 4 + i]

        this.m = result
        return this
    }

    translate(v:Vec3): Mat4 {
        const translation = new Mat4()
        translation.m.set([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            v.x, v.y, v.z, 1
        ])
        return this.multiply(translation)
    }

    scale(v:Vec3): Mat4 {
        const scaling = new Mat4()
        scaling.m.set([
            v.x, 0, 0, 0,
            0, v.y, 0, 0,
            0, 0, v.z, 0,
            0, 0, 0, 1
        ])
        return this.multiply(scaling)
    }

    rotateX(angle:number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        const rotation = new Mat4()
        rotation.m.set([
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        ])
        return this.multiply(rotation)
    }

    rotateY(angle:number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        const rotation = new Mat4()
        rotation.m.set([
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0,
            0, 0, 0, 1
        ])
        return this.multiply(rotation)
    }

    rotateZ(angle:number): Mat4 {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        const rotation = new Mat4()
        rotation.m.set([
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ])
        return this.multiply(rotation)
    }

    rotate(rot:Vec3): Mat4 {
        return this
            .rotateY(rot.y)
            .rotateX(rot.x)
            .rotateZ(rot.z)
    }

    lookAt(eye:Vec3, center:Vec3, up:Vec3): Mat4 {
        const z = Vec3.subtract(eye, center).normalize()
        const x = up.cross(z).normalize()
        const y = z.cross(x).normalize()

        this.m.set([
            x.x, y.x, z.x, 0,
            x.y, y.y, z.y, 0,
            x.z, y.z, z.z, 0,
            -x.dot(eye), -y.dot(eye), -z.dot(eye), 1
        ])
        return this
    }

    perspective(fov:number, aspect:number, near:number, far:number): Mat4 {
        const f = 1 / Math.tan(fov * Math.PI / 360)
        const fn = 1 / (far - near)

        this.m.set([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, -far * fn, -1,
            0, 0, -far * near * fn, 0
        ])
        return this
    }

    clone(): Mat4 {
        const clone = new Mat4()
        clone.m.set(this.m)
        return clone
    }

    transformVec3(v:Vec3): Vec3 {
        const x = v.x * this.m[0] + v.y * this.m[4] + v.z * this.m[8 ] + this.m[12]
        const y = v.x * this.m[1] + v.y * this.m[5] + v.z * this.m[9 ] + this.m[13]
        const z = v.x * this.m[2] + v.y * this.m[6] + v.z * this.m[10] + this.m[14]
        const w = v.x * this.m[3] + v.y * this.m[7] + v.z * this.m[11] + this.m[15]
        return new Vec3(x, y, z).scale(1 / Math.abs(w))
    }

    transpose(): Mat4 {
        const result = new Mat4()
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                result.m[j * 4 + i] = this.m[i * 4 + j]
        this.m = result.m
        return this
    }

    toEulerAngles(): Vec3 {
        return new Vec3(
            Math.atan2(this.m[9], this.m[10]),
            Math.atan2(-this.m[8], Math.sqrt(this.m[9]*this.m[9] + this.m[10]*this.m[10])),
            Math.atan2(this.m[4], this.m[0])
        )
    }
}