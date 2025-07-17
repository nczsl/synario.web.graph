/**
 * Synario WebGPU Graphics Library
 * @file scenery.ts
 * @description 场景管理
 * @author Synario Team
 */
///<reference types="@webgpu/types" />
import { util_mod, engine_mod } from 'synario.base';
import * as camera_mod from './camera';
import * as signal_mod from './signal';
import * as builders_mod from './builders';
import * as types_mod from './types';
import * as data_access_mod from './data-access';
import * as control_mod from './control';
import * as render_graph_mod from './render-graph';


export class Scenery {
  canvas: HTMLCanvasElement; // 画布 - 用于渲染的HTML元素
  context: GPUCanvasContext;
  device: GPUDevice;
  control: control_mod.Control; // 控制器 - 用于处理渲染循环和更新逻辑
  format: GPUTextureFormat; // 新增：记录当前画布格式

  // 是否正在运行渲染循环
  private isRunning: boolean = false;

  // 资源管理
  access: data_access_mod.DataAccess; // 资源池 - 用于存储和管理GPU资源

  // 固定的两个渲染层
  major: render_graph_mod.RenderGraph; // 主要渲染层 - 用于主场景渲染
  minor: render_graph_mod.RenderGraph; // 次要渲染层 - 用于UI/后处理等


  async init(canvas: HTMLCanvasElement): Promise<void> {
    this.canvas = canvas;
    this.context = canvas.getContext('webgpu');
    let adapter = await navigator.gpu.requestAdapter();
    this.device = await adapter.requestDevice();
    this.format = 'bgra8unorm'; // 新增：与 context.configure 保持一致
    this.context.configure({
      device: this.device,
      format: this.format,
    }); 
    this.access = new data_access_mod.DataAccess(this);
    let texture = this.device.createTexture({
      size:[canvas.width, canvas.height,2],
      format: this.format, // 保持一致
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      viewFormats: [this.format],
    })
    let textureView = texture.createView();
    // 初始化两个固定渲染层
    this.major = new render_graph_mod.RenderGraph(this);
    this.minor = new render_graph_mod.RenderGraph(this);

    // 确保 control 初始化
    this.control = new control_mod.Control(this.access);
  }

  constructor() {
    // 初始化资源池和渲染图
    // this.respool = new resource_mod.ResPool(this.device);
    // this.major = new render_graph_mod.RenderGraph(this);
    // this.minor = new render_graph_mod.RenderGraph(this);
  }

  //#region 渲染循环控制
  runMajor(): void {
    if (!this.isRunning) {
      this.isRunning = true;
            engine_mod.Engine.start(
        tick => {
          this.control.update(tick);
          this.major.render();
        }
      )
    }
  }
  run(): void {
    if (!this.isRunning) {
      this.isRunning = true;
            engine_mod.Engine.start(
        tick => {
          this.control.update(tick);
          this.major.render();
          this.minor.render();
        }
      )
    }
  }
  stop(): void {
    if (this.isRunning) {
      this.isRunning = false;
      engine_mod.Engine.stop();
    }
  }
  //#endregion
}
