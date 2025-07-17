// 引入所需的模块
import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as scenery_mod from './scenery';
import * as types_mod from './types';
import * as scen_mod from './scene';
import type { RenderGraph } from './render-graph';
// 确保引入 VertexBufferBuilder，因为我们需要在 addVertexStruct 的回调中使用它
import { VertexBufferBuilder } from './vertex-format-builder';

export class NodeRS implements types_mod.INode {
  id: types_mod.Id;
  label: string;
  owner: RenderGraph;
  scene: scen_mod.Scene;
  pipeline: types_mod.Pipeline;
  passDescriptor: PassDescriptor; // 渲染通道描述符
  onframe: types_mod.PassHandler;


  constructor(owner: RenderGraph, mesh: scen_mod.Scene) {
    this.owner = owner;
    this.scene = mesh;
    this.id = this.owner.nodes.length;
    this.label = `NodeRS-${this.id}`;
    this.passDescriptor = {
      colorAttachments:this.scene.meshRes.colorAttachments,
      depthStencilAttachment: this.scene.meshRes.depthStencilAttachment
    }
  }

  init(codes: string[], topology: GPUPrimitiveTopology, mainName = 'main'): void {
    const pipelineBuilder = new pipeline_builder_mod.PipelineBuilder(this.owner.owner.device, true);
    const colorTargetState = this.scene.meshRes.colorTargetStates;
    pipelineBuilder.setRenderShader(codes.join('\n'), mainName, colorTargetState);
  }

  // configureOnFrame 方法保持不变，它已经正确地绑定了多个缓冲区。
  configureOnFrame(): void {
    const pipeline = this.pipeline as GPURenderPipeline;
    const scene = this.scene;
    const meshRes = scene.meshRes;
  }
}
