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
import * as scen_mod from './scene';
import * as render_graph_mod from './render-graph';

export enum ResType {
  buffer,
  texture,
  sampler,
  bindGroup,
  bindGroupLayout,
  renderpipeline,
  computepipeline,
}
export type ScenAttachmentValue = number; // 用于表示ScenAttachment的flags值
// scen.ts 的枚举，以说明scen的资源状态
export enum ScenAttachment {
  None = 0,
  RequiresColorAttachment0 = 1 << 0,  // 主颜色附件 (通常是纹理的第0层)
  RequiresColorAttachment1 = 1 << 1,  // 第二个颜色附件 (纹理的第1层)
  RequiresColorAttachment2 = 1 << 2,  // 第三个颜色附件
  RequiresColorAttachment3 = 1 << 3,  // 第四个颜色附件 (WebGPU通常支持最多8个MRT)
  // ... 根据需要可以扩展到更多 RequiresColorAttachmentX

  RequiresDepthStencilAttachment = 1 << 4, // 需要深度模板附件 (纹理的某个特定层)
}
/**值来自枚举类型ScenResourceFlags的flags值计算结果 */
export type ScenResourceValue = number;
/**
 * Scen 所需资源的位标志枚举
 * 定义了在当前 Scen 下，哪些核心资源是活跃的或被启用的。
 */
export enum ScenResource {
  /** 默认无资源或未定义 */
  None = 0,

  // --- 输入数据相关的标志 ---

  /** 需要顶点缓冲区和索引缓冲区（传统几何体渲染） */
  RequiresVertexBuffer = 1 << 0,
  RequiresIndexBuffer = 1 << 1,
  /** 需要几何体对象存储数据（如自定义属性，用于GPU Instance数据） */
  RequiresGOSBuffer = 1 << 2,
  /** 需要间接绘制缓冲区（用于间接绘制命令，如 `drawIndexedIndirect`） */
  RequiresIndirectDrawBuffer = 1 << 3,
  /** 需要间接索引绘制缓冲区（用于间接索引绘制命令） */
  RequiresIndirectIndexDrawBuffer = 1 << 4,
  /** 需要间接计算调度缓冲区（用于间接 `dispatchWorkgroups` 命令） */
  RequiresIndirectWorkdispatchBuffer = 1 << 5,
  RequiresGOSTexture = 1 << 6,
  RequiresCaseBuffer = 1 << 7,
  // --- 输出/处理目标相关的标志 ---
  /** 需要目标纹理作为渲染目标或CS输出 */
  RequiresTargetTexture = 1 << 8,
  /** 需要深度模板附件（通常与TargetTexture配合，但可独立标记） */
  /** 需要CS输出附件缓冲区（例如CS将计算结果写入一个可读写缓冲区） */
  RequiresOutBuffer = 1 << 9,
}
// 统一资源类型联合类型
export type StoreResource =
  | GPUBuffer
  | GPUTexture
  | GPUSampler
  | GPUBindGroup
  | GPUBindGroupLayout
  | GPURenderPipeline
  | GPUComputePipeline

export type Id = number; // 资源ID
export type Pipeline = GPURenderPipeline | GPUComputePipeline;
export type PassEncoder = GPURenderPassEncoder | GPUComputePassEncoder | GPURenderBundleEncoder;
export type PassDescriptor = GPURenderPassDescriptor | GPUComputePassDescriptor | GPURenderBundleDescriptor;


export type PassHandler = (sender: INode, pass: PassEncoder) => unknown;
/**
 * 节点接口
 */
export interface INode {
  id: Id; // 节点ID
  label: string; // 节点名称
  owner: render_graph_mod.RenderGraph; // 所属引擎
  scene: scen_mod.Scene; // 存储关联的网格对象  
  pipeline: Pipeline; // 渲染管线
  passDescriptor: PassDescriptor; // 渲染通道描述符
  init(codes:string[], topology: GPUPrimitiveTopology, mainName:string): void; // 设置渲染管线
  onframe: PassHandler; // 渲染函数
  configureOnFrame():void; // 配置渲染函数
}

//build handler
export type ColorAttachmentBuilder = (builder: builders_mod.ColorAttachmentBuilder) => GPURenderPassColorAttachment[];
export type DepthStencilAttachmentBuilder = (builder: builders_mod.DepthStencilAttachmentBuilder) => GPURenderPassDepthStencilAttachment;
export type ColorAttachmentParamSettingHandler = (colorAttachments:GPURenderPassColorAttachment[]) => GPURenderPassColorAttachment[];
export type DepthStencilAttachmentParamSettingHandler = (depthStencilAttachment: GPURenderPassDepthStencilAttachment) => GPURenderPassDepthStencilAttachment;
//
export type ColorStateHandler = (builder: builders_mod.ColorStateBuilder) => GPUColorTargetState[];
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



