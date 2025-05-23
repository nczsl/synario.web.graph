import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as data_access_mod from './data-access';
import * as model_mod from './model';
export declare enum ResType {
    buffer = 0,
    texture = 1,
    externalTexture = 2,
    sampler = 3,
    colorTargetState = 4,
    bindGroup = 5,
    bindGroupLayout = 6,
    textureView = 7,
    vertexBufferLayout = 8,
    pipelineLayout = 9,
    renderpipeline = 10,
    computepipeline = 11,
    colorAttachment = 12,
    renderBundleDescriptor = 13,
    querySet = 14,
    passParam = 15
}
export type StoreResource = GPUBuffer | GPUTexture | GPUExternalTexture | GPUSampler | GPUColorTargetState | GPUBindGroup | GPUBindGroupLayout | GPUPipelineLayout | GPUTextureView | GPUVertexBufferLayout | GPURenderPipeline | GPUComputePipeline | GPURenderPassColorAttachment | GPURenderBundleDescriptor | GPUQuerySet | PassParam;
export type Pipeline = GPURenderPipeline | GPUComputePipeline;
export type PassEncoder = GPURenderPassEncoder | GPUComputePassEncoder | GPURenderBundleEncoder;
export type PassDescriptor = GPURenderPassDescriptor | GPUComputePassDescriptor | GPURenderBundleDescriptor;
type MethodKeys<T> = {
    [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];
export type RenderPassKeys = MethodKeys<GPURenderPassEncoder>;
export type ComputePassKeys = MethodKeys<GPUComputePassEncoder>;
export type PassHandler = (sender: INode, pass: PassEncoder, res: data_access_mod.DataAccess) => unknown;
export type PassParamId = number;
export type PassItem = {
    param: PassParamId;
};
type ExtractParamType<T, K extends string | number | symbol> = K extends keyof T ? T[K] extends (...args: infer P) => any ? P : never : never;
export type RenderPassParam = {
    [K in RenderPassKeys]?: ExtractParamType<GPURenderPassEncoder, K>[];
};
export type ComputePassParam = {
    [K in ComputePassKeys]?: ExtractParamType<GPUComputePassEncoder, K>[];
};
export declare function ensureParamArray<T>(value: T | T[]): T[];
export type PassParam = RenderPassParam | ComputePassParam;
export type PassDict = Record<string, PassParamId | PassParamId[]>;
export type PassDictName = 'RenderPassDict' | 'ComputePassDict';
export type PassId = number;
export interface INode {
    name: string;
    type: PassDictName;
    order: number;
    colorAttachmentId: PassId;
    passParamId?: PassId;
    get passParam(): PassParam;
    get colorAttachment(): GPURenderPassColorAttachment;
    mesh: model_mod.Mesh;
    setPipeline(isRender: boolean, isSignal: boolean, isCammera: boolean, codes: string[]): void;
    loadRenderPassParam(): void;
    loadComputePassParam(): void;
    onframe?: PassHandler;
    frame: (pass: PassEncoder) => void;
    createRenderPassDescriptor(): GPURenderPassDescriptor;
    createComputePassDescriptor(): GPUComputePassDescriptor;
}
export type ColorStateHandler = (builder: builders_mod.ColorStateBuilder) => GPUColorTargetState;
export type BindGroupLayoutHandler = (builder: builders_mod.BindGroupLayoutBuilder) => GPUBindGroupLayout;
export type BindGroupHandler = (builder: builders_mod.BindGroupBuilder) => GPUBindGroup;
export type PipelineHandler = (pipe: pipeline_builder_mod.PipelineBuilder) => Pipeline;
export type VertexFormatHandler = (builder: vertex_format_builder_mod.VertexBufferBuilder) => GPUVertexBufferLayout;
export type SamplerDescriptorHandler = (builder: builders_mod.SamplerDescriptorBuilder) => GPUSamplerDescriptor;
export type TextureDescriptorHandler = (builder: builders_mod.TextureDescriptorBuilder) => GPUTextureDescriptor;
export type PassDescriptorHandler = (builder: builders_mod.PassEncoderDescriptorBuilder) => PassDescriptor;
export type PipelineDescriptor = GPURenderPipelineDescriptor | GPUComputePipelineDescriptor;
export type ResDic = {
    [key: string]: {
        id0: number;
        id1: number;
    };
};
export {};
