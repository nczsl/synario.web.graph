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
import * as scen_mod from './scene';
import * as node_cs_mod from './node-cs';
import * as node_rs_mod from './node-rs';


/**
 * 渲染图类
 * 用于管理多个渲染/计算节点，并按顺序执行它们
 */
export class RenderGraph {
  owner: scenery_mod.Scenery; // 所属场景
  nodes: types_mod.INode[];
  constructor(owner: scenery_mod.Scenery) {
    this.owner = owner;
    this.nodes = [];
  }
  render(): void {
    const commandEncoder = this.owner.device.createCommandEncoder();

    for (const node of this.nodes) {
      let pass: types_mod.PassEncoder;
      if (node instanceof node_cs_mod.NodeCS) {
        let passDescriptor = node.passDescriptor as GPUComputePassDescriptor;
        pass = commandEncoder.beginComputePass(passDescriptor);
      }else if (node instanceof node_rs_mod.NodeRS) {
        let passDescriptor = node.passDescriptor as GPURenderPassDescriptor;
        pass = commandEncoder.beginRenderPass(passDescriptor);
      }
      node.onframe(node, pass);
    }
    const commandBuffer = commandEncoder.finish();
    this.owner.device.queue.submit([commandBuffer]);

  }
}
