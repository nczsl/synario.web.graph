import * as types_mod from './types';
import * as store_mod from './store';
import * as signal_mod from './signal';
import * as builders_mod from './builders';
import * as camera_mod from './camera';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as pipeline_builder_mod from './pipeline-builder';
import * as scenery_mod from './scenery';
import * as gmath_mod from './gmath';
/**
 * 函数中会尽量使用各种 types_mod定义的Handler 函数来注册资源
 */
export class DataAccess {
  store: store_mod.Store;
  scenery: scenery_mod.Scenery;
  // 新增：保存常用 colorTargetState 的 id
  colorTargetStateIds: { [key: string]: types_mod.Id } = {};

  constructor(scen: scenery_mod.Scenery) {
    this.scenery = scen;
    this.store = new store_mod.Store();
  }
  // registryView(texture: GPUTexture): types_mod.Id {
  //   let view = this.store.registry<GPUTextureView>(types_mod.ResType.textureView, texture.createView());
  //   return view;
  // }
  
  registryRenderPipeline(config: types_mod.PipelineHandler): types_mod.Id {
    let builder = new pipeline_builder_mod.PipelineBuilder(this.scenery.device, true);
    let renderpipeline = config(builder) as GPURenderPipeline;
    const id = this.store.registry<GPURenderPipeline>(types_mod.ResType.renderpipeline, renderpipeline);
    return id;
  }
  registryComputePipeline(config: types_mod.PipelineHandler): types_mod.Id {
    let builder = new pipeline_builder_mod.PipelineBuilder(this.scenery.device, false);
    let computepipeline = config(builder) as GPUComputePipeline;
    const id = this.store.registry<GPUComputePipeline>(types_mod.ResType.computepipeline, computepipeline);
    return id;
  }
  //bindgrouplayout
  registryBindGroupLayout(config: types_mod.BindGroupLayoutHandler): types_mod.Id {
    let builder = new builders_mod.BindGroupLayoutBuilder();
    let bindGroupLayout = config(builder) as GPUBindGroupLayout;
    const id = this.store.registry<GPUBindGroupLayout>(types_mod.ResType.bindGroupLayout, bindGroupLayout);
    return id;
  }
  //bindgroup
  registryBindGroup(config: types_mod.BindGroupHandler): types_mod.Id {
    let builder = new builders_mod.BindGroupBuilder();
    let bindGroup = config(builder);
    const id = this.store.registry<GPUBindGroup>(types_mod.ResType.bindGroup, bindGroup);
    return id;
  }
  //buffer
  /** 注意会报错size有最小要求 一般是256所以本注册会自动设置最小size=256 */
  registryBuffer(size: GPUSize32, usage?: GPUBufferUsageFlags): types_mod.Id {
    // size = Math.max(size, 256); // 修正：确保最小大小为256
    let buffer = this.scenery.device.createBuffer({
      size,
      usage: usage ?? (GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
    });
    const id = this.store.registry<GPUBuffer>(types_mod.ResType.buffer, buffer);
    return id;
  }
  updateBuffer(id: types_mod.Id, data: ArrayBufferLike): void {
    let buffer = this.store.get<GPUBuffer>(types_mod.ResType.buffer, id);
    if (buffer === undefined) return;
    this.scenery.device.queue.writeBuffer(buffer, 0, data, 0);
  }
  //
  //texture
  registryTexture(config: types_mod.TextureDescriptorHandler): types_mod.Id {
    let builder = new builders_mod.TextureDescriptorBuilder();
    let textureDescriptor = config(builder);
    let texture: GPUTexture = this.scenery.device.createTexture(textureDescriptor);
    const id = this.store.registry<GPUTexture>(types_mod.ResType.texture, texture);
    return id;
  }
  //update texture from arraybufferlike
  updateTexture(
    id: types_mod.Id,
    data: ArrayBufferLike,
    options: {
      width: number;
      height: number;
      format: GPUTextureFormat;
      bytesPerRow?: number;
      rowsPerImage?: number;
      offset?: number;
      mipLevel?: number;
      depthOrArrayLayers?: number;
    }
  ): void {
    if (!id) throw new Error("Invalid texture id");
    const texture = this.store.get<GPUTexture>(types_mod.ResType.texture, id);
    if (!texture) throw new Error(`Texture ${id} not found`);

    const {
      width,
      height,
      format,
      bytesPerRow,
      rowsPerImage,
      offset = 0,
      mipLevel = 0,
      depthOrArrayLayers = 1
    } = options;

    // 计算每像素字节数
    let bytesPerPixel = 4;
    switch (format) {
      case 'r8unorm': case 'r8snorm': case 'r8uint': case 'r8sint': bytesPerPixel = 1; break;
      case 'rg8unorm': case 'rg8snorm': case 'rg8uint': case 'rg8sint': case 'r16float': case 'r16uint': case 'r16sint': bytesPerPixel = 2; break;
      case 'rgba8unorm': case 'rgba8unorm-srgb': case 'rgba8snorm': case 'rgba8uint': case 'rgba8sint': case 'bgra8unorm': case 'bgra8unorm-srgb': case 'rg16float': case 'rg16uint': case 'rg16sint': bytesPerPixel = 4; break;
      case 'rgba16float': case 'rgba16uint': case 'rgba16sint': bytesPerPixel = 8; break;
      case 'rgba32float': case 'rgba32uint': case 'rgba32sint': bytesPerPixel = 16; break;
      default: bytesPerPixel = 4;
    }

    // 计算并对齐 bytesPerRow
    let bpr = bytesPerRow || width * bytesPerPixel;
    bpr = Math.ceil(bpr / 256) * 256;

    this.scenery.device.queue.writeTexture(
      { texture, mipLevel },
      data,
      {
        bytesPerRow: bpr,
        rowsPerImage: rowsPerImage || height,
        offset
      },
      {
        width,
        height,
        depthOrArrayLayers
      }
    );
  }
  // 

  initSignalCamera(signal: signal_mod.Signal, camera: camera_mod.Camera): void {
    //signal gbufferid - 现在只有一个组合缓冲区
    signal.gbufferId = this.registryBuffer(signal_mod.Signal.COMBINED_BUFFER_SIZE, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);

    // signal组合缓冲区 VS/FS layout
    signal.bindGroupLayoutId_vs = this.registryBindGroupLayout(builder => {
      // 之前是三个buffer，现在合并为一个
      // 绑定点0: 包含mouse, key, tick数据的组合缓冲区
      builder.addBuffer(0, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage', minSize: signal_mod.Signal.COMBINED_BUFFER_SIZE });
      return builder.build(this.scenery.device);
    });
    signal.bindGroupId_vs = this.registryBindGroup(builder => {
      builder.addBuffer(0, this.store.get<GPUBuffer>(types_mod.ResType.buffer, signal.gbufferId));
      return builder.build(this.scenery.device, this.store.get(types_mod.ResType.bindGroupLayout, signal.bindGroupLayoutId_vs));
    });

    // signal组合缓冲区 CS layout
    signal.bindGroupLayoutId_cs = this.registryBindGroupLayout(builder => {
      // 绑定点0: 包含mouse, key, tick数据的组合缓冲区
      builder.addBuffer(0, GPUShaderStage.COMPUTE, { type: 'storage', minSize: signal_mod.Signal.COMBINED_BUFFER_SIZE });
      return builder.build(this.scenery.device);
    });
    signal.bindGroupId_cs = this.registryBindGroup(builder => {
      builder.addBuffer(0, this.store.get<GPUBuffer>(types_mod.ResType.buffer, signal.gbufferId));
      return builder.build(this.scenery.device, this.store.get(types_mod.ResType.bindGroupLayout, signal.bindGroupLayoutId_cs));
    });

    // camera VS/FS (camera部分保持不变)
    camera.bufferId = this.registryBuffer(camera_mod.Camera.BUFFER_SIZE, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    camera.bindgrouplayoutId_vs = this.registryBindGroupLayout(builder => {
      builder.addBuffer(
        0,
        GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        {
          type: 'uniform',
          minSize: camera_mod.Camera.BUFFER_SIZE // 保持与 camera.ts 中一致
        }
      );
      return builder.build(this.scenery.device);
    });
    camera.bindgroupId_vs = this.registryBindGroup(builder => {
      builder.addBuffer(0, this.store.get<GPUBuffer>(types_mod.ResType.buffer, camera.bufferId));
      return builder.build(this.scenery.device, this.store.get(types_mod.ResType.bindGroupLayout, camera.bindgrouplayoutId_vs));
    });

    // camera CS
    camera.bindgrouplayoutId_cs = this.registryBindGroupLayout(builder => {
      builder.addBuffer(
        0,
        GPUShaderStage.COMPUTE,
        {
          type: 'uniform',
          minSize: camera_mod.Camera.BUFFER_SIZE
        }
      );
      return builder.build(this.scenery.device);
    });
    camera.bindgroupId_cs = this.registryBindGroup(builder => {
      builder.addBuffer(0, this.store.get<GPUBuffer>(types_mod.ResType.buffer, camera.bufferId));
      return builder.build(this.scenery.device, this.store.get(types_mod.ResType.bindGroupLayout, camera.bindgrouplayoutId_cs));
    });
  }
}
