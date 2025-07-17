import * as types_mod from './types';
export class Store {
    buffers;
    textures;
    samplers;
    groups;
    groupLayouts;
    renderpipelines;
    computepipelines;
    store;
    labelDic;
    constructor() {
        this.initArray();
        this.initStore();
    }
    initArray() {
        this.buffers = new Array();
        this.textures = new Array();
        this.samplers = new Array();
        this.groups = new Array();
        this.groupLayouts = new Array();
        this.renderpipelines = new Array();
        this.computepipelines = new Array();
    }
    initStore() {
        this.store = new Map();
        this.store.set(types_mod.ResType.buffer, this.buffers);
        this.store.set(types_mod.ResType.texture, this.textures);
        this.store.set(types_mod.ResType.sampler, this.samplers);
        this.store.set(types_mod.ResType.bindGroup, this.groups);
        this.store.set(types_mod.ResType.bindGroupLayout, this.groupLayouts);
        this.store.set(types_mod.ResType.renderpipeline, this.renderpipelines);
        this.store.set(types_mod.ResType.computepipeline, this.computepipelines);
    }
    registry(type, obj) {
        let id = this.store.get(type)?.length || 0;
        this.store.get(type)?.push(obj);
        return id;
    }
    get(type, id) {
        return this.store.get(type)?.[id];
    }
    update(type, id, obj) {
        const array = this.store.get(type);
        if (array) {
            array[id] = obj;
        }
    }
}
