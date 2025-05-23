/**
 * Synario WebGPU Graphics Library
 * @file gmath.ts
 * @description 图形数学库
 * @author Synario Team
 */
/**
 * Mathematical constant PI.
 * @constant {number}
 */
export const PI: number = Math.PI;

/**
 * Byte size of a 4x4 matrix of floats.
 * @constant {number}
 */
export const MATRIX4F_SIZE: number = 4 * 4 * 4;

/**
 * Byte size of a 3x3 matrix of floats.
 * @constant {number}
 */
export const MATRIX3F_SIZE: number = 3 * 3 * 4;

/**
 * Class representing a generic vector.
 * @class
 */
export class Vector {
  buffer: Float32Array;
  /**
   * Creates a new Vector.
   * @constructor
   * @param {Float32Array} buffer - The numeric values of the vector.
   */
  constructor(buffer: Float32Array) {
    this.buffer = buffer;
  }
  /**
   * Returns a string representation of this vector.
   * @returns {string} String representation.
   */
  ToString(): string {
    return `[${this.buffer.join(',')}]`;
  }
  get x(): number { return this.buffer[0]; }
  get y(): number { return this.buffer[1]; }
  get z(): number { return this.buffer[2]; }
  get w(): number { return this.buffer[3]; }
  set x(value: number) { this.buffer[0] = value; }
  set y(value: number) { this.buffer[1] = value; }
  set z(value: number) { this.buffer[2] = value; }
  set w(value: number) { this.buffer[3] = value; }
  //
  get r(): number { return this.buffer[0]; }
  get g(): number { return this.buffer[1]; }
  get b(): number { return this.buffer[2]; }
  get a(): number { return this.buffer[3]; }
  set r(value: number) { this.buffer[0] = value; }
  set g(value: number) { this.buffer[1] = value; }
  set b(value: number) { this.buffer[2] = value; }
  set a(value: number) { this.buffer[3] = value; }
  /**
   * Checks if the current vector is equal to vector v.
   * @param {Vector} v - The vector to compare.
   * @returns {boolean} True if equal.
   */
  Equals(v: Vector): boolean {
    let result: boolean = false;
    switch (this.buffer.length) {
      case 2: result = this.x == v.x && this.y == v.y; break;
      case 3: result = this.x == v.x && this.y == v.y && this.z == v.z; break;
      case 4: result = this.x == v.x && this.y == v.y && this.z == v.z && this.w == v.w; break;
    }
    return result;
  }
  /**
   * Resets the vector values.
   * @param {...number} values - New value(s); order: x, y, z, w.
   */
  Reset(...values: number[]): void {
    for (let i = 0; i < values.length; i++) {
      this.buffer[i] = values[i];
    }
  }
  //virtual len
  get len(): number {
    return -1;
  }
  /**
   * Returns the length of the vector.
   * @returns {number} Vector length.
   */
  Length(): number {
    let sum = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      sum += this.buffer[i] ** 2;
    }
    return Math.sqrt(sum);
  }
  /**
   * Normalizes the vector.
   */
  Normalize(): void {
    let l = this.Length();
    for (let i = 0; i < this.buffer.length; i++) {
      this.buffer[i] /= l;
    }
  }
  /**
   * Clones this vector.
   * @returns {TVector} A new vector with the same values.
   * @template TVector
   */
  Clone<TVector extends Vector>(): TVector {
    let len = this.buffer.length;
    let newBuffer = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      newBuffer[i] = this.buffer[i];
    }
    let result: unknown;
    switch (len) {
      case 2: result = new Vector2(newBuffer); break;
      case 3: result = new Vector3(newBuffer); break;
      case 4: result = new Vector4(newBuffer); break;
      default: throw new Error('vector length must be 2,3 or 4');
    }
    return <TVector>result;
  }
  /**
   * Creates a new 2D vector from x and y.
   * @param {number} x The x value.
   * @param {number} y The y value.
   * @returns {Vector2} A new 2D vector.
   */
  static FromXY(x: number, y: number): Vector2 {
    return new Vector2(new Float32Array([x, y]));
  }
  /**
   * Creates a new 3D vector from x, y, and z.
   * @param {number} x The x value.
   * @param {number} y The y value.
   * @param {number} z The z value.
   * @returns {Vector3} A new 3D vector.
   */
  static FromXYZ(x: number, y: number, z: number): Vector3 {
    return new Vector3(new Float32Array([x, y, z]));
  }
  /**
   * Creates a new 4D vector from x, y, z, and w.
   * @param {number} x The x value.
   * @param {number} y The y value.
   * @param {number} z The z value.
   * @param {number} w The w value.
   * @returns {Vector4} A new 4D vector.
   */
  static FromXYZW(x: number, y: number, z: number, w: number): Vector4 {
    return new Vector4(new Float32Array([x, y, z, w]));
  }
  /**
   * Creates a new 3D vector from r, g, and b.
   * @param {number} r The red value.
   * @param {number} g The green value.
   * @param {number} b The blue value.
   * @returns {Vector3} A new 3D vector.
   */
  static FromRGB(r: number, g: number, b: number): Vector3 {
    return new Vector3(new Float32Array([r, g, b]));
  }
  /**
   * Creates a new 4D vector from r, g, b, and a.
   * @param {number} r The red value.
   * @param {number} g The green value.
   * @param {number} b The blue value.
   * @param {number} a The alpha value.
   * @returns {Vector4} A new 4D vector.
   */
  static FromRGBA(r: number, g: number, b: number, a: number): Vector4 {
    return new Vector4(new Float32Array([r, g, b, a]));
  }
  //from array
  static FromArray<TVector extends Vector>(arr: number[]): TVector {
    let len = arr.length;
    let newBuffer = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      newBuffer[i] = arr[i];
    }
    let result: unknown;
    switch (len) {
      case 2: result = new Vector2(newBuffer); break;
      case 3: result = new Vector3(newBuffer); break;
      case 4: result = new Vector4(newBuffer); break;
      default: throw new Error('vector length must be 2,3 or 4');
    }
    return <TVector>result;
  }
  /**
   * Computes the dot product of two vectors.
   * @param {Vector} a - The first operand.
   * @param {Vector} b - The second operand.
   * @returns {number} The dot product.
   */
  static Dot(a: Vector, b: Vector): number {
    let sum = 0;
    for (let i = 0; i < a.buffer.length; i++) {
      sum += a.buffer[i] * b.buffer[i];
    }
    return sum;
  }
  /**
   * Checks equality with tolerance.
   * @param {Vector} v - The vector to compare.
   * @param {number} [epsilon=0.000001] Tolerance value.
   * @returns {boolean} True if approximately equal.
   */
  EqualsTolerance(v: Vector, epsilon: number = 0.000001): boolean {
    if (this.buffer.length !== v.buffer.length)
      return false;
    for (let i = 0; i < this.buffer.length; i++) {
      if (Math.abs(this.buffer[i] - v.buffer[i]) > epsilon)
        return false;
    }
    return true;
  }
  /**
   * Computes the perpendicular vector for a 2D vector.
   * @param {Vector2} a - Input 2D vector.
   * @returns {Vector2} The perpendicular vector (-a.y, a.x).
   */
  static Perpendicular(a: Vector2): Vector2 {
    return new Vector2(new Float32Array([-a.y, a.x]));
  }  
  //add
  static Add(a: Vector, b: Vector): Vector {
    let result = new Float32Array(a.buffer.length);
    for (let i = 0; i < a.buffer.length; i++) {
      result[i] = a.buffer[i] + b.buffer[i];
    }
    return new Vector(result);
  }
  //subtract
  static Subtract(a: Vector, b: Vector): Vector {
    let result = new Float32Array(a.buffer.length);
    for (let i = 0; i < a.buffer.length; i++) {
      result[i] = a.buffer[i] - b.buffer[i];
    }
    return new Vector(result);
  }
  //normalize
  static Normalize(v: Vector): Vector {
    let result = new Float32Array(v.buffer.length);
    let l = v.Length();
    for (let i = 0; i < v.buffer.length; i++) {
      result[i] = v.buffer[i] / l;
    }
    return new Vector(result);
  }

}

