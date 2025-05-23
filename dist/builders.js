import { util_mod, engine_mod } from 'synario.base';
import * as types_mod from './types';
export class ColorStateBuilder {
    state = null;
    addState(format, colorblend = {
        operation: "add",
        srcFactor: "one",
        dstFactor: "zero"
    }, alphablend = {
        operation: "add",
        srcFactor: "one",
        dstFactor: "zero"
    }) {
        this.state = {
            format: format,
            blend: {
                color: colorblend,
                alpha: alphablend
            },
            writeMask: GPUColorWrite.ALL
        };
        return this;
    }
    build() {
        if (!this.state) {
            throw new Error("ColorTargetState not configured");
        }
        return this.state;
    }
}
export class BindGroupLayoutBuilder {
    entries = [];
    bindingSet = new Set();
    addBuffer(binding, visibility, options) {
        this.validateBinding(binding);
        this.entries.push({
            binding,
            visibility,
            buffer: {
                type: options.type,
                hasDynamicOffset: options.dynamicOffset || false,
                minBindingSize: options.minSize || 256
            }
        });
        return this;
    }
    addTexture(binding, visibility, sampleType, viewDimension) {
        this.validateBinding(binding);
        this.entries.push({
            binding,
            visibility,
            texture: { sampleType, viewDimension }
        });
        return this;
    }
    addSampler(binding, visibility, type) {
        this.validateBinding(binding);
        this.entries.push({
            binding,
            visibility,
            sampler: { type: type || 'filtering' }
        });
        return this;
    }
    addStorageTexture(binding, visibility, format, access = 'write-only', viewDimension) {
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
    addExternalTexture(binding, visibility) {
        this.validateBinding(binding);
        this.entries.push({
            binding,
            visibility,
            externalTexture: {}
        });
        return this;
    }
    build(device) {
        if (this.entries.length === 0)
            throw new Error("Empty entries");
        return device.createBindGroupLayout({ entries: this.entries });
    }
    validateBinding(binding) {
        if (this.bindingSet.has(binding))
            throw new Error(`Duplicate binding ${binding}`);
        this.bindingSet.add(binding);
    }
}
export class TextureDescriptorBuilder {
    descriptor = {
        size: { width: 1, height: 1, depthOrArrayLayers: 1 },
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
    };
    size(size) {
        this.descriptor.size = {
            width: size.width,
            height: size.height,
            depthOrArrayLayers: size.depthOrArrayLayers || 1
        };
        return this;
    }
    setSize(width, height, depthOrArrayLayers = 1) {
        this.descriptor.size = { width, height, depthOrArrayLayers };
        return this;
    }
    format(format) {
        this.descriptor.format = format;
        return this;
    }
    setFormat(format) {
        this.descriptor.format = format;
        return this;
    }
    usage(usage) {
        this.descriptor.usage = usage;
        return this;
    }
    setUsage(usage) {
        this.descriptor.usage = usage;
        return this;
    }
    setDimension(dimension) {
        this.descriptor.dimension = dimension;
        return this;
    }
    setMipLevelCount(mipLevelCount) {
        this.descriptor.mipLevelCount = mipLevelCount;
        return this;
    }
    setSampleCount(sampleCount) {
        this.descriptor.sampleCount = sampleCount;
        return this;
    }
    setViewFormats(viewFormats) {
        this.descriptor.viewFormats = viewFormats;
        return this;
    }
    build() {
        return this.descriptor;
    }
}
export class SamplerDescriptorBuilder {
    descriptor = {};
    setAddressMode(addressModeU, addressModeV, addressModeW) {
        this.descriptor.addressModeU = addressModeU;
        this.descriptor.addressModeV = addressModeV || addressModeU;
        this.descriptor.addressModeW = addressModeW || addressModeU;
        return this;
    }
    setMagFilter(filter) {
        this.descriptor.magFilter = filter;
        return this;
    }
    setMinFilter(filter) {
        this.descriptor.minFilter = filter;
        return this;
    }
    setMipmapFilter(filter) {
        this.descriptor.mipmapFilter = filter;
        return this;
    }
    setLodMinClamp(lodMinClamp) {
        this.descriptor.lodMinClamp = lodMinClamp;
        return this;
    }
    setLodMaxClamp(lodMaxClamp) {
        this.descriptor.lodMaxClamp = lodMaxClamp;
        return this;
    }
    setCompare(compare) {
        this.descriptor.compare = compare;
        return this;
    }
    setMaxAnisotropy(maxAnisotropy) {
        this.descriptor.maxAnisotropy = maxAnisotropy;
        return this;
    }
    build() {
        return this.descriptor;
    }
}
export class BindGroupBuilder {
    entries = [];
    bindingSet = new Set();
    addBuffer(no, buffer) {
        this.validateBinding(no);
        this.entries.push({
            binding: no,
            resource: { buffer }
        });
        return this;
    }
    addTexture(no, textureView) {
        this.validateBinding(no);
        this.entries.push({
            binding: no,
            resource: textureView
        });
        return this;
    }
    addSampler(no, sampler) {
        this.validateBinding(no);
        this.entries.push({
            binding: no,
            resource: sampler
        });
        return this;
    }
    build(device, layout) {
        if (this.entries.length === 0)
            throw new Error("Empty entries");
        return device.createBindGroup({ layout, entries: this.entries });
    }
    validateBinding(binding) {
        if (this.bindingSet.has(binding))
            throw new Error(`Duplicate binding ${binding}`);
        this.bindingSet.add(binding);
    }
}
export class PassEncoderDescriptorBuilder {
    renderPassDesc = {
        colorAttachments: [],
    };
    colorAttachments = [];
    computePassDesc = {};
    isRenderPass = true;
    constructor() {
        this.colorAttachments = [];
        this.renderPassDesc.colorAttachments = this.colorAttachments;
    }
    asRenderPass() {
        this.isRenderPass = true;
        return this;
    }
    asComputePass() {
        this.isRenderPass = false;
        return this;
    }
    addColorAttachment(attachment) {
        if (!this.isRenderPass) {
            throw new Error("Cannot add color attachment to compute pass");
        }
        this.colorAttachments.push(attachment);
        return this;
    }
    setDepthStencilAttachment(depthStencilAttachment) {
        if (!this.isRenderPass) {
            throw new Error("Cannot add depth stencil attachment to compute pass");
        }
        this.renderPassDesc.depthStencilAttachment = depthStencilAttachment;
        return this;
    }
    setOcclusionQuerySet(querySet) {
        if (!this.isRenderPass) {
            throw new Error("Cannot set occlusion query set to compute pass");
        }
        this.renderPassDesc.occlusionQuerySet = querySet;
        return this;
    }
    setLabel(label) {
        if (this.isRenderPass) {
            this.renderPassDesc.label = label;
        }
        else {
            this.computePassDesc.label = label;
        }
        return this;
    }
    build() {
        if (this.isRenderPass) {
            this.renderPassDesc.colorAttachments = this.colorAttachments;
            return this.renderPassDesc;
        }
        else {
            return this.computePassDesc;
        }
    }
}
