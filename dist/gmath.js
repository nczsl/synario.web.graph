export const PI = Math.PI;
export const MATRIX4F_SIZE = 4 * 4 * 4;
export const MATRIX3F_SIZE = 3 * 3 * 4;
export class Vector {
    buffer;
    constructor(buffer) {
        this.buffer = buffer;
    }
    ToString() {
        return `[${this.buffer.join(',')}]`;
    }
    get x() { return this.buffer[0]; }
    get y() { return this.buffer[1]; }
    get z() { return this.buffer[2]; }
    get w() { return this.buffer[3]; }
    set x(value) { this.buffer[0] = value; }
    set y(value) { this.buffer[1] = value; }
    set z(value) { this.buffer[2] = value; }
    set w(value) { this.buffer[3] = value; }
    get r() { return this.buffer[0]; }
    get g() { return this.buffer[1]; }
    get b() { return this.buffer[2]; }
    get a() { return this.buffer[3]; }
    set r(value) { this.buffer[0] = value; }
    set g(value) { this.buffer[1] = value; }
    set b(value) { this.buffer[2] = value; }
    set a(value) { this.buffer[3] = value; }
    Equals(v) {
        let result = false;
        switch (this.buffer.length) {
            case 2:
                result = this.x == v.x && this.y == v.y;
                break;
            case 3:
                result = this.x == v.x && this.y == v.y && this.z == v.z;
                break;
            case 4:
                result = this.x == v.x && this.y == v.y && this.z == v.z && this.w == v.w;
                break;
        }
        return result;
    }
    Reset(...values) {
        for (let i = 0; i < values.length; i++) {
            this.buffer[i] = values[i];
        }
    }
    get len() {
        return -1;
    }
    Length() {
        let sum = 0;
        for (let i = 0; i < this.buffer.length; i++) {
            sum += this.buffer[i] ** 2;
        }
        return Math.sqrt(sum);
    }
    Normalize() {
        let l = this.Length();
        for (let i = 0; i < this.buffer.length; i++) {
            this.buffer[i] /= l;
        }
    }
    Clone() {
        let len = this.buffer.length;
        let newBuffer = new Float32Array(len);
        for (let i = 0; i < len; i++) {
            newBuffer[i] = this.buffer[i];
        }
        let result;
        switch (len) {
            case 2:
                result = new Vector2(newBuffer);
                break;
            case 3:
                result = new Vector3(newBuffer);
                break;
            case 4:
                result = new Vector4(newBuffer);
                break;
            default: throw new Error('vector length must be 2,3 or 4');
        }
        return result;
    }
    static FromXY(x, y) {
        return new Vector2(new Float32Array([x, y]));
    }
    static FromXYZ(x, y, z) {
        return new Vector3(new Float32Array([x, y, z]));
    }
    static FromXYZW(x, y, z, w) {
        return new Vector4(new Float32Array([x, y, z, w]));
    }
    static FromRGB(r, g, b) {
        return new Vector3(new Float32Array([r, g, b]));
    }
    static FromRGBA(r, g, b, a) {
        return new Vector4(new Float32Array([r, g, b, a]));
    }
    static FromArray(arr) {
        let len = arr.length;
        let newBuffer = new Float32Array(len);
        for (let i = 0; i < len; i++) {
            newBuffer[i] = arr[i];
        }
        let result;
        switch (len) {
            case 2:
                result = new Vector2(newBuffer);
                break;
            case 3:
                result = new Vector3(newBuffer);
                break;
            case 4:
                result = new Vector4(newBuffer);
                break;
            default: throw new Error('vector length must be 2,3 or 4');
        }
        return result;
    }
    static Dot(a, b) {
        let sum = 0;
        for (let i = 0; i < a.buffer.length; i++) {
            sum += a.buffer[i] * b.buffer[i];
        }
        return sum;
    }
    EqualsTolerance(v, epsilon = 0.000001) {
        if (this.buffer.length !== v.buffer.length)
            return false;
        for (let i = 0; i < this.buffer.length; i++) {
            if (Math.abs(this.buffer[i] - v.buffer[i]) > epsilon)
                return false;
        }
        return true;
    }
    static Perpendicular(a) {
        return new Vector2(new Float32Array([-a.y, a.x]));
    }
    static Add(a, b) {
        let result = new Float32Array(a.buffer.length);
        for (let i = 0; i < a.buffer.length; i++) {
            result[i] = a.buffer[i] + b.buffer[i];
        }
        return new Vector(result);
    }
    static Subtract(a, b) {
        let result = new Float32Array(a.buffer.length);
        for (let i = 0; i < a.buffer.length; i++) {
            result[i] = a.buffer[i] - b.buffer[i];
        }
        return new Vector(result);
    }
    static Normalize(v) {
        let result = new Float32Array(v.buffer.length);
        let l = v.Length();
        for (let i = 0; i < v.buffer.length; i++) {
            result[i] = v.buffer[i] / l;
        }
        return new Vector(result);
    }
}
export class Vector2 extends Vector {
    constructor(buffer) {
        if (buffer) {
            if (buffer.length != Vector2.len) {
                throw new Error('vec2 must be 2d');
            }
            super(buffer);
        }
        else {
            super(new Float32Array(Vector2.len));
        }
    }
    static len = 2;
    static Zero() {
        return new Vector2(new Float32Array([0, 0]));
    }
    static One() {
        return new Vector2(new Float32Array([1, 1]));
    }
    Abs() {
        return new Vector2(new Float32Array([Math.abs(this.x), Math.abs(this.y)]));
    }
    Negate() {
        return new Vector2(new Float32Array([-this.x, -this.y]));
    }
    Sum() {
        return this.x + this.y;
    }
    Average() {
        return (this.x + this.y) / 2;
    }
    static Distance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }
    static Lerp(a, b, t) {
        return new Vector2(new Float32Array([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t]));
    }
    static MultiplyScalar(v, scalar) {
        return new Vector2(new Float32Array([v.x * scalar, v.y * scalar]));
    }
    static Transform(left, x) {
        let temp = [...x.buffer, 1];
        let result = new Vector3();
        result.x = left.buffer[0] * temp[0] + left.buffer[1] * temp[1] + left.buffer[2] * temp[2];
        result.y = left.buffer[3] * temp[0] + left.buffer[4] * temp[1] + left.buffer[5] * temp[2];
        result.z = left.buffer[6] * temp[0] + left.buffer[7] * temp[1] + left.buffer[8] * temp[2];
        result.x /= result.z;
        result.y /= result.z;
        return new Vector2(result.buffer.subarray(0, 2));
    }
}
export class Vector3 extends Vector {
    constructor(buffer) {
        if (buffer) {
            if (buffer.length != Vector3.len) {
                throw new Error('vec3 must be 3d');
            }
            super(buffer);
        }
        else {
            super(new Float32Array(Vector3.len));
        }
    }
    static len = 3;
    static Zero() {
        return new Vector3(new Float32Array([0, 0, 0]));
    }
    static One() {
        return new Vector3(new Float32Array([1, 1, 1]));
    }
    Abs() {
        return new Vector3(new Float32Array([Math.abs(this.x), Math.abs(this.y), Math.abs(this.z)]));
    }
    Negate() {
        return new Vector3(new Float32Array([-this.x, -this.y, -this.z]));
    }
    Sum() {
        return this.x + this.y + this.z;
    }
    Average() {
        return (this.x + this.y + this.z) / 3;
    }
    static Cross(a, b) {
        return new Vector3(new Float32Array([a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x]));
    }
    static Distance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
    }
    static Lerp(a, b, t) {
        if (t < 0 || t > 1)
            throw new Error('t must be between 0 and 1');
        return new Vector3(new Float32Array([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t]));
    }
    static Transform(left, x) {
        let temp = [...x.buffer, 1];
        let v4 = new Vector4(new Float32Array(temp));
        let _temp = Vector4.Transform(left, v4);
        _temp.x /= _temp.w;
        _temp.y /= _temp.w;
        _temp.z /= _temp.w;
        return new Vector3(_temp.buffer.subarray(0, 3));
    }
    static GetForward() {
        return new Vector3(new Float32Array([0, 0, 1]));
    }
    static GetBack() {
        return new Vector3(new Float32Array([0, 0, -1]));
    }
    static GetUp() {
        return new Vector3(new Float32Array([0, 1, 0]));
    }
    static GetDown() {
        return new Vector3(new Float32Array([0, -1, 0]));
    }
    static GetRight() {
        return new Vector3(new Float32Array([1, 0, 0]));
    }
    static GetLeft() {
        return new Vector3(new Float32Array([-1, 0, 0]));
    }
}
export class Vector4 extends Vector {
    constructor(buffer) {
        if (buffer) {
            if (buffer.length != Vector4.len) {
                throw new Error('vec4 must be 4d');
            }
            super(buffer);
        }
        else {
            super(new Float32Array(Vector4.len));
        }
    }
    static len = 4;
    static Zero() {
        return new Vector4(new Float32Array([0, 0, 0, 0]));
    }
    static One() {
        return new Vector4(new Float32Array([1, 1, 1, 1]));
    }
    Abs() {
        return new Vector4(new Float32Array([Math.abs(this.x), Math.abs(this.y), Math.abs(this.z), Math.abs(this.w)]));
    }
    Negate() {
        return new Vector4(new Float32Array([-this.x, -this.y, -this.z, -this.w]));
    }
    Sum() {
        return this.x + this.y + this.z + this.w;
    }
    Average() {
        return (this.x + this.y + this.z + this.w) / 4;
    }
    static Distance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 + (a.w - b.w) ** 2);
    }
    static Lerp(a, b, t) {
        return new Vector4(new Float32Array([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t, a.w + (b.w - a.w) * t]));
    }
    static Transform(left, x) {
        let result = new Vector4();
        result.x = left.buffer[0] * x.x + left.buffer[1] * x.y + left.buffer[2] * x.z + left.buffer[3] * x.w;
        result.y = left.buffer[4] * x.x + left.buffer[5] * x.y + left.buffer[6] * x.z + left.buffer[7] * x.w;
        result.z = left.buffer[8] * x.x + left.buffer[9] * x.y + left.buffer[10] * x.z + left.buffer[11] * x.w;
        result.w = left.buffer[12] * x.x + left.buffer[13] * x.y + left.buffer[14] * x.z + left.buffer[15] * x.w;
        return result;
    }
}
export class Matrix {
    buffer;
    row;
    col;
    static length;
    constructor(buffer) {
        this.buffer = buffer;
    }
    ToString() {
        return this.buffer.join(',');
    }
    GetByIndex(row, col) {
        return this.buffer[row * this.col + col];
    }
    SetByIndex(row, col, value) {
        this.buffer[row * this.col + col] = value;
    }
    *GetRow(rowNo) {
        for (let i = 0; i < this.col; i++) {
            yield this.buffer[rowNo * this.col + i];
        }
    }
    *GetCol(colNo) {
        for (let i = 0; i < this.row; i++) {
            yield this.buffer[i * this.col + colNo];
        }
    }
    GetRowVector(rowNo) {
        return Vector.FromArray([...this.GetRow(rowNo)]);
    }
    GetColVector(colNo) {
        return Vector.FromArray([...this.GetCol(colNo)]);
    }
    SetRow(rowNo, v) {
        for (let i = 0; i < this.col; i++) {
            this.buffer[rowNo * this.col + i] = v.buffer[i];
        }
    }
    SetCol(colNo, v) {
        for (let i = 0; i < this.row; i++) {
            this.buffer[i * this.col + colNo] = v.buffer[i];
        }
    }
    Transpose() {
        let m = new Matrix(new Float32Array(this.buffer));
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                m.buffer[j * this.row + i] = this.buffer[i * this.col + j];
            }
        }
        return m;
    }
    Clone() {
        let len = this.buffer.length;
        let newBuffer = new Float32Array(len);
        for (let i = 0; i < len; i++) {
            newBuffer[i] = this.buffer[i];
        }
        let result;
        switch (len) {
            case 9:
                result = new Matrix3(newBuffer);
                break;
            case 16:
                result = new Matrix4(newBuffer);
                break;
            default: throw new Error('matrix length must be 9 or 16');
        }
        return result;
    }
    Invert() {
        throw new Error('Method not implemented.');
    }
}
export class Matrix4 extends Matrix {
    constructor(buffer) {
        if (buffer) {
            if (buffer.length != Matrix4.LENGTH) {
                throw new Error('mat4 must be 4x4');
            }
            super(buffer);
        }
        else {
            super(new Float32Array(Matrix4.LENGTH));
        }
        this.row = 4;
        this.col = 4;
    }
    static LENGTH = 16;
    Invert() {
        let m = this.buffer;
        let a0 = m[0] * m[5] - m[1] * m[4];
        let a1 = m[0] * m[6] - m[2] * m[4];
        let a2 = m[0] * m[7] - m[3] * m[4];
        let a3 = m[1] * m[6] - m[2] * m[5];
        let a4 = m[1] * m[7] - m[3] * m[5];
        let a5 = m[2] * m[7] - m[3] * m[6];
        let b0 = m[8] * m[13] - m[9] * m[12];
        let b1 = m[8] * m[14] - m[10] * m[12];
        let b2 = m[8] * m[15] - m[11] * m[12];
        let b3 = m[9] * m[14] - m[10] * m[13];
        let b4 = m[9] * m[15] - m[11] * m[13];
        let b5 = m[10] * m[15] - m[11] * m[14];
        let det = a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;
        if (det == 0)
            throw new Error('matrix is not invertible');
        let m1 = new Float32Array(16);
        m1[0] = m[5] * b5 - m[6] * b4 + m[7] * b3;
        m1[1] = -m[1] * b5 + m[2] * b4 - m[3] * b3;
        m1[2] = m[13] * a5 - m[14] * a4 + m[15] * a3;
        m1[3] = -m[9] * a5 + m[10] * a4 - m[11] * a3;
        m1[4] = -m[4] * b5 + m[6] * b2 - m[7] * b1;
        m1[5] = m[0] * b5 - m[2] * b2 + m[3] * b1;
        m1[6] = -m[12] * a5 + m[14] * a2 - m[15] * a1;
        m1[7] = m[8] * a5 - m[10] * a2 + m[11] * a1;
        m1[8] = m[4] * b4 - m[5] * b2 + m[7] * b0;
        m1[9] = -m[0] * b4 + m[1] * b2 - m[3] * b0;
        m1[10] = m[12] * a4 - m[13] * a2 + m[15] * a0;
        m1[11] = -m[8] * a4 + m[9] * a2 - m[11] * a0;
        m1[12] = -m[4] * b3 + m[5] * b1 - m[6] * b0;
        m1[13] = m[0] * b3 - m[1] * b1 + m[2] * b0;
        m1[14] = -m[12] * a3 + m[13] * a1 - m[14] * a0;
        m1[15] = m[8] * a3 - m[9] * a1 + m[10] * a0;
        let detInv = 1 / det;
        for (let i = 0; i < 16; i++) {
            m1[i] *= detInv;
        }
        let result = new Matrix4(m1);
        return result;
    }
    get Delta() {
        let m = this.buffer;
        let a0 = m[0] * m[5] - m[1] * m[4];
        let a1 = m[0] * m[6] - m[2] * m[4];
        let a2 = m[0] * m[7] - m[3] * m[4];
        let a3 = m[1] * m[6] - m[2] * m[5];
        let a4 = m[1] * m[7] - m[3] * m[5];
        let a5 = m[2] * m[7] - m[3] * m[6];
        let b0 = m[8] * m[13] - m[9] * m[12];
        let b1 = m[8] * m[14] - m[10] * m[12];
        let b2 = m[8] * m[15] - m[11] * m[12];
        let b3 = m[9] * m[14] - m[10] * m[13];
        let b4 = m[9] * m[15] - m[11] * m[13];
        let b5 = m[10] * m[15] - m[11] * m[14];
        return a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0;
    }
    static FromArray(arr) {
        return new Matrix4(new Float32Array(arr));
    }
    static Multiply(left, right) {
        let m = new Matrix4();
        m.buffer[0] = left.buffer[0] * right.buffer[0] + left.buffer[1] * right.buffer[4] + left.buffer[2] * right.buffer[8] + left.buffer[3] * right.buffer[12];
        m.buffer[1] = left.buffer[0] * right.buffer[1] + left.buffer[1] * right.buffer[5] + left.buffer[2] * right.buffer[9] + left.buffer[3] * right.buffer[13];
        m.buffer[2] = left.buffer[0] * right.buffer[2] + left.buffer[1] * right.buffer[6] + left.buffer[2] * right.buffer[10] + left.buffer[3] * right.buffer[14];
        m.buffer[3] = left.buffer[0] * right.buffer[3] + left.buffer[1] * right.buffer[7] + left.buffer[2] * right.buffer[11] + left.buffer[3] * right.buffer[15];
        m.buffer[4] = left.buffer[4] * right.buffer[0] + left.buffer[5] * right.buffer[4] + left.buffer[6] * right.buffer[8] + left.buffer[7] * right.buffer[12];
        m.buffer[5] = left.buffer[4] * right.buffer[1] + left.buffer[5] * right.buffer[5] + left.buffer[6] * right.buffer[9] + left.buffer[7] * right.buffer[13];
        m.buffer[6] = left.buffer[4] * right.buffer[2] + left.buffer[5] * right.buffer[6] + left.buffer[6] * right.buffer[10] + left.buffer[7] * right.buffer[14];
        m.buffer[7] = left.buffer[4] * right.buffer[3] + left.buffer[5] * right.buffer[7] + left.buffer[6] * right.buffer[11] + left.buffer[7] * right.buffer[15];
        m.buffer[8] = left.buffer[8] * right.buffer[0] + left.buffer[9] * right.buffer[4] + left.buffer[10] * right.buffer[8] + left.buffer[11] * right.buffer[12];
        m.buffer[9] = left.buffer[8] * right.buffer[1] + left.buffer[9] * right.buffer[5] + left.buffer[10] * right.buffer[9] + left.buffer[11] * right.buffer[13];
        m.buffer[10] = left.buffer[8] * right.buffer[2] + left.buffer[9] * right.buffer[6] + left.buffer[10] * right.buffer[10] + left.buffer[11] * right.buffer[14];
        m.buffer[11] = left.buffer[8] * right.buffer[3] + left.buffer[9] * right.buffer[7] + left.buffer[10] * right.buffer[11] + left.buffer[11] * right.buffer[15];
        m.buffer[12] = left.buffer[12] * right.buffer[0] + left.buffer[13] * right.buffer[4] + left.buffer[14] * right.buffer[8] + left.buffer[15] * right.buffer[12];
        m.buffer[13] = left.buffer[12] * right.buffer[1] + left.buffer[13] * right.buffer[5] + left.buffer[14] * right.buffer[9] + left.buffer[15] * right.buffer[13];
        m.buffer[14] = left.buffer[12] * right.buffer[2] + left.buffer[13] * right.buffer[6] + left.buffer[14] * right.buffer[10] + left.buffer[15] * right.buffer[14];
        m.buffer[15] = left.buffer[12] * right.buffer[3] + left.buffer[13] * right.buffer[7] + left.buffer[14] * right.buffer[11] + left.buffer[15] * right.buffer[15];
        return m;
    }
    Multiply(other) {
        let m = this.buffer;
        let n = other.buffer;
        let a0 = m[0] * n[0] + m[1] * n[4] + m[2] * n[8] + m[3] * n[12];
        let a1 = m[0] * n[1] + m[1] * n[5] + m[2] * n[9] + m[3] * n[13];
        let a2 = m[0] * n[2] + m[1] * n[6] + m[2] * n[10] + m[3] * n[14];
        let a3 = m[0] * n[3] + m[1] * n[7] + m[2] * n[11] + m[3] * n[15];
        let a4 = m[4] * n[0] + m[5] * n[4] + m[6] * n[8] + m[7] * n[12];
        let a5 = m[4] * n[1] + m[5] * n[5] + m[6] * n[9] + m[7] * n[13];
        let a6 = m[4] * n[2] + m[5] * n[6] + m[6] * n[10] + m[7] * n[14];
        let a7 = m[4] * n[3] + m[5] * n[7] + m[6] * n[11] + m[7] * n[15];
        let a8 = m[8] * n[0] + m[9] * n[4] + m[10] * n[8] + m[11] * n[12];
        let a9 = m[8] * n[1] + m[9] * n[5] + m[10] * n[9] + m[11] * n[13];
        let a10 = m[8] * n[2] + m[9] * n[6] + m[10] * n[10] + m[11] * n[14];
        let a11 = m[8] * n[3] + m[9] * n[7] + m[10] * n[11] + m[11] * n[15];
        let a12 = m[12] * n[0] + m[13] * n[4] + m[14] * n[8] + m[15] * n[12];
        let a13 = m[12] * n[1] + m[13] * n[5] + m[14] * n[9] + m[15] * n[13];
        let a14 = m[12] * n[2] + m[13] * n[6] + m[14] * n[10] + m[15] * n[14];
        let a15 = m[12] * n[3] + m[13] * n[7] + m[14] * n[11] + m[15] * n[15];
        m[0] = a0;
        m[1] = a1;
        m[2] = a2;
        m[3] = a3;
        m[4] = a4;
        m[5] = a5;
        m[6] = a6;
        m[7] = a7;
        m[8] = a8;
        m[9] = a9;
        m[10] = a10;
        m[11] = a11;
        m[12] = a12;
        m[13] = a13;
        m[14] = a14;
        m[15] = a15;
        this.buffer = m;
    }
    Add(other) {
        for (let i = 0; i < Matrix4.LENGTH; i++) {
            this.buffer[i] += other.buffer[i];
        }
    }
    Subtract(other) {
        for (let i = 0; i < Matrix4.LENGTH; i++) {
            this.buffer[i] -= other.buffer[i];
        }
    }
    Scalar(scalar) {
        for (let i = 0; i < Matrix4.LENGTH; i++) {
            this.buffer[i] *= scalar;
        }
    }
    static Identity() {
        let m = new Matrix4();
        m.buffer[0] = 1;
        m.buffer[5] = 1;
        m.buffer[10] = 1;
        m.buffer[15] = 1;
        return m;
    }
    static LookAt(eye, center, up) {
        let m = new Matrix4();
        let f = Vector3.Normalize(Vector3.Subtract(center, eye));
        let s = Vector3.Normalize(Vector3.Cross(f, up));
        let u = Vector3.Cross(s, f);
        m.buffer[0] = s.x;
        m.buffer[1] = u.x;
        m.buffer[2] = -f.x;
        m.buffer[3] = 0;
        m.buffer[4] = s.y;
        m.buffer[5] = u.y;
        m.buffer[6] = -f.y;
        m.buffer[7] = 0;
        m.buffer[8] = s.z;
        m.buffer[9] = u.z;
        m.buffer[10] = -f.z;
        m.buffer[11] = 0;
        m.buffer[12] = -Vector3.Dot(s, eye);
        m.buffer[13] = -Vector3.Dot(u, eye);
        m.buffer[14] = Vector3.Dot(f, eye);
        m.buffer[15] = 1;
        return m;
    }
    static Perspective(angle, aspect, near, far) {
        let m = new Matrix4();
        const f = 1.0 / Math.tan(angle / 2);
        const rangeInv = 1 / (near - far);
        m.buffer[0] = f / aspect;
        m.buffer[5] = f;
        m.buffer[10] = (far + near) * rangeInv;
        m.buffer[11] = -1;
        m.buffer[14] = far * near * rangeInv * 2;
        return m;
    }
    static Viewport(x, y, width, height, depth) {
        let m = new Matrix4();
        m.buffer[0] = width / 2;
        m.buffer[3] = x + width / 2;
        m.buffer[5] = height / 2;
        m.buffer[7] = y + height / 2;
        m.buffer[10] = depth / 2;
        m.buffer[11] = depth / 2;
        m.buffer[15] = 1;
        return m;
    }
    static RotationX(angle) {
        let m = Matrix4.Identity();
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        m.buffer[5] = c;
        m.buffer[6] = s;
        m.buffer[9] = -s;
        m.buffer[10] = c;
        return m;
    }
    RotateX(angle) {
        let m = Matrix4.RotationX(angle);
        m.Multiply(this);
        this.buffer = m.buffer;
    }
    RotateY(angle) {
        let m = Matrix4.RotationY(angle);
        m.Multiply(this);
        this.buffer = m.buffer;
    }
    RotateZ(angle) {
        let m = Matrix4.RotationZ(angle);
        m.Multiply(this);
        this.buffer = m.buffer;
    }
    RotateAxis(axis, angle) {
        let m = Matrix4.RotationAxis(axis, angle);
        m.Multiply(this);
        this.buffer = m.buffer;
    }
    static RotationY(angle) {
        let m = Matrix4.Identity();
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        m.buffer[0] = c;
        m.buffer[2] = -s;
        m.buffer[8] = s;
        m.buffer[10] = c;
        return m;
    }
    static RotationZ(angle) {
        let m = Matrix4.Identity();
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        m.buffer[0] = c;
        m.buffer[1] = s;
        m.buffer[4] = -s;
        m.buffer[5] = c;
        return m;
    }
    static RotationAxis(axis, angle) {
        let m = Matrix4.Identity();
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let t = 1 - c;
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        m.buffer[0] = t * x * x + c;
        m.buffer[1] = t * x * y + s * z;
        m.buffer[2] = t * x * z - s * y;
        m.buffer[4] = t * x * y - s * z;
        m.buffer[5] = t * y * y + c;
        m.buffer[6] = t * y * z + s * x;
        m.buffer[8] = t * x * z + s * y;
        m.buffer[9] = t * y * z - s * x;
        m.buffer[10] = t * z * z + c;
        return m;
    }
    static Translation(x, y, z) {
        let m = Matrix4.Identity();
        m.buffer[3] = x;
        m.buffer[7] = y;
        m.buffer[11] = z;
        return m;
    }
    Translate(x, y, z) {
        this.buffer[3] += x;
        this.buffer[7] += y;
        this.buffer[11] += z;
    }
    static MultiplyAll(matrices) {
        if (matrices.length === 0) {
            throw new Error("No matrices provided.");
        }
        let result = Matrix4.Identity();
        for (let i = 0; i < matrices.length; i++) {
            result.Multiply(matrices[i]);
        }
        return result;
    }
    MultiplyChain(other) {
        this.Multiply(other);
        return this;
    }
    static FromQuaternion(q) {
        const qn = Quaternion.Normalize(q);
        const x = qn.x, y = qn.y, z = qn.z, w = qn.w;
        const xx = x * x;
        const xy = x * y;
        const xz = x * z;
        const xw = x * w;
        const yy = y * y;
        const yz = y * z;
        const yw = y * w;
        const zz = z * z;
        const zw = z * w;
        return new Matrix4(new Float32Array([
            1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0,
            2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0,
            2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0,
            0, 0, 0, 1
        ]));
    }
}
export class Matrix3 extends Matrix {
    constructor(buffer) {
        if (buffer) {
            if (buffer.length != Matrix3.LENGTH) {
                throw new Error('mat3 must be 3x3');
            }
            super(buffer);
        }
        else {
            super(new Float32Array(Matrix3.LENGTH));
        }
        this.row = 3;
        this.col = 3;
    }
    static LENGTH = 9;
    get Delta() {
        let m = this.buffer;
        let a0 = m[0] * m[4] - m[1] * m[3];
        let a1 = m[0] * m[5] - m[2] * m[3];
        let a2 = m[1] * m[5] - m[2] * m[4];
        return a0 * a2 - a1 * a1;
    }
    Invert() {
        let m = this.buffer;
        let a0 = m[0] * m[4] - m[1] * m[3];
        let a1 = m[0] * m[5] - m[2] * m[3];
        let a2 = m[1] * m[5] - m[2] * m[4];
        let det = a0 * a2 - a1 * a1;
        if (det == 0)
            throw new Error('matrix is not invertible');
        let m1 = new Float32Array(9);
        let detInv = 1 / det;
        m1[0] = a2 * detInv;
        m1[1] = -m[1] * m[5] * detInv;
        m1[2] = m[1] * detInv;
        m1[3] = -a1 * detInv;
        m1[4] = m[0] * m[5] * detInv;
        m1[5] = -m[0] * detInv;
        m1[6] = m[3] * m[2] * detInv;
        m1[7] = -m[3] * m[0] * detInv;
        m1[8] = m[0] * m[4] * detInv;
        let result = new Matrix3(m1);
        return result;
    }
    static FromArray(arr) {
        return new Matrix3(new Float32Array(arr));
    }
    static Identity() {
        let m = new Matrix3();
        m.buffer[0] = 1;
        m.buffer[4] = 1;
        m.buffer[8] = 1;
        return m;
    }
    static Multiply(left, right) {
        let m = new Matrix3();
        m.buffer[0] = left.buffer[0] * right.buffer[0] + left.buffer[1] * right.buffer[3] + left.buffer[2] * right.buffer[6];
        m.buffer[1] = left.buffer[0] * right.buffer[1] + left.buffer[1] * right.buffer[4] + left.buffer[2] * right.buffer[7];
        m.buffer[2] = left.buffer[0] * right.buffer[2] + left.buffer[1] * right.buffer[5] + left.buffer[2] * right.buffer[8];
        m.buffer[3] = left.buffer[3] * right.buffer[0] + left.buffer[4] * right.buffer[3] + left.buffer[5] * right.buffer[6];
        m.buffer[4] = left.buffer[3] * right.buffer[1] + left.buffer[4] * right.buffer[4] + left.buffer[5] * right.buffer[7];
        m.buffer[5] = left.buffer[3] * right.buffer[2] + left.buffer[4] * right.buffer[5] + left.buffer[5] * right.buffer[8];
        m.buffer[6] = left.buffer[6] * right.buffer[0] + left.buffer[7] * right.buffer[3] + left.buffer[8] * right.buffer[6];
        m.buffer[7] = left.buffer[6] * right.buffer[1] + left.buffer[7] * right.buffer[4] + left.buffer[8] * right.buffer[7];
        m.buffer[8] = left.buffer[6] * right.buffer[2] + left.buffer[7] * right.buffer[5] + left.buffer[8] * right.buffer[8];
        return m;
    }
    Multiply(other) {
        let m = this.buffer;
        let n = other.buffer;
        let a0 = m[0] * n[0] + m[1] * n[3] + m[2] * n[6];
        let a1 = m[0] * n[1] + m[1] * n[4] + m[2] * n[7];
        let a2 = m[0] * n[2] + m[1] * n[5] + m[2] * n[8];
        let a3 = m[3] * n[0] + m[4] * n[3] + m[5] * n[6];
        let a4 = m[3] * n[1] + m[4] * n[4] + m[5] * n[7];
        let a5 = m[3] * n[2] + m[4] * n[5] + m[5] * n[8];
        let a6 = m[6] * n[0] + m[7] * n[3] + m[8] * n[6];
        let a7 = m[6] * n[1] + m[7] * n[4] + m[8] * n[7];
        let a8 = m[6] * n[2] + m[7] * n[5] + m[8] * n[8];
        m[0] = a0;
        m[1] = a1;
        m[2] = a2;
        m[3] = a3;
        m[4] = a4;
        m[5] = a5;
        m[6] = a6;
        m[7] = a7;
        m[8] = a8;
        this.buffer = m;
    }
    Add(other) {
        for (let i = 0; i < Matrix3.LENGTH; i++) {
            this.buffer[i] += other.buffer[i];
        }
    }
    Subtract(other) {
        for (let i = 0; i < Matrix3.LENGTH; i++) {
            this.buffer[i] -= other.buffer[i];
        }
    }
    Scalar(scalar) {
        for (let i = 0; i < Matrix3.LENGTH; i++) {
            this.buffer[i] *= scalar;
        }
    }
    Translate(x, y) {
        this.buffer[6] += x;
        this.buffer[7] += y;
    }
    RotateX(angle) {
        let m = Matrix3.RotationX(angle);
        m.Multiply(this);
        this.buffer = m.buffer;
    }
    RotateY(angle) {
        let m = Matrix3.RotationY(angle);
        m.Multiply(this);
        this.buffer = m.buffer;
    }
    RotateAxis(axis, angle) {
        let m = Matrix3.RotationAxis(axis, angle);
        m.Multiply(this);
        this.buffer = m.buffer;
    }
    static RotationX(angle) {
        let m = Matrix3.Identity();
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        m.buffer[4] = c;
        m.buffer[5] = s;
        m.buffer[7] = -s;
        m.buffer[8] = c;
        return m;
    }
    static RotationY(angle) {
        let m = Matrix3.Identity();
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        m.buffer[0] = c;
        m.buffer[2] = -s;
        m.buffer[6] = s;
        m.buffer[8] = c;
        return m;
    }
    static RotationAxis(axis, angle) {
        let m = Matrix3.Identity();
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let t = 1 - c;
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        m.buffer[0] = t * x * x + c;
        m.buffer[1] = t * x * y + s * z;
        m.buffer[2] = t * x * z - s * y;
        m.buffer[3] = t * x * y - s * z;
        m.buffer[4] = t * y * y + c;
        m.buffer[5] = t * y * z + s * x;
        m.buffer[6] = t * x * z + s * y;
        m.buffer[7] = t * y * z - s * x;
        m.buffer[8] = t * z * z + c;
        return m;
    }
    static Translation(x, y) {
        let m = this.Identity();
        m.buffer[6] = x;
        m.buffer[7] = y;
        return m;
    }
    static Scale(x, y) {
        let m = this.Identity();
        m.buffer[0] = x;
        m.buffer[4] = y;
        return m;
    }
    static MultiplyAll(matrices) {
        if (matrices.length === 0) {
            throw new Error("No matrices provided.");
        }
        let result = Matrix3.Identity();
        for (let i = 0; i < matrices.length; i++) {
            result.Multiply(matrices[i]);
        }
        return result;
    }
}
export class Quaternion {
    buffer;
    constructor(x = 0, y = 0, z = 0, w = 1) {
        if (x instanceof Float32Array) {
            this.buffer = new Float32Array(4);
            this.buffer.set(x.slice(0, 4));
        }
        else {
            this.buffer = new Float32Array([x, y, z, w]);
        }
    }
    get x() { return this.buffer[0]; }
    set x(value) { this.buffer[0] = value; }
    get y() { return this.buffer[1]; }
    set y(value) { this.buffer[1] = value; }
    get z() { return this.buffer[2]; }
    set z(value) { this.buffer[2] = value; }
    get w() { return this.buffer[3]; }
    set w(value) { this.buffer[3] = value; }
    static Identity() {
        return new Quaternion(0, 0, 0, 1);
    }
    static FromXYZW(x, y, z, w) {
        return new Quaternion(x, y, z, w);
    }
    static FromAxisAngle(axis, angle) {
        const norm = Vector3.Normalize(axis);
        const halfAngle = angle * 0.5;
        const s = Math.sin(halfAngle);
        const c = Math.cos(halfAngle);
        return new Quaternion(norm.x * s, norm.y * s, norm.z * s, c);
    }
    static FromEulerAngles(x, y, z) {
        const cx = Math.cos(x * 0.5);
        const cy = Math.cos(y * 0.5);
        const cz = Math.cos(z * 0.5);
        const sx = Math.sin(x * 0.5);
        const sy = Math.sin(y * 0.5);
        const sz = Math.sin(z * 0.5);
        return new Quaternion(cx * cy * sz - sx * sy * cz, cx * sy * cz + sx * cy * sz, sx * cy * cz - cx * sy * sz, cx * cy * cz + sx * sy * sz);
    }
    static Length(q) {
        return Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    }
    static Normalize(q) {
        const len = Quaternion.Length(q);
        if (len < 1e-8) {
            return Quaternion.Identity();
        }
        const invLen = 1.0 / len;
        return new Quaternion(q.x * invLen, q.y * invLen, q.z * invLen, q.w * invLen);
    }
    static Conjugate(q) {
        return new Quaternion(-q.x, -q.y, -q.z, q.w);
    }
    static Inverse(q) {
        const lenSq = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
        if (Math.abs(lenSq - 1.0) < 1e-8) {
            return Quaternion.Conjugate(q);
        }
        const invLenSq = 1.0 / lenSq;
        return new Quaternion(-q.x * invLenSq, -q.y * invLenSq, -q.z * invLenSq, q.w * invLenSq);
    }
    static Multiply(a, b) {
        return new Quaternion(a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y, a.w * b.y + a.y * b.w + a.z * b.x - a.x * b.z, a.w * b.z + a.z * b.w + a.x * b.y - a.y * b.x, a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z);
    }
    static Slerp(a, b, t) {
        t = Math.max(0, Math.min(1, t));
        let cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        if (cosHalfTheta < 0) {
            b = new Quaternion(-b.x, -b.y, -b.z, -b.w);
            cosHalfTheta = -cosHalfTheta;
        }
        if (cosHalfTheta > 0.9999) {
            return new Quaternion(a.x + t * (b.x - a.x), a.y + t * (b.y - a.y), a.z + t * (b.z - a.z), a.w + t * (b.w - a.w));
        }
        const halfTheta = Math.acos(cosHalfTheta);
        const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        return new Quaternion(a.x * ratioA + b.x * ratioB, a.y * ratioA + b.y * ratioB, a.z * ratioA + b.z * ratioB, a.w * ratioA + b.w * ratioB);
    }
    static ToMatrix4(q) {
        const qn = Quaternion.Normalize(q);
        const x = qn.x, y = qn.y, z = qn.z, w = qn.w;
        const xx = x * x;
        const xy = x * y;
        const xz = x * z;
        const xw = x * w;
        const yy = y * y;
        const yz = y * z;
        const yw = y * w;
        const zz = z * z;
        const zw = z * w;
        return new Matrix4(new Float32Array([
            1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0,
            2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0,
            2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0,
            0, 0, 0, 1
        ]));
    }
    static FromMatrix4(m) {
        const mat = m.buffer;
        const m00 = mat[0], m11 = mat[5], m22 = mat[10];
        const trace = m00 + m11 + m22;
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);
            return new Quaternion((mat[9] - mat[6]) * s, (mat[2] - mat[8]) * s, (mat[4] - mat[1]) * s, 0.25 / s);
        }
        else if (m00 > m11 && m00 > m22) {
            const s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
            return new Quaternion(0.25 * s, (mat[4] + mat[1]) / s, (mat[2] + mat[8]) / s, (mat[9] - mat[6]) / s);
        }
        else if (m11 > m22) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
            return new Quaternion((mat[4] + mat[1]) / s, 0.25 * s, (mat[9] + mat[6]) / s, (mat[2] - mat[8]) / s);
        }
        else {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
            return new Quaternion((mat[2] + mat[8]) / s, (mat[9] + mat[6]) / s, 0.25 * s, (mat[4] - mat[1]) / s);
        }
    }
}
