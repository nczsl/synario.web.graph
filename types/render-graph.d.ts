import * as scenery_mod from './scenery';
import * as types_mod from './types';
export declare class RenderGraph {
    scenery: scenery_mod.Scenery;
    private nodes;
    nodeMaps: Map<string, types_mod.INode>;
    get count(): number;
    constructor(scenery: scenery_mod.Scenery);
    addRenderNode(name: string, colorAttachmentOption: GPURenderPassColorAttachment): types_mod.INode;
    addComputeNode(name: string): types_mod.INode;
    sortByOrder(): void;
    render(): void;
}
