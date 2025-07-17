import { util_mod, engine_mod } from 'synario.base';
import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as scenery_mod from './scenery';
import * as types_mod from './types';
import * as scen_mod from './scene';
import * as node_cs_mod from './node-cs';
import * as node_rs_mod from './node-rs';
export class RenderGraph {
    owner;
    nodes;
    constructor(owner) {
        this.owner = owner;
        this.nodes = [];
    }
    render() {
        const commandEncoder = this.owner.device.createCommandEncoder();
        for (const node of this.nodes) {
            let pass;
            if (node instanceof node_cs_mod.NodeCS) {
                let passDescriptor = node.passDescriptor;
                pass = commandEncoder.beginComputePass(passDescriptor);
            }
            else if (node instanceof node_rs_mod.NodeRS) {
                let passDescriptor = node.passDescriptor;
                pass = commandEncoder.beginRenderPass(passDescriptor);
            }
            node.onframe(node, pass);
        }
        const commandBuffer = commandEncoder.finish();
        this.owner.device.queue.submit([commandBuffer]);
    }
}
