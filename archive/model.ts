/**
 * Synario WebGPU Graphics Library
 * @file model.ts
 * @description 3D模型相关类型定义和操作
 * @author Synario Team
 */
import * as gmath_mod from "./gmath";
import * as types_mod from "./types";
import * as scenery_mod from './scenery';
import * as builders_mod from './builders';
import * as vertex_format_builder_mod from './vertex-format-builder';


/**非索引绘制：vertexCount, instanceCount, firstVertex, firstInstance */
export class DrawIndirectArgs {
  private go: Gobj;
  bufferId: number;
  constructor(go: Gobj) {
    this.go = go;
    // 独立分配每个Gobj的indirect参数buffer
    this.bufferId = this.go.mesh.scenery.access.registryBuffer(this.byteSize, GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST);
  }
  get byteSize(): GPUSize32 {
    return 4 * Uint32Array.BYTES_PER_ELEMENT;
  }
  get buffer(): GPUBuffer {
    // 返回自己独立的indirect参数buffer
    return this.go.mesh.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.bufferId);
  }
  get vertexCount(): number {
    let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
    return this.go.mesh.ref.drawIndirectArgsView.getUint32(index, true); // 顶点数量
  }
  set vertexCount(value: number) {
    let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndirectArgsView.setUint32(index, value, true); // 顶点数量
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndirectArgsData); // 更新缓冲区数据
  }
  get instanceCount(): number {
    // let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
    return this.go.instanceCount;
  }
  get firstVertex(): number {
    let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
    return this.go.mesh.ref.drawIndirectArgsView.getUint32(index, true); // 起始顶点索引
  }
  set firstVertex(value: number) {
    let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndirectArgsView.setUint32(index, value, true); // 起始顶点索引
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndirectArgsData); // 更新缓冲区数据
  }
  get firstInstance(): number {
    let index = 3 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
    return this.go.mesh.ref.drawIndirectArgsView.getUint32(index, true); // 起始实例索引
  }
  set firstInstance(value: number) {
    let index = 3 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndirectArgsView.setUint32(index, value, true); // 起始实例索引
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndirectArgsData); // 更新缓冲区数据
  }
  setArgs(vertexCount: number, instanceCount: number, firstVertex: number, firstInstance: number): void {
    const base = this.go.id * DrawIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndirectArgsView.setUint32(base + 0, vertexCount, true); // 顶点数量
    this.go.mesh.ref.drawIndirectArgsView.setUint32(base + 4, instanceCount, true); // 实例数量
    this.go.mesh.ref.drawIndirectArgsView.setUint32(base + 8, firstVertex, true); // 起始顶点索引
    this.go.mesh.ref.drawIndirectArgsView.setUint32(base + 12, firstInstance, true); // 起始实例索引
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndirectArgsData); // 更新缓冲区数据
    console.log("drawIndirectArgs:", this.go.mesh.ref.drawIndirectArgsView.getUint32(base + 0, true), this.go.mesh.ref.drawIndirectArgsView.getUint32(base + 4, true), this.go.mesh.ref.drawIndirectArgsView.getUint32(base + 8, true), this.go.mesh.ref.drawIndirectArgsView.getUint32(base + 12, true));
  }
}
/**索引绘制：indexCount, instanceCount, firstIndex, baseVertex, firstInstance */
export class DrawIndexIndirectArgs {
  private go: Gobj;
  bufferId: number;
  constructor(go: Gobj) {
    this.go = go;
    this.bufferId = this.go.mesh.scenery.access.registryBuffer(this.byteSize, GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST);
  }
  get byteSize(): number {
    return 5 * Uint32Array.BYTES_PER_ELEMENT;
  }
  get buffer(): GPUBuffer {
    // 返回自己独立的indirect参数buffer
    return this.go.mesh.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.bufferId);
  }
  get indexCount(): number {
    let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
  }
  set indexCount(value: number) {
    let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndexIndirectArgsData);
  }
  get instanceCount(): number {
    let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    return this.go.instanceCount;
  }

  get firstIndex(): number {
    let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
  }
  set firstIndex(value: number) {
    let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndexIndirectArgsData);
  }
  get baseVertex(): number {
    let index = 3 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
  }
  set baseVertex(value: number) {
    let index = 3 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndexIndirectArgsData);
  }
  get firstInstance(): number {
    let index = 4 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
  }
  set firstInstance(value: number) {
    let index = 4 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndexIndirectArgsData);
  }
  setArgs(indexCount: number, instanceCount: number, firstIndex: number, baseVertex: number, firstInstance: number): void {
    const base = this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(base + 0, indexCount, true);
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(base + 4, instanceCount, true);
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(base + 8, firstIndex, true);
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(base + 12, baseVertex, true);
    this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(base + 16, firstInstance, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.gosIndexIndirectArgsData);
  }
}

