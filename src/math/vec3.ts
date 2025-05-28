export class Vec3 {
    x:number
    y:number
    z:number

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    add(v:Vec3): Vec3 {
        this.x += v.x
        this.y += v.y
        this.z += v.z
        return this
    }

    sub(v:Vec3): Vec3 {
        this.x -= v.x
        this.y -= v.y
        this.z -= v.z
        return this
    }

    scale(s:number): Vec3 {
        this.x *= s
        this.y *= s
        this.z *= s
        return this
    }

    dot(v:Vec3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    multVal(v:Vec3): Vec3 {
        this.x *= v.x
        this.y *= v.y
        this.z *= v.z
        return this
    }

    cross(v:Vec3): Vec3 {
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        )
    }

    lengthSq(): number {
        return this.x ** 2 + this.y ** 2 + this.z ** 2
    }

    length(): number {
        return Math.sqrt(this.lengthSq())
    }

    normalize(): Vec3 {
        const len = this.length()
        if (len === 0) return this
        return this.scale(1 / len)
    }

    clone(): Vec3 {
        return new Vec3(this.x, this.y, this.z)
    }

    static subtract(a:Vec3, b:Vec3): Vec3 {
        return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z)
    }
}