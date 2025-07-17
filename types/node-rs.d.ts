import * as types_mod from './types';
import * as scen_mod from './scene';
import type { RenderGraph } from './render-graph';
export declare class NodeRS implements types_mod.INode {
    id: types_mod.Id;
    label: string;
    owner: RenderGraph;
    scene: scen_mod.Scene;
    pipeline: types_mod.Pipeline;
    passDescriptor: PassDescriptor;
    onframe: types_mod.PassHandler;
    constructor(owner: RenderGraph, mesh: scen_mod.Scene);
    init(codes: string[], topology: GPUPrimitiveTopology, mainName?: string): void;
    configureOnFrame(): void;
}
