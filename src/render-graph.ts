/**
 * Synario WebGPU Graphics Library
 * @file render-graph.ts
 * @description 渲染图和节点管理
 * @author Synario Team
 */

import { util_mod, engine_mod } from 'synario.base';
import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as scenery_mod from './scenery';
import * as types_mod from './types';
import * as model_mod from './model';


/**
 * 渲染图类
 * 用于管理多个渲染/计算节点，并按顺序执行它们
 */
export class RenderGraph {
  // 场景对象引用
  scenery: scenery_mod.Scenery;

  // 节点列表及相关计数器
  private nodes: types_mod.INode[];
  nodeMaps: Map<string, types_mod.INode> = new Map<string, types_mod.INode>();
  get count(): number {
    return this.nodes.length;
  }
  /**
   * 创建一个渲染图
   * @param scenery 场景对象
   */
  constructor(scenery: scenery_mod.Scenery) {
    this.scenery = scenery;
    this.nodes = [];
    this.nodeMaps = new Map<string, types_mod.INode>();
  }

  /**
   * 添加一个渲染节点
   * @returns 新节点的ID
   */
  addRenderNode(name: string, colorAttachmentOption: GPURenderPassColorAttachment): types_mod.INode {
    // 创建节点
    let node = new Node(name, this, 'RenderPassDict', colorAttachmentOption);
    this.nodes.push(node);
    this.nodeMaps.set(name, node);
    return node;
  }

  /**
   * 添加一个计算节点
   * @param passDescriptorName 通道描述符名称，可选，如不提供则使用默认
   * @returns 新节点的ID
   */
  addComputeNode(name: string): types_mod.INode {
    // 创建节点
    let node = new Node(name, this, 'ComputePassDict');
    this.nodes.push(node);
    this.nodeMaps.set(name, node);
    return node;
  }

  sortByOrder(): void {
    this.nodes.sort((a, b) => a.order - b.order);
  }

  /**
   * 渲染所有节点
   * 按照节点添加的顺序执行它们
   */
  render(): void {
    const commandEncoder = this.scenery.device.createCommandEncoder();

    for (const node of this.nodes) {
      let pass: types_mod.PassEncoder;
      if (node.type === 'RenderPassDict') {
        pass = commandEncoder.beginRenderPass(node.createRenderPassDescriptor());
      } else {
        pass = commandEncoder.beginComputePass(node.createComputePassDescriptor());
      }
      node.frame(pass);
      pass.end();
    }
    const commandBuffer = commandEncoder.finish();
    this.scenery.device.queue.submit([commandBuffer]);
  }
}

class Node implements types_mod.INode {
  name: string; // 节点名称
  order: number = 0; // 节点顺序
  type: types_mod.PassDictName;
  colorAttachmentId: types_mod.PassId;
  passParamId?: types_mod.PassId;
  pipelineId?: number;
  get renderPipeline(): GPURenderPipeline {
    return this.graph.scenery.access.store.get<GPURenderPipeline>(types_mod.ResType.renderpipeline, this.pipelineId) as GPURenderPipeline;
  }
  get computePipeline(): GPUComputePipeline {
    return this.graph.scenery.access.store.get<GPUComputePipeline>(types_mod.ResType.computepipeline, this.pipelineId) as GPUComputePipeline;
  }

