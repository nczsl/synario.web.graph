/**
 * Synario WebGPU Graphics Library
 * @file model.ts
 * @description 3D模型相关类型定义和操作
 * @author Synario Team
 * 基本模型
 */
//#region imports
import * as gmath_mod from "./gmath";
import * as types_mod from "./types";
import * as scenery_mod from './scenery';
import * as store_mod from './store';
import * as data_access_mod from './data-access';
import * as builders_mod from './builders';
import * as vertex_format_builder_mod from './vertex-format-builder';
//#endregion

//#region MeshRes 数据结构
/** 模型数据 */
export class MeshRes {
  // --- 资源 id 字段公开 ---
  caseBufferId: types_mod.Id = -1;
  vertexBufferId: types_mod.Id = -1;
  indexBufferId: types_mod.Id = -1;
  indirectDrawBufferId: types_mod.Id = -1;
  indirectIndexDrawBufferId: types_mod.Id = -1;
  indirectWorkdispatchBufferId: types_mod.Id = -1;
  targetTextureId: types_mod.Id = -1;
  gosTextureId: types_mod.Id = -1;
  OutBufferId: types_mod.Id = -1;
  gosBufferId: types_mod.Id = -1;
  rsBindGroupId: types_mod.Id = -1;
  rsBindGroupLayoutId: types_mod.Id = -1;
  csBindGroupId1: types_mod.Id = -1;
  csBindGroupLayoutId1: types_mod.Id = -1;
  csBindGroupId2: types_mod.Id = -1;
  csBindGroupLayoutId2: types_mod.Id = -1;
  csBindGroupId3: types_mod.Id = -1;
  csBindGroupLayoutId3: types_mod.Id = -1;

  // --- 只读资源访问器，类型标注 ---
  get caseBuffer(): GPUBuffer | undefined {
    return this.caseBufferId >= 0 ? this.store.get(types_mod.ResType.buffer, this.caseBufferId) as GPUBuffer : undefined;
  }
  get vertexBuffer(): GPUBuffer | undefined {
    return this.vertexBufferId >= 0 ? this.store.get(types_mod.ResType.buffer, this.vertexBufferId) as GPUBuffer : undefined;
  }
  get indexBuffer(): GPUBuffer | undefined {
    return this.indexBufferId >= 0 ? this.store.get(types_mod.ResType.buffer, this.indexBufferId) as GPUBuffer : undefined;
  }
  get indirectDrawBuffer(): GPUBuffer | undefined {
    return this.indirectDrawBufferId >= 0 ? this.store.get(types_mod.ResType.buffer, this.indirectDrawBufferId) as GPUBuffer : undefined;
  }
  get indirectIndexDrawBuffer(): GPUBuffer | undefined {
    return this.indirectIndexDrawBufferId >= 0 ? this.store.get(types_mod.ResType.buffer, this.indirectIndexDrawBufferId) as GPUBuffer : undefined;
  }
  get indirectWorkdispatchBuffer(): GPUBuffer | undefined {
    return this.indirectWorkdispatchBufferId >= 0 ? this.store.get(types_mod.ResType.buffer, this.indirectWorkdispatchBufferId) as GPUBuffer : undefined;
  }
  get targetTexture(): GPUTexture | undefined {
    return this.targetTextureId >= 0 ? this.store.get(types_mod.ResType.texture, this.targetTextureId) as GPUTexture : undefined;
  }
  get gosTexture(): GPUTexture | undefined {
    return this.gosTextureId >= 0 ? this.store.get(types_mod.ResType.texture, this.gosTextureId) as GPUTexture : undefined;
  }
  get OutBuffer(): GPUBuffer | undefined {
    return this.OutBufferId >= 0 ? this.store.get(types_mod.ResType.buffer, this.OutBufferId) as GPUBuffer : undefined;
  }
  get gosBuffer(): GPUBuffer | undefined {
    return this.gosBufferId >= 0 ? this.store.get(types_mod.ResType.buffer, this.gosBufferId) as GPUBuffer : undefined;
  }
  get rsBindGroup(): GPUBindGroup | undefined {
    return this.rsBindGroupId >= 0 ? this.store.get(types_mod.ResType.bindGroup, this.rsBindGroupId) as GPUBindGroup : undefined;
  }
  get rsBindGroupLayout(): GPUBindGroupLayout | undefined {
    return this.rsBindGroupLayoutId >= 0 ? this.store.get(types_mod.ResType.bindGroupLayout, this.rsBindGroupLayoutId) as GPUBindGroupLayout : undefined;
  }
  get csBindGroup1(): GPUBindGroup | undefined {
    return this.csBindGroupId1 >= 0 ? this.store.get(types_mod.ResType.bindGroup, this.csBindGroupId1) as GPUBindGroup : undefined;
  }
  get csBindGroupLayout1(): GPUBindGroupLayout | undefined {
    return this.csBindGroupLayoutId1 >= 0 ? this.store.get(types_mod.ResType.bindGroupLayout, this.csBindGroupLayoutId1) as GPUBindGroupLayout : undefined;
  }
  get csBindGroup2(): GPUBindGroup | undefined {
    return this.csBindGroupId2 >= 0 ? this.store.get(types_mod.ResType.bindGroup, this.csBindGroupId2) as GPUBindGroup : undefined;
  }
  get csBindGroupLayout2(): GPUBindGroupLayout | undefined {
    return this.csBindGroupLayoutId2 >= 0 ? this.store.get(types_mod.ResType.bindGroupLayout, this.csBindGroupLayoutId2) as GPUBindGroupLayout : undefined;
  }
  get csBindGroup3(): GPUBindGroup | undefined {
    return this.csBindGroupId3 >= 0 ? this.store.get(types_mod.ResType.bindGroup, this.csBindGroupId3) as GPUBindGroup : undefined;
  }
  get csBindGroupLayout3(): GPUBindGroupLayout | undefined {
    return this.csBindGroupLayoutId3 >= 0 ? this.store.get(types_mod.ResType.bindGroupLayout, this.csBindGroupLayoutId3) as GPUBindGroupLayout : undefined;
  }

