import * as types_mod from './types';
import * as store_mod from './store';
import * as signal_mod from './signal';
import * as camera_mod from './camera';
import * as scenery_mod from './scenery';
export declare class DataAccess {
    store: store_mod.Store;
    scenery: scenery_mod.Scenery;
    colorTargetStateIds: {
        [key: string]: types_mod.Id;
    };
    constructor(scen: scenery_mod.Scenery);
    registryRenderPipeline(config: types_mod.PipelineHandler): types_mod.Id;
    registryComputePipeline(config: types_mod.PipelineHandler): types_mod.Id;
    registryBindGroupLayout(config: types_mod.BindGroupLayoutHandler): types_mod.Id;
    registryBindGroup(config: types_mod.BindGroupHandler): types_mod.Id;
    registryBuffer(size: GPUSize32, usage?: GPUBufferUsageFlags): types_mod.Id;
    updateBuffer(id: types_mod.Id, data: ArrayBufferLike): void;
    registryTexture(config: types_mod.TextureDescriptorHandler): types_mod.Id;
    updateTexture(id: types_mod.Id, data: ArrayBufferLike, options: {
        width: number;
        height: number;
        format: GPUTextureFormat;
        bytesPerRow?: number;
        rowsPerImage?: number;
        offset?: number;
        mipLevel?: number;
        depthOrArrayLayers?: number;
    }): void;
    initSignalCamera(signal: signal_mod.Signal, camera: camera_mod.Camera): void;
}