/**Dispatch间接调度参数：workgroupX, workgroupY, workgroupZ */
export class DispatchIndirectArgs {
  private go: Gobj;
  bufferId: number;
  constructor(go: Gobj) {
    this.go = go;
    // 分配buffer
    this.bufferId = this.go.mesh.scenery.access.registryBuffer(
      3 * Uint32Array.BYTES_PER_ELEMENT,
      GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST
    );
  }
  get buffer(): GPUBuffer {
    return this.go.mesh.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.bufferId);
  }
  get x(): number {
    return this.go.mesh.ref.dispatchIndirectArgsView.getUint32(0, true);
  }
  set x(value: number) {
    this.go.mesh.ref.dispatchIndirectArgsView.setUint32(0, value, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.dispatchIndirectArgsData);
  }
  get y(): number {
    return this.go.mesh.ref.dispatchIndirectArgsView.getUint32(4, true);
  }
  set y(value: number) {
    this.go.mesh.ref.dispatchIndirectArgsView.setUint32(4, value, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.dispatchIndirectArgsData);
  }
  get z(): number {
    return this.go.mesh.ref.dispatchIndirectArgsView.getUint32(8, true);
  }
  set z(value: number) {
    this.go.mesh.ref.dispatchIndirectArgsView.setUint32(8, value, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.dispatchIndirectArgsData);
  }
  setXYZ(x: number, y: number, z: number) {
    this.go.mesh.ref.dispatchIndirectArgsView.setUint32(0, x, true);
    this.go.mesh.ref.dispatchIndirectArgsView.setUint32(4, y, true);
    this.go.mesh.ref.dispatchIndirectArgsView.setUint32(8, z, true);
    this.go.mesh.scenery.access.updateBuffer(this.bufferId, this.go.mesh.ref.dispatchIndirectArgsData);
  }
}

