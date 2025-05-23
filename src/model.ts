/**
 * Synario WebGPU Graphics Library
 * @file model.ts
 * @description 3D模型相关类型定义和操作
 * @author Synario Team
 * 本模块设计思路：
 * 1，集中的 vertex/index buffer,可一次投喂，而draw-call 的次数可与 gobj的数量 相关
 * 2，mesh 可做为整体支持实例化，而gobj 只是mesh的一个部分可以这么来理解，不能对单个gobj进行实例化
 * 3，全部采用间接参数，包括绘制与计算
 * 4，Mesh为主类，它提供一个绑定组，包括6个缓冲区，vs/fs 这边 绑定所有gobj的属性，cs这边绑定 所有的缓冲
 */
import * as gmath_mod from "./gmath";
import * as types_mod from "./types";
import * as scenery_mod from './scenery';
import * as data_access_mod from './data-access';
import * as builders_mod from './builders';
import * as vertex_format_builder_mod from './vertex-format-builder';

export enum RenderMode {
  Instanced,
  Indirect,
}

export class Gobj {
  id: types_mod.Id;
  mesh: Mesh;
  startVertexIndex: GPUIndex32;
  countVertex: GPUSize32;
  startIndexIndex: GPUIndex32;
  countIndex: GPUSize32;

  model: gmath_mod.Matrix4;
  mvp: gmath_mod.Matrix4;
  color?: gmath_mod.Vector4;
  materialId?: types_mod.Id;
  textureId?: types_mod.Id;

  constructor(mesh: Mesh, id: types_mod.Id) {
    this.mesh = mesh;
    this.id = id;
    this.startVertexIndex = 0;
    this.countVertex = 0;
    this.startIndexIndex = 0;
    this.countIndex = 0;
    this.model = gmath_mod.Matrix4.Identity();
    this.mvp = gmath_mod.Matrix4.Identity();
    this.color = undefined;
    this.materialId = undefined;
    this.textureId = undefined;
  }
}

export class MeshRes {
  scenery: scenery_mod.Scenery;
  constructor(scenery: scenery_mod.Scenery) {
    this.scenery = scenery;
  }
  vertexData: Float32Array;
  vertexView: DataView;
  vertexBufferId: types_mod.Id;
  get vertexBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.vertexBufferId);
  }
  indexData: Uint32Array;
  indexView: DataView;
  indexBufferId: types_mod.Id;
  getOptionalIndexBuffer(): GPUBuffer | undefined {
    return this.indexBufferId !== undefined ? this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.indexBufferId) : undefined;
  }

  gosBufferId: types_mod.Id;
  get gosBuffer(): GPUBuffer {
    return this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.gosBufferId);
  }

  indirectDrawBufferId: types_mod.Id;
  get indirectDrawBuffer(): GPUBuffer | undefined {
    return this.indirectDrawBufferId !== undefined ? this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.indirectDrawBufferId) : undefined;
  }

  dispatchBufferId: types_mod.Id;
  get dispatchBuffer(): GPUBuffer | undefined {
    return this.dispatchBufferId !== undefined ? this.scenery.access.store.get<GPUBuffer>(types_mod.ResType.buffer, this.dispatchBufferId) : undefined;
  }

  vsInstancedBindGroupLayoutId: types_mod.Id;
  vsInstancedBindGroupId: types_mod.Id;
  vsIndirectBindGroupLayoutId: types_mod.Id;
  vsIndirectBindGroupId: types_mod.Id;

  csInstancedBindGroupLayoutId: types_mod.Id;
  csInstancedBindGroupId: types_mod.Id;
  csIndirectBindGroupLayoutId: types_mod.Id;
  csIndirectBindGroupId: types_mod.Id;
}

export class Mesh {
  instanceId: types_mod.Id;
  scenery: scenery_mod.Scenery;
  useIndex: boolean;
  res: MeshRes;
  gos: Gobj[];
  vertexLayout: GPUVertexBufferLayout;
  instanceLayout?: GPUVertexBufferLayout;
  primitiveTopology: GPUPrimitiveTopology;
  renderMode: RenderMode;

  static readonly GOBJ_MODEL_OFFSET = 0;
  static readonly GOBJ_COLOR_OFFSET = 64;
  static readonly GOBJ_DATA_STRIDE = 80;

  get isInstancePattern(): boolean {
    return this.renderMode === RenderMode.Instanced;
  }

  constructor(scenery: scenery_mod.Scenery, mode: RenderMode = RenderMode.Indirect) {
    this.scenery = scenery;
    this.gos = [];
    this.useIndex = false;
    this.res = new MeshRes(this.scenery);
    this.renderMode = mode;
    this.primitiveTopology = 'triangle-list';
  }

  init(
    vertexData: Float32Array,
    vertexLayout: GPUVertexBufferLayout,
    indexData?: Uint32Array,
    instanceLayoutForInstancedMode?: GPUVertexBufferLayout
  ): void {
    this.res.vertexData = vertexData;
    this.res.vertexView = new DataView(this.res.vertexData.buffer, this.res.vertexData.byteOffset, this.res.vertexData.byteLength);
    this.res.vertexBufferId = this.scenery.access.registryBuffer(
      this.res.vertexData.byteLength,
      GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    );
    this.vertexLayout = vertexLayout;

    if (indexData) {
      this.useIndex = true;
      this.res.indexData = indexData;
      this.res.indexView = new DataView(this.res.indexData.buffer, this.res.indexData.byteOffset, this.res.indexData.byteLength);
      this.res.indexBufferId = this.scenery.access.registryBuffer(
        this.res.indexData.byteLength,
        GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      );
    }

    if (this.renderMode === RenderMode.Instanced) {
      if (instanceLayoutForInstancedMode) {
        this.instanceLayout = instanceLayoutForInstancedMode;
      } else {
        console.warn("Instanced mode selected, but no instanceLayoutForInstancedMode provided. Instance data might not be correctly mapped in shaders.");
      }
    }
  }

  addGobj(gobjConfig?: Partial<Gobj>): Gobj {
    const newId = this.gos.length;
    const gobj = new Gobj(this, newId);
    if (gobjConfig) {
      Object.assign(gobj, gobjConfig);
    }
    this.gos.push(gobj);
    return gobj;
  }

  public allocateAndSetupResources(): void {
    if (this.gos.length === 0) {
      console.warn("No Gobj instances added. Buffers and bind groups will not be created.");
      return;
    }

    const gosBufferSize = this.gos.length * Mesh.GOBJ_DATA_STRIDE;
    let gosBufferUsage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
    if (this.renderMode === RenderMode.Instanced) {
      gosBufferUsage |= GPUBufferUsage.VERTEX;
    }
    this.res.gosBufferId = this.scenery.access.registryBuffer(gosBufferSize, gosBufferUsage);
    this.updateGosBufferData();

    if (this.renderMode === RenderMode.Indirect) {
      const indirectDrawCommandSize = (this.useIndex ? 5 : 4) * Uint32Array.BYTES_PER_ELEMENT;
      this.res.indirectDrawBufferId = this.scenery.access.registryBuffer(
        this.gos.length * indirectDrawCommandSize,
        GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.INDIRECT,
      );
      this.updateIndirectDrawCommands();
    }

    this.res.dispatchBufferId = this.scenery.access.registryBuffer(
      3 * Uint32Array.BYTES_PER_ELEMENT,
      GPUBufferUsage.COPY_DST | GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE
    );

    this.setupBindGroupsInternal();
  }