  //
  colorTargetStates: GPUColorTargetState[] = []; // 颜色目标状态数组
  //颜色附件数组
  colorAttachments: GPURenderPassColorAttachment[] = []; // 渲染通道颜色附件数组
  depthStencilAttachment: GPURenderPassDepthStencilAttachment // 深度模板附件数组
  /**
   * Computed property to get render target views.
   * Derives views from `colorTargetStates` for off-screen rendering.
   * Returns an empty array if no off-screen target is set, allowing fallback to the swap chain.
   */
  get activeRenderViews(): GPUTextureView[] {
    const texture = this.targetTexture;
    if (!texture || this.colorTargetStates.length === 0) {
      return [];
    }

    const views: GPUTextureView[] = [];
    for (let i = 0; i < this.colorTargetStates.length; i++) {
      const state = this.colorTargetStates[i];
      const view = texture.createView({
        label: `TargetView_Layer_${i}`,
        format: state.format,
        dimension: '2d',
        baseArrayLayer: i,
        arrayLayerCount: 1,
      });
      views.push(view);
    }
    return views;
  }
  // --- 其他字段 ---
  caseData: ArrayBuffer; // 案例数据
  vertexData: Float32Array;
  indexData: Uint32Array;
  indirectDrawData: Uint32Array;
  indirectIndexDrawData: Uint32Array;
  indirectWorkdispatchData: Uint32Array;
  gosData: ArrayBuffer;
  //
  vertexLayout: GPUVertexBufferLayout | null = null; // 顶点布局
  /**为了简单起见，仅有一个实例数据，所以也仅有一个相关的layout 设置 */
  instanceLayout: GPUVertexBufferLayout | null = null; // 实例布局
  // 为gostexture 制定一组宽高
  gosTextureSize: gmath_mod.Vector2 = gmath_mod.Vector2.Zero(); // gos 纹理大小
  //
  store: store_mod.Store; // 资源池
  constructor(store: store_mod.Store) {
    this.store = store;
  }
}
//#endregion

//#region Gobj 数据结构
export class Gobj {
  id: types_mod.Id = -1; // 全局唯一ID
  parentId: types_mod.Id = -1; // 父对象ID
  label: string = ''; // 名称
  modelMatrix: gmath_mod.Matrix4; // 模型矩阵
  localMatrix: gmath_mod.Matrix4;
  position: gmath_mod.Vector3;
  rotation: gmath_mod.Quaternion;
  scale: gmath_mod.Vector3;
  center: gmath_mod.Vector3; // 中心点
  redius: GPUSize32; // 半径
  vertexLocation: GPUIndex32// 顶点位置
  vertexCount: GPUSize32; // 顶点数量
  indexLocation: GPUIndex32; // 索引位置
  indexCount: GPUSize32; // 索引数量
  instanceLocation: GPUIndex32; // 实例位置
  instanceCount: GPUSize32; // 实例数量
  materialId: types_mod.Id = -1; // 材质ID
  childen: Gobj[];
  static get BYTESIZE(): GPUSize32 {
    /**
    id: types_mod.Id = -1; // 全局唯一ID +4
    parentId: types_mod.Id = -1; // 父对象ID +4
    label: string = ''; // 名称
    modelMatrix: gmath_mod.Matrix4; // 模型矩阵 +64
    localMatrix: gmath_mod.Matrix4; +64
    position:gmath_mod.Vector3; +12
    rotation:gmath_mod.Quaternion; +16
    scale:gmath_mod.Vector3; +12
    center: gmath_mod.Vector3; // 中心点 +12
    redius: GPUSize32; // 半径 +4
    vertexLocation: GPUIndex32// 顶点位置 +4
    vertexCount: GPUSize32; // 顶点数量 +4
    indexLocation: GPUIndex32; // 索引位置 +4
    indexCount: GPUSize32; // 索引数量 +4
    instanceLocation: GPUIndex32; // 实例位置 +4
    instanceCount: GPUSize32; // 实例数量 +4
    materialId: types_mod.Id = -1; // 材质ID +4
    childen:Gobj[];
     */
    return 4 * 2 + 64 * 2 + 12 + 16 + 12 + 12 + 4 * 8;
  }
  constructor(id: types_mod.Id = -1, label: string = '') {
    this.id = id;
    this.label = label;
    this.modelMatrix = gmath_mod.Matrix4.Identity();
    this.localMatrix = gmath_mod.Matrix4.Identity();
    this.position = gmath_mod.Vector3.Zero();
    this.rotation = gmath_mod.Quaternion.Identity();
    this.scale = gmath_mod.Vector3.Zero();
    this.center = gmath_mod.Vector4.Zero();
    this.redius = 0;
    this.vertexLocation = 0;
    this.vertexCount = 0;
    this.indexLocation = 0;
    this.indexCount = 0;
    this.instanceLocation = 0;
    this.instanceCount = 1; // 默认单实例
    this.childen = [];
  }
}
//#endregion

//#region Scene 主类定义
export class Scene {
  id: types_mod.Id = -1; // 全局唯一ID
  label: string = ''; // 名称
  meshRes: MeshRes | null = null; // MeshRes资源
  gobjs: Gobj[];
  owner: scenery_mod.Scenery | null = null; // 所属场景
  // 资源标志管理，使用 number 特化类型
  private _resourceFlags: types_mod.ScenResourceValue = 0;
  // 附件标志管理
  private _attachmentFlags: types_mod.ScenAttachmentValue = 0;

  // --- 渲染模式互斥保护 ---
  private drawMode: 'none' | 'noindex' | 'index' = 'none';

  get resourceFlags() {
    return this._resourceFlags;
  }
  get attachmentFlags() {
    return this._attachmentFlags;
  }

  //#region 构造与基本属性
  constructor(owner: scenery_mod.Scenery, vertexLayout: GPUVertexBufferLayout | null = null) {
    this.owner = owner;
    this.gobjs = [];
    this.meshRes = new MeshRes(owner.access.store);
    this.meshRes.vertexLayout = vertexLayout; // 设置顶点布局
  }
  //#endregion

