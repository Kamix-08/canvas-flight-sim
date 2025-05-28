import { Vec3 } from './vec3'

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
        return this.rotateX(rot.x).rotateY(rot.y).rotateZ(rot.z)
    }

    lookAt(eye:Vec3, center:Vec3, up:Vec3): Mat4 {
        const z = Vec3.subtract(eye, center).normalize()
        const x = up.cross(z).normalize()
        const y = z.cross(x).normalize()

        this.m.set([
            x.x, x.y, x.z, 0,
            y.x, y.y, y.z, 0,
            z.x, z.y, z.z, 0,
            -x.dot(eye), -y.dot(eye), -z.dot(eye), 1
        ])
        return this
    }

    perspective(fov:number, aspect:number, near:number, far:number): Mat4 {
        const f = 1 / Math.tan(fov / 2)
        const nf = 1 / (near - far)

        this.m.set([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
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
        return new Vec3(x, y, z)
    }

    toArray(): Float32Array {
        return this.m.slice()
    }

    inverse(): Mat4 | null {
        const m = this.m
        const inv = new Float32Array(16)

        inv[0]  =  m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10]
        inv[4]  = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10]
        inv[8]  =  m[4] * m[9]  * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9]
        inv[12] = -m[4] * m[9]  * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9]
        inv[1]  = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10]
        inv[5]  =  m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10]
        inv[9]  = -m[0] * m[9]  * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9]
        inv[13] =  m[0] * m[9]  * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9]
        inv[2]  =  m[1] * m[6]  * m[15] - m[1] * m[7] *  m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] -  m[13] * m[3] * m[6]
        inv[6]  = -m[0] * m[6]  * m[15] + m[0] * m[7] *  m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] +  m[12] * m[3] * m[6]
        inv[10] =  m[0] * m[5]  * m[15] - m[0] * m[7] *  m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] -  m[12] * m[3] * m[5]
        inv[14] = -m[0] * m[5]  * m[14] + m[0] * m[6] *  m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] +  m[12] * m[2] * m[5]
        inv[3]  = -m[1] * m[6]  * m[11] + m[1] * m[7] *  m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9]  * m[2] * m[7] +  m[9]  * m[3] * m[6]
        inv[7]  =  m[0] * m[6]  * m[11] - m[0] * m[7] *  m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8]  * m[2] * m[7] -  m[8]  * m[3] * m[6]
        inv[11] = -m[0] * m[5]  * m[11] + m[0] * m[7] *  m[9]  + m[4] * m[1] * m[11] - m[4] * m[3] * m[9]  - m[8]  * m[1] * m[7] +  m[8]  * m[3] * m[5]
        inv[15] =  m[0] * m[5]  * m[10] - m[0] * m[6] *  m[9]  - m[4] * m[1] * m[10] + m[4] * m[2] * m[9]  + m[8]  * m[1] * m[6] -  m[8]  * m[2] * m[5]

        const det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12]
        if (det === 0) return null

        const invDet = 1 / det
        for (let i = 0; i < 16; i++) inv[i] *= invDet

        this.m = inv
        return this
    }

    transpose(): Mat4 {
        const m = this.m
        const temp = new Float32Array([
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
        ])
        this.m = temp
        return this
    }

    static fromArray(arr:number[]): Mat4 {
        const mat = new Mat4()
        if (arr.length === 16) mat.m.set(arr)
        return mat
    }
}