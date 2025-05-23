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
    store;
    scen;
    colorTargetStateIds = {};
    constructor(scen) {
        this.scen = scen;
        this.store = new store_mod.Store();
        this.initColorTargetState();
    }
    registryView(texture) {
        let view = this.store.registry(types_mod.ResType.textureView, texture.createView());
        return view;
    }
    registryPassParam(param) {
        let type = types_mod.ResType.passParam;
        let actualParam = param == undefined ? {} : param;
        const id = this.store.registry(type, actualParam);
        return id;
    }
    registryRenderPipeline(config) {
        let builder = new pipeline_builder_mod.PipelineBuilder(this.scen.device, true);
        let renderpipeline = config(builder);
        const id = this.store.registry(types_mod.ResType.renderpipeline, renderpipeline);
        return id;
    }
    registryComputePipeline(config) {
        let builder = new pipeline_builder_mod.PipelineBuilder(this.scen.device, false);
        let computepipeline = config(builder);
        const id = this.store.registry(types_mod.ResType.computepipeline, computepipeline);
        return id;
    }
    registryColorAttachment(colorAttachment) {
        const id = this.store.registry(types_mod.ResType.colorAttachment, colorAttachment);
        return id;
    }
    registryColorTargetState(config) {
        let builder = new builders_mod.ColorStateBuilder();
        let colorTargetState = config(builder);
        const id = this.store.registry(types_mod.ResType.colorTargetState, colorTargetState);
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
    registryVertexBufferLayout(config) {
        let builder = new vertex_format_builder_mod.VertexBufferBuilder();
        let vertexBufferLayout = config(builder);
        if (vertexBufferLayout) {
            const id = this.store.registry(types_mod.ResType.vertexBufferLayout, vertexBufferLayout);
            return id;
        }
        else {
            throw new Error(`Vertex buffer layout is undefined`);
        }
    }
    registryBuffer(size, usage) {
        let buffer = this.scen.device.createBuffer({
            size: size,
            usage: usage ?? (GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST),
        });
        const id = this.store.registry(types_mod.ResType.buffer, buffer);
        return id;
    }
    updateBuffer(id, data) {
        let buffer = this.store.get(types_mod.ResType.buffer, id);
        if (buffer === undefined)
            return;
        let byteLength = data.byteLength - (data.byteLength % 4);
        if (byteLength === 0)
            return;
        this.scen.device.queue.writeBuffer(buffer, 0, data, 0, byteLength);
    }
    registryTexture(config) {
        let builder = new builders_mod.TextureDescriptorBuilder();
        let textureDescriptor = config(builder);
        let texture = this.scen.device.createTexture(textureDescriptor);
        const id = this.store.registry(types_mod.ResType.texture, texture);
        return id;
    }
    updateTexture(id, data, options) {
        if (id) {
            let texture = this.store.get(types_mod.ResType.texture, id);
            const textureWidth = options?.width || texture.width;
            const textureHeight = options?.height || texture.height;
            const depthOrArrayLayers = options?.depthOrArrayLayers || 1;
            const mipLevel = options?.mipLevel || 0;
            const offset = options?.offset || 0;
            let bytesPerPixel = 4;
            if (options?.format) {
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
                        bytesPerPixel = 4;
                }
            }
            const bytesPerRow = options?.bytesPerRow || (textureWidth * bytesPerPixel);
            const rowsPerImage = options?.rowsPerImage || textureHeight;
            this.scen.device.queue.writeTexture({
                texture: texture,
                mipLevel: mipLevel
            }, data, {
                bytesPerRow: bytesPerRow,
                rowsPerImage: rowsPerImage,
                offset: offset
            }, {
                width: textureWidth,
                height: textureHeight,
                depthOrArrayLayers: depthOrArrayLayers
            });
        }
        else {
            throw new Error(`Texture ${id} not found`);
        }
    }
    initSignalCamera(signal, camera) {
        signal.mouse.gbufferId = this.registryBuffer(signal_mod.MouseInfo.BUFFER_SIZE, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
        signal.key.gbufferId = this.registryBuffer(signal_mod.KeyInfo.BUFFER_SIZE, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
        signal.tick.gbufferId = this.registryBuffer(signal_mod.TickInfo.BUFFER_SIZE, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
        signal.bindgrouplayoutId_vs = this.registryBindGroupLayout(builder => {
            builder.addBuffer(0, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage', minSize: 256 });
            builder.addBuffer(1, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage', minSize: 256 });
            builder.addBuffer(2, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage', minSize: 256 });
            return builder.build(this.scen.device);
        });
        signal.bindgroupId_vs = this.registryBindGroup(builder => {
            builder.addBuffer(0, this.store.get(types_mod.ResType.buffer, signal.mouse.gbufferId));
            builder.addBuffer(1, this.store.get(types_mod.ResType.buffer, signal.key.gbufferId));
            builder.addBuffer(2, this.store.get(types_mod.ResType.buffer, signal.tick.gbufferId));
            return builder.build(this.scen.device, this.store.get(types_mod.ResType.bindGroupLayout, signal.bindgrouplayoutId_vs));
        });
        signal.bindgrouplayoutId_cs = this.registryBindGroupLayout(builder => {
            builder.addBuffer(0, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
            builder.addBuffer(1, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
            builder.addBuffer(2, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
            return builder.build(this.scen.device);
        });
        signal.bindgroupId_cs = this.registryBindGroup(builder => {
            builder.addBuffer(0, this.store.get(types_mod.ResType.buffer, signal.mouse.gbufferId));
            builder.addBuffer(1, this.store.get(types_mod.ResType.buffer, signal.key.gbufferId));
            builder.addBuffer(2, this.store.get(types_mod.ResType.buffer, signal.tick.gbufferId));
            return builder.build(this.scen.device, this.store.get(types_mod.ResType.bindGroupLayout, signal.bindgrouplayoutId_cs));
        });
        camera.bufferId = this.registryBuffer(camera_mod.Camera.BUFFER_SIZE, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
        camera.bindgrouplayoutId_vs = this.registryBindGroupLayout(builder => {
            builder.addBuffer(0, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, {
                type: 'uniform',
                minSize: camera_mod.Camera.BUFFER_SIZE
            });
            return builder.build(this.scen.device);
        });
        camera.bindgroupId_vs = this.registryBindGroup(builder => {
            builder.addBuffer(0, this.store.get(types_mod.ResType.buffer, camera.bufferId));
            return builder.build(this.scen.device, this.store.get(types_mod.ResType.bindGroupLayout, camera.bindgrouplayoutId_vs));
        });
        camera.bindgrouplayoutId_cs = this.registryBindGroupLayout(builder => {
            builder.addBuffer(0, GPUShaderStage.COMPUTE, {
                type: 'uniform',
                minSize: camera_mod.Camera.BUFFER_SIZE
            });
            return builder.build(this.scen.device);
        });
        camera.bindgroupId_cs = this.registryBindGroup(builder => {
            builder.addBuffer(0, this.store.get(types_mod.ResType.buffer, camera.bufferId));
            return builder.build(this.scen.device, this.store.get(types_mod.ResType.bindGroupLayout, camera.bindgrouplayoutId_cs));
        });
    }
    initColorTargetState() {
        this.colorTargetStateIds['rgba8unorm'] = this.registryColorTargetState(builder => {
            return builder.addState('rgba8unorm').build();
        });
        this.colorTargetStateIds['rgba8unorm-alpha-blend'] = this.registryColorTargetState(builder => {
            return builder.addState('rgba8unorm', {
                operation: "add",
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha"
            }, {
                operation: "add",
                srcFactor: "one",
                dstFactor: "one-minus-src-alpha"
            }).build();
        });
        this.colorTargetStateIds['bgra8unorm'] = this.registryColorTargetState(builder => {
            return builder.addState('bgra8unorm').build();
        });
        this.colorTargetStateIds['bgra8unorm-alpha-blend'] = this.registryColorTargetState(builder => {
            return builder.addState('bgra8unorm', {
                operation: "add",
                srcFactor: "src-alpha",
                dstFactor: "one-minus-src-alpha"
            }, {
                operation: "add",
                srcFactor: "one",
                dstFactor: "one-minus-src-alpha"
            }).build();
        });
    }
}