  //#region private method
  private _appendInstance(gobj: Gobj, instanceCount: number = 1): Gobj {
    const oldBytes = this.meshRes.gosData ? this.meshRes.gosData.byteLength : 0;
    const newBytes = oldBytes + Gobj.BYTESIZE * instanceCount;
    let newInstanceData = new ArrayBuffer(newBytes);
    // 复制现有数据
    if (this.meshRes.gosData) {
      new Uint8Array(newInstanceData).set(new Uint8Array(this.meshRes.gosData), 0);
    }
    let dv = new DataView(newInstanceData);
    for (let i = 0; i < instanceCount; i++) {
      let offset = oldBytes + i * Gobj.BYTESIZE;
      dv.setInt32(offset, gobj.id, true); offset += 4;
      dv.setInt32(offset, gobj.parentId, true); offset += 4;
      // Write modelMatrix (Matrix4) as 16 float32 values
      const matrixArray = new Float32Array(gobj.modelMatrix.buffer);
      for (let j = 0; j < matrixArray.length; j++) {
        dv.setFloat32(offset, matrixArray[j], true);
        offset += 4;
      }
      const matrixArray2 = new Float32Array(gobj.localMatrix.buffer);
      for (let j = 0; j < matrixArray2.length; j++) {
        dv.setFloat32(offset, matrixArray2[j], true);
        offset += 4;
      }
      //position
      dv.setFloat32(offset, gobj.position.x, true); offset += 4;
      dv.setFloat32(offset, gobj.position.y, true); offset += 4;
      dv.setFloat32(offset, gobj.position.z, true); offset += 4;
      //rotation
      dv.setFloat32(offset, gobj.rotation.x, true); offset += 4;
      dv.setFloat32(offset, gobj.rotation.y, true); offset += 4;
      dv.setFloat32(offset, gobj.rotation.z, true); offset += 4;
      dv.setFloat32(offset, gobj.rotation.w, true); offset += 4;
      //scale
      dv.setFloat32(offset, gobj.scale.x, true); offset += 4;
      dv.setFloat32(offset, gobj.scale.y, true); offset += 4;
      dv.setFloat32(offset, gobj.scale.z, true); offset += 4;
      //center
      dv.setFloat32(offset, gobj.center.x, true); offset += 4;
      dv.setFloat32(offset, gobj.center.y, true); offset += 4;
      dv.setFloat32(offset, gobj.center.z, true); offset += 4;
      dv.setFloat32(offset, gobj.center.w, true); offset += 4;
      //redius
      dv.setFloat32(offset, gobj.redius, true); offset += 4;
      //index etc
      dv.setUint32(offset, gobj.vertexLocation, true); offset += 4;
      dv.setUint32(offset, gobj.vertexCount, true); offset += 4;
      dv.setUint32(offset, gobj.indexLocation, true); offset += 4;
      dv.setUint32(offset, gobj.indexCount, true); offset += 4;
      dv.setUint32(offset, gobj.instanceLocation + i, true); offset += 4; // 每个实例独立编号
      dv.setUint32(offset, i, true); offset += 4; // 每个实例单独写入1
      //materialId
      dv.setInt32(offset, gobj.materialId, true); // 写入材质ID
    }
    this.meshRes.gosData = newInstanceData;
    return gobj;
  }

  /**
   * 自动生成并写入间接绘制参数（非索引绘制）
   * 只处理传入的gobj，扩容并写入最后一组参数，offset由oldArr.length决定
   */
  private _appendIndirectDrawData(gobj: Gobj) {
    const oldArr = this.meshRes.indirectDrawData;
    const oldLen = oldArr ? oldArr.length : 0;
    const arr = new Uint32Array(oldLen + 4);
    if (oldArr && oldLen > 0) {
      arr.set(oldArr, 0);
    }
    // 只写最后一组，数据取自参数gobj
    arr[oldLen + 0] = gobj.vertexCount;
    arr[oldLen + 1] = gobj.instanceCount;
    arr[oldLen + 2] = gobj.vertexLocation;
    arr[oldLen + 3] = gobj.instanceLocation;
    this.meshRes.indirectDrawData = arr;
  }

  /**
   * 自动生成并写入间接索引绘制参数（索引绘制）
   * 只处理传入的gobj，扩容并写入最后一组参数，offset由oldArr.length决定
   */
  private _appendIndirectIndexDrawData(gobj: Gobj) {
    const oldArr = this.meshRes.indirectIndexDrawData;
    const oldLen = oldArr ? oldArr.length : 0;
    const arr = new Uint32Array(oldLen + 5);
    if (oldArr && oldLen > 0) {
      arr.set(oldArr, 0);
    }
    // 只写最后一组，数据取自参数gobj
    arr[oldLen + 0] = gobj.indexCount;
    arr[oldLen + 1] = gobj.instanceCount;
    arr[oldLen + 2] = gobj.indexLocation;
    arr[oldLen + 3] = gobj.vertexLocation; // baseVertex
    arr[oldLen + 4] = gobj.instanceLocation;
    this.meshRes.indirectIndexDrawData = arr;
  }
  //#endregion

