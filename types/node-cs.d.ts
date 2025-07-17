import * as types_mod from './types';
import * as scen_mod from './scene';
import type { RenderGraph } from './render-graph';
export declare class NodeCS implements types_mod.INode {
    id: number;
    label: string;
    owner: RenderGraph;
    scene: scen_mod.Scene;
    pipeline: types_mod.Pipeline;
    onframe: types_mod.PassHandler;
    createPassDescriptor(): types_mod.PassDescriptor;
    constructor(owner: RenderGraph, mesh: scen_mod.Scene);
    passDescriptor: types_mod.PassDescriptor;
    init(codes: string[], topology: GPUPrimitiveTopology, mainName?: string): void;
    configureOnFrame(): void;
}
