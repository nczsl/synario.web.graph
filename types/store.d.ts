import * as types_mod from './types';
export declare class Store {
    private buffers;
    private textures;
    private samplers;
    private groups;
    private groupLayouts;
    private renderpipelines;
    private computepipelines;
    private store;
    labelDic: types_mod.ResDic;
    constructor();
    initArray(): void;
    initStore(): void;
    registry<T extends types_mod.StoreResource>(type: types_mod.ResType, obj: T): number;
    get<T extends types_mod.StoreResource>(type: types_mod.ResType, id: number): T;
    update<T extends types_mod.StoreResource>(type: types_mod.ResType, id: number, obj: T): void;
}