  //#region addi
  /**
   * 获取所有 Gobj 对象 非索引情况
   * 互斥保护：add10/20 只能二选一，混用抛异常
   */
  add10(vertexData: Float32Array, instanceCount: GPUSize32 = 1): Gobj {
    if (this.drawMode === 'index') {
      throw new Error('Scene: add10/20 不能混用，当前已进入索引模式(add20)，请勿再调用 add10。');
    }
    this.drawMode = 'noindex';
    const gobj = new Gobj();
    gobj.id = this.gobjs.length; // 简单的ID分配
    gobj.label = `Gobj-${gobj.id}`;
    gobj.instanceCount = instanceCount;
    if (!this.meshRes.vertexLayout) {
      throw new Error("MeshRes.vertexLayout must be set before adding Gobj.");
    }
    let stride = this.meshRes.vertexLayout.arrayStride; // 获取顶点布局的步长
    // offset 直接用当前 vertexData 长度
    let offset = this.meshRes.vertexData ? this.meshRes.vertexData.length : 0;
    let newVertexData = new Float32Array(offset + vertexData.length);
    newVertexData.set(this.meshRes.vertexData || [], 0); // 复制现有顶点数据
    newVertexData.set(vertexData, offset); // 在末尾添加新顶点数据
    this.meshRes.vertexData = newVertexData; // 更新顶点数据
    gobj.vertexLocation = offset / stride; // 设置顶点位置
    gobj.vertexCount = vertexData.length / stride; // 设置顶点数量
    this.gobjs.push(gobj);
    // 更新 GOS 数据
    this._appendInstance(gobj, instanceCount); // 添加实例数据
    this._appendIndirectDrawData(gobj); // 只写本次gobj
    this._resourceFlags |= types_mod.ScenResource.RequiresVertexBuffer; // 设置资源标志
    this._resourceFlags |= types_mod.ScenResource.RequiresGOSBuffer; // 设置 GOS 资源标志    
    this._resourceFlags |= types_mod.ScenResource.RequiresIndirectDrawBuffer; // 设置间接绘制缓冲区资源标志
    return gobj; // 返回新创建的 Gobj 对象
  }
  add11(vertexData: Float32Array, modelmatrix: gmath_mod.Matrix4, instanceCount: GPUSize32 = 1): Gobj {
    var gobj = this.add10(vertexData, instanceCount);
    gobj.modelMatrix = modelmatrix; // 设置模型矩阵
    return gobj; // 返回新创建的 Gobj 对象
  }
  add12(vertexData: Float32Array, modelmatrix: gmath_mod.Matrix4, center: gmath_mod.Vector4, redius: GPUSize32, instanceCount: GPUSize32 = 1): Gobj {
    var gobj = this.add11(vertexData, modelmatrix, instanceCount);
    gobj.center = center; // 设置中心点
    gobj.redius = redius; // 设置半径
    return gobj; // 返回新创建的 Gobj 对象
  }
  add13(vertexData: Float32Array, modelmatrix: gmath_mod.Matrix4, materialId: types_mod.Id, instanceCount: GPUSize32 = 1): Gobj {
    var gobj = this.add11(vertexData, modelmatrix, instanceCount);
    gobj.materialId = materialId; // 设置材质ID
    return gobj; // 返回新创建的 Gobj 对象
  }
  add14(vertexData: Float32Array, modelmatrix: gmath_mod.Matrix4, center: gmath_mod.Vector4, redius: GPUSize32, materialId: types_mod.Id, instanceCount: GPUSize32 = 1): Gobj {
    var gobj = this.add12(vertexData, modelmatrix, center, redius, instanceCount);
    gobj.materialId = materialId; // 设置材质ID
    return gobj; // 返回新创建的 Gobj 对象
  }
  /**
   * 获取所有 Gobj 对象 有索引情况
   * 互斥保护：add10/20 只能二选一，混用抛异常
   */
  add20(vertexData: Float32Array, indexData: Uint32Array, instanceCount: GPUSize32 = 1): Gobj {
    if (this.drawMode === 'noindex') {
      throw new Error('Scene: add10/20 不能混用，当前已进入无索引模式(add10)，请勿再调用 add20。');
    }
    this.drawMode = 'index';
    const gobj = new Gobj();
    gobj.id = this.gobjs.length; // 简单的ID分配
    gobj.label = `Gobj-${gobj.id}`;
    gobj.instanceCount = instanceCount;
    if (!this.meshRes.vertexLayout) {
      throw new Error("MeshRes.vertexLayout must be set before adding Gobj.");
    }
    let stride = this.meshRes.vertexLayout.arrayStride; // 获取顶点布局的步长
    // 顶点数据扩容追加
    let vOffset = this.meshRes.vertexData ? this.meshRes.vertexData.length : 0;
    let newVertexData = new Float32Array(vOffset + vertexData.length);
    newVertexData.set(this.meshRes.vertexData || [], 0);
    newVertexData.set(vertexData, vOffset);
    this.meshRes.vertexData = newVertexData;
    gobj.vertexLocation = vOffset / stride; // 设置顶点位置
    gobj.vertexCount = vertexData.length / stride; // 设置顶点数量
    // 索引数据扩容追加
    let iOffset = this.meshRes.indexData ? this.meshRes.indexData.length : 0;
    let newIndexData = new Uint32Array(iOffset + indexData.length);
    newIndexData.set(this.meshRes.indexData || [], 0);
    newIndexData.set(indexData, iOffset);
    this.meshRes.indexData = newIndexData;
    gobj.indexLocation = iOffset;
    gobj.indexCount = indexData.length;
    this.gobjs.push(gobj);
    // 更新 GOS 数据
    this._appendInstance(gobj, instanceCount); // 添加实例数据
    this._appendIndirectIndexDrawData(gobj); // 只写本次gobj
    this._resourceFlags |= types_mod.ScenResource.RequiresVertexBuffer; // 设置顶点缓冲区资源标志
    this._resourceFlags |= types_mod.ScenResource.RequiresIndexBuffer; // 设置索引缓冲区资源标志
    this._resourceFlags |= types_mod.ScenResource.RequiresGOSBuffer; // 设置 GOS 资源标志
    this._resourceFlags |= types_mod.ScenResource.RequiresIndirectIndexDrawBuffer; // 设置间接索引绘制缓冲区资源标志
    return gobj; // 返回新创建的 Gobj 对象
  }
  add21(vertexData: Float32Array, indexData: Uint32Array, modelmatrix: gmath_mod.Matrix4, instanceCount: GPUSize32 = 1): Gobj {
    var gobj = this.add20(vertexData, indexData, instanceCount);
    gobj.modelMatrix = modelmatrix; // 设置模型矩阵
    return gobj; // 返回新创建的 Gobj 对象
  }
  add22(vertexData: Float32Array, indexData: Uint32Array, modelmatrix: gmath_mod.Matrix4, center: gmath_mod.Vector4, redius: GPUSize32, instanceCount: GPUSize32 = 1): Gobj {
    var gobj = this.add21(vertexData, indexData, modelmatrix, instanceCount);
    gobj.center = center; // 设置中心点
    gobj.redius = redius; // 设置半径
    return gobj; // 返回新创建的 Gobj 对象
  }
  add23(vertexData: Float32Array, indexData: Uint32Array, modelmatrix: gmath_mod.Matrix4, materialId: types_mod.Id, instanceCount: GPUSize32 = 1): Gobj {
    var gobj = this.add21(vertexData, indexData, modelmatrix, instanceCount);
    gobj.materialId = materialId; // 设置材质ID
    return gobj; // 返回新创建的 Gobj 对象
  }
  add24(vertexData: Float32Array, indexData: Uint32Array, modelmatrix: gmath_mod.Matrix4, center: gmath_mod.Vector4, redius: GPUSize32, materialId: types_mod.Id, instanceCount: GPUSize32 = 1): Gobj {
    var gobj = this.add22(vertexData, indexData, modelmatrix, center, redius, instanceCount);
    gobj.materialId = materialId; // 设置材质ID
    return gobj; // 返回新创建的 Gobj 对象
  }
  //#endregion

