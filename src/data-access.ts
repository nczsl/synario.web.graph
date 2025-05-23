import * as types_mod from './types';
import * as store_mod from './store';
import * as signal_mod from './signal';
import * as builders_mod from './builders';
import * as camera_mod from './camera';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as pipeline_builder_mod from './pipeline-builder';
import * as scenery_mod from './scenery';
import * as gmath_mod from './gmath';
import * as model_mod from './model';

export class DataAccess {
  store: store_mod.Store;
  scen: scenery_mod.Scenery;
  // 新增：保存常用 colorTargetState 的 id
  colorTargetStateIds: { [key: string]: types_mod.Id } = {};

  constructor(scen: scenery_mod.Scenery) {
    this.scen = scen;
    this.store = new store_mod.Store();
    this.initColorTargetState(); // 初始化常用的 colorTargetState 预设
  }
  registryView(texture: GPUTexture): types_mod.Id {
    let view = this.store.registry<GPUTextureView>(types_mod.ResType.textureView, texture.createView());
    return view;
  }
  //registry passparam
  registryPassParam(param?: types_mod.PassParam): types_mod.Id {
    let type: types_mod.ResType = types_mod.ResType.passParam;
    let actualParam = param == undefined ? {} : param;
    const id = this.store.registry<types_mod.PassParam>(type, actualParam);
    return id;
  }
  registryRenderPipeline(config: types_mod.PipelineHandler): types_mod.Id {
    let builder = new pipeline_builder_mod.PipelineBuilder(this.scen.device, true);
    let renderpipeline = config(builder) as GPURenderPipeline;
    const id = this.store.registry<GPURenderPipeline>(types_mod.ResType.renderpipeline, renderpipeline);
    return id;
  }
  registryComputePipeline(config: types_mod.PipelineHandler): types_mod.Id {
    let builder = new pipeline_builder_mod.PipelineBuilder(this.scen.device, false);
    let computepipeline = config(builder) as GPUComputePipeline;
    const id = this.store.registry<GPUComputePipeline>(types_mod.ResType.computepipeline, computepipeline);
    return id;
  }
  //color attachment
  registryColorAttachment(colorAttachment: GPURenderPassColorAttachment): types_mod.Id {
    const id = this.store.registry<GPURenderPassColorAttachment>(types_mod.ResType.colorAttachment, colorAttachment);
    return id;
  }
  //colorTargetState
  registryColorTargetState(config: types_mod.ColorStateHandler): types_mod.Id {
    let builder = new builders_mod.ColorStateBuilder();
    let colorTargetState = config(builder) as GPUColorTargetState;
    const id = this.store.registry<GPUColorTargetState>(types_mod.ResType.colorTargetState, colorTargetState);
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
  //vertexBufferLayout
  registryVertexBufferLayout(config: types_mod.VertexFormatHandler): types_mod.Id {
    let builder = new vertex_format_builder_mod.VertexBufferBuilder();
    let vertexBufferLayout = config(builder);
    if (vertexBufferLayout) {
      const id = this.store.registry<GPUVertexBufferLayout>(types_mod.ResType.vertexBufferLayout, vertexBufferLayout);
      return id;
    } else {
      throw new Error(`Vertex buffer layout is undefined`);
    }
  }
  //buffer
  /** 注意会报错size有最小要求 一般是256所以本注册会自动设置最小size=256 */
  registryBuffer(size: GPUSize32, usage?: GPUBufferUsageFlags): types_mod.Id {
    // size = Math.max(size, 256); // 修正：确保最小大小为256
    let buffer = this.scen.device.createBuffer({
      size,
      usage: usage ?? (GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
    });
    const id = this.store.registry<GPUBuffer>(types_mod.ResType.buffer, buffer);
    return id;
  }
  updateBuffer(id: types_mod.Id, data: ArrayBufferLike): void {
    let buffer = this.store.get<GPUBuffer>(types_mod.ResType.buffer, id);
    if (buffer === undefined) return;
    this.scen.device.queue.writeBuffer(buffer, 0, data, 0);
  }
  //
  //texture
  registryTexture(config: types_mod.TextureDescriptorHandler): types_mod.Id {
    let builder = new builders_mod.TextureDescriptorBuilder();
    let textureDescriptor = config(builder);
    let texture: GPUTexture = this.scen.device.createTexture(textureDescriptor);
    const id = this.store.registry<GPUTexture>(types_mod.ResType.texture, texture);
    return id;
  }
  //update texture from arraybufferlike
  updateTexture(id: types_mod.Id, data: ArrayBufferLike, options?: {
    bytesPerRow?: number;
    rowsPerImage?: number;
    width?: number;
    height?: number;
    depthOrArrayLayers?: number;
    offset?: number;
    format?: GPUTextureFormat; // 纹理格式
    mipLevel?: number; // MIP级别
  }): void {
    if (id) {
      let texture = this.store.get<GPUTexture>(types_mod.ResType.texture, id);

      // 获取纹理的实际尺寸
      const textureWidth = options?.width || texture.width;
      const textureHeight = options?.height || texture.height;
      const depthOrArrayLayers = options?.depthOrArrayLayers || 1;
      const mipLevel = options?.mipLevel || 0;
      const offset = options?.offset || 0;

      // 根据纹理格式计算每像素字节数
      let bytesPerPixel = 4; // 默认RGBA格式，4字节/像素
      if (options?.format) {
        // 根据提供的格式计算每像素字节数
        switch (options.format) {
          case 'r8unorm':
          case 'r8snorm':
          case 'r8uint':
          case 'r8sint':
            bytesPerPixel = 1;
            break;
          case 'rg8unorm':
          case 'rg8snorm':
          case 'rg8uint':
          case 'rg8sint':
          case 'r16float':
          case 'r16uint':
          case 'r16sint':
            bytesPerPixel = 2;
            break;
          case 'rgba8unorm':
          case 'rgba8unorm-srgb':
          case 'rgba8snorm':
          case 'rgba8uint':
          case 'rgba8sint':
          case 'bgra8unorm':
          case 'bgra8unorm-srgb':
          case 'rg16float':
          case 'rg16uint':
          case 'rg16sint':
            bytesPerPixel = 4;
            break;
          case 'rgba16float':
          case 'rgba16uint':
          case 'rgba16sint':
            bytesPerPixel = 8;
            break;
          case 'rgba32float':
          case 'rgba32uint':
          case 'rgba32sint':
            bytesPerPixel = 16;
            break;
          default:
            bytesPerPixel = 4; // 默认值
        }
      }

      // 计算每行字节数（如果未提供）
      const bytesPerRow = options?.bytesPerRow || (textureWidth * bytesPerPixel);

      // 计算每张图像的行数（如果未提供）
      const rowsPerImage = options?.rowsPerImage || textureHeight;

      this.scen.device.queue.writeTexture(
        {
          texture: texture,
          mipLevel: mipLevel
        },
        data,
        {
          bytesPerRow: bytesPerRow,
          rowsPerImage: rowsPerImage,
          offset: offset
        },
        {
          width: textureWidth,
          height: textureHeight,
          depthOrArrayLayers: depthOrArrayLayers
        }
      );
    } else {
      throw new Error(`Texture ${id} not found`);
    }
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
      return builder.build(this.scen.device);
    });
    signal.bindGroupId_vs = this.registryBindGroup(builder => {
      builder.addBuffer(0, this.store.get<GPUBuffer>(types_mod.ResType.buffer, signal.gbufferId));
      return builder.build(this.scen.device, this.store.get(types_mod.ResType.bindGroupLayout, signal.bindGroupLayoutId_vs));
    });

    // signal组合缓冲区 CS layout
    signal.bindGroupLayoutId_cs = this.registryBindGroupLayout(builder => {
      // 绑定点0: 包含mouse, key, tick数据的组合缓冲区
      builder.addBuffer(0, GPUShaderStage.COMPUTE, { type: 'storage', minSize: signal_mod.Signal.COMBINED_BUFFER_SIZE });
      return builder.build(this.scen.device);
    });
    signal.bindGroupId_cs = this.registryBindGroup(builder => {
      builder.addBuffer(0, this.store.get<GPUBuffer>(types_mod.ResType.buffer, signal.gbufferId));
      return builder.build(this.scen.device, this.store.get(types_mod.ResType.bindGroupLayout, signal.bindGroupLayoutId_cs));
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
      return builder.build(this.scen.device);
    });
    camera.bindgroupId_vs = this.registryBindGroup(builder => {
      builder.addBuffer(0, this.store.get<GPUBuffer>(types_mod.ResType.buffer, camera.bufferId));
      return builder.build(this.scen.device, this.store.get(types_mod.ResType.bindGroupLayout, camera.bindgrouplayoutId_vs));
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
      return builder.build(this.scen.device);
    });
    camera.bindgroupId_cs = this.registryBindGroup(builder => {
      builder.addBuffer(0, this.store.get<GPUBuffer>(types_mod.ResType.buffer, camera.bufferId));
      return builder.build(this.scen.device, this.store.get(types_mod.ResType.bindGroupLayout, camera.bindgrouplayoutId_cs));
    });
  }