// InstanceData 表示每个实例的附加数据，通常用于实例化渲染
export class InstanceData {
  id: GPUIndex32; // 实例ID
  go: Gobj; // 关联的图形对象
  hasColor: boolean = false;
  hasMaterialId: boolean = false;
  hasUV: boolean = false;
  hasNormal: boolean = false;
  constructor(
    id: GPUIndex32,
    go: Gobj,
  ) {
    this.id = id; // 设置实例ID
    this.go = go; // 关联的图形对象
    // this.model = gmath_mod.Matrix4.Identity(); // 设置模型矩阵，默认为单位矩阵
  }
  get byteSize(): number {
    let size = 0;
    size += Uint32Array.BYTES_PER_ELEMENT; // instanceId: uint32
    size += 16 * Float32Array.BYTES_PER_ELEMENT; // model: float32[16]
    if (this.hasColor) size += 4 * Float32Array.BYTES_PER_ELEMENT; // color: float32[4]
    if (this.hasMaterialId) size += Uint32Array.BYTES_PER_ELEMENT; // materialId: uint32
    if (this.hasUV) size += 2 * Float32Array.BYTES_PER_ELEMENT; // uv: float32[2]
    if (this.hasNormal) size += 3 * Float32Array.BYTES_PER_ELEMENT; // normal: float32[3]
    return size;
  }
  private offset: GPUIndex32 = 0; // 实例数据偏移量
  //instanceId: number; // 实例ID
  get instanceId(): number {
    return this.go.mesh.ref.instanceDataView.getUint32(this.offset, true); // 获取实例ID
  } // 实例的ID
  set instanceId(value: number) {
    this.go.mesh.ref.instanceDataView.setUint32(this.offset, value, true); // 设置实例ID
    this.go.mesh.scenery.access.updateBuffer(this.go.mesh.ref.gosInstanceBufferId, this.go.mesh.ref.gosInstanceData);
  }
  get model(): gmath_mod.Matrix4 {
    let _model: gmath_mod.Matrix4 = new gmath_mod.Matrix4();
    for (let i = 0; i < 16; i++) {
      _model.buffer[i] = this.go.mesh.ref.instanceDataView.getFloat32(this.offset + 4 + i * Float32Array.BYTES_PER_ELEMENT, true); // 获取模型矩阵
    }
    return _model;

  } // 实例的模型矩阵
  set model(value: gmath_mod.Matrix4) {
    for (let i = 0; i < 16; i++) {
      this.go.mesh.ref.instanceDataView.setFloat32(this.offset + 4 + i * Float32Array.BYTES_PER_ELEMENT, value.buffer[i], true); // 设置模型矩阵
    }
    this.go.mesh.scenery.access.updateBuffer(this.go.mesh.ref.gosInstanceBufferId, this.go.mesh.ref.gosInstanceData);
  }
  get color(): gmath_mod.Vector4 | undefined {
    if (!this.hasColor) return undefined;
    let color = new gmath_mod.Vector4();
    for (let i = 0; i < 4; i++) {
      color.buffer[i] = this.go.mesh.ref.instanceDataView.getFloat32(this.offset + 68 + i * Float32Array.BYTES_PER_ELEMENT, true); // 获取实例颜色
    }
    return color;
  }
  set color(value: gmath_mod.Vector4 | undefined) {
    if (!value || this.hasColor) return;
    for (let i = 0; i < 4; i++) {
      this.go.mesh.ref.instanceDataView.setFloat32(this.offset + 68 + i * Float32Array.BYTES_PER_ELEMENT, value.buffer[i], true); // 设置实例颜色
    }
    this.go.mesh.scenery.access.updateBuffer(this.go.mesh.ref.gosInstanceBufferId, this.go.mesh.ref.gosInstanceData);
  }
  get materialId(): number | undefined {
    if (!this.hasMaterialId) return undefined;
    return this.go.mesh.ref.instanceDataView.getUint32(36, true); // 获取材质ID
  } // 实例的材质ID
  set materialId(value: number | undefined) {
    if (value === undefined) return;
    this.go.mesh.ref.instanceDataView.setUint32(36, value, true); // 设置材质ID
    this.hasMaterialId = true;
    this.go.mesh.scenery.access.updateBuffer(this.go.mesh.ref.gosInstanceBufferId, this.go.mesh.ref.gosInstanceData);
  }
  get uv(): gmath_mod.Vector2 | undefined {
    if (!this.hasUV) return undefined;
    let uv = new gmath_mod.Vector2();
    for (let i = 0; i < 2; i++) {
      uv.buffer[i] = this.go.mesh.ref.instanceDataView.getFloat32(40 + i * Float32Array.BYTES_PER_ELEMENT, true); // 获取实例的UV坐标
    }
    return uv;
  } // 实例的UV坐标
  set uv(value: gmath_mod.Vector2 | undefined) {
    if (!value || this.hasUV) return;
    for (let i = 0; i < 2; i++) {
      this.go.mesh.ref.instanceDataView.setFloat32(40 + i * Float32Array.BYTES_PER_ELEMENT, value.buffer[i], true); // 设置实例的UV坐标
    }
    this.hasUV = true;
    this.go.mesh.scenery.access.updateBuffer(this.go.mesh.ref.gosInstanceBufferId, this.go.mesh.ref.gosInstanceData);
  }
  get normal(): gmath_mod.Vector3 | undefined {
    if (!this.hasNormal) return undefined;
    let normal = new gmath_mod.Vector3();
    for (let i = 0; i < 3; i++) {
      normal.buffer[i] = this.go.mesh.ref.instanceDataView.getFloat32(48 + i * Float32Array.BYTES_PER_ELEMENT, true); // 获取实例的法线向量
    }
    return normal;
  } // 实例的法线向量
  set normal(value: gmath_mod.Vector3 | undefined) {
    if (!value || this.hasNormal) return;
    for (let i = 0; i < 3; i++) {
      this.go.mesh.ref.instanceDataView.setFloat32(48 + i * Float32Array.BYTES_PER_ELEMENT, value.buffer[i], true); // 设置实例的法线向量
    }
    this.hasNormal = true;
    this.go.mesh.scenery.access.updateBuffer(this.go.mesh.ref.gosInstanceBufferId, this.go.mesh.ref.gosInstanceData);
  }
  /**
   * 一次性设置所有常用属性
   */
  setParams(params: {
    model?: gmath_mod.Matrix4,
    color?: gmath_mod.Vector4,
    materialId?: number,
    uv?: gmath_mod.Vector2,
    normal?: gmath_mod.Vector3
  }) {
    if (params.model) this.model = params.model;
    if (params.color) this.color = params.color;
    if (params.materialId !== undefined) this.materialId = params.materialId;
    if (params.uv) this.uv = params.uv;
    if (params.normal) this.normal = params.normal;
    // 每次批量设置后也同步到 GPU
    this.go.mesh.scenery.access.updateBuffer(this.go.mesh.ref.gosInstanceBufferId, this.go.mesh.ref.gosInstanceData);
  }
}
export class MeshRef {
  scenery: scenery_mod.Scenery;
  drawIndirectArgsView: DataView<ArrayBuffer>;
  drawIndexIndirectArgsView: DataView<ArrayBuffer>;
  instanceDataView: DataView<ArrayBuffer>;
  instanceIndexView: DataView<ArrayBuffer>;
  dispatchIndirectArgsView: DataView<ArrayBuffer>; // 新增：调度间接参数视图
  constructor(scenery: scenery_mod.Scenery) {
    this.scenery = scenery;
  }
  vsBindGroupLayoutId: number;
  get renderBindGroupLayout(): GPUBindGroupLayout {
    return this.scenery.access.store.get<GPUBindGroupLayout>(types_mod.ResType.bindGroupLayout, this.vsBindGroupLayoutId);
  }
  vsBindGroupId: number;
  get bindGroupLayout(): GPUBindGroup {
    return this.scenery.access.store.get<GPUBindGroup>(types_mod.ResType.bindGroupLayout, this.vsBindGroupLayoutId);
  }
  csBindGroupLayoutId: number;
  get computeBindGroupLayout(): GPUBindGroupLayout {
    return this.scenery.access.store.get<GPUBindGroupLayout>(types_mod.ResType.bindGroupLayout, this.csBindGroupLayoutId);
  }
  csBindGroupId: number;
  get bindGroupCompute(): GPUBindGroup {
    return this.scenery.access.store.get<GPUBindGroup>(types_mod.ResType.bindGroup, this.csBindGroupId);
  }
  vertexBufferId: number;
  get vertexBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.vertexBufferId);
  }
  indexBufferId?: number;
  get indexBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.indexBufferId);
  }
  gosInstanceData: ArrayBuffer; // 实例数据缓冲区
  gosInstanceBufferId: number; // 缓冲区ID
  get gosInstanceBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.gosInstanceBufferId);
  }
  gosIndexData: ArrayBuffer; // 索引数据缓冲区
  gosIndexBufferId: number; // 索引缓冲区ID
  get gosIndexBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.gosIndexBufferId);
  }
  gosIndirectArgsData: ArrayBuffer; // 间接绘制参数缓冲区
  gosIndexIndirectArgsData: ArrayBuffer; // 间接索引绘制参数缓冲区
  dispatchIndirectArgsData: ArrayBuffer; // 调度间接参数缓冲区
  gosIndirectArgsBufferId?: number;
  gosIndexIndirectArgsBufferId?: number;
  get gosIndirectArgsBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.gosIndirectArgsBufferId);
  }
  get gosIndexIndirectArgsBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.gosIndexIndirectArgsBufferId);
  }
  dispatchIndirectBufferId?: number;
  get dispatchIndirectBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.dispatchIndirectBufferId);
  }
}

