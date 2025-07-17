/**
 * Synario WebGPU Graphics Library
 * @file resource-pool.ts
 * @description 资源池管理
 * @author Synario Team
 */
import * as types_mod from './types';


// 基础资源池
export class Store {
  private buffers: GPUBuffer[];
  private textures: GPUTexture[];
  private samplers: GPUSampler[];
  private groups: GPUBindGroup[];
  private groupLayouts: GPUBindGroupLayout[];
  private renderpipelines: GPURenderPipeline[];
  private computepipelines: GPUComputePipeline[];
  private store: Map<types_mod.ResType, types_mod.StoreResource[]>;
  labelDic: types_mod.ResDic;
  constructor() {
    // this.device = device;
    this.initArray(); // 初始化资源数组
    this.initStore(); // 初始化资源池
  }
  initArray() {
    this.buffers = new Array<GPUBuffer>();
    this.textures = new Array<GPUTexture>();
    this.samplers = new Array<GPUSampler>();
    this.groups = new Array<GPUBindGroup>();
    this.groupLayouts = new Array<GPUBindGroupLayout>();
    this.renderpipelines = new Array<GPURenderPipeline>();
    this.computepipelines = new Array<GPUComputePipeline>();
  }
  initStore() {
    this.store = new Map<types_mod.ResType, []>(); // 初始化资源池
    this.store.set(types_mod.ResType.buffer, this.buffers);
    this.store.set(types_mod.ResType.texture, this.textures);
    this.store.set(types_mod.ResType.sampler, this.samplers);
    this.store.set(types_mod.ResType.bindGroup, this.groups);
    this.store.set(types_mod.ResType.bindGroupLayout, this.groupLayouts);
    this.store.set(types_mod.ResType.renderpipeline, this.renderpipelines);
    this.store.set(types_mod.ResType.computepipeline, this.computepipelines);
  }
  registry<T extends types_mod.StoreResource>(type: types_mod.ResType, obj: T): number {
    let id = this.store.get(type)?.length || 0; // 获取当前资源池的长度作为ID
    this.store.get(type)?.push(obj); // 将对象添加到资源池中
    return id; // 返回ID
  }
  get<T extends types_mod.StoreResource>(type: types_mod.ResType, id: number): T {
    return this.store.get(type)?.[id] as T; // 返回指定类型和ID的对象
  }
  update<T extends types_mod.StoreResource>(type: types_mod.ResType, id: number, obj: T): void {
    const array = this.store.get(type);
    if (array) {
      array[id] = obj; // 更新指定类型和ID的对象
    }
  }
}