  //#region 资源标志与附件标志相关
  // --- 资源标志相关操作 ---
  private setResource(flags: types_mod.ScenResource | types_mod.ScenResource[]) {
    if (Array.isArray(flags)) {
      this._resourceFlags = flags.reduce((acc, f) => acc | f, 0);
    } else {
      this._resourceFlags = flags;
    }
  }
  /** 检查是否包含某个资源标志 */
  hasResource(flag: types_mod.ScenResource): boolean {
    return (this._resourceFlags & flag) === flag;
  }

  // --- 附件标志相关操作 ---
  private setAttachment(flags: types_mod.ScenAttachment | types_mod.ScenAttachment[]) {
    let value = Array.isArray(flags) ? flags.reduce((acc, f) => acc | f, 0) : flags;
    // 只允许 color 组和 csout 组各自最多只能有一个被设置，遇到冲突时用当前 set 参数覆盖
    const colorFlags = [
      types_mod.ScenAttachment.RequiresColorAttachment0,
      types_mod.ScenAttachment.RequiresColorAttachment1,
      types_mod.ScenAttachment.RequiresColorAttachment2,
      types_mod.ScenAttachment.RequiresColorAttachment3
    ];
    // 只保留当前 set 参数中的 color 组第一个
    let colorSet = colorFlags.filter(f => (value & f) !== 0);
    if (colorSet.length > 1) {
      value = value & ~colorFlags.reduce((acc, f) => acc | f, 0);
      value = value | colorSet[0];
    }
    // 只允许 csout 组最多只能有一个被设置
    const csoutFlags = [
      types_mod.ScenAttachment.RequiresColorAttachment0, // 假设 csout 组只使用第一个颜色附件
      types_mod.ScenAttachment.RequiresColorAttachment1,
      types_mod.ScenAttachment.RequiresColorAttachment2,
      types_mod.ScenAttachment.RequiresColorAttachment3
    ];
    // 只保留当前 set 参数中的 csout 组第一个
    let csoutSet = csoutFlags.filter(f => (value & f) !== 0);
    if (csoutSet.length > 1) {
      value = value & ~csoutFlags.reduce((acc, f) => acc | f, 0);
      value = value | csoutSet[0];
    }
    this._attachmentFlags = value;
  }
  hasAttachment(flag: types_mod.ScenAttachment): boolean {
    return (this._attachmentFlags & flag) === flag;
  }

  /**
   * 获取当前 resourceFlags 启用的所有资源枚举值
   */
  getEnabledResourceFlags(): types_mod.ScenResource[] {
    const enabled: types_mod.ScenResource[] = [];
    for (const key in types_mod.ScenResource) {
      const val = (types_mod.ScenResource as any)[key];
      if (typeof val === 'number' && val !== 0 && (this.resourceFlags & val) === val) {
        enabled.push(val);
      }
    }
    return enabled;
  }

  /**
   * 根据 attachmentFlags 的 number值，返回所有被置位的 ScenAttachment 枚举值集合（每遇到一个都加1，不省略）
   */
  getEnabledAttachmentFlags(): types_mod.ScenAttachment[] {
    const enabled: types_mod.ScenAttachment[] = [];
    const flags = this.attachmentFlags;
    for (const key in types_mod.ScenAttachment) {
      const val = (types_mod.ScenAttachment as any)[key];
      if (typeof val === 'number' && val !== 0 && (flags & val) === val) {
        enabled.push(val);
      }
    }
    return enabled;
  }
  //#endregion