/**
 * Class representing a 2D vector.
 * @extends Vector
 */
export class Vector2 extends Vector {
  /**
   * Creates a new 2D vector.
   * @constructor
   * @param {Float32Array} [buffer] - Optional buffer.
   * @throws {Error} If buffer length is not 2.
   */
  constructor(buffer?: Float32Array) {
    if (buffer) {
      if (buffer.length != Vector2.len) {
        throw new Error('vec2 must be 2d');
      }
      super(buffer);
    } else {
      super(new Float32Array(Vector2.len));
    }
  }
  /** @static */
  static len: number = 2;
  //zero
  static Zero(): Vector2 {
    return new Vector2(new Float32Array([0, 0]));
  }
  //one
  static One(): Vector2 {
    return new Vector2(new Float32Array([1, 1]));
  }
  //abs
  Abs(): Vector2 {
    return new Vector2(new Float32Array([Math.abs(this.x), Math.abs(this.y)]));
  }
  //negate
  Negate(): Vector2 {
    return new Vector2(new Float32Array([-this.x, -this.y]));
  }
  //sum
  Sum(): number {
    return this.x + this.y;
  }
  //average
  Average(): number {
    return (this.x + this.y) / 2;
  }
  /**
   * Calculates the Euclidean distance between two 2D vectors.
   * @param {Vector2} a - First vector.
   * @param {Vector2} b - Second vector.
   * @returns {number} The distance.
   */
  static Distance(a: Vector2, b: Vector2): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  }
  /**
   * Linearly interpolates between two 2D vectors.
   * @param {Vector2} a - The start vector.
   * @param {Vector2} b - The end vector.
   * @param {number} t - The interpolation factor (0 to 1).
   * @returns {Vector2} The interpolated vector.
   */
  static Lerp(a: Vector2, b: Vector2, t: number): Vector2 {
    return new Vector2(new Float32Array([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t]));
  }

  /**
   * Multiplies a vector by a scalar.
   * @param {Vector2} v - The vector.
   * @param {number} scalar - The scalar value.
   * @returns {Vector2} The scaled vector.
   */
  static MultiplyScalar(v: Vector2, scalar: number): Vector2 {
    return new Vector2(new Float32Array([v.x * scalar, v.y * scalar]));
  }
  /**
   * Transforms a 2D vector by a 3x3 matrix.
   * @param {Matrix3} left - The transformation matrix.
   * @param {Vector2} x - The vector to transform.
   * @returns {Vector2} The transformed vector.
   */
  static Transform(left: Matrix3, x: Vector2): Vector2 {
    let temp = [...x.buffer, 1];
    let result = new Vector3();
    result.x = left.buffer[0] * temp[0] + left.buffer[1] * temp[1] + left.buffer[2] * temp[2];
    result.y = left.buffer[3] * temp[0] + left.buffer[4] * temp[1] + left.buffer[5] * temp[2];
    result.z = left.buffer[6] * temp[0] + left.buffer[7] * temp[1] + left.buffer[8] * temp[2];
    result.x /= result.z; result.y /= result.z;
    return new Vector2(result.buffer.subarray(0, 2));
  }
}

/**
 * Class representing a 3D vector.
 * @extends Vector
 */
export class Vector3 extends Vector {
  /**
   * Creates a new 3D vector.
   * @constructor
   * @param {Float32Array} [buffer] - Optional buffer.
   * @throws {Error} If buffer length is not 3.
   */
  constructor(buffer?: Float32Array) {
    if (buffer) {
      if (buffer.length != Vector3.len) {
        throw new Error('vec3 must be 3d');
      }
      super(buffer);
    } else {
      super(new Float32Array(Vector3.len));
    }
  }
  /** @static */
  static len: number = 3;
  //zero
  static Zero(): Vector3 {
    return new Vector3(new Float32Array([0, 0, 0]));
  }
  //one
  static One(): Vector3 {
    return new Vector3(new Float32Array([1, 1, 1]));
  }
  //abs
  Abs(): Vector3 {
    return new Vector3(new Float32Array([Math.abs(this.x), Math.abs(this.y), Math.abs(this.z)]));
  }
  //negate
  Negate(): Vector3 {
    return new Vector3(new Float32Array([-this.x, -this.y, -this.z]));
  }
  //sum
  Sum(): number {
    return this.x + this.y + this.z;
  }
  //average
  Average(): number {
    return (this.x + this.y + this.z) / 3;
  }
  /**
   * Computes the cross product of two 3D vectors.
   * @param {Vector3} a - The first operand.
   * @param {Vector3} b - The second operand.
   * @returns {Vector3} The cross product.
   */
  static Cross(a: Vector3, b: Vector3): Vector3 {
    return new Vector3(new Float32Array([a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x]));
  }
  /**
   * Calculates the Euclidean distance between two 3D vectors.
   * @param {Vector3} a - First vector.
   * @param {Vector3} b - Second vector.
   * @returns {number} The distance.
   */
  static Distance(a: Vector3, b: Vector3): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
  }
  /**
   * Linearly interpolates between two 3D vectors.
   * @param {Vector3} a - The start vector.
   * @param {Vector3} b - The end vector.
   * @param {number} t - The interpolation factor (0 to 1).
   * @returns {Vector3} The interpolated vector.
   * @throws {Error} If t is not between 0 and 1.
   */
  static Lerp(a: Vector3, b: Vector3, t: number): Vector3 {
    if (t < 0 || t > 1) throw new Error('t must be between 0 and 1');
    return new Vector3(new Float32Array([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t]));
  }
  /**
   * Transforms a 3D vector by a 4x4 matrix.
   * @param {Matrix4} left - The transformation matrix.
   * @param {Vector3} x - The vector to transform.
   * @returns {Vector3} The transformed vector.
   */
  static Transform(left: Matrix4, x: Vector3): Vector3 {
    let temp = [...x.buffer, 1];
    let v4 = new Vector4(new Float32Array(temp));
    let _temp = Vector4.Transform(left, v4);
    _temp.x /= _temp.w; _temp.y /= _temp.w; _temp.z /= _temp.w;
    return new Vector3(_temp.buffer.subarray(0, 3));
  }
  /**
   * Returns a forward unit vector.
   * @returns {Vector3} The forward vector.
   */
  static GetForward(): Vector3 {
    return new Vector3(new Float32Array([0, 0, 1]));
  }
  /**
   * Returns a backward unit vector.
   * @returns {Vector3} The backward vector.
   */
  static GetBack(): Vector3 {
    return new Vector3(new Float32Array([0, 0, -1]));
  }
  /**
   * Returns an upward unit vector.
   * @returns {Vector3} The upward vector.
   */
  static GetUp(): Vector3 {
    return new Vector3(new Float32Array([0, 1, 0]));
  }
  /**
   * Returns a downward unit vector.
   * @returns {Vector3} The downward vector.
   */
  static GetDown(): Vector3 {
    return new Vector3(new Float32Array([0, -1, 0]));
  }
  /**
   * Returns a rightward unit vector.
   * @returns {Vector3} The rightward vector.
   */
  static GetRight(): Vector3 {
    return new Vector3(new Float32Array([1, 0, 0]));
  }
  /**
   * Returns a leftward unit vector.
   * @returns {Vector3} The leftward vector.
   */
  static GetLeft(): Vector3 {
    return new Vector3(new Float32Array([-1, 0, 0]));
  }
}

