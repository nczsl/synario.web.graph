import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as scen_mod from './scene';
import * as render_graph_mod from './render-graph';
export declare enum ResType {
    buffer = 0,
    texture = 1,
    sampler = 2,
    bindGroup = 3,
    bindGroupLayout = 4,
    renderpipeline = 5,
    computepipeline = 6
}
export type ScenAttachmentValue = number;
export declare enum ScenAttachment {
    None = 0,
    RequiresColorAttachment0 = 1,
    RequiresColorAttachment1 = 2,
    RequiresColorAttachment2 = 4,
    RequiresColorAttachment3 = 8,
    RequiresDepthStencilAttachment = 16
}
export type ScenResourceValue = number;
export declare enum ScenResource {
    None = 0,
    RequiresVertexBuffer = 1,
    RequiresIndexBuffer = 2,
    RequiresGOSBuffer = 4,
    RequiresIndirectDrawBuffer = 8,
    RequiresIndirectIndexDrawBuffer = 16,
    RequiresIndirectWorkdispatchBuffer = 32,
    RequiresGOSTexture = 64,
    RequiresCaseBuffer = 128,
    RequiresTargetTexture = 256,
    RequiresOutBuffer = 512
}
export type StoreResource = GPUBuffer | GPUTexture | GPUSampler | GPUBindGroup | GPUBindGroupLayout | GPURenderPipeline | GPUComputePipeline;
export type Id = number;
export type Pipeline = GPURenderPipeline | GPUComputePipeline;
export type PassEncoder = GPURenderPassEncoder | GPUComputePassEncoder | GPURenderBundleEncoder;
export type PassDescriptor = GPURenderPassDescriptor | GPUComputePassDescriptor | GPURenderBundleDescriptor;
export type PassHandler = (sender: INode, pass: PassEncoder) => unknown;
export interface INode {
    id: Id;
    label: string;
    owner: render_graph_mod.RenderGraph;
    scene: scen_mod.Scene;
    pipeline: Pipeline;
    passDescriptor: PassDescriptor;
    init(codes: string[], topology: GPUPrimitiveTopology, mainName: string): void;
    onframe: PassHandler;
    configureOnFrame(): void;
}
export type ColorAttachmentBuilder = (builder: builders_mod.ColorAttachmentBuilder) => GPURenderPassColorAttachment[];
export type DepthStencilAttachmentBuilder = (builder: builders_mod.DepthStencilAttachmentBuilder) => GPURenderPassDepthStencilAttachment;
export type ColorAttachmentParamSettingHandler = (colorAttachments: GPURenderPassColorAttachment[]) => GPURenderPassColorAttachment[];
export type DepthStencilAttachmentParamSettingHandler = (depthStencilAttachment: GPURenderPassDepthStencilAttachment) => GPURenderPassDepthStencilAttachment;
export type ColorStateHandler = (builder: builders_mod.ColorStateBuilder) => GPUColorTargetState[];
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
