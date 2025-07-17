import * as types_mod from './types';
import * as store_mod from './store';
import * as signal_mod from './signal';
import * as builders_mod from './builders';
import * as camera_mod from './camera';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as pipeline_builder_mod from './pipeline-builder';
import * as scenery_mod from './scenery';
import * as gmath_mod from './gmath';
export class DataAccess {
    store;
    scenery;
    colorTargetStateIds = {};
    constructor(scen) {
        this.scenery = scen;
        this.store = new store_mod.Store();
    }
    registryRenderPipeline(config) {
        let builder = new pipeline_builder_mod.PipelineBuilder(this.scenery.device, true);
        let renderpipeline = config(builder);
        const id = this.store.registry(types_mod.ResType.renderpipeline, renderpipeline);
        return id;
    }
    registryComputePipeline(config) {
        let builder = new pipeline_builder_mod.PipelineBuilder(this.scenery.device, false);
        let computepipeline = config(builder);
        const id = this.store.registry(types_mod.ResType.computepipeline, computepipeline);
        return id;
    }
    registryBindGroupLayout(config) {
        let builder = new builders_mod.BindGroupLayoutBuilder();
        let bindGroupLayout = config(builder);
        const id = this.store.registry(types_mod.ResType.bindGroupLayout, bindGroupLayout);
        return id;
    }
    registryBindGroup(config) {
        let builder = new builders_mod.BindGroupBuilder();
        let bindGroup = config(builder);
        const id = this.store.registry(types_mod.ResType.bindGroup, bindGroup);
        return id;
    }
    registryBuffer(size, usage) {
        let buffer = this.scenery.device.createBuffer({
            size,
            usage: usage ?? (GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
        });
        const id = this.store.registry(types_mod.ResType.buffer, buffer);
        return id;
    }
    updateBuffer(id, data) {
        let buffer = this.store.get(types_mod.ResType.buffer, id);
        if (buffer === undefined)
            return;
        this.scenery.device.queue.writeBuffer(buffer, 0, data, 0);
    }
    registryTexture(config) {
        let builder = new builders_mod.TextureDescriptorBuilder();
        let textureDescriptor = config(builder);
        let texture = this.scenery.device.createTexture(textureDescriptor);
        const id = this.store.registry(types_mod.ResType.texture, texture);
        return id;
    }
    updateTexture(id, data, options) {
        if (!id)
            throw new Error("Invalid texture id");
        const texture = this.store.get(types_mod.ResType.texture, id);
        if (!texture)
            throw new Error(`Texture ${id} not found`);
        const { width, height, format, bytesPerRow, rowsPerImage, offset = 0, mipLevel = 0, depthOrArrayLayers = 1 } = options;
        let bytesPerPixel = 4;
        switch (format) {
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
            default: bytesPerPixel = 4;
        }
        let bpr = bytesPerRow || width * bytesPerPixel;
        bpr = Math.ceil(bpr / 256) * 256;
        this.scenery.device.queue.writeTexture({ texture, mipLevel }, data, {
            bytesPerRow: bpr,
            rowsPerImage: rowsPerImage || height,
            offset
        }, {
            width,
            height,
            depthOrArrayLayers
        });
    }
    initSignalCamera(signal, camera) {
        signal.gbufferId = this.registryBuffer(signal_mod.Signal.COMBINED_BUFFER_SIZE, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
        signal.bindGroupLayoutId_vs = this.registryBindGroupLayout(builder => {
            builder.addBuffer(0, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage', minSize: signal_mod.Signal.COMBINED_BUFFER_SIZE });
            return builder.build(this.scenery.device);
        });
        signal.bindGroupId_vs = this.registryBindGroup(builder => {
            builder.addBuffer(0, this.store.get(types_mod.ResType.buffer, signal.gbufferId));
            return builder.build(this.scenery.device, this.store.get(types_mod.ResType.bindGroupLayout, signal.bindGroupLayoutId_vs));
        });
        signal.bindGroupLayoutId_cs = this.registryBindGroupLayout(builder => {
            builder.addBuffer(0, GPUShaderStage.COMPUTE, { type: 'storage', minSize: signal_mod.Signal.COMBINED_BUFFER_SIZE });
            return builder.build(this.scenery.device);
        });
        signal.bindGroupId_cs = this.registryBindGroup(builder => {
            builder.addBuffer(0, this.store.get(types_mod.ResType.buffer, signal.gbufferId));
            return builder.build(this.scenery.device, this.store.get(types_mod.ResType.bindGroupLayout, signal.bindGroupLayoutId_cs));
        });
        camera.bufferId = this.registryBuffer(camera_mod.Camera.BUFFER_SIZE, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        camera.bindgrouplayoutId_vs = this.registryBindGroupLayout(builder => {
            builder.addBuffer(0, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, {
                type: 'uniform',
                minSize: camera_mod.Camera.BUFFER_SIZE
            });
            return builder.build(this.scenery.device);
        });
        camera.bindgroupId_vs = this.registryBindGroup(builder => {
            builder.addBuffer(0, this.store.get(types_mod.ResType.buffer, camera.bufferId));
            return builder.build(this.scenery.device, this.store.get(types_mod.ResType.bindGroupLayout, camera.bindgrouplayoutId_vs));
        });
        camera.bindgrouplayoutId_cs = this.registryBindGroupLayout(builder => {
            builder.addBuffer(0, GPUShaderStage.COMPUTE, {
                type: 'uniform',
                minSize: camera_mod.Camera.BUFFER_SIZE
            });
            return builder.build(this.scenery.device);
        });
        camera.bindgroupId_cs = this.registryBindGroup(builder => {
            builder.addBuffer(0, this.store.get(types_mod.ResType.buffer, camera.bufferId));
            return builder.build(this.scenery.device, this.store.get(types_mod.ResType.bindGroupLayout, camera.bindgrouplayoutId_cs));
        });
    }
}