/**
 * Class representing a 4D vector.
 * @extends Vector
 */
export class Vector4 extends Vector {
  /**
   * Creates a new 4D vector.
   * @constructor
   * @param {Float32Array} [buffer] - Optional buffer.
   * @throws {Error} If buffer length is not 4.
   */
  constructor(buffer?: Float32Array) {
    if (buffer) {
      if (buffer.length != Vector4.len) {
        throw new Error('vec4 must be 4d');
      }
      super(buffer);
    } else {
      super(new Float32Array(Vector4.len));
    }
  }
  /** @static */
  static len: number = 4;
  //zero
  static Zero(): Vector4 {
    return new Vector4(new Float32Array([0, 0, 0, 0]));
  }
  //one
  static One(): Vector4 {
    return new Vector4(new Float32Array([1, 1, 1, 1]));
  }
  //abs
  Abs(): Vector4 {
    return new Vector4(new Float32Array([Math.abs(this.x), Math.abs(this.y), Math.abs(this.z), Math.abs(this.w)]));
  }
  //negate
  Negate(): Vector4 {
    return new Vector4(new Float32Array([-this.x, -this.y, -this.z, -this.w]));
  }
  //sum
  Sum(): number {
    return this.x + this.y + this.z + this.w;
  }
  //average
  Average(): number {
    return (this.x + this.y + this.z + this.w) / 4;
  }
  /**
   * Calculates the Euclidean distance between two 4D vectors.
   * @param {Vector4} a - First vector.
   * @param {Vector4} b - Second vector.
   * @returns {number} The distance.
   */
  static Distance(a: Vector4, b: Vector4): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 + (a.w - b.w) ** 2);
  }
  /**
   * Linearly interpolates between two 4D vectors.
   * @param {Vector4} a - The start vector.
   * @param {Vector4} b - The end vector.
   * @param {number} t - The interpolation factor (0 to 1).
   * @returns {Vector4} The interpolated vector.
   */
  static Lerp(a: Vector4, b: Vector4, t: number): Vector4 {
    return new Vector4(new Float32Array([a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t, a.w + (b.w - a.w) * t]));
  }
  /**
   * Transforms this vector by a 4x4 matrix.
   * @param {Matrix4} left - The transformation matrix.
   * @param {Vector4} x - The vector to transform.
   * @returns {Vector4} The transformed vector.
   */
  static Transform(left: Matrix4, x: Vector4): Vector4 {
    let result = new Vector4();
    result.x = left.buffer[0] * x.x + left.buffer[1] * x.y + left.buffer[2] * x.z + left.buffer[3] * x.w;
    result.y = left.buffer[4] * x.x + left.buffer[5] * x.y + left.buffer[6] * x.z + left.buffer[7] * x.w;
    result.z = left.buffer[8] * x.x + left.buffer[9] * x.y + left.buffer[10] * x.z + left.buffer[11] * x.w;
    result.w = left.buffer[12] * x.x + left.buffer[13] * x.y + left.buffer[14] * x.z + left.buffer[15] * x.w;
    return result;
  }
}

/**
 * Base class for matrix types.
 * @class
 */
