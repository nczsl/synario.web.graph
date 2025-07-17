import * as data_access_mod from './data-access';
import * as camera_mod from './camera';
import * as signal_mod from './signal';
export declare class Control {
    access: data_access_mod.DataAccess;
    camera: camera_mod.Camera;
    signal: signal_mod.Signal;
    samplers: {
        [key: string]: GPUSampler;
    };
    samplerBindGroupLayoutId: number;
    samplerBindGroupId: number;
    constructor(access: data_access_mod.DataAccess);
    registryEvent(): void;
    update(tick: number): void;
    initSamplers(device: GPUDevice): void;
    getSampler(name: string): GPUSampler;
    initSamplerBindGroup(device: GPUDevice): void;
    getSamplerBindGroup(): GPUBindGroup | null;
    getSamplerBindGroupLayout(): GPUBindGroupLayout | null;
}
