/**
 * 本 模块主要是解决 scenery 的run 函数所需要的 update需求，为了让scenery代码更简洁，所以把很多细节工作分散到了
 * 各个子模块中。
 */
import * as data_access_mod from './data-access';
import * as camera_mod from './camera';
import * as signal_mod from './signal';
import * as scen_mod from './scene';
import * as types_mod from './types'; // 新增对 types_mod 的引用


export class Control {
  access: data_access_mod.DataAccess; // 资源池 - 用于存储和管理GPU资源
  camera: camera_mod.Camera; // 摄像机 - 用于控制视图和投影矩阵
  signal: signal_mod.Signal; // 信号 - 用于传递渲染信号和事件
  samplers: { [key: string]: GPUSampler } = {};

  samplerBindGroupLayoutId: number = -1;
  samplerBindGroupId: number = -1;

  constructor(access: data_access_mod.DataAccess) {
    this.access = access;
    this.camera = new camera_mod.Camera();
    this.signal = new signal_mod.Signal();
    this.access.initSignalCamera(this.signal, this.camera);
    this.registryEvent();
    this.initSamplers(this.access.scenery.device);
    this.initSamplerBindGroup(this.access.scenery.device);
  }
  // event
  registryEvent(): void {
    const canvas = this.access.scenery.canvas;

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
  update(tick: number): void {
    this.signal.tick.nextFrame(tick);
    const combinedBuffer = this.signal.getCombinedBufferData();
    this.access.updateBuffer(this.signal.gbufferId, combinedBuffer);
    //
    this.camera.updateBuffer();
    this.access.updateBuffer(this.camera.bufferId, this.camera.buffer);
  }

  /**
   * 初始化常用全局 Sampler
   */
  initSamplers(device: GPUDevice) {
    this.samplers.linear = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'repeat',
      addressModeV: 'repeat',
    });
    this.samplers.nearest = device.createSampler({
      magFilter: 'nearest',
      minFilter: 'nearest',
      addressModeU: 'repeat',
      addressModeV: 'repeat',
    });
    this.samplers.linearClamp = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    });
    // 可根据需要扩展更多采样器
  }

  /**
   * 获取指定名称的 Sampler
   */
  getSampler(name: string): GPUSampler {
    return this.samplers[name];
  }

  /**
   * 初始化 Sampler BindGroupLayout 和 BindGroup
   */
  initSamplerBindGroup(device: GPUDevice) {
    // 1. 创建 BindGroupLayout
    this.samplerBindGroupLayoutId = this.access.registryBindGroupLayout(builder => {
      let idx = 0;
      if (this.samplers.linear) builder.addSampler(idx++, GPUShaderStage.FRAGMENT);
      if (this.samplers.nearest) builder.addSampler(idx++, GPUShaderStage.FRAGMENT);
      if (this.samplers.linearClamp) builder.addSampler(idx++, GPUShaderStage.FRAGMENT);
      // 可扩展更多采样器
      return builder.build(device);
    });
    // 2. 创建 BindGroup
    this.samplerBindGroupId = this.access.registryBindGroup(builder => {
      let idx = 0;
      if (this.samplers.linear) builder.addSampler(idx++, this.samplers.linear);
      if (this.samplers.nearest) builder.addSampler(idx++, this.samplers.nearest);
      if (this.samplers.linearClamp) builder.addSampler(idx++, this.samplers.linearClamp);
      // 可扩展更多采样器
      return builder.build(device, this.access.store.get(
        types_mod.ResType.bindGroupLayout,
        this.samplerBindGroupLayoutId
      ));
    });
  }

  /**
   * 获取全局 Sampler BindGroup
   */
  getSamplerBindGroup(): GPUBindGroup | null {
    return this.access.store.get(types_mod.ResType.bindGroup, this.samplerBindGroupId);
  }

  /**
   * 获取全局 Sampler BindGroupLayout
   */
  getSamplerBindGroupLayout(): GPUBindGroupLayout | null {
    return this.access.store.get(types_mod.ResType.bindGroupLayout, this.samplerBindGroupLayoutId);
  }
}
