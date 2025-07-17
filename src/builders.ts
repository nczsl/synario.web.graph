/**
 * 深度模板附件构建器
 * 用于批量构建 GPURenderPassDepthStencilAttachment 数组
 */
export class DepthStencilAttachmentBuilder {
  private depthStencilAttachment: GPURenderPassDepthStencilAttachment;

  /** 添加一个深度模板附件视图（必须） */
  setView(view: GPUTextureView): this {
    this.depthStencilAttachment  = {
      view,
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
      stencilClearValue: 0,
      stencilLoadOp: 'clear',
      stencilStoreOp: 'store',
    };
    return this;
  }

  /** 设置 depthClearValue */
  setDepthClearValue(value: number): this {
    this.depthStencilAttachment .depthClearValue = value;
    return this;
  }

  /** 设置 depthLoadOp */
  setDepthLoadOp(op: GPULoadOp): this {
    this.depthStencilAttachment .depthLoadOp = op;
    return this;
  }

  /** 设置 depthStoreOp */
  setDepthStoreOp(op: GPUStoreOp): this {
    this.depthStencilAttachment .depthStoreOp = op;
    return this;
  }

  /** 设置 stencilClearValue */
  setStencilClearValue(value: number): this {
    this.depthStencilAttachment .stencilClearValue = value;
    return this;
  }

  /** 设置 stencilLoadOp */
  setStencilLoadOp(op: GPULoadOp): this {
    this.depthStencilAttachment .stencilLoadOp = op;
    return this;
  }

  /** 设置 stencilStoreOp */
  setStencilStoreOp(op: GPUStoreOp): this {
    this.depthStencilAttachment .stencilStoreOp = op;
    return this;
  }

  /** 构建 GPURenderPassDepthStencilAttachment 数组 */
  build(): GPURenderPassDepthStencilAttachment {
    return this.depthStencilAttachment;
  }
}
/**
 * 颜色附件构建器
 * 用于批量构建 GPURenderPassColorAttachment 数组
 */
export class ColorAttachmentBuilder {
  private colorAttachment: GPURenderPassColorAttachment[] = [];
  private current: GPURenderPassColorAttachment;
  /** 添加一个颜色附件视图（必须） */
  addView(view: GPUTextureView): this {
    this.current = {
      view,
      clearValue: { r: 0, g: 0, b: 0, a: 1 }, // 默认清除颜色
      loadOp: 'clear', // 默认加载操作
      storeOp: 'store' // 默认存储操作
    };
    this.colorAttachment.push(this.current);
    return this;
  }

  /** 批量设置 clearValue，可单个或数组 */
  setClearValue(clearValue: GPUColor): this {
    this.current.clearValue = clearValue
    return this;
  }

  /** 批量设置 loadOp，可单个或数组 */
  setLoadOp(loadOp: GPULoadOp): this {
    this.current.loadOp = loadOp;
    return this;
  }

  /** 批量设置 storeOp，可单个或数组 */
  setStoreOp(storeOp: GPUStoreOp): this {
    this.current.storeOp = storeOp;
    return this;
  }

  /** 构建 GPURenderPassColorAttachment 数组 */
  build(): GPURenderPassColorAttachment[] {
    return this.colorAttachment;
  }
}
/**
 * Synario WebGPU Graphics Library
 * @file builders.ts
 * @description 构建器基类和通用构建器
 * @author Synario Team
 */
import { util_mod, engine_mod } from 'synario.base';
import * as types_mod from './types';


export class ColorStateBuilder {
  private states: GPUColorTargetState[] = [];

  addState(
    format: GPUTextureFormat,
    colorblend: GPUBlendComponent = {
      operation: "add",
      srcFactor: "one",
      dstFactor: "zero"
    },
    alphablend: GPUBlendComponent = {
      operation: "add",
      srcFactor: "one",
      dstFactor: "zero"
    }
  ): this {
    this.states.push({
      format: format,
      blend: {
        color: colorblend,
        alpha: alphablend
      },
      writeMask: GPUColorWrite.ALL
    });
    return this;
  }

  build(): GPUColorTargetState[] {
    if (this.states.length === 0) {
      throw new Error("No color target states configured");
    }
    return this.states;
  }
}
export class BindGroupLayoutBuilder {
  private entries: GPUBindGroupLayoutEntry[] = [];
  private bindingSet = new Set<number>();

  // Buffer类型配置（类型安全重载）
  addBuffer(
    binding: number,
    visibility: GPUShaderStageFlags,
    options: {
      type: GPUBufferBindingType;
      dynamicOffset?: boolean;
      minSize?: number; // 默认256字节对齐
    }
  ): this {
    this.validateBinding(binding);
    this.entries.push({
      binding,
      visibility,
      buffer: {
        type: options.type,
        hasDynamicOffset: options.dynamicOffset || false,
        minBindingSize: options.minSize || 256 // 常用默认值
      }
    });
    return this;
  }

