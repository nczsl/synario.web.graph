/**
 * 本 模块主要是解决 scenery 的run 函数所需要的 update需求，为了让scenery代码更简洁，所以把很多细节工作分散到了
 * 各个子模块中。
 */
import * as data_access_mod from './data-access';
import * as camera_mod from './camera';
import * as signal_mod from './signal';
import * as model_mod from './model';


export class Control {
  access: data_access_mod.DataAccess; // 资源池 - 用于存储和管理GPU资源
  camera: camera_mod.Camera; // 摄像机 - 用于控制视图和投影矩阵
  signal: signal_mod.Signal; // 信号 - 用于传递渲染信号和事件

  constructor(access: data_access_mod.DataAccess) {
    this.access = access;
    this.camera = new camera_mod.Camera();
    this.signal = new signal_mod.Signal();
    // // 先分配 bufferId
    // this.initSignal();
    // this.initCamera();
    // 再注册 BindGroup/BindGroupLayout
    this.access.initSignalCamera(this.signal, this.camera);
    this.registryEvent();
  }
  // event
  registryEvent(): void {
    const canvas = this.access.scen.canvas;

    // 鼠标移动
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      this.signal.mouse.updateFromEvent(e);
      // 可选：相机响应鼠标拖拽
      // if (e.buttons === 2) { ...this.camera.xxx... }
    });

    // 鼠标按下
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      this.signal.mouse.updateFromEvent(e);
      // 可选：记录拖拽起点等
    });

    // 鼠标抬起
    canvas.addEventListener('mouseup', (e: MouseEvent) => {
      this.signal.mouse.updateFromEvent(e);
      // 可选：结束拖拽
    });

    // 鼠标滚轮（常用于缩放）
    canvas.addEventListener('wheel', (e: WheelEvent) => {
      // 这里可以直接操作 camera 缩放
      // 例如：this.camera.fov += e.deltaY * 0.01;
      // this.camera.updateProjectionMatrix();
      // 或者通过 signal 记录
    });

    // 键盘事件
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.signal.key.updateFromEvent(e);
      // 可选：相机快捷键响应
      // if (e.code === 'KeyR') { this.camera.reset(); }
    });
    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.signal.key.updateFromEvent(e);
    });

    // 窗口尺寸变化
    window.addEventListener('resize', () => {
      // 例如：更新相机宽高比
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.camera.updateViewProjectionMatrix();
    });
  }
  
  // // signal
  // initSignal(): void {
  //   // mouseinfo 只用于 COPY_DST
  //   this.signal.mouse.gbufferId = this.access.registryBuffer(Math.max(signal_mod.MouseInfo.BUFFER_SIZE, 256), GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE);
  //   // keyinfo 只用于 COPY_DST
  //   this.signal.key.gbufferId = this.access.registryBuffer(Math.max(signal_mod.KeyInfo.BUFFER_SIZE, 256), GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE);
  //   // tickinfo 用于 storage
  //   this.signal.tick.gbufferId = this.access.registryBuffer(Math.max(signal_mod.TickInfo.BUFFER_SIZE, 256), GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE);
  // }
  // // camera
  // initCamera(): void {
  //   // camera 用于 uniform
  //   this.camera.bufferId = this.access.registryBuffer(camera_mod.Camera.BUFFER_SIZE, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
  // }
  update(tick: number): void {
    //
    this.signal.tick.nextFrame(tick);
    this.access.updateBuffer(this.signal.mouse.gbufferId, this.signal.mouse.buffer);
    this.access.updateBuffer(this.signal.key.gbufferId, this.signal.key.buffer);
    this.access.updateBuffer(this.signal.tick.gbufferId, this.signal.tick.buffer);
    //
    this.camera.updateBuffer();
    this.access.updateBuffer(this.camera.bufferId, this.camera.buffer);
  }
}