  colorAttachment: GPURenderPassColorAttachment;
  passParam: types_mod.PassParam;
  mesh: model_mod.Mesh; // 存储关联的网格对象
  // 存储当前渲染图的引用
  protected graph: RenderGraph;
  onframe: types_mod.PassHandler;
  frame: (pass: types_mod.PassEncoder) => void;
  constructor(name: string, graph: RenderGraph, type: types_mod.PassDictName, colorAttachmentOption?: GPURenderPassColorAttachment, onframe?: types_mod.PassHandler) {
    this.graph = graph;
    this.type = type;
    this.name = name;
    if (colorAttachmentOption) {
      this.colorAttachmentId = this.graph.scenery.access.registryColorAttachment(colorAttachmentOption);
      this.colorAttachment = colorAttachmentOption;
    }
    this.passParamId = this.graph.scenery.access.registryPassParam();
    this.passParam = this.graph.scenery.access.store.get<types_mod.PassParam>(types_mod.ResType.passParam, this.passParamId) || {};
    this.mesh = new model_mod.Mesh(this.graph.scenery);
    this.onframe = onframe;
    if (this.onframe === undefined) {
      if (this.type === 'RenderPassDict') {
        this.frame = this._renderFrame.bind(this);
      } else {
        this.frame = this._computeFrame.bind(this);
      }
    } else {
      this.frame = this._frame;
    }
  }
  setPipeline(isRender: boolean, isSignal: boolean, isCammera: boolean, codes: string[]): void {
// 更健壮的拼接方式，确保每个 code 都是字符串
    let code = codes.map(c => (typeof c === 'string' ? c : (c ? String(c) : ''))).join('\n');
    // console.log('[setPipeline] code:', code);
    let lyaouts: GPUBindGroupLayout[] = [];
    // 区分渲染/计算绑定组布局
    if (isRender) {
      if (isSignal) {
        lyaouts.push(this.graph.scenery.access.store.get<GPUBindGroupLayout>(types_mod.ResType.bindGroupLayout, this.graph.scenery.control.signal.bindgrouplayoutId_vs));
      }
      if (isCammera) {
        lyaouts.push(this.graph.scenery.access.store.get<GPUBindGroupLayout>(types_mod.ResType.bindGroupLayout, this.graph.scenery.control.camera.bindgrouplayoutId_vs));
      }
      lyaouts.push(this.mesh.res.renderBindGroupLayout);
      this.pipelineId = this.graph.scenery.access.registryRenderPipeline(builder => {
        builder.setBindGroupLayoutByExists(lyaouts);
        builder.addVertexStructByExists(this.mesh.vertexLayouts);
        builder.setRenderShader(code, 'main', [
          this.graph.scenery.access.store.get<GPUColorTargetState>(types_mod.ResType.colorTargetState, this.graph.scenery.access.colorTargetStateIds['bgra8unorm']),
        ]);
        builder.setPrimitiveTopology(this.mesh.usage);
        return builder.build();
      });
    } else {
      if (isSignal) {
        lyaouts.push(this.graph.scenery.access.store.get<GPUBindGroupLayout>(types_mod.ResType.bindGroupLayout, this.graph.scenery.control.signal.bindgrouplayoutId_cs));
      }
      if (isCammera) {
        lyaouts.push(this.graph.scenery.access.store.get<GPUBindGroupLayout>(types_mod.ResType.bindGroupLayout, this.graph.scenery.control.camera.bindgrouplayoutId_cs));
      }
      lyaouts.push(this.mesh.res.computeBindGroupLayout);
      this.pipelineId = this.graph.scenery.access.registryComputePipeline(builder => {
        builder.setBindGroupLayoutByExists(lyaouts);
        builder.setComputeShader(code, 'main');
        return builder.build();
      });
    }
  }
  createRenderPassDescriptor(): GPURenderPassDescriptor {
    const rpdb = new builders_mod.PassEncoderDescriptorBuilder();
    rpdb.setLabel(this.name);
    rpdb.addColorAttachment({
      loadOp: this.colorAttachment.loadOp,
      storeOp: this.colorAttachment.storeOp,
      clearValue: this.colorAttachment.clearValue,
      // 动态获取 view，避免跨帧复用
      view: this.graph.scenery.context.getCurrentTexture().createView(),
    });
    rpdb.asRenderPass();
    return rpdb.build() as GPURenderPassDescriptor;
  }