  //#region 资源注册与分配
  /**
   * 根据 resourceFlags 自动注册所需资源到 owner.store
   * 需保证 meshRes 已初始化，owner/store 可用
   * 此方法应该在 addi setxxx等之后调用，以确保正确的资源 枚举值得到设置，同时所有应该录入的cpu侧输入数据得以就位
   * 在此情况下，将能正确的申请gpu显存，并将匹配的数据写入其中，对于不需要写入的情况也能得到正确对待；
   */
  registerResources() {
    if (!this.owner || !this.owner.access || !this.meshRes) return;
    const access = this.owner.access;
    const enabledFlags = this.getEnabledResourceFlags();
    for (const flag of enabledFlags) {
      switch (flag) {
        case types_mod.ScenResource.RequiresVertexBuffer:
          this.meshRes.vertexBufferId = access.registryBuffer(
            this.meshRes.vertexData ? this.meshRes.vertexData.byteLength : 0,
            GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
          );
          this.owner.device.queue.writeBuffer(
            this.owner.access.store.get(types_mod.ResType.buffer, this.meshRes.vertexBufferId)
            , 0
            , this.meshRes.vertexData
            , 0
          )
          break;
        case types_mod.ScenResource.RequiresIndexBuffer:
          this.meshRes.indexBufferId = access.registryBuffer(
            this.meshRes.indexData ? this.meshRes.indexData.byteLength : 0,
            GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
          );
          this.owner.device.queue.writeBuffer(
            this.owner.access.store.get(types_mod.ResType.buffer, this.meshRes.indexBufferId)
            , 0
            , this.meshRes.indexData
            , 0
          );
          break;
        case types_mod.ScenResource.RequiresCaseBuffer:
          // 分配 buffer，并写入 caseData（如有）
          // this.meshRes.caseBufferId = access.registryBuffer(
          //   this.meshRes.caseData ? this.meshRes.caseData.byteLength : 0,
          //   GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
          // );
          // if (this.meshRes.caseData) {
          //   this.owner.device.queue.writeBuffer(
          //     this.owner.access.store.get(types_mod.ResType.buffer, this.meshRes.caseBufferId),
          //     0,
          //     this.meshRes.caseData,
          //     0
          //   );
          // }
          break;
        case types_mod.ScenResource.RequiresIndirectDrawBuffer:
          this.meshRes.indirectDrawBufferId = access.registryBuffer(
            this.meshRes.indirectDrawData ? this.meshRes.indirectDrawData.byteLength : 0,
            GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST
          );
          //write
          this.owner.device.queue.writeBuffer(
            this.owner.access.store.get(types_mod.ResType.buffer, this.meshRes.indirectDrawBufferId)
            , 0
            , this.meshRes.indirectDrawData
            , 0
          );
          break;
        case types_mod.ScenResource.RequiresIndirectIndexDrawBuffer:
          this.meshRes.indirectIndexDrawBufferId = access.registryBuffer(
            this.meshRes.indirectIndexDrawData ? this.meshRes.indirectIndexDrawData.byteLength : 0,
            GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST
          );
          //write
          this.owner.device.queue.writeBuffer(
            this.owner.access.store.get(types_mod.ResType.buffer, this.meshRes.indirectIndexDrawBufferId)
            , 0
            , this.meshRes.indirectIndexDrawData
            , 0
          );
          break;
        case types_mod.ScenResource.RequiresIndirectWorkdispatchBuffer:
          // this.meshRes.indirectWorkdispatchData = new Uint32Array(3); // 假设间接工作调度数据为3个32位无符号整数
          // this.meshRes.indirectWorkdispatchBufferId = access.registryBuffer(
          //   this.meshRes.indirectWorkdispatchData ? this.meshRes.indirectWorkdispatchData.byteLength : 0,
          //   GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST
          // );
          break;
        case types_mod.ScenResource.RequiresGOSBuffer:
          this.meshRes.gosBufferId = access.registryBuffer(
            this.meshRes.gosData ? this.meshRes.gosData.byteLength : 0
            , GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
          );
          this.owner.device.queue.writeBuffer(
            this.owner.access.store.get(types_mod.ResType.buffer, this.meshRes.gosBufferId)
            , 0
            , this.meshRes.gosData
            , 0
          );
          break;
        case types_mod.ScenResource.RequiresTargetTexture:
          break;
        case types_mod.ScenResource.RequiresGOSTexture:
          break;
        case types_mod.ScenResource.RequiresOutBuffer:
          break;
      }
    }
  }
  //#endregion

  //#region 绑定组与布局创建
  /**
   * 创建CS用的Vertex/Index Buffer绑定组和布局
   * @param vertexType vertex buffer类型
   * @param indexType index buffer类型
   */
  createCsVertexIndexBindGroup(vertexType?: 'read-only-storage' | 'storage', indexType?: 'read-only-storage' | 'storage') {
    const access = this.owner.access;
    let idx = 0;
    const vType = vertexType || 'read-only-storage';
    const iType = indexType || 'read-only-storage';
    this.meshRes.csBindGroupLayoutId1 = access.registryBindGroupLayout(builder => {
      if (this.hasResource(types_mod.ScenResource.RequiresVertexBuffer) && this.meshRes.vertexBufferId >= 0)
        builder.addBuffer(idx++, GPUShaderStage.COMPUTE, { type: vType });
      if (this.hasResource(types_mod.ScenResource.RequiresIndexBuffer) && this.meshRes.indexBufferId >= 0)
        builder.addBuffer(idx++, GPUShaderStage.COMPUTE, { type: iType });
      return builder.build(this.owner.device);
    });
    this.meshRes.csBindGroupId1 = access.registryBindGroup(builder => {
      let idx = 0;
      if (this.hasResource(types_mod.ScenResource.RequiresVertexBuffer) && this.meshRes.vertexBufferId >= 0)
        builder.addBuffer(idx++, access.store.get(types_mod.ResType.buffer, this.meshRes.vertexBufferId));
      if (this.hasResource(types_mod.ScenResource.RequiresIndexBuffer) && this.meshRes.indexBufferId >= 0)
        builder.addBuffer(idx++, access.store.get(types_mod.ResType.buffer, this.meshRes.indexBufferId));
      return builder.build(this.owner.device, access.store.get(types_mod.ResType.bindGroupLayout, this.meshRes.csBindGroupLayoutId1));
    });
  }

  /**
   * 创建CS用的GOSTexture绑定组和布局
   * @param sampleType 纹理采样类型
   * @param viewType 纹理视图类型
   */
  createCsGosTextureBindGroup(sampleType?: GPUTextureSampleType, viewType?: GPUTextureViewDimension) {
    const access = this.owner.access;
    let idx = 0;
    const sType = sampleType || 'float';
    const vType = viewType || '2d-array';
    this.meshRes.csBindGroupLayoutId2 = access.registryBindGroupLayout(builder => {
      if (this.hasResource(types_mod.ScenResource.RequiresGOSTexture) && this.meshRes.gosTextureId >= 0)
        builder.addTexture(idx++, GPUShaderStage.COMPUTE, sType, vType);
      return builder.build(this.owner.device);
    });
    this.meshRes.csBindGroupId2 = access.registryBindGroup(builder => {
      let idx = 0;
      if (this.hasResource(types_mod.ScenResource.RequiresGOSTexture) && this.meshRes.gosTextureId >= 0) {
        const tex = access.store.get(types_mod.ResType.texture, this.meshRes.gosTextureId) as GPUTexture;
        builder.addTexture(idx++, tex.createView());
      }
      return builder.build(this.owner.device, access.store.get(types_mod.ResType.bindGroupLayout, this.meshRes.csBindGroupLayoutId2));
    });
  }