export class Matrix {
  buffer: Float32Array;
  row: number;
  col: number;
  static length: number;
  /**
   * Creates a new Matrix instance.
   * @constructor
   * @param {Float32Array} buffer - The underlying data buffer.
   */
  constructor(buffer: Float32Array) {
    this.buffer = buffer;
  }
  /**
   * Returns a string representation of the matrix.
   * @returns {string} The matrix as a comma-separated string.
   */
  ToString(): string {
    return this.buffer.join(',');
  }
  /**
   * Gets the value at the specified row and column.
   * @param {number} row - The row index.
   * @param {number} col - The column index.
   * @returns {number} The value at the specified position.
   */
  GetByIndex(row: number, col: number): number {
    return this.buffer[row * this.col + col];
  }
  /**
   * Sets the value at the specified row and column.
   * @param {number} row - The row index.
   * @param {number} col - The column index.
   * @param {number} value - The value to set.
   */
  SetByIndex(row: number, col: number, value: number): void {
    this.buffer[row * this.col + col] = value;
  }
  /**
   * Gets an iterable for the specified row.
   * @param {number} rowNo - The row index.
   * @returns {Iterable<number>} An iterable for the row values.
   */
  *GetRow(rowNo: number): Iterable<number> {
    for (let i = 0; i < this.col; i++) {
      yield this.buffer[rowNo * this.col + i];
    }
  }
  /**
   * Gets an iterable for the specified column.
   * @param {number} colNo - The column index.
   * @returns {Iterable<number>} An iterable for the column values.
   */
  *GetCol(colNo: number): Iterable<number> {
    for (let i = 0; i < this.row; i++) {
      yield this.buffer[i * this.col + colNo];
    }
  }
  /**
   * Gets a row vector.
   * @param {number} rowNo - The row index.
   * @returns {TVector} The row vector.
   * @template TVector
   */
  GetRowVector<TVector extends Vector>(rowNo: number): TVector {
    return <TVector>Vector.FromArray([...this.GetRow(rowNo)]);
  }
  /**
   * Gets a column vector.
   * @param {number} colNo - The column index.
   * @returns {TVector} The column vector.
   * @template TVector
   */
  GetColVector<TVector extends Vector>(colNo: number): TVector {
    return <TVector>Vector.FromArray([...this.GetCol(colNo)]);
  }
  /**
   * Sets a row vector.
   * @param {number} rowNo - The row index.
   * @param {Vector} v - The vector to set.
   */
  SetRow(rowNo: number, v: Vector): void {
    for (let i = 0; i < this.col; i++) {
      this.buffer[rowNo * this.col + i] = v.buffer[i];
    }
  }
  /**
   * Sets a column vector.
   * @param {number} colNo - The column index.
   * @param {Vector} v - The vector to set.
   */
  SetCol(colNo: number, v: Vector): void {
    for (let i = 0; i < this.row; i++) {
      this.buffer[i * this.col + colNo] = v.buffer[i];
    }
  }
  /**
   * Transposes the matrix.
   * @returns {TMatrix} The transposed matrix.
   * @template TMatrix
   */
  Transpose<TMatrix extends Matrix>(): TMatrix {
    let m = new Matrix(new Float32Array(this.buffer));
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        m.buffer[j * this.row + i] = this.buffer[i * this.col + j];
      }
    }
    return <TMatrix>m;
  }
  /**
   * Returns a clone of this matrix.
   * @returns {TMatrix} A clone matrix.
   * @template TMatrix
   */
  Clone<TMatrix extends Matrix>(): TMatrix {
    let len = this.buffer.length;
    let newBuffer = new Float32Array(len);
    for (let i = 0; i < len; i++) {
      newBuffer[i] = this.buffer[i];
    }
    let result: unknown;
    switch (len) {
      case 9: result = new Matrix3(newBuffer); break;
      case 16: result = new Matrix4(newBuffer); break;
      default: throw new Error('matrix length must be 9 or 16');
    }
    return result as TMatrix;
  }
  /**
   * Not implemented inversion method.
   * @throws {Error} Method not implemented.
   */
  Invert<TMatrix extends Matrix>(): TMatrix {
    throw new Error('Method not implemented.');
  }

}

/**
 * Class representing a 4x4 matrix.
 * @extends Matrix
 */