  /**
   * 注册常用的 GPUColorTargetState 预设对象
   */
  initColorTargetState(): void {
    // 例如：标准RGBA8无混合
    this.colorTargetStateIds['rgba8unorm'] = this.registryColorTargetState(builder => {
      return builder.addState('rgba8unorm').build();
    });
    // 例如：标准RGBA8带alpha混合
    this.colorTargetStateIds['rgba8unorm-alpha-blend'] = this.registryColorTargetState(builder => {
      return builder.addState(
        'rgba8unorm',
        {
          operation: "add",
          srcFactor: "src-alpha",
          dstFactor: "one-minus-src-alpha"
        },
        {
          operation: "add",
          srcFactor: "one",
          dstFactor: "one-minus-src-alpha"
        }
      ).build();
    });
    // 修正：主色附件格式应与 context.configure 保持一致（bgra8unorm）
    this.colorTargetStateIds['bgra8unorm'] = this.registryColorTargetState(builder => {
      return builder.addState('bgra8unorm').build();
    });
    // 例如：标准RGBA8带alpha混合
    this.colorTargetStateIds['bgra8unorm-alpha-blend'] = this.registryColorTargetState(builder => {
      return builder.addState(
        'bgra8unorm',
        {
          operation: "add",
          srcFactor: "src-alpha",
          dstFactor: "one-minus-src-alpha"
        },
        {
          operation: "add",
          srcFactor: "one",
          dstFactor: "one-minus-src-alpha"
        }
      ).build();
    });
    // 可继续添加更多预设
  }
}
