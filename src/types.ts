/**
 * Synario WebGPU Graphics Library
 * @file common.ts
 * @description 公共类型
 * @author Synario Team
 */
import { util_mod, engine_mod } from 'synario.base';
import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as data_access_mod from './data-access';
import * as model_mod from './model';

export enum ResType {
  buffer,
  texture,
  externalTexture,
  sampler,
  colorTargetState,
  bindGroup,
  bindGroupLayout,
  textureView,
  vertexBufferLayout,
  pipelineLayout,
  renderpipeline,
  computepipeline,
  colorAttachment,
  renderBundleDescriptor,
  querySet,
  passParam,
}

// 统一资源类型联合类型
export type StoreResource =
  | GPUBuffer
  | GPUTexture
  | GPUExternalTexture
  | GPUSampler
  | GPUColorTargetState
  | GPUBindGroup
  | GPUBindGroupLayout
  | GPUPipelineLayout
  | GPUTextureView
  | GPUVertexBufferLayout
  | GPURenderPipeline
  | GPUComputePipeline
  | GPURenderPassColorAttachment
  | GPURenderBundleDescriptor
  | GPUQuerySet
  | PassParam;
export type Id = number; // 资源ID
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
}

// 移除单次调用和多次调用的区分，简化类型系统

// 修正的类型定义，使用 infer 提取参数类型
type ExtractParamType<T, K extends string | number | symbol> =
  K extends keyof T
  ? T[K] extends (...args: infer P) => any
  ? P
  : never
  : never;

// 统一为数组类型，简化类型系统
export type RenderPassParam = {
  [K in RenderPassKeys]?: ExtractParamType<GPURenderPassEncoder, K>[];
};

// 统一为数组类型，简化类型系统
export type ComputePassParam = {
  [K in ComputePassKeys]?: ExtractParamType<GPUComputePassEncoder, K>[];
};

// 创建帮助函数，确保 PassParam 中的值总是数组形式
export function ensureParamArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export type PassParam = RenderPassParam | ComputePassParam;

export type PassDict = Record<string, PassParamId | PassParamId[]>;
export type PassDictName = 'RenderPassDict' | 'ComputePassDict';

export type PassId = number;
/**
 * 节点接口
 */
export interface INode {
  name: string; // 节点名称
  type: PassDictName; // 节点类型
  order: number; // 节点顺序
  // colorAttachmentOption: GPURenderPassColorAttachment;
  colorAttachmentId: PassId;
  passParamId?: PassId; // 存储关联的 pass 参数的资源ID
  //
  get passParam(): PassParam; // 存储关联的 pass 参数
  get colorAttachment(): GPURenderPassColorAttachment; // 存储关联的颜色附件
  //
  mesh: model_mod.Mesh; // 存储关联的网格对象
  setPipeline(isRender: boolean, isSignal: boolean, isCammera: boolean, codes: string[]): void; // 设置管线
  loadRenderPassParam():void; // 加载渲染通道参数
  loadComputePassParam():void; // 加载计算通道参数
  onframe?: PassHandler; // 渲染函数
  frame: (pass: PassEncoder) => void; // 渲染函数
  createRenderPassDescriptor(): GPURenderPassDescriptor; // 创建渲染通道描述符
  createComputePassDescriptor(): GPUComputePassDescriptor; // 创建计算通道描述符
}

//build handler
export type ColorStateHandler = (builder: builders_mod.ColorStateBuilder) => GPUColorTargetState;
// export type VertexBufferHandler = (builder: vertex_format_builder_mod.VertexBufferBuilder) => GPUVertexBufferLayout;
export type BindGroupLayoutHandler = (builder: builders_mod.BindGroupLayoutBuilder) => GPUBindGroupLayout;
export type BindGroupHandler = (builder: builders_mod.BindGroupBuilder) => GPUBindGroup;
export type PipelineHandler = (pipe: pipeline_builder_mod.PipelineBuilder) => Pipeline;
export type VertexFormatHandler = (builder: vertex_format_builder_mod.VertexBufferBuilder) => GPUVertexBufferLayout;
export type SamplerDescriptorHandler = (builder: builders_mod.SamplerDescriptorBuilder) => GPUSamplerDescriptor;
export type TextureDescriptorHandler = (builder: builders_mod.TextureDescriptorBuilder) => GPUTextureDescriptor;
export type PassDescriptorHandler = (builder: builders_mod.PassEncoderDescriptorBuilder) => PassDescriptor;

//PipelineDescriptor
export type PipelineDescriptor =
  GPURenderPipelineDescriptor
  | GPUComputePipelineDescriptor
  ;

// 全局资源映射字典，用于从label 映射到资源ID
export type ResDic = {
  [key: string]: { id0: number, id1: number };
}



