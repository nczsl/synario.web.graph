import * as types_mod from './types';
export declare class Store {
    private buffers;
    private textures;
    private externalTextures;
    private samplers;
    private colorTargetStates;
    private groups;
    private groupLayouts;
    private pipelineLayouts;
    private views;
    private vertexBufferLayouts;
    private renderpipelines;
    private computepipelines;
    private colorAttachments;
    private renderBundleDescriptors;
    private querySets;
    private passParams;
    private store;
    labelDic: types_mod.ResDic;
    constructor();
    initArray(): void;
    initStore(): void;
    registry<T extends types_mod.StoreResource>(type: types_mod.ResType, obj: T): number;
    get<T extends types_mod.StoreResource>(type: types_mod.ResType, id: number): T;
    update<T extends types_mod.StoreResource>(type: types_mod.ResType, id: number, obj: T): void;
}
