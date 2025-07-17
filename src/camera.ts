/**
 * Synario WebGPU Graphics Library
 * @file camera.ts
 * @description 相机系统
 * @author Synario Team
 */
import * as math_mod from './gmath';
import * as builders_mod from './builders';
import { util_mod } from 'synario.base';

/**
 * 相机类 - 管理视图矩阵和投影矩阵
 */
export class Camera {
  // 位置和方向 - 使用gmath中的Vector4
  position: math_mod.Vector4 = math_mod.Vector4.FromXYZW(0, 0, 5, 1);
  target: math_mod.Vector4 = math_mod.Vector4.FromXYZW(0, 0, 0, 1);
  up: math_mod.Vector4 = math_mod.Vector4.FromXYZW(0, 1, 0, 0);

  // 投影参数
  fov: number = 45 * Math.PI / 180;
  aspect: number = 1.0;
  near: number = 0.1;
  far: number = 1000.0;

  // 矩阵 - 使用gmath中的Matrix4
  viewMatrix: math_mod.Matrix4 = new math_mod.Matrix4();
  projectionMatrix: math_mod.Matrix4 = new math_mod.Matrix4();
  static readonly BUFFER_SIZE = 64   // viewMatrix
                                + 64 // projectionMatrix
                                + 16 // position (vec4)
                                + 16 // target (vec4)
                                + 16 // up (vec4)
                                + 16; // fov, aspect, near, far (vec4)
  buffer: ArrayBuffer = new ArrayBuffer(Camera.BUFFER_SIZE);

  bindgrouplayoutId_vs: number = -1; // VS/FS只读layout
  bindgroupId_vs: number = -1;       // VS/FS只读group
  bindgrouplayoutId_cs: number = -1; // CS可读layout
  bindgroupId_cs: number = -1;       // CS可读group
  bufferId: number = -1; // 绑定组ID，供GPU使用
  // bindgroup: GPUBindGroup | null = null; // 绑定组，供GPU使用
  // bindgrouplayout: GPUBindGroupLayout | null = null; // 绑定组布局，供GPU使用
  // gbuffer: GPUBuffer | null = null; // 绑定组布局，供GPU使用
  /**
   * 创建相机实例
   */
  constructor() {
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }


  /**
   * 更新视图矩阵
   */
  updateViewMatrix(): void {
    // 使用gmath中的LookAt方法
    this.viewMatrix = math_mod.Matrix4.LookAt(this.position, this.target, this.up);
  }

  /**
     * 更新投影矩阵
     */
  updateProjectionMatrix(): void {
    // 使用gmath中的Perspective方法
    this.projectionMatrix = math_mod.Matrix4.Perspective(this.fov, this.aspect, this.near, this.far);
  }

  /**
   * 更新视图投影矩阵
   */
  updateViewProjectionMatrix(): void {
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }

  /**
   * 设置透视投影参数
   */
  setPerspective(fov: number, aspect: number, near: number, far: number): void {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
    this.updateViewProjectionMatrix();
  }

  /**
   * 设置相机位置
   */
  setPosition(x: number, y: number, z: number, w: number = 1): void {
    this.position = math_mod.Vector4.FromXYZW(x, y, z, w);
    this.updateViewMatrix();
    this.updateViewProjectionMatrix();
  }

  /**
   * 设置相机目标点
   */
  setTarget(x: number, y: number, z: number, w: number = 1): void {
    this.target = math_mod.Vector4.FromXYZW(x, y, z, w);
    this.updateViewMatrix();
    this.updateViewProjectionMatrix();
  }

  /**
   * 设置相机朝上方向
   */
  setUp(x: number, y: number, z: number, w: number = 0): void {
    this.up = math_mod.Vector4.FromXYZW(x, y, z, w);
    this.updateViewMatrix();
    this.updateViewProjectionMatrix();
  }

  /**
   * 将相机数据写入 buffer，供 GPU 侧使用
   */
  updateBuffer(): void {
    const f32 = new Float32Array(this.buffer);
    // viewMatrix (16 floats)
    f32.set(this.viewMatrix.buffer, 0);
    // projectionMatrix (16 floats)
    f32.set(this.projectionMatrix.buffer, 16);
    // position (vec4)
    f32.set(this.position.buffer, 32);
    // cameraTarget (vec4)
    f32.set(this.target.buffer, 36);
    // up (vec4)
    f32.set(this.up.buffer, 40);
    // projParams: fov, aspect, near, far
    f32.set([this.fov, this.aspect, this.near, this.far], 44);
  }

  // 兼容属性名，添加驼峰形式的 getter
  get bindGroupLayoutId_vs() { return this.bindgrouplayoutId_vs; }
  get bindGroupId_vs() { return this.bindgroupId_vs; }
  get bindGroupLayoutId_cs() { return this.bindgrouplayoutId_cs; }
  get bindGroupId_cs() { return this.bindgroupId_cs; }
}

