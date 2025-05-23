import * as types_mod from './types';
import * as store_mod from './store';
import * as signal_mod from './signal';
import * as camera_mod from './camera';
import * as scenery_mod from './scenery';
export declare class DataAccess {
    store: store_mod.Store;
    scen: scenery_mod.Scenery;
    colorTargetStateIds: {
        [key: string]: number;
    };
    constructor(scen: scenery_mod.Scenery);
    registryView(texture: GPUTexture): number;
    registryPassParam(param?: types_mod.PassParam): number;
    registryRenderPipeline(config: types_mod.PipelineHandler): number;
    registryComputePipeline(config: types_mod.PipelineHandler): number;
    registryColorAttachment(colorAttachment: GPURenderPassColorAttachment): number;
    registryColorTargetState(config: types_mod.ColorStateHandler): number;
    registryBindGroupLayout(config: types_mod.BindGroupLayoutHandler): number;
    registryBindGroup(config: types_mod.BindGroupHandler): number;
    registryVertexBufferLayout(config: types_mod.VertexFormatHandler): number;
    registryBuffer(size: number, usage?: number): number;
    updateBuffer(id: number, data: ArrayBufferLike): void;
    registryTexture(config: types_mod.TextureDescriptorHandler): number;
    updateTexture(id: number, data: ArrayBufferLike, options?: {
        bytesPerRow?: number;
        rowsPerImage?: number;
        width?: number;
        height?: number;
        depthOrArrayLayers?: number;
        offset?: number;
        format?: GPUTextureFormat;
        mipLevel?: number;
    }): void;
    initSignalCamera(signal: signal_mod.Signal, camera: camera_mod.Camera): void;
    initColorTargetState(): void;
}