  // Texture类型配置（独立方法防止参数混淆）
  addTexture(
    binding: number,
    visibility: GPUShaderStageFlags,
    sampleType: GPUTextureSampleType,
    viewDimension?: GPUTextureViewDimension
  ): this {
    this.validateBinding(binding);
    this.entries.push({
      binding,
      visibility,
      texture: { sampleType, viewDimension }
    });
    return this;
  }

  // 添加Sampler采样器支持
  addSampler(
    binding: number,
    visibility: GPUShaderStageFlags,
    type?: GPUSamplerBindingType
  ): this {
    this.validateBinding(binding);
    this.entries.push({
      binding,
      visibility,
      sampler: { type: type || 'filtering' }
    });
    return this;
  }

  // 添加StorageTexture存储纹理支持
  addStorageTexture(
    binding: number,
    visibility: GPUShaderStageFlags,
    format: GPUTextureFormat,
    access: GPUStorageTextureAccess = 'write-only',
    viewDimension?: GPUTextureViewDimension
  ): this {
    this.validateBinding(binding);
    this.entries.push({
      binding,
      visibility,
      storageTexture: {
        format,
        access,
        viewDimension
      }
    });
    return this;
  }

  // 添加ExternalTexture外部纹理支持
  addExternalTexture(
    binding: number,
    visibility: GPUShaderStageFlags
  ): this {
    this.validateBinding(binding);
    this.entries.push({
      binding,
      visibility,
      externalTexture: {}
    });
    return this;
  }

  // 构建时验证
  build(device: GPUDevice): GPUBindGroupLayout {
    if (this.entries.length === 0) throw new Error("Empty entries");
    return device.createBindGroupLayout({ entries: this.entries });
  }

  private validateBinding(binding: number) {
    if (this.bindingSet.has(binding)) throw new Error(`Duplicate binding ${binding}`);
    this.bindingSet.add(binding);
  }
}
/**
 * 纹理描述符构建器
 */
export class TextureDescriptorBuilder {
  private descriptor: GPUTextureDescriptor = {
    size: { width: 1, height: 1, depthOrArrayLayers: 1 },
    format: 'rgba8unorm',
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
  };


  // 设置纹理大小(独立参数版本)
  setSize(width: number, height: number, depthOrArrayLayers: number = 1): this {
    this.descriptor.size = { width, height, depthOrArrayLayers };
    return this;
  }


  setFormat(format: GPUTextureFormat): this {
    this.descriptor.format = format;
    return this;
  }


  setUsage(usage: GPUTextureUsageFlags): this {
    this.descriptor.usage = usage;
    return this;
  }

  setDimension(dimension: GPUTextureDimension = '1d'): this {
    this.descriptor.dimension = dimension;
    return this;
  }

  setMipLevelCount(mipLevelCount = 0): this {
    this.descriptor.mipLevelCount = mipLevelCount;
    return this;
  }

  setSampleCount(sampleCount: GPUIntegerCoordinate): this {
    this.descriptor.sampleCount = sampleCount;
    return this;
  }

  setViewFormats(viewFormats: GPUTextureFormat[]): this {
    this.descriptor.viewFormats = viewFormats;
    return this;
  }

  build(): GPUTextureDescriptor {
    return this.descriptor;
  }
}

/**
 * 采样器描述符构建器
 */
export class SamplerDescriptorBuilder {
  private descriptor: GPUSamplerDescriptor = {};

  setAddressMode(addressModeU: GPUAddressMode, addressModeV?: GPUAddressMode, addressModeW?: GPUAddressMode): this {
    this.descriptor.addressModeU = addressModeU;
    this.descriptor.addressModeV = addressModeV || addressModeU;
    this.descriptor.addressModeW = addressModeW || addressModeU;
    return this;
  }

  setMagFilter(filter: GPUFilterMode): this {
    this.descriptor.magFilter = filter;
    return this;
  }

  setMinFilter(filter: GPUFilterMode): this {
    this.descriptor.minFilter = filter;
    return this;
  }

  setMipmapFilter(filter: GPUMipmapFilterMode): this {
    this.descriptor.mipmapFilter = filter;
    return this;
  }

  setLodMinClamp(lodMinClamp: number): this {
    this.descriptor.lodMinClamp = lodMinClamp;
    return this;
  }

  setLodMaxClamp(lodMaxClamp: number): this {
    this.descriptor.lodMaxClamp = lodMaxClamp;
    return this;
  }

  setCompare(compare: GPUCompareFunction): this {
    this.descriptor.compare = compare;
    return this;
  }