  createComputePassDescriptor(): GPUComputePassDescriptor {
    const rpdb = new builders_mod.PassEncoderDescriptorBuilder();
    rpdb.setLabel(this.name);
    rpdb.asComputePass();
    return rpdb.build() as GPUComputePassDescriptor;
  }
  /**
   * 自动初始化 passParam，设置常用的 setBindGroup/setVertexBuffer/setIndexBuffer/drawIndirect/drawIndexedIndirect
   * 客户端无需手动设置，简化调用
   */
  loadRenderPassParam(): void {
    const _passParam = this.passParam as types_mod.RenderPassParam;
    _passParam.setPipeline = [
      [this.renderPipeline],
    ]
    _passParam.setBindGroup = [
      [0, this.graph.scenery.access.store.get<GPUBindGroup>(types_mod.ResType.bindGroup, this.graph.scenery.control.signal.bindgroupId_vs), new Uint32Array(0), 0, 0],
      [1, this.graph.scenery.access.store.get<GPUBindGroup>(types_mod.ResType.bindGroup, this.graph.scenery.control.camera.bindgroupId_vs), new Uint32Array(0), 0, 0],
      [2, this.graph.scenery.access.store.get<GPUBindGroup>(types_mod.ResType.bindGroup, this.mesh.res.vsBindGroupId), new Uint32Array(0), 0, 0],
    ];
    _passParam.setVertexBuffer = [
      [0, this.mesh.res.vertexBuffer],
    ];
    if (this.mesh.isIndex)
      _passParam.setIndexBuffer = [
        [this.mesh.res.indexBuffer, 'uint32'],
      ];
    let draw: [GPUBuffer, number][] = [];
    let drawIndexed: [GPUBuffer, number][] = [];
    for (let go of this.mesh.gos) {
      if (this.mesh.isIndex) {
        drawIndexed.push([go.drawIndexIndirectArgs.buffer, 0]);
      } else {
        draw.push([go.drawIndirectArgs.buffer, 0]);
      }
    }
    if (this.mesh.isIndex) {
      _passParam.drawIndexedIndirect = drawIndexed;
    }
    else {
      _passParam.drawIndirect = draw;
    }
  }
  loadComputePassParam(): void {
    const _passParam = this.passParam as types_mod.ComputePassParam;
    _passParam.setPipeline = [
      [this.computePipeline],
    ];
    _passParam.setBindGroup = [
      [0, this.graph.scenery.access.store.get<GPUBindGroup>(types_mod.ResType.bindGroup, this.graph.scenery.control.signal.bindgroupId_cs), new Uint32Array(0), 0, 0],
      [1, this.graph.scenery.access.store.get<GPUBindGroup>(types_mod.ResType.bindGroup, this.graph.scenery.control.camera.bindgroupId_cs), new Uint32Array(0), 0, 0],
      [2, this.mesh.res.bindGroupCompute, new Uint32Array(0), 0, 0], // 修正：计算绑定组
    ];
    // 确保 dispatchIndirectBuffer 已初始化
    // 使用 dispatchWorkgroupsIndirect
    _passParam.dispatchWorkgroupsIndirect = [
      [this.mesh.res.dispatchIndirectBuffer, 0]
    ];
  }
  /**
   * 执行渲染帧
   * 简化版本：统一处理所有 API 调用，不区分单次/多次调用
   * @param pass 通道编码器
   * @private
   */
  private _renderFrame(pass: GPURenderPassEncoder): void {
    const passParam = this.passParam as types_mod.RenderPassParam;
    if (!passParam) return;
    for (const key in passParam) {
      let key2 = key as types_mod.RenderPassKeys;
      if (!key2) continue;
      const paramArrays = passParam[key2];
      for (let i of paramArrays) {
        (pass[key2] as Function)(...i);
      }
    }
  }

  private _computeFrame(pass: GPUComputePassEncoder): void {
    const passParam = this.passParam as types_mod.ComputePassParam;
    if (!passParam) return;
    for (const key in passParam) {
      let key2 = key as types_mod.ComputePassKeys;
      if (!key2) continue;
      const paramArrays = passParam[key2];
      for (let i of paramArrays) {
        (pass[key2] as Function)(...i);
      }
    }
  }
  private _frame(pass: types_mod.PassEncoder): void {
    this.onframe(this, pass, this.graph.scenery.access);
  }
}