  /**
   * 创建CS用的Extra Buffer绑定组和布局
   * @param caseType caseBuffer类型
   * @param indirectDrawType indirectDrawBuffer类型
   * @param indirectIndexType indirectIndexDrawBuffer类型
   * @param indirectWorkType indirectWorkdispatchBuffer类型
   * @param outBufferType OutBuffer类型
   */
  createCsExtraBindGroup(
    caseType?: 'read-only-storage' | 'storage',
    indirectDrawType?: 'storage',
    indirectIndexType?: 'storage',
    indirectWorkType?: 'storage',
    outBufferType?: 'storage',
  ) {
    const access = this.owner.access;
    let idx = 0;
    const cType = caseType || 'read-only-storage';
    const dType = indirectDrawType || 'storage';
    const iType = indirectIndexType || 'storage';
    const wType = indirectWorkType || 'storage';
    const oType = outBufferType || 'storage';
    this.meshRes.csBindGroupLayoutId3 = access.registryBindGroupLayout(builder => {
      if (this.hasResource(types_mod.ScenResource.RequiresCaseBuffer) && this.meshRes.caseBufferId >= 0)
        builder.addBuffer(idx++, GPUShaderStage.COMPUTE, { type: cType });
      if (this.hasResource(types_mod.ScenResource.RequiresIndirectDrawBuffer) && this.meshRes.indirectDrawBufferId >= 0)
        builder.addBuffer(idx++, GPUShaderStage.COMPUTE, { type: dType });
      if (this.hasResource(types_mod.ScenResource.RequiresIndirectIndexDrawBuffer) && this.meshRes.indirectIndexDrawBufferId >= 0)
        builder.addBuffer(idx++, GPUShaderStage.COMPUTE, { type: iType });
      if (this.hasResource(types_mod.ScenResource.RequiresIndirectWorkdispatchBuffer) && this.meshRes.indirectWorkdispatchBufferId >= 0)
        builder.addBuffer(idx++, GPUShaderStage.COMPUTE, { type: wType });
      if (this.meshRes.OutBufferId >= 0)
        builder.addBuffer(idx++, GPUShaderStage.COMPUTE, { type: oType });
      return builder.build(this.owner.device);
    });
    this.meshRes.csBindGroupId3 = access.registryBindGroup(builder => {
      let idx = 0;
      if (this.hasResource(types_mod.ScenResource.RequiresCaseBuffer) && this.meshRes.caseBufferId >= 0)
        builder.addBuffer(idx++, access.store.get(types_mod.ResType.buffer, this.meshRes.caseBufferId));
      if (this.hasResource(types_mod.ScenResource.RequiresIndirectDrawBuffer) && this.meshRes.indirectDrawBufferId >= 0)
        builder.addBuffer(idx++, access.store.get(types_mod.ResType.buffer, this.meshRes.indirectDrawBufferId));
      if (this.hasResource(types_mod.ScenResource.RequiresIndirectIndexDrawBuffer) && this.meshRes.indirectIndexDrawBufferId >= 0)
        builder.addBuffer(idx++, access.store.get(types_mod.ResType.buffer, this.meshRes.indirectIndexDrawBufferId));
      if (this.hasResource(types_mod.ScenResource.RequiresIndirectWorkdispatchBuffer) && this.meshRes.indirectWorkdispatchBufferId >= 0)
        builder.addBuffer(idx++, access.store.get(types_mod.ResType.buffer, this.meshRes.indirectWorkdispatchBufferId));
      if (this.meshRes.OutBufferId >= 0)
        builder.addBuffer(idx++, access.store.get(types_mod.ResType.buffer, this.meshRes.OutBufferId));
      return builder.build(this.owner.device, access.store.get(types_mod.ResType.bindGroupLayout, this.meshRes.csBindGroupLayoutId3));
    });
  }

  /**
   * 创建RS用的bind group和layout，仅绑定gosTexture（主纹理/材质贴图）
   * @param sampleType gosTexture采样类型
   * @param viewType gosTexture视图类型
   */
  createRsBindGroup(
    sampleType?: GPUTextureSampleType,
    viewType?: GPUTextureViewDimension
  ) {
    const access = this.owner.access;
    let idx = 0;
    const sType = sampleType || 'float';
    const vType = viewType || '2d-array';
    this.meshRes.rsBindGroupLayoutId = access.registryBindGroupLayout(builder => {
      if (this.hasResource(types_mod.ScenResource.RequiresGOSTexture) && this.meshRes.gosTextureId >= 0)
        builder.addTexture(idx++, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, sType, vType);
      return builder.build(this.owner.device);
    });
    this.meshRes.rsBindGroupId = access.registryBindGroup(builder => {
      let idx = 0;
      if (this.hasResource(types_mod.ScenResource.RequiresGOSTexture) && this.meshRes.gosTextureId >= 0) {
        const tex = access.store.get(types_mod.ResType.texture, this.meshRes.gosTextureId) as GPUTexture;
        builder.addTexture(idx++, tex.createView());
      }
      return builder.build(this.owner.device, access.store.get(types_mod.ResType.bindGroupLayout, this.meshRes.rsBindGroupLayoutId));
    });
  }
  //#endregion

  //#region setxxx
  /**
   * 设置 caseData，仅写入数据，不负责分配 buffer
   */
  setcaseData(data: ArrayBuffer) {
    this.meshRes.caseData = data;
    // 只写入数据到 GPU buffer，不再分配 buffer
    if (this.meshRes.caseBufferId < 0) {
      // 若未分配，直接跳过写入或抛异常（可选，防止误用）
      // throw new Error('caseBufferId 未分配，请先调用 registerResources');
      return;
    }
    this.owner.device.queue.writeBuffer(
      this.owner.access.store.get(types_mod.ResType.buffer, this.meshRes.caseBufferId),
      0,
      data,
      0
    );
    this._resourceFlags |= types_mod.ScenResource.RequiresCaseBuffer;
  }

