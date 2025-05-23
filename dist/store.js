import { util_mod } from 'synario.base';
import * as builders_mod from './builders';
import * as types_mod from './types';
import * as cammera_mod from './camera';
import * as signal_mod from './signal';
import * as pipeline_builder_mod from './pipeline-builder';
export class Store {
    buffers;
    textures;
    externalTextures;
    samplers;
    colorTargetStates;
    groups;
    groupLayouts;
    pipelineLayouts;
    views;
    vertexBufferLayouts;
    renderpipelines;
    computepipelines;
    colorAttachments;
    renderBundleDescriptors;
    querySets;
    passParams;
    store;
    labelDic;
    constructor() {
        this.initArray();
        this.initStore();
    }
    initArray() {
        this.buffers = new Array();
        this.textures = new Array();
        this.externalTextures = new Array();
        this.samplers = new Array();
        this.colorTargetStates = new Array();
        this.groups = new Array();
        this.groupLayouts = new Array();
        this.pipelineLayouts = new Array();
        this.views = new Array();
        this.vertexBufferLayouts = new Array();
        this.renderpipelines = new Array();
        this.computepipelines = new Array();
        this.colorAttachments = new Array();
        this.renderBundleDescriptors = new Array();
        this.querySets = new Array();
        this.passParams = new Array();
    }
    initStore() {
        this.store = new Map();
        this.store.set(types_mod.ResType.buffer, this.buffers);
        this.store.set(types_mod.ResType.texture, this.textures);
        this.store.set(types_mod.ResType.externalTexture, this.externalTextures);
        this.store.set(types_mod.ResType.sampler, this.samplers);
        this.store.set(types_mod.ResType.colorTargetState, this.colorTargetStates);
        this.store.set(types_mod.ResType.bindGroup, this.groups);
        this.store.set(types_mod.ResType.bindGroupLayout, this.groupLayouts);
        this.store.set(types_mod.ResType.textureView, this.views);
        this.store.set(types_mod.ResType.vertexBufferLayout, this.vertexBufferLayouts);
        this.store.set(types_mod.ResType.pipelineLayout, this.pipelineLayouts);
        this.store.set(types_mod.ResType.renderpipeline, this.renderpipelines);
        this.store.set(types_mod.ResType.computepipeline, this.computepipelines);
        this.store.set(types_mod.ResType.colorAttachment, this.colorAttachments);
        this.store.set(types_mod.ResType.renderBundleDescriptor, this.renderBundleDescriptors);
        this.store.set(types_mod.ResType.querySet, this.querySets);
        this.store.set(types_mod.ResType.passParam, this.passParams);
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
