import * as types_mod from './types';
export declare class ColorStateBuilder {
    private state;
    addState(format: GPUTextureFormat, colorblend?: GPUBlendComponent, alphablend?: GPUBlendComponent): this;
    build(): GPUColorTargetState;
}
export declare class BindGroupLayoutBuilder {
    private entries;
    private bindingSet;
    addBuffer(binding: number, visibility: GPUShaderStageFlags, options: {
        type: GPUBufferBindingType;
        dynamicOffset?: boolean;
        minSize?: number;
    }): this;
    addTexture(binding: number, visibility: GPUShaderStageFlags, sampleType: GPUTextureSampleType, viewDimension?: GPUTextureViewDimension): this;
    addSampler(binding: number, visibility: GPUShaderStageFlags, type?: GPUSamplerBindingType): this;
    addStorageTexture(binding: number, visibility: GPUShaderStageFlags, format: GPUTextureFormat, access?: GPUStorageTextureAccess, viewDimension?: GPUTextureViewDimension): this;
    addExternalTexture(binding: number, visibility: GPUShaderStageFlags): this;
    build(device: GPUDevice): GPUBindGroupLayout;
    private validateBinding;
}
export declare class TextureDescriptorBuilder {
    private descriptor;
    size(size: {
        width: number;
        height: number;
        depthOrArrayLayers?: number;
    }): this;
    setSize(width: number, height: number, depthOrArrayLayers?: number): this;
    format(format: GPUTextureFormat): this;
    setFormat(format: GPUTextureFormat): this;
    usage(usage: GPUTextureUsageFlags): this;
    setUsage(usage: GPUTextureUsageFlags): this;
    setDimension(dimension: GPUTextureDimension): this;
    setMipLevelCount(mipLevelCount: GPUIntegerCoordinate): this;
    setSampleCount(sampleCount: GPUIntegerCoordinate): this;
    setViewFormats(viewFormats: GPUTextureFormat[]): this;
    build(): GPUTextureDescriptor;
}
export declare class SamplerDescriptorBuilder {
    private descriptor;
    setAddressMode(addressModeU: GPUAddressMode, addressModeV?: GPUAddressMode, addressModeW?: GPUAddressMode): this;
    setMagFilter(filter: GPUFilterMode): this;
    setMinFilter(filter: GPUFilterMode): this;
    setMipmapFilter(filter: GPUMipmapFilterMode): this;
    setLodMinClamp(lodMinClamp: number): this;
    setLodMaxClamp(lodMaxClamp: number): this;
    setCompare(compare: GPUCompareFunction): this;
    setMaxAnisotropy(maxAnisotropy: number): this;
    build(): GPUSamplerDescriptor;
}
export declare class BindGroupBuilder {
    entries: GPUBindGroupEntry[];
    private bindingSet;
    addBuffer(no: number, buffer: GPUBuffer): this;
    addTexture(no: number, textureView: GPUTextureView): this;
    addSampler(no: number, sampler: GPUSampler): this;
    build(device: GPUDevice, layout: GPUBindGroupLayout): GPUBindGroup;
    private validateBinding;
}
export declare class PassEncoderDescriptorBuilder {
    private renderPassDesc;
    private colorAttachments;
    private computePassDesc;
    private isRenderPass;
    constructor();
    asRenderPass(): PassEncoderDescriptorBuilder;
    asComputePass(): PassEncoderDescriptorBuilder;
    addColorAttachment(attachment: GPURenderPassColorAttachment): PassEncoderDescriptorBuilder;
    setDepthStencilAttachment(depthStencilAttachment: GPURenderPassDepthStencilAttachment): PassEncoderDescriptorBuilder;
    setOcclusionQuerySet(querySet: GPUQuerySet): PassEncoderDescriptorBuilder;
    setLabel(label: string): PassEncoderDescriptorBuilder;
    build(): types_mod.PassDescriptor;
}