/**
 * 表示每个 Gobj 在扁平化 instanceData 数组中的索引信息
 */
export class GobjInstanceIndex {
  static readonly byteSize = 3 * Uint32Array.BYTES_PER_ELEMENT;
  go: Gobj;
  constructor(go: Gobj) {
    this.go = go;
  }

  get gobjId(): number {
    let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
    return this.go.mesh.ref.instanceIndexView.getUint32(index, true);
  }
  set gobjId(value: number) {
    let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
    this.go.mesh.ref.instanceIndexView.setUint32(index, value, true);
  }

  get start(): number {
    let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
    return this.go.mesh.ref.instanceIndexView.getUint32(index, true);
  }
  set start(value: number) {
    let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
    this.go.mesh.ref.instanceIndexView.setUint32(index, value, true);
  }

  get count(): number {
    let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
    return this.go.mesh.ref.instanceIndexView.getUint32(index, true);
  }
  set count(value: number) {
    let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
    this.go.mesh.ref.instanceIndexView.setUint32(index, value, true);
  }
}

/**
 * mesh
 */
export class Mesh {
  scenery: scenery_mod.Scenery; // 场景
  buffer: Float32Array;
  indices?: Uint32Array;
  ref: MeshRef;
  gos: Gobj[]; // 图形对象列表
  isIndex: boolean; // 是否包含索引数据
  vertexLayouts: GPUVertexBufferLayout[];
  usage: GPUPrimitiveTopology;
  constructor(scenery: scenery_mod.Scenery, usage: GPUPrimitiveTopology = 'triangle-list') {
    this.scenery = scenery; // 场景
    this.gos = []; // 初始化图形对象列表
    this.ref = new MeshRef(this.scenery); // 创建 MeshRef 实例
    this.usage = usage; // 设置图元拓扑类型
    this.vertexLayouts = []; // 初始化顶点布局
  }
  initVertexIndexBuffer(buffer: Float32Array, indices?: Uint32Array): void {
    // 保证顶点缓冲区至少256字节（用于storage绑定时）
    let vertexBufferSize = buffer.byteLength < 256 ? 256 : buffer.byteLength;
    // 分配正确长度的 Float32Array
    let vertexBuffer = new Float32Array(vertexBufferSize / Float32Array.BYTES_PER_ELEMENT);
    // 拷贝原始数据
    vertexBuffer.set(buffer);
    this.buffer = vertexBuffer; // 设置顶点数据缓冲区
    // 分配顶点 GPUBuffer
    this.ref.vertexBufferId = this.scenery.access.registryBuffer(vertexBufferSize, GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
    this.scenery.access.updateBuffer(this.ref.vertexBufferId, vertexBuffer.buffer);
    if (indices) {
      // 保证索引缓冲区至少256字节（用于storage绑定时）
      let indexBufferSize = indices.byteLength < 256 ? 256 : indices.byteLength;
      // 分配正确长度的 Uint32Array
      let indexBuffer = new Uint32Array(indexBufferSize / Uint32Array.BYTES_PER_ELEMENT);
      // 拷贝原始数据
      indexBuffer.set(indices);
      this.isIndex = true;
      this.indices = indices;
      this.ref.indexBufferId = this.scenery.access.registryBuffer(indexBufferSize, GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
      this.scenery.access.updateBuffer(this.ref.indexBufferId, indexBuffer.buffer);
    }
  }

  /**
   * 计算并分配所有 ArrayBuffer，必须在 setupView() 之前调用
   */
  private allocateBufferData(): void {
    // 1. gosIndirectArgsData: 每个 Gobj 一个 DrawIndirectArgs（4*4字节）
    const indirectArgsStride = 4 * Uint32Array.BYTES_PER_ELEMENT;
    this.ref.gosIndirectArgsData = new ArrayBuffer(this.gos.length * indirectArgsStride);

    // 2. gosIndexIndirectArgsData: 每个 Gobj 一个 DrawIndexIndirectArgs（5*4字节）
    const indexIndirectArgsStride = 5 * Uint32Array.BYTES_PER_ELEMENT;
    this.ref.gosIndexIndirectArgsData = new ArrayBuffer(this.gos.length * indexIndirectArgsStride);

    // 3. dispatchIndirectArgsData: 单独分配一块（如 4*4 字节，或按实际需求）
    this.ref.dispatchIndirectArgsData = new ArrayBuffer(4 * Uint32Array.BYTES_PER_ELEMENT);

    // 4. gosInstanceData: 所有 Gobj 的所有实例数据拼接
    let totalInstanceBytes = 0;
    for (const go of this.gos) {
      for (const inst of go.instanceData) {
        totalInstanceBytes += inst.byteSize;
      }
    }
    // 至少分配256字节
    this.ref.gosInstanceData = new ArrayBuffer(totalInstanceBytes);

    // 5. gosIndexData: 每个 Gobj 一个 GobjInstanceIndex（3*4字节）
    const instanceIndexStride = 3 * Uint32Array.BYTES_PER_ELEMENT;
    this.ref.gosIndexData = new ArrayBuffer(this.gos.length * instanceIndexStride);
  }

  /**
   * 必须在 allocateBuffers() 之后调用
   */
  private setupView(): void {
    this.ref.drawIndirectArgsView = new DataView(this.ref.gosIndirectArgsData);
    this.ref.drawIndexIndirectArgsView = new DataView(this.ref.gosIndexIndirectArgsData);
    this.ref.instanceDataView = new DataView(this.ref.gosInstanceData);
    this.ref.instanceIndexView = new DataView(this.ref.gosIndexData);
    this.ref.dispatchIndirectArgsView = new DataView(this.ref.dispatchIndirectArgsData);
  }

  private setBindingBuffer(): void {
    this.ref.gosIndirectArgsBufferId = this.scenery.access.registryBuffer(
      Math.max(this.ref.gosIndirectArgsData.byteLength, 256),
      GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    );
    this.ref.gosIndexIndirectArgsBufferId = this.scenery.access.registryBuffer(
      Math.max(this.ref.gosIndexIndirectArgsData.byteLength, 256),
      GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    );
    this.ref.gosInstanceBufferId = this.scenery.access.registryBuffer(
      Math.max(this.ref.gosInstanceData.byteLength, 256),
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    );
    this.ref.gosIndexBufferId = this.scenery.access.registryBuffer(
      Math.max(this.ref.gosIndexData.byteLength, 256),
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    );
    this.ref.dispatchIndirectBufferId = this.scenery.access.registryBuffer(
      Math.max(this.ref.dispatchIndirectArgsData.byteLength, 256),
      GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    );
  }
  /** set gos buffer 以后 就是做res的 bindinglayout and bindgroup了 分两类，vs and cs*/
  /** bindgroup and bindgrouplayout  vs*/
  private setVsBindGroupLayout(): void {
    this.ref.vsBindGroupLayoutId = this.scenery.access.registryBindGroupLayout(builder => {
      builder.addBuffer(0, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage' });
      builder.addBuffer(1, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage' });
      return builder.build(this.scenery.device);
    });
  }
  private setVsBindGroup(): void {
    this.ref.vsBindGroupId = this.scenery.access.registryBindGroup(builder => {
      builder.addBuffer(0, this.ref.gosInstanceBuffer);
      builder.addBuffer(1, this.ref.gosIndexBuffer);
      return builder.build(this.scenery.device, this.ref.renderBindGroupLayout);
    });
  }
  private setCsBindGroupLayout(): void {
    this.ref.csBindGroupLayoutId = this.scenery.access.registryBindGroupLayout(builder => {
      builder.addBuffer(0, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
      builder.addBuffer(1, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
      builder.addBuffer(2, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
      builder.addBuffer(3, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
      builder.addBuffer(4, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
      builder.addBuffer(5, GPUShaderStage.COMPUTE, { type: 'storage', minSize: 256 });
      return builder.build(this.scenery.device);
    });
  }
  private setCsBindGroup(): void {
    this.ref.csBindGroupId = this.scenery.access.registryBindGroup(builder => {
      builder.addBuffer(0, this.ref.gosInstanceBuffer); // 实例数据缓冲区
      builder.addBuffer(1, this.ref.gosIndexBuffer); // 实例索引数据缓冲区
      builder.addBuffer(2, this.ref.gosIndirectArgsBuffer); // 间接绘制参数缓冲区
      builder.addBuffer(3, this.ref.gosIndexIndirectArgsBuffer); // 间接索引绘制参数缓冲区
      builder.addBuffer(4, this.ref.dispatchIndirectBuffer); // 保证分配时size>=256
      builder.addBuffer(5, this.ref.vertexBuffer); // 顶点缓冲区
      return builder.build(this.scenery.device, this.ref.computeBindGroupLayout);
    });
  }

  setBinding(): void {
    this.allocateBufferData();
    this.setupView();
    this.setBindingBuffer();
    this.updateBindBuffer();
    this.setCsBindGroupLayout();
    this.setCsBindGroup();
    this.setVsBindGroupLayout();
    this.setVsBindGroup();
  }
  private updateBindBuffer(): void {
    this.scenery.access.updateBuffer(this.ref.gosInstanceBufferId, this.ref.gosInstanceData); // 更新实例数据缓冲区
    this.scenery.access.updateBuffer(this.ref.gosIndexBufferId, this.ref.gosIndexData); // 更新索引数据缓冲区
    this.scenery.access.updateBuffer(this.ref.gosIndirectArgsBufferId, this.ref.gosIndirectArgsData); // 更新间接绘制参数缓冲区
    this.scenery.access.updateBuffer(this.ref.gosIndexIndirectArgsBufferId, this.ref.gosIndexIndirectArgsData); // 更新间接索引绘制参数缓冲区
    // 新增：更新 dispatchIndirectBuffer
    this.scenery.access.updateBuffer(this.ref.dispatchIndirectBufferId, this.ref.dispatchIndirectArgsData);
  }
  /**
   * 改进：允许直接传入 VertexBufferBuilder 实例，支持复杂自定义顶点布局
   */
  setVertexLayout(config: types_mod.VertexFormatHandler, instanceConfig?: types_mod.VertexFormatHandler): void {
    let builder: vertex_format_builder_mod.VertexBufferBuilder = new vertex_format_builder_mod.VertexBufferBuilder();
    // 顶点属性 layout
    const vertexLayout = config(builder);
    vertexLayout.stepMode = 'vertex';
    this.vertexLayouts = [vertexLayout];
    // 如果需要实例化，添加实例属性 layout，且 shaderLocation 不能与顶点属性重叠
    if (instanceConfig) {
      let instBuilder = new vertex_format_builder_mod.VertexBufferBuilder();
      // 起始 location 设为顶点属性数量，避免冲突
      instBuilder.setLocation(vertexLayout.attributes.length);
      const instanceLayout = instanceConfig(instBuilder);
      instanceLayout.stepMode = 'instance';
      this.vertexLayouts.push(instanceLayout);
    }
  }
  addGobjFromVertex(index: number, count: number, center?: gmath_mod.Vector3): Gobj {
    let gobj = new Gobj(this.gos.length, this, false, center);
    gobj.vertexIndex = index; // 设置起始索引
    gobj.vertexCount = count; // 设置顶点数量
    this.isIndex = false; // 设置为非索引绘制
    this.gos.push(gobj);
    return gobj;
  }
  addGobjFromIndex(vertexIndex: number, vertexCount: number, indexIndex: number, indexCount: number, center?: gmath_mod.Vector3): Gobj {
    let gobj = new Gobj(this.gos.length, this, true, center);
    gobj.vertexIndex = vertexIndex; // 设置起始索引
    gobj.vertexCount = vertexCount; // 设置顶点数量
    gobj.indexIndex = indexIndex; // 设置索引起始索引
    gobj.indexCount = indexCount; // 设置索引数量
    this.isIndex = true; // 设置为索引绘制
    this.gos.push(gobj);
    return gobj;
  }
}


/**
 * 表示一个可渲染的图形对象。
 * Geometry 通过引用 Mesh，实现 Mesh 数据的复用。
 */
export class Gobj {
  mesh: Mesh; // 关联的 Mesh 对象
  id: number;  // 由mesh中的索引决定
  isIndex: boolean; // 是否为索引绘制
  materialId?: number;
  instanceData: InstanceData[] = []; // 实例数据
  instanceIndex: GobjInstanceIndex;
  label?: string;
  vertexIndex: number;
  vertexCount: number;
  indexIndex: number;
  indexCount: number;
  firstInstance: number = 0; // 新增：起始实例索引
  baseVertex: number = 0; // 新增：基础顶点偏移量
  parent?: Gobj;
  children: Gobj[] = [];
  boundingBox?: { min: gmath_mod.Vector3, max: gmath_mod.Vector3 };
  center: gmath_mod.Vector3 = gmath_mod.Vector3.Zero(); // 本地中心点
  get instanceCount(): number {
    return this.instanceData.length;
  }
  drawIndirectArgs: DrawIndirectArgs;
  drawIndexIndirectArgs: DrawIndexIndirectArgs;
  dispatchIndirectArgs: DispatchIndirectArgs;


  /**
   * 创建一个图形对象。
   * @param id 对象的唯一标识符。
   * @param center 中心点
   * @param options 可选参数：firstInstance, baseVertex
   */
  constructor(
    id: number,
    mesh: Mesh,
    isIndex: boolean = false,
    center?: gmath_mod.Vector3,
  ) {
    this.id = id;
    this.mesh = mesh; // 关联的 Mesh 对象
    this.isIndex = isIndex; // 是否为索引绘制
    this.materialId = 0; // 默认材质ID为0
    this.center = center || gmath_mod.Vector3.Zero(); // 默认中心点为原点
    this.vertexIndex = -1; // 默认起始索引为0
    this.indexIndex = -1; // 默认结束索引为0
    this.boundingBox = undefined; // 默认没有包围盒
    this.instanceData = []; // 实例数据初始化为空数组
    this.instanceIndex = new GobjInstanceIndex(this); // 创建实例索引对象
    this.drawIndirectArgs = new DrawIndirectArgs(this);
    this.drawIndexIndirectArgs = new DrawIndexIndirectArgs(this);
    this.dispatchIndirectArgs = new DispatchIndirectArgs(this);
  }
  // add instanceData
  addInstanceData(model?: gmath_mod.Matrix4, color?: gmath_mod.Vector4, materialId?: number, uv?: gmath_mod.Vector2, normal?: gmath_mod.Vector3): InstanceData {
    let instance = new InstanceData(this.instanceCount, this); // 创建实例数据对象
    this.instanceData.push(instance); // 将实例数据添加到数组中    
    return instance;
  }
}
