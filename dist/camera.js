import * as math_mod from './gmath';
import * as builders_mod from './builders';
import { util_mod } from 'synario.base';
export class Camera {
    position = math_mod.Vector4.FromXYZW(0, 0, 5, 1);
    target = math_mod.Vector4.FromXYZW(0, 0, 0, 1);
    up = math_mod.Vector4.FromXYZW(0, 1, 0, 0);
    fov = 45 * Math.PI / 180;
    aspect = 1.0;
    near = 0.1;
    far = 1000.0;
    viewMatrix = new math_mod.Matrix4();
    projectionMatrix = new math_mod.Matrix4();
    static BUFFER_SIZE = 64
        + 64
        + 16
        + 16
        + 16
        + 16;
    buffer = new ArrayBuffer(Camera.BUFFER_SIZE);
    bindgrouplayoutId_vs = -1;
    bindgroupId_vs = -1;
    bindgrouplayoutId_cs = -1;
    bindgroupId_cs = -1;
    bufferId = -1;
    constructor() {
        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }
    updateViewMatrix() {
        this.viewMatrix = math_mod.Matrix4.LookAt(this.position, this.target, this.up);
    }
    updateProjectionMatrix() {
        this.projectionMatrix = math_mod.Matrix4.Perspective(this.fov, this.aspect, this.near, this.far);
    }
    updateViewProjectionMatrix() {
        this.updateViewMatrix();
        this.updateProjectionMatrix();
    }
    setPerspective(fov, aspect, near, far) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.updateProjectionMatrix();
        this.updateViewProjectionMatrix();
    }
    setPosition(x, y, z, w = 1) {
        this.position = math_mod.Vector4.FromXYZW(x, y, z, w);
        this.updateViewMatrix();
        this.updateViewProjectionMatrix();
    }
    setTarget(x, y, z, w = 1) {
        this.target = math_mod.Vector4.FromXYZW(x, y, z, w);
        this.updateViewMatrix();
        this.updateViewProjectionMatrix();
    }
    setUp(x, y, z, w = 0) {
        this.up = math_mod.Vector4.FromXYZW(x, y, z, w);
        this.updateViewMatrix();
        this.updateViewProjectionMatrix();
    }
    updateBuffer() {
        const f32 = new Float32Array(this.buffer);
        f32.set(this.viewMatrix.buffer, 0);
        f32.set(this.projectionMatrix.buffer, 16);
        f32.set(this.position.buffer, 32);
        f32.set(this.target.buffer, 36);
        f32.set(this.up.buffer, 40);
        f32.set([this.fov, this.aspect, this.near, this.far], 44);
    }
    get bindGroupLayoutId_vs() { return this.bindgrouplayoutId_vs; }
    get bindGroupId_vs() { return this.bindgroupId_vs; }
    get bindGroupLayoutId_cs() { return this.bindgrouplayoutId_cs; }
    get bindGroupId_cs() { return this.bindgroupId_cs; }
}
