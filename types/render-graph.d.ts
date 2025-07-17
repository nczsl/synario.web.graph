import * as scenery_mod from './scenery';
import * as types_mod from './types';
export declare class RenderGraph {
    owner: scenery_mod.Scenery;
    nodes: types_mod.INode[];
    constructor(owner: scenery_mod.Scenery);
    render(): void;
}
