import { util_mod, engine_mod } from 'synario.base';
import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as scenery_mod from './scenery';
import * as types_mod from './types';
import * as scen_mod from './scene';
import type { RenderGraph } from './render-graph';

export class NodeCS implements types_mod.INode {
  id: number;
  label: string;
  owner: RenderGraph;
  scene: scen_mod.Scene;
  pipeline: types_mod.Pipeline;
  onframe: types_mod.PassHandler;
  createPassDescriptor(): types_mod.PassDescriptor {
    throw new Error('Method not implemented.');
  }

  constructor(owner: RenderGraph, mesh: scen_mod.Scene) {
    this.owner = owner;
    this.scene = mesh;
    this.id = this.owner.nodes.length;
    this.label = `NodeRS-${this.id}`;
  }
  passDescriptor: types_mod.PassDescriptor;
  init(codes: string[], topology: GPUPrimitiveTopology, mainName = 'main'): void {
    const pipelineBuilder = new pipeline_builder_mod.PipelineBuilder(this.owner.owner.device, false);
    const colorTargetState = this.scene.meshRes.colorTargetStates;
    // pipelineBuilder.setComputeShader(codes.join('\n'), mainName, colorTargetState);
  }
  configureOnFrame(): void {
    const pipeline = this.pipeline as GPUComputePipeline;
    const scene = this.scene;
    const meshRes = scene.meshRes;

    // 这里可以添加对 compute pass 的配置逻辑
    // 例如，绑定缓冲区、设置 uniforms 等
  }
}