export class Matrix4 extends Matrix {
  /**
   * Creates a new 4x4 matrix.
   * @constructor
   * @param {Float32Array} [buffer] - Optional buffer.
   * @throws {Error} If buffer length is not 16.
   */
  constructor(buffer?: Float32Array) {
    if (buffer) {
      if (buffer.length != Matrix4.LENGTH) {
        throw new Error('mat4 must be 4x4');
      }
      super(buffer);
    } else {
      super(new Float32Array(Matrix4.LENGTH));
    }
    this.row = 4;
    this.col = 4;
  }
  /** @static */
  static readonly LENGTH: number = 16;
  /**
   * Inverts this 4x4 matrix.
   * @returns {TMatrix} The inverted matrix.
   * @throws {Error} If the matrix is not invertible.
   */
  Invert<TMatrix extends Matrix>(): TMatrix {
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
    if (det == 0) throw new Error('matrix is not invertible');
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
    return <TMatrix><unknown>result;
  }
  /**
   * Gets the determinant of this matrix.
   * @readonly
   * @type {number}
   */
  get Delta(): number {
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
  /**
   * Creates a new Matrix4 from an array.
   * @param {number[]} arr - The source array.
   * @returns {Matrix4} The created matrix.
   */
  static FromArray(arr: number[]): Matrix4 {
    return new Matrix4(new Float32Array(arr));
  }
  /**
   * Multiplies two Matrix4 objects.
   * @param {Matrix4} left - The left operand.
   * @param {Matrix4} right - The right operand.
   * @returns {Matrix4} The product matrix.
   */
  static Multiply(left: Matrix4, right: Matrix4): Matrix4 {
    let m = new Matrix4();
    m.buffer[0] = left.buffer[0] * right.buffer[0] + left.buffer[1] * right.buffer[4] + left.buffer[2] * right.buffer[8] + left.buffer[3] * right.buffer[12];
    m.buffer[1] = left.buffer[0] * right.buffer[1] + left.buffer[1] * right.buffer[5] + left.buffer[2] * right.buffer[9] + left.buffer[3] * right.buffer[13];
    m.buffer[2] = left.buffer[0] * right.buffer[2] + left.buffer[1] * right.buffer[6] + left.buffer[2] * right.buffer[10] + left.buffer[3] * right.buffer[14];
    m.buffer[3] = left.buffer[0] * right.buffer[3] + left.buffer[1] * right.buffer[7] + left.buffer[2] * right.buffer[11] + left.buffer[3] * right.buffer[15];
    //
    m.buffer[4] = left.buffer[4] * right.buffer[0] + left.buffer[5] * right.buffer[4] + left.buffer[6] * right.buffer[8] + left.buffer[7] * right.buffer[12];
    m.buffer[5] = left.buffer[4] * right.buffer[1] + left.buffer[5] * right.buffer[5] + left.buffer[6] * right.buffer[9] + left.buffer[7] * right.buffer[13];
    m.buffer[6] = left.buffer[4] * right.buffer[2] + left.buffer[5] * right.buffer[6] + left.buffer[6] * right.buffer[10] + left.buffer[7] * right.buffer[14];
    m.buffer[7] = left.buffer[4] * right.buffer[3] + left.buffer[5] * right.buffer[7] + left.buffer[6] * right.buffer[11] + left.buffer[7] * right.buffer[15];
    //    
    m.buffer[8] = left.buffer[8] * right.buffer[0] + left.buffer[9] * right.buffer[4] + left.buffer[10] * right.buffer[8] + left.buffer[11] * right.buffer[12];
    m.buffer[9] = left.buffer[8] * right.buffer[1] + left.buffer[9] * right.buffer[5] + left.buffer[10] * right.buffer[9] + left.buffer[11] * right.buffer[13];
    m.buffer[10] = left.buffer[8] * right.buffer[2] + left.buffer[9] * right.buffer[6] + left.buffer[10] * right.buffer[10] + left.buffer[11] * right.buffer[14];
    m.buffer[11] = left.buffer[8] * right.buffer[3] + left.buffer[9] * right.buffer[7] + left.buffer[10] * right.buffer[11] + left.buffer[11] * right.buffer[15];
    //
    m.buffer[12] = left.buffer[12] * right.buffer[0] + left.buffer[13] * right.buffer[4] + left.buffer[14] * right.buffer[8] + left.buffer[15] * right.buffer[12];
    m.buffer[13] = left.buffer[12] * right.buffer[1] + left.buffer[13] * right.buffer[5] + left.buffer[14] * right.buffer[9] + left.buffer[15] * right.buffer[13];
    m.buffer[14] = left.buffer[12] * right.buffer[2] + left.buffer[13] * right.buffer[6] + left.buffer[14] * right.buffer[10] + left.buffer[15] * right.buffer[14];
    m.buffer[15] = left.buffer[12] * right.buffer[3] + left.buffer[13] * right.buffer[7] + left.buffer[14] * right.buffer[11] + left.buffer[15] * right.buffer[15];
    return m;
  }
  /**
   * Multiplies this matrix by another matrix.
   * @param {Matrix4} other - The matrix to multiply.
   */
  Multiply(other: Matrix4): void {
    let m = this.buffer;
    let n = other.buffer;
    let a0 = m[0] * n[0] + m[1] * n[4] + m[2] * n[8] + m[3] * n[12];
    let a1 = m[0] * n[1] + m[1] * n[5] + m[2] * n[9] + m[3] * n[13];
    let a2 = m[0] * n[2] + m[1] * n[6] + m[2] * n[10] + m[3] * n[14];
    let a3 = m[0] * n[3] + m[1] * n[7] + m[2] * n[11] + m[3] * n[15];
    //
    let a4 = m[4] * n[0] + m[5] * n[4] + m[6] * n[8] + m[7] * n[12];
    let a5 = m[4] * n[1] + m[5] * n[5] + m[6] * n[9] + m[7] * n[13];
    let a6 = m[4] * n[2] + m[5] * n[6] + m[6] * n[10] + m[7] * n[14];
    let a7 = m[4] * n[3] + m[5] * n[7] + m[6] * n[11] + m[7] * n[15];
    //
    let a8 = m[8] * n[0] + m[9] * n[4] + m[10] * n[8] + m[11] * n[12];
    let a9 = m[8] * n[1] + m[9] * n[5] + m[10] * n[9] + m[11] * n[13];
    let a10 = m[8] * n[2] + m[9] * n[6] + m[10] * n[10] + m[11] * n[14];
    let a11 = m[8] * n[3] + m[9] * n[7] + m[10] * n[11] + m[11] * n[15];
    //
    let a12 = m[12] * n[0] + m[13] * n[4] + m[14] * n[8] + m[15] * n[12];
    let a13 = m[12] * n[1] + m[13] * n[5] + m[14] * n[9] + m[15] * n[13];
    let a14 = m[12] * n[2] + m[13] * n[6] + m[14] * n[10] + m[15] * n[14];
    let a15 = m[12] * n[3] + m[13] * n[7] + m[14] * n[11] + m[15] * n[15];
    m[0] = a0; m[1] = a1; m[2] = a2; m[3] = a3;
    m[4] = a4; m[5] = a5; m[6] = a6; m[7] = a7;
    m[8] = a8; m[9] = a9; m[10] = a10; m[11] = a11;
    m[12] = a12; m[13] = a13; m[14] = a14; m[15] = a15;
    this.buffer = m;
  }
  /**
   * Adds another matrix to this matrix.
   * @param {Matrix4} other - The matrix to add.
   */
  Add(other: Matrix4): void {
    for (let i = 0; i < Matrix4.LENGTH; i++) {
      this.buffer[i] += other.buffer[i];
    }
  }
  /**
   * Subtracts another matrix from this matrix.
   * @param {Matrix4} other - The matrix to subtract.
   */
  Subtract(other: Matrix4): void {
    for (let i = 0; i < Matrix4.LENGTH; i++) {
      this.buffer[i] -= other.buffer[i];
    }
  }
  /**
   * Multiplies this matrix by a scalar.
   * @param {number} scalar - The scalar value.
   */
  Scalar(scalar: number): void {
    for (let i = 0; i < Matrix4.LENGTH; i++) {
      this.buffer[i] *= scalar;
    }
  }
  /**
   * Returns an identity matrix.
   * @returns {Matrix4} An identity matrix.
   */
  static Identity(): Matrix4 {
    let m = new Matrix4();
    m.buffer[0] = 1;
    m.buffer[5] = 1;
    m.buffer[10] = 1;
    m.buffer[15] = 1;
    return m;
  }
  /**
   * Creates a look-at matrix.
   * @param {Vector3} eye - The eye position.
   * @param {Vector3} center - The center position.
   * @param {Vector3} up - The up vector.
   * @returns {Matrix4} The look-at matrix.
   */
  static LookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4 {
    let m = new Matrix4();
    let f = Vector3.Normalize(Vector3.Subtract(center, eye)) as Vector3;
    let s = Vector3.Normalize(Vector3.Cross(f, up)) as Vector3;
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
  /**
   * Creates a perspective projection matrix.
   * @param {number} angle - The field of view angle.
   * @param {number} aspect - The aspect ratio.
   * @param {number} near - The near clipping plane.
   * @param {number} far - The far clipping plane.
   * @returns {Matrix4} The perspective projection matrix.
   */
  static Perspective(angle: number, aspect: number, near: number, far: number): Matrix4 {
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
  /**
   * Creates a viewport transformation matrix.
   * @param {number} x - The x position.
   * @param {number} y - The y position.
   * @param {number} width - The width of the viewport.
   * @param {number} height - The height of the viewport.
   * @param {number} depth - The depth of the viewport.
   * @returns {Matrix4} The viewport transformation matrix.
   */
  static Viewport(x: number, y: number, width: number, height: number, depth: number): Matrix4 {
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
  /**
   * Creates a rotation matrix around the X axis.
   * @param {number} angle - The rotation angle.
   * @returns {Matrix4} The rotation matrix.
   */
  static RotationX(angle: number): Matrix4 {
    let m = Matrix4.Identity();
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    m.buffer[5] = c;
    m.buffer[6] = s;
    m.buffer[9] = -s;
    m.buffer[10] = c;
    return m;
  }
  /**
   * Rotates this matrix around the X axis.
   * @param {number} angle - The rotation angle.
   */
  RotateX(angle: number): void {
    let m = Matrix4.RotationX(angle);
    m.Multiply(this);
    this.buffer = m.buffer;
  }
  /**
   * Rotates this matrix around the Y axis.
   * @param {number} angle - The rotation angle.
   */
  RotateY(angle: number): void {
    let m = Matrix4.RotationY(angle);
    m.Multiply(this);
    this.buffer = m.buffer;
  }
  /**
   * Rotates this matrix around the Z axis.
   * @param {number} angle - The rotation angle.
   */
  RotateZ(angle: number): void {
    let m = Matrix4.RotationZ(angle);
    m.Multiply(this);
    this.buffer = m.buffer;
  }
  /**
   * Rotates this matrix around an arbitrary axis.
   * @param {Float32Array} axis - The rotation axis.
   * @param {number} angle - The rotation angle.
   */
  RotateAxis(axis: Float32Array, angle: number): void {
    let m = Matrix4.RotationAxis(axis, angle);
    m.Multiply(this);
    this.buffer = m.buffer;
  }
  /**
   * Creates a rotation matrix around the Y axis.
   * @param {number} angle - The rotation angle.
   * @returns {Matrix4} The rotation matrix.
   */
  static RotationY(angle: number): Matrix4 {
    let m = Matrix4.Identity();
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    m.buffer[0] = c;
    m.buffer[2] = -s;
    m.buffer[8] = s;
    m.buffer[10] = c;
    return m;
  }
  /**
   * Creates a rotation matrix around the Z axis.
   * @param {number} angle - The rotation angle.
   * @returns {Matrix4} The rotation matrix.
   */
  static RotationZ(angle: number): Matrix4 {
    let m = Matrix4.Identity();
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    m.buffer[0] = c;
    m.buffer[1] = s;
    m.buffer[4] = -s;
    m.buffer[5] = c;
    return m;
  }
  /**
   * Creates a rotation matrix around an arbitrary axis.
   * @param {Float32Array} axis - The rotation axis.
   * @param {number} angle - The rotation angle.
   * @returns {Matrix4} The rotation matrix.
   */
  static RotationAxis(axis: Float32Array, angle: number): Matrix4 {
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
  /**
   * Creates a translation matrix.
   * @param {number} x - The translation along the X axis.
   * @param {number} y - The translation along the Y axis.
   * @param {number} z - The translation along the Z axis.
   * @returns {Matrix4} The translation matrix.
   */
  static Translation(x: number, y: number, z: number): Matrix4 {
    let m = Matrix4.Identity();
    m.buffer[3] = x;
    m.buffer[7] = y;
    m.buffer[11] = z;
    return m;
  }
  /**
   * Translates this matrix.
   * @param {number} x - The translation along the X axis.
   * @param {number} y - The translation along the Y axis.
   * @param {number} z - The translation along the Z axis.
   */
  Translate(x: number, y: number, z: number): void {
    this.buffer[3] += x;
    this.buffer[7] += y;
    this.buffer[11] += z;
  }
  /**
   * Multiplies an array of Matrix4 objects in sequence (from left to right).
   * @param {Matrix4[]} matrices - Array of matrices.
   * @returns {Matrix4} The resulting matrix.
   * @throws {Error} If no matrices are provided.
   */
  static MultiplyAll(matrices: Matrix4[]): Matrix4 {
    if (matrices.length === 0) {
      throw new Error("No matrices provided.");
    }
    let result = Matrix4.Identity();
    for (let i = 0; i < matrices.length; i++) {
      result.Multiply(matrices[i]);
    }
    return result;
  }
  /**
   * Instance method for chained multiplication.
   * @param {Matrix4} other - The matrix to multiply.
   * @returns {this} The current matrix after multiplication.
   */
  MultiplyChain(other: Matrix4): this {
    this.Multiply(other);
    return this;
  }

  /**
   * 从四元数创建旋转矩阵
   * @param q 输入四元数
   * @returns 表示相同旋转的4x4矩阵
   */
  static FromQuaternion(q: Quaternion): Matrix4 {
    // 先确保四元数是单位四元数
    const qn = Quaternion.Normalize(q);
    const x = qn.x, y = qn.y, z = qn.z, w = qn.w;
    
    // 计算四元数元素的乘积
    const xx = x * x;
    const xy = x * y;
    const xz = x * z;
    const xw = x * w;
    
    const yy = y * y;
    const yz = y * z;
    const yw = y * w;
    
    const zz = z * z;
    const zw = z * w;
    
    // 构建旋转矩阵
    return new Matrix4(new Float32Array([
        1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0,
        2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0,
        2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0,
        0, 0, 0, 1
    ]));
  }
}

/**
 * Class representing a 3x3 matrix.
 * @extends Matrix
 */
export class Matrix3 extends Matrix {
  /**
   * Creates a new 3x3 matrix.
   * @constructor
   * @param {Float32Array} [buffer] - Optional buffer.
   * @throws {Error} If buffer length is not 9.
   */
  constructor(buffer?: Float32Array) {
    if (buffer) {
      if (buffer.length != Matrix3.LENGTH) {
        throw new Error('mat3 must be 3x3');
      }
      super(buffer);
    } else {
      super(new Float32Array(Matrix3.LENGTH));
    }
    this.row = 3;
    this.col = 3;
  }
  /** @static */
  static readonly LENGTH: number = 9;
  /**
   * Returns the determinant of this matrix.
   * @readonly
   * @type {number}
   */
  get Delta(): number {
    let m = this.buffer;
    let a0 = m[0] * m[4] - m[1] * m[3];
    let a1 = m[0] * m[5] - m[2] * m[3];
    let a2 = m[1] * m[5] - m[2] * m[4];
    return a0 * a2 - a1 * a1;
  }
  /**
   * Inverts this matrix.
   * @returns {TMatrix} The inverted matrix.
   * @template TMatrix
   * @throws {Error} If the matrix is not invertible.
   */
  Invert<TMatrix extends Matrix>(): TMatrix {
    let m = this.buffer;
    let a0 = m[0] * m[4] - m[1] * m[3];
    let a1 = m[0] * m[5] - m[2] * m[3];
    let a2 = m[1] * m[5] - m[2] * m[4];
    let det = a0 * a2 - a1 * a1;
    if (det == 0) throw new Error('matrix is not invertible');
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
    return <TMatrix><unknown>result;
  }
  /**
   * Creates a new Matrix3 instance from an array.
   * @param {number[]} arr - The source array.
   * @returns {Matrix3} The created matrix.
   */
  static FromArray(arr: number[]): Matrix3 {
    return new Matrix3(new Float32Array(arr));
  }
  /**
   * Returns a new identity Matrix3.
   * @returns {Matrix3} An identity matrix.
   */
  static Identity(): Matrix3 {
    let m = new Matrix3();
    m.buffer[0] = 1; m.buffer[4] = 1; m.buffer[8] = 1;
    return m;
  }
  /**
   * Multiplies two Matrix3 objects.
   * @param {Matrix3} left - The left operand.
   * @param {Matrix3} right - The right operand.
   * @returns {Matrix3} The product matrix.
   */
  static Multiply(left: Matrix3, right: Matrix3): Matrix3 {
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
  /**
   * Multiplies this matrix by another matrix.
   * @param {Matrix3} other - The matrix to multiply.
   */
  Multiply(other: Matrix3): void {
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
    m[0] = a0; m[1] = a1; m[2] = a2;
    m[3] = a3; m[4] = a4; m[5] = a5;
    m[6] = a6; m[7] = a7; m[8] = a8;
    this.buffer = m;
  }
  /**
   * Adds another matrix to this matrix.
   * @param {Matrix3} other - The matrix to add.
   */
  Add(other: Matrix3): void {
    for (let i = 0; i < Matrix3.LENGTH; i++) {
      this.buffer[i] += other.buffer[i];
    }
  }
  /**
   * Subtracts another matrix from this matrix.
   * @param {Matrix3} other - The matrix to subtract.
   */
  Subtract(other: Matrix3): void {
    for (let i = 0; i < Matrix3.LENGTH; i++) {
      this.buffer[i] -= other.buffer[i];
    }
  }
  /**
   * Multiplies this matrix by a scalar.
   * @param {number} scalar - The scalar value.
   */
  Scalar(scalar: number): void {
    for (let i = 0; i < Matrix3.LENGTH; i++) {
      this.buffer[i] *= scalar;
    }
  }
  /**
   * Translates this matrix.
   * @param {number} x - The translation along the X axis.
   * @param {number} y - The translation along the Y axis.
   */
  Translate(x: number, y: number): void {
    this.buffer[6] += x;
    this.buffer[7] += y;
  }
  /**
   * Rotates this matrix around the X axis.
   * @param {number} angle - The rotation angle.
   */
  RotateX(angle: number): void {
    let m = Matrix3.RotationX(angle);
    m.Multiply(this);
    this.buffer = m.buffer;
  }
  /**
   * Rotates this matrix around the Y axis.
   * @param {number} angle - The rotation angle.
   */
  RotateY(angle: number): void {
    let m = Matrix3.RotationY(angle);
    m.Multiply(this);
    this.buffer = m.buffer;
  }
  /**
   * Rotates this matrix around an arbitrary axis.
   * @param {Float32Array} axis - The rotation axis.
   * @param {number} angle - The rotation angle.
   */
  RotateAxis(axis: Float32Array, angle: number): void {
    let m = Matrix3.RotationAxis(axis, angle);
    m.Multiply(this);
    this.buffer = m.buffer;
  }
  /**
   * Creates a rotation matrix around the X axis.
   * @param {number} angle - The rotation angle.
   * @returns {Matrix3} The rotation matrix.
   */
  static RotationX(angle: number): Matrix3 {
    let m = Matrix3.Identity();
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    m.buffer[4] = c;
    m.buffer[5] = s;
    m.buffer[7] = -s;
    m.buffer[8] = c;
    return m;
  }
  /**
   * Creates a rotation matrix around the Y axis.
   * @param {number} angle - The rotation angle.
   * @returns {Matrix3} The rotation matrix.
   */
  static RotationY(angle: number): Matrix3 {
    let m = Matrix3.Identity();
    let c = Math.cos(angle);
    let s = Math.sin(angle);
    m.buffer[0] = c;
    m.buffer[2] = -s;
    m.buffer[6] = s;
    m.buffer[8] = c;
    return m;
  }
  /**
   * Creates a rotation matrix around an arbitrary axis.
   * @param {Float32Array} axis - The rotation axis.
   * @param {number} angle - The rotation angle.
   * @returns {Matrix3} The rotation matrix.
   */
  static RotationAxis(axis: Float32Array, angle: number): Matrix3 {
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
  /**
   * Creates a translation matrix.
   * @param {number} x - The translation along the X axis.
   * @param {number} y - The translation along the Y axis.
   * @returns {Matrix3} The translation matrix.
   */
  static Translation(x: number, y: number): Matrix3 {
    let m = this.Identity();
    m.buffer[6] = x;
    m.buffer[7] = y;
    return m;
  }
  /**
   * Creates a scaling matrix.
   * @param {number} x - The scaling factor along the X axis.
   * @param {number} y - The scaling factor along the Y axis.
   * @returns {Matrix3} The scaling matrix.
   */
  static Scale(x: number, y: number): Matrix3 {
    let m = this.Identity();
    m.buffer[0] = x;
    m.buffer[4] = y;
    return m;
  }
  /**
   * Multiplies an array of Matrix3 objects in sequence.
   * @param {Matrix3[]} matrices - Array of 3x3 matrices.
   * @returns {Matrix3} The resulting matrix.
   * @throws {Error} If no matrices are provided.
   */
  static MultiplyAll(matrices: Matrix3[]): Matrix3 {
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

/**
 * 四元数类 - 用于表示3D旋转
 */
export class Quaternion {
    buffer: Float32Array;
    
    /**
     * 创建一个新的四元数
     * @param x X分量或完整Float32Array
     * @param y Y分量
     * @param z Z分量
     * @param w W分量
     */
    constructor(x: number | Float32Array = 0, y: number = 0, z: number = 0, w: number = 1) {
        if (x instanceof Float32Array) {
            this.buffer = new Float32Array(4);
            this.buffer.set(x.slice(0, 4));
        } else {
            this.buffer = new Float32Array([x, y, z, w]);
        }
    }
    
    /**
     * 获取X分量
     */
    get x(): number { return this.buffer[0]; }
    set x(value: number) { this.buffer[0] = value; }
    
    /**
     * 获取Y分量
     */
    get y(): number { return this.buffer[1]; }
    set y(value: number) { this.buffer[1] = value; }
    
    /**
     * 获取Z分量
     */
    get z(): number { return this.buffer[2]; }
    set z(value: number) { this.buffer[2] = value; }
    
    /**
     * 获取W分量
     */
    get w(): number { return this.buffer[3]; }
    set w(value: number) { this.buffer[3] = value; }
    
    /**
     * 创建单位四元数
     * @returns 单位四元数(0,0,0,1)
     */
    static Identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1);
    }
    
    /**
     * 从XYZW值创建四元数
     * @param x X分量
     * @param y Y分量
     * @param z Z分量
     * @param w W分量
     * @returns 新的四元数
     */
    static FromXYZW(x: number, y: number, z: number, w: number): Quaternion {
        return new Quaternion(x, y, z, w);
    }
    
    /**
     * 从轴角度表示创建四元数
     * @param axis 旋转轴
     * @param angle 旋转角度（弧度）
     * @returns 表示指定旋转的四元数
     */
    static FromAxisAngle(axis: Vector3, angle: number): Quaternion {
        // 规范化旋转轴
        const norm = Vector3.Normalize(axis);
        
        // 计算半角正弦和余弦
        const halfAngle = angle * 0.5;
        const s = Math.sin(halfAngle);
        const c = Math.cos(halfAngle);
        
        // 创建四元数
        return new Quaternion(
            norm.x * s,
            norm.y * s,
            norm.z * s,
            c
        );
    }
    
    /**
     * 从欧拉角创建四元数（按ZYX顺序旋转）
     * @param x X轴旋转（弧度）
     * @param y Y轴旋转（弧度）
     * @param z Z轴旋转（弧度）
     * @returns 表示指定旋转的四元数
     */
    static FromEulerAngles(x: number, y: number, z: number): Quaternion {
        // 计算各轴的半角正弦余弦
        const cx = Math.cos(x * 0.5);
        const cy = Math.cos(y * 0.5);
        const cz = Math.cos(z * 0.5);
        const sx = Math.sin(x * 0.5);
        const sy = Math.sin(y * 0.5);
        const sz = Math.sin(z * 0.5);
        
        // 按ZYX顺序组合旋转
        return new Quaternion(
            cx * cy * sz - sx * sy * cz,
            cx * sy * cz + sx * cy * sz,
            sx * cy * cz - cx * sy * sz,
            cx * cy * cz + sx * sy * sz
        );
    }
    
    /**
     * 计算四元数的长度（范数）
     * @param q 输入四元数
     * @returns 四元数长度
     */
    static Length(q: Quaternion): number {
        return Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w);
    }
    
    /**
     * 规范化四元数
     * @param q 输入四元数
     * @returns 规范化后的四元数
     */
    static Normalize(q: Quaternion): Quaternion {
        const len = Quaternion.Length(q);
        if (len < 1e-8) { // 避免除以零
            return Quaternion.Identity();
        }
        
        const invLen = 1.0 / len;
        return new Quaternion(
            q.x * invLen,
            q.y * invLen,
            q.z * invLen,
            q.w * invLen
        );
    }
    
    /**
     * 四元数共轭
     * @param q 输入四元数
     * @returns 共轭四元数
     */
    static Conjugate(q: Quaternion): Quaternion {
        return new Quaternion(-q.x, -q.y, -q.z, q.w);
    }
    
    /**
     * 四元数逆
     * @param q 输入四元数
     * @returns 逆四元数
     */
    static Inverse(q: Quaternion): Quaternion {
        // 对于单位四元数，逆等于共轭
        const lenSq = q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w;
        if (Math.abs(lenSq - 1.0) < 1e-8) {
            return Quaternion.Conjugate(q);
        }
        
        // 一般四元数的逆
        const invLenSq = 1.0 / lenSq;
        return new Quaternion(
            -q.x * invLenSq,
            -q.y * invLenSq,
            -q.z * invLenSq,
            q.w * invLenSq
        );
    }
    
    /**
     * 四元数乘法
     * @param a 第一个四元数
     * @param b 第二个四元数
     * @returns 两个四元数的乘积
     */
    static Multiply(a: Quaternion, b: Quaternion): Quaternion {
        return new Quaternion(
            a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
            a.w * b.y + a.y * b.w + a.z * b.x - a.x * b.z,
            a.w * b.z + a.z * b.w + a.x * b.y - a.y * b.x,
            a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
        );
    }
    
    /**
     * 四元数球面线性插值
     * @param a 起始四元数
     * @param b 目标四元数
     * @param t 插值参数(0-1)
     * @returns 插值结果
     */
    static Slerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
        // 确保参数在0-1范围内
        t = Math.max(0, Math.min(1, t));
        
        // 计算四元数点积
        let cosHalfTheta = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
        
        // 如果点积为负，反转第二个四元数获取较短路径
        if (cosHalfTheta < 0) {
            b = new Quaternion(-b.x, -b.y, -b.z, -b.w);
            cosHalfTheta = -cosHalfTheta;
        }
        
        // 如果四元数几乎相同，执行线性插值
        if (cosHalfTheta > 0.9999) {
            return new Quaternion(
                a.x + t * (b.x - a.x),
                a.y + t * (b.y - a.y),
                a.z + t * (b.z - a.z),
                a.w + t * (b.w - a.w)
            );
        }
        
        // 计算角度和正弦
        const halfTheta = Math.acos(cosHalfTheta);
        const sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
        
        // 计算权重
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
        const ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        
        // 组合四元数
        return new Quaternion(
            a.x * ratioA + b.x * ratioB,
            a.y * ratioA + b.y * ratioB,
            a.z * ratioA + b.z * ratioB,
            a.w * ratioA + b.w * ratioB
        );
    }
    
    /**
     * 从四元数创建旋转矩阵
     * @param q 输入四元数
     * @returns 表示相同旋转的4x4矩阵
     */
    static ToMatrix4(q: Quaternion): Matrix4 {
        const qn = Quaternion.Normalize(q);
        const x = qn.x, y = qn.y, z = qn.z, w = qn.w;
        
        // 计算四元数元素的乘积
        const xx = x * x;
        const xy = x * y;
        const xz = x * z;
        const xw = x * w;
        
        const yy = y * y;
        const yz = y * z;
        const yw = y * w;
        
        const zz = z * z;
        const zw = z * w;
        
        // 构建旋转矩阵
        return new Matrix4(new Float32Array([
            1 - 2 * (yy + zz), 2 * (xy - zw), 2 * (xz + yw), 0,
            2 * (xy + zw), 1 - 2 * (xx + zz), 2 * (yz - xw), 0,
            2 * (xz - yw), 2 * (yz + xw), 1 - 2 * (xx + yy), 0,
            0, 0, 0, 1
        ]));
    }

    /**
     * 从旋转矩阵创建四元数
     * @param m 旋转矩阵
     * @returns 表示相同旋转的四元数
     */
    static FromMatrix4(m: Matrix4): Quaternion {
        const mat = m.buffer;
        
        // 提取矩阵的对角线元素和迹
        const m00 = mat[0], m11 = mat[5], m22 = mat[10];
        const trace = m00 + m11 + m22;
        
        if (trace > 0) {
            // 矩阵迹为正，直接计算
            const s = 0.5 / Math.sqrt(trace + 1.0);
            return new Quaternion(
                (mat[9] - mat[6]) * s,
                (mat[2] - mat[8]) * s,
                (mat[4] - mat[1]) * s,
                0.25 / s
            );
        } else if (m00 > m11 && m00 > m22) {
            // m00最大
            const s = 2.0 * Math.sqrt(1.0 + m00 - m11 - m22);
            return new Quaternion(
                0.25 * s,
                (mat[4] + mat[1]) / s,
                (mat[2] + mat[8]) / s,
                (mat[9] - mat[6]) / s
            );
        } else if (m11 > m22) {
            // m11最大
            const s = 2.0 * Math.sqrt(1.0 + m11 - m00 - m22);
            return new Quaternion(
                (mat[4] + mat[1]) / s,
                0.25 * s,
                (mat[9] + mat[6]) / s,
                (mat[2] - mat[8]) / s
            );
        } else {
            // m22最大
            const s = 2.0 * Math.sqrt(1.0 + m22 - m00 - m11);
            return new Quaternion(
                (mat[2] + mat[8]) / s,
                (mat[9] + mat[6]) / s,
                0.25 * s,
                (mat[4] - mat[1]) / s
            );
        }
    }
}