  setMaxAnisotropy(maxAnisotropy: number): this {
    this.descriptor.maxAnisotropy = maxAnisotropy;
    return this;
  }

  build(): GPUSamplerDescriptor {
    return this.descriptor;
  }
}

/**
 * 绑定组构建器
 */
export class BindGroupBuilder {
  entries: GPUBindGroupEntry[] = [];
  private bindingSet = new Set<number>();

  // Buffer类型配置（类型安全重载）
  addBuffer(
    binding: number,
    buffer: GPUBuffer,
  ): this {
    this.validateBinding(binding);
    this.entries.push({
      binding: binding,
      resource: { buffer }
    });
    return this;
  }

  // Texture类型配置（独立方法防止参数混淆）
  addTexture(
    binding: number,
    textureView: GPUTextureView,
  ): this {
    this.validateBinding(binding);
    this.entries.push({
      binding: binding,
      resource: textureView
    });
    return this;
  }

  // 添加Sampler采样器支持
  addSampler(
    binding: number,
    sampler: GPUSampler,
  ): this {
    this.validateBinding(binding);
    this.entries.push({
      binding: binding,
      resource: sampler
    });
    return this;
  }


  // 构建时验证
  build(device: GPUDevice, layout: GPUBindGroupLayout): GPUBindGroup {
    if (this.entries.length === 0) throw new Error("Empty entries");
    return device.createBindGroup({ layout, entries: this.entries });
  }

  private validateBinding(binding: number) {
    if (this.bindingSet.has(binding)) throw new Error(`Duplicate binding ${binding}`);
    this.bindingSet.add(binding);
  }
}

/**
 * 通道描述符构建器
 * 用于构建 GPURenderPassDescriptor 和 GPUComputePassDescriptor
 */
export class PassEncoderDescriptorBuilder {
  private renderPassDesc: GPURenderPassDescriptor = {
    colorAttachments: [],
  };
  private colorAttachments: GPURenderPassColorAttachment[] = [];

  private computePassDesc: GPUComputePassDescriptor = {};

  private isRenderPass: boolean = true;

  constructor() {
    this.colorAttachments = [];
    this.renderPassDesc.colorAttachments = this.colorAttachments;
  }

  /**
   * 设置为渲染通道构建器模式
   */
  asRenderPass(): PassEncoderDescriptorBuilder {
    this.isRenderPass = true;
    return this;
  }

  /**
   * 设置为计算通道构建器模式
   */
  asComputePass(): PassEncoderDescriptorBuilder {
    this.isRenderPass = false;
    return this;
  }

  /**
   * 添加一个颜色附件 (仅适用于渲染通道)
   * @param attachment 颜色附件配置对象
   * @returns 构建器自身，便于链式调用
   */
  addColorAttachment(attachment: GPURenderPassColorAttachment): PassEncoderDescriptorBuilder {
    if (!this.isRenderPass) {
      throw new Error("Cannot add color attachment to compute pass");
    }

    this.colorAttachments.push(attachment);
    return this;
  }

  /**
   * 设置深度模板附件 (仅适用于渲染通道)
   * @param depthStencilAttachment 深度模板附件配置对象
   * @returns 构建器自身，便于链式调用
   */
  setDepthStencilAttachment(depthStencilAttachment: GPURenderPassDepthStencilAttachment): PassEncoderDescriptorBuilder {
    if (!this.isRenderPass) {
      throw new Error("Cannot add depth stencil attachment to compute pass");
    }

    this.renderPassDesc.depthStencilAttachment = depthStencilAttachment;
    return this;
  }

  /**
   * 设置遮挡查询集 (仅适用于渲染通道)
   * @param querySet 查询集
   * @returns 构建器自身，便于链式调用
   */
  setOcclusionQuerySet(querySet: GPUQuerySet): PassEncoderDescriptorBuilder {
    if (!this.isRenderPass) {
      throw new Error("Cannot set occlusion query set to compute pass");
    }

    this.renderPassDesc.occlusionQuerySet = querySet;
    return this;
  }

  /**
   * 添加标签
   * @param label 标签
   * @returns 构建器自身，便于链式调用
   */
  setLabel(label: string): PassEncoderDescriptorBuilder {
    if (this.isRenderPass) {
      this.renderPassDesc.label = label;
    } else {
      this.computePassDesc.label = label;
    }
    return this;
  }

  /**
   * 构建并返回通道描述符
   * @returns GPURenderPassDescriptor 或 GPUComputePassDescriptor
   */
  build(): types_mod.PassDescriptor {
    if (this.isRenderPass) {
      this.renderPassDesc.colorAttachments = this.colorAttachments;
      return this.renderPassDesc;
    } else {
      return this.computePassDesc;
    }
  }
}