  public updateGosBufferData(): void {
    if (!this.res.gosBufferId || this.gos.length === 0) return;
    const bufferData = new ArrayBuffer(this.gos.length * Mesh.GOBJ_DATA_STRIDE);
    const view = new DataView(bufferData);
    this.gos.forEach((gobj, i) => {
      const baseOffset = i * Mesh.GOBJ_DATA_STRIDE;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          view.setFloat32(baseOffset + Mesh.GOBJ_MODEL_OFFSET + (c * 4 + r) * 4, gobj.model.buffer[c * 4 + r], true);
        }
      }
      if (gobj.color) {
        const colorDataOffset = baseOffset + Mesh.GOBJ_COLOR_OFFSET;
        view.setFloat32(colorDataOffset + 0, gobj.color.r, true);
        view.setFloat32(colorDataOffset + 4, gobj.color.g, true);
        view.setFloat32(colorDataOffset + 8, gobj.color.b, true);
        view.setFloat32(colorDataOffset + 12, gobj.color.a, true);
      }
    });
    this.scenery.access.updateBuffer(this.res.gosBufferId, bufferData);
  }

  public updateIndirectDrawCommands(): void {
    if (this.renderMode !== RenderMode.Indirect || !this.res.indirectDrawBufferId || this.gos.length === 0) return;

    const numCommands = this.gos.length;
    const commandFields = this.useIndex ? 5 : 4;
    const bufferData = new Uint32Array(numCommands * commandFields);

    for (let i = 0; i < numCommands; i++) {
      const gobj = this.gos[i];
      const offset = i * commandFields;
      if (this.useIndex) {
        bufferData[offset + 0] = gobj.countIndex;
        bufferData[offset + 1] = 1;
        bufferData[offset + 2] = gobj.startIndexIndex;
        bufferData[offset + 3] = gobj.startVertexIndex;
        bufferData[offset + 4] = i;
      } else {
        bufferData[offset + 0] = gobj.countVertex;
        bufferData[offset + 1] = 1;
        bufferData[offset + 2] = gobj.startVertexIndex;
        bufferData[offset + 3] = i;
      }
    }
    this.scenery.access.updateBuffer(this.res.indirectDrawBufferId, bufferData.buffer);
  }

  private setupBindGroupsInternal(): void {
    const device = this.scenery.device;
    const access = this.scenery.access;
    const store = access.store;

    if (this.renderMode === RenderMode.Instanced) {
      this.res.vsInstancedBindGroupLayoutId = access.registryBindGroupLayout(builder => {
        return builder.build(device);
      });
      this.res.vsInstancedBindGroupId = access.registryBindGroup(builder => {
        return builder.build(device, store.get(types_mod.ResType.bindGroupLayout, this.res.vsInstancedBindGroupLayoutId));
      });
    } else {
      this.res.vsIndirectBindGroupLayoutId = access.registryBindGroupLayout(builder => {
        builder.addBuffer(1, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage', minSize: Mesh.GOBJ_DATA_STRIDE });
        return builder.build(device);
      });
      this.res.vsIndirectBindGroupId = access.registryBindGroup(builder => {
        builder.addBuffer(1, this.res.gosBuffer);
        return builder.build(device, store.get(types_mod.ResType.bindGroupLayout, this.res.vsIndirectBindGroupLayoutId));
      });
    }

    this.res.csInstancedBindGroupLayoutId = access.registryBindGroupLayout(builder => {
      builder.addBuffer(0, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.res.vertexData.byteLength });
      if (this.useIndex && this.res.indexBufferId !== undefined) builder.addBuffer(1, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.res.indexData.byteLength });
      builder.addBuffer(2, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.gos.length * Mesh.GOBJ_DATA_STRIDE });
      if (this.res.dispatchBufferId !== undefined) builder.addBuffer(3, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.res.dispatchBuffer.size });
      return builder.build(device);
    });
    this.res.csInstancedBindGroupId = access.registryBindGroup(builder => {
      builder.addBuffer(0, this.res.vertexBuffer);
      if (this.useIndex && this.res.indexBufferId !== undefined) builder.addBuffer(1, this.res.getOptionalIndexBuffer());
      builder.addBuffer(2, this.res.gosBuffer);
      if (this.res.dispatchBufferId !== undefined) builder.addBuffer(3, this.res.dispatchBuffer);
      return builder.build(device, store.get(types_mod.ResType.bindGroupLayout, this.res.csInstancedBindGroupLayoutId));
    });

    this.res.csIndirectBindGroupLayoutId = access.registryBindGroupLayout(builder => {
      builder.addBuffer(0, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.res.vertexData.byteLength });
      if (this.useIndex && this.res.indexBufferId !== undefined) builder.addBuffer(1, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.res.indexData.byteLength });
      builder.addBuffer(2, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.gos.length * Mesh.GOBJ_DATA_STRIDE });
      if (this.res.indirectDrawBufferId !== undefined) builder.addBuffer(3, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.res.indirectDrawBuffer.size });
      if (this.res.dispatchBufferId !== undefined) builder.addBuffer(4, GPUShaderStage.COMPUTE, { type: 'storage', minSize: this.res.dispatchBuffer.size });
      return builder.build(device);
    });
    this.res.csIndirectBindGroupId = access.registryBindGroup(builder => {
      builder.addBuffer(0, this.res.vertexBuffer);
      if (this.useIndex && this.res.indexBufferId !== undefined) builder.addBuffer(1, this.res.getOptionalIndexBuffer());
      builder.addBuffer(2, this.res.gosBuffer);
      if (this.res.indirectDrawBufferId !== undefined) builder.addBuffer(3, this.res.indirectDrawBuffer);
      if (this.res.dispatchBufferId !== undefined) builder.addBuffer(4, this.res.dispatchBuffer);
      return builder.build(device, store.get(types_mod.ResType.bindGroupLayout, this.res.csIndirectBindGroupLayoutId));
    });
  }

  public getGobjCount(): number {
    return this.gos.length;
  }

  public getPrimitiveTopology(): GPUPrimitiveTopology {
    return this.primitiveTopology;
  }

  public getVertexLayoutsForRender(): GPUVertexBufferLayout[] {
    const layouts = [this.vertexLayout];
    if (this.renderMode === RenderMode.Instanced && this.instanceLayout) {
      layouts.push(this.instanceLayout);
    }
    return layouts;
  }

  public getVertexBufferForSlot(slot: number): GPUBuffer | undefined {
    if (slot === 0) return this.res.vertexBuffer;
    if (this.renderMode === RenderMode.Instanced && slot === 1) return this.res.gosBuffer;
    return undefined;
  }

  public getIndexBuffer(): GPUBuffer | undefined {
    return this.useIndex ? this.res.getOptionalIndexBuffer() : undefined;
  }

  public getIndexFormat(): GPUIndexFormat | undefined {
    return this.useIndex ? 'uint32' : undefined;
  }

  public getIndirectBufferForDraw(): GPUBuffer | undefined {
    return this.renderMode === RenderMode.Indirect ? this.res.indirectDrawBuffer : undefined;
  }

  public getCurrentRenderBindGroupLayoutId(): types_mod.Id | undefined {
    return this.renderMode === RenderMode.Instanced ? this.res.vsInstancedBindGroupLayoutId : this.res.vsIndirectBindGroupLayoutId;
  }

  public getCurrentRenderBindGroupId(): types_mod.Id | undefined {
    return this.renderMode === RenderMode.Instanced ? this.res.vsInstancedBindGroupId : this.res.vsIndirectBindGroupId;
  }

  public getCurrentComputeBindGroupLayoutId(): types_mod.Id | undefined {
    return this.renderMode === RenderMode.Instanced ? this.res.csInstancedBindGroupLayoutId : this.res.csIndirectBindGroupLayoutId;
  }

  public getCurrentComputeBindGroupId(): types_mod.Id | undefined {
    return this.renderMode === RenderMode.Instanced ? this.res.csInstancedBindGroupId : this.res.csIndirectBindGroupId;
  }
}