  /**
   * 配置并注册 GOS 纹理资源（支持图片数组，自动推导尺寸/层数并写入数据）
   * @param images ImageBitmap[]
   * @param format GPUTextureFormat
   */
  setGosTexture(images: ImageBitmap[], format?: GPUTextureFormat): void {
    if (!images || images.length === 0) return;
    if (!this.owner || !this.owner.access || !this.owner.device) return;
    // 1. 计算最大宽高
    let width = 0, height = 0;
    for (const img of images) {
      width = Math.max(width, img.width);
      height = Math.max(height, img.height);
    }
    const layer = images.length;
    const _format = format || this.owner.format || 'rgba8unorm';
    // 2. 分配 GPU 纹理
    this.meshRes.gosTextureId = this.owner.access.registryTexture(builder => builder
      .setSize(width, height, layer)
      .setFormat(_format)
      .setUsage(GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST)
      .build()
    );
    // 3. 写入每一层图片数据
    const device = this.owner.device;
    const tex = this.owner.access.store.get(types_mod.ResType.texture, this.meshRes.gosTextureId) as GPUTexture;
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      device.queue.copyExternalImageToTexture(
        { source: img },
        { texture: tex, origin: { x: 0, y: 0, z: i } },
        { width: img.width, height: img.height, depthOrArrayLayers: 1 }
      );
    }
    // 修正 Vector2 构造方式，兼容 gmath_mod.Vector2 定义
    if (typeof gmath_mod.Vector2.FromXY === 'function') {
      this.meshRes.gosTextureSize = gmath_mod.Vector2.FromXY(width, height);
    } else {
      // 兜底：尝试直接赋值
      this.meshRes.gosTextureSize = { x: width, y: height } as any;
    }
    this._resourceFlags |= types_mod.ScenResource.RequiresGOSTexture;
  }

  /**
   * 预分配一组空白 GOS 纹理层（如“白板”），可用于后续写入
   * @param width 纹理宽度
   * @param height 纹理高度
   * @param layers 图层数
   * @param format 纹理格式
   */
  setGosTexture2(width: number, height: number, layers: number, format?: GPUTextureFormat): void {
    if (!this.owner || !this.owner.access || !this.owner.device) return;
    const _format = format || this.owner.format || 'rgba8unorm';
    this.meshRes.gosTextureId = this.owner.access.registryTexture(builder => builder
      .setSize(width, height, layers)
      .setFormat(_format)
      .setUsage(GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_DST)
      .build()
    );
    // 设置 gosTextureSize
    if (typeof gmath_mod.Vector2.FromXY === 'function') {
      this.meshRes.gosTextureSize = gmath_mod.Vector2.FromXY(width, height);
    } else {
      this.meshRes.gosTextureSize = { x: width, y: height } as any;
    }
    this._resourceFlags |= types_mod.ScenResource.RequiresGOSTexture;
  }

  /**
   * 配置并注册 outBuffer 资源（无 data，仅配置大小）
   */
  setOutBuffer(size: number = 256) {
    this.meshRes.OutBufferId = this.owner.access.registryBuffer(
      size,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    );
    this._resourceFlags |= types_mod.ScenResource.RequiresOutBuffer;
  }

  /**
   * 配置并注册 targetTexture 资源（无 data，仅配置尺寸/格式等）
   */
  setTargetTexture(width: GPUSize32, height: GPUSize32
    , colorTargetStatesHandler: types_mod.ColorStateHandler
    , colorAttachmentParamSettingHandler?: types_mod.ColorAttachmentParamSettingHandler
    , depthStencilAttachmentParamSettingHandler?: types_mod.DepthStencilAttachmentParamSettingHandler) {
    const colorTargetStates = colorTargetStatesHandler(new builders_mod.ColorStateBuilder());
    const colorAttachmentsBuilder = new builders_mod.ColorAttachmentBuilder();
    const depthStencilAttachmentBuilder = new builders_mod.DepthStencilAttachmentBuilder();
    this.meshRes.targetTextureId = this.owner.access.registryTexture(builder => builder
      .setSize(width, height, colorTargetStates.length)
      .setFormat(this.owner.format || 'rgba8unorm')
      .setUsage(GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST)
      .setDimension('2d')
      .build()
    );
    this.meshRes.colorTargetStates = colorTargetStates;
    const texture = this.owner.access.store.get(types_mod.ResType.texture, this.meshRes.targetTextureId) as GPUTexture;
    for (let i = 0; i < colorTargetStates.length; i++) {
      const view = texture.createView({
        format: colorTargetStates[i].format,
        dimension: '2d',
        baseArrayLayer: i,
        arrayLayerCount: 1,
        baseMipLevel: 0,
        mipLevelCount: 1
      });
      colorAttachmentsBuilder.addView(view);
    }
    const depthView = texture.createView({
      format: 'depth24plus', // 或你的深度格式
      dimension: '2d',
      baseArrayLayer: 0,
      arrayLayerCount: 1,
      baseMipLevel: 0,
      mipLevelCount: 1
    });
    depthStencilAttachmentBuilder.setView(depthView);
    let colorAttachments: GPURenderPassColorAttachment[];
    let depthStencilAttachment: GPURenderPassDepthStencilAttachment;
    if (colorAttachmentParamSettingHandler) {
      colorAttachments = colorAttachmentParamSettingHandler(colorAttachmentsBuilder.build());
    } else {
      colorAttachments = colorAttachmentsBuilder.build();
    }
    if (depthStencilAttachmentParamSettingHandler) {
      depthStencilAttachment = depthStencilAttachmentParamSettingHandler(depthStencilAttachmentBuilder.build());
    }
    else {
      depthStencilAttachment = depthStencilAttachmentBuilder.build();
    }

    this.meshRes.colorAttachments = colorAttachments;
    this.meshRes.depthStencilAttachment = depthStencilAttachment;
    this._resourceFlags |= types_mod.ScenResource.RequiresTargetTexture;
  }

  /**
   * 设置间接 Workdispatch 参数（如 [x, y, z]），分配 GPU buffer 并写入数据，自动声明资源
   * @param data 形如 [x, y, z] 的 number[] 或 Uint32Array
   */
  setIndirectWorkdispatchData(data: number[] | Uint32Array) {
    // 允许多次调用，自动扩容/覆盖
    const arr = (data instanceof Uint32Array) ? data : new Uint32Array(data);
    this.meshRes.indirectWorkdispatchData = arr;
    // 若未分配则先分配 GPU buffer
    if (this.meshRes.indirectWorkdispatchBufferId < 0) {
      this.meshRes.indirectWorkdispatchBufferId = this.owner.access.registryBuffer(
        arr.byteLength,
        GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST
      );
    }
    // 写入数据到 GPU buffer
    this.owner.device.queue.writeBuffer(
      this.owner.access.store.get(types_mod.ResType.buffer, this.meshRes.indirectWorkdispatchBufferId),
      0,
      arr,
      0
    );
    this._resourceFlags |= types_mod.ScenResource.RequiresIndirectWorkdispatchBuffer;
  }
  //#endregion

}
//#endregion
