import * as gmath_mod from "./gmath";
import * as types_mod from "./types";
import * as scenery_mod from './scenery';
export declare class DrawIndirectArgs {
    private go;
    bufferId: number;
    constructor(go: Gobj);
    get byteSize(): GPUSize32;
    get buffer(): GPUBuffer;
    get vertexCount(): number;
    set vertexCount(value: number);
    get instanceCount(): number;
    set instanceCount(value: number);
    get firstVertex(): number;
    set firstVertex(value: number);
    get firstInstance(): number;
    set firstInstance(value: number);
}
export declare class DrawIndexIndirectArgs {
    private go;
    bufferId: number;
    constructor(go: Gobj);
    get byteSize(): number;
    get buffer(): GPUBuffer;
    get indexCount(): number;
    set indexCount(value: number);
    get instanceCount(): number;
    set instanceCount(value: number);
    get firstIndex(): number;
    set firstIndex(value: number);
    get baseVertex(): number;
    set baseVertex(value: number);
    get firstInstance(): number;
    set firstInstance(value: number);
}
export declare class InstanceData {
    id: GPUIndex32;
    go: Gobj;
    hasColor: boolean;
    hasMaterialId: boolean;
    hasUV: boolean;
    hasNormal: boolean;
    constructor(id: GPUIndex32, go: Gobj);
    get byteSize(): number;
    private offset;
    get instanceId(): number;
    set instanceId(value: number);
    get model(): gmath_mod.Matrix4;
    set model(value: gmath_mod.Matrix4);
    get color(): gmath_mod.Vector4 | undefined;
    set color(value: gmath_mod.Vector4 | undefined);
    get materialId(): number | undefined;
    set materialId(value: number | undefined);
    get uv(): gmath_mod.Vector2 | undefined;
    set uv(value: gmath_mod.Vector2 | undefined);
    get normal(): gmath_mod.Vector3 | undefined;
    set normal(value: gmath_mod.Vector3 | undefined);
}
export declare class MeshRef {
    scenery: scenery_mod.Scenery;
    drawIndirectArgsView: DataView<ArrayBuffer>;
    drawIndexIndirectArgsView: DataView<ArrayBuffer>;
    instanceDataView: DataView<ArrayBuffer>;
    instanceIndexView: DataView<ArrayBuffer>;
    constructor(scenery: scenery_mod.Scenery);
    vsBindGroupLayoutId: number;
    get renderBindGroupLayout(): GPUBindGroupLayout;
    vsBindGroupId: number;
    get bindGroupLayout(): GPUBindGroup;
    csBindGroupLayoutId: number;
    get computeBindGroupLayout(): GPUBindGroupLayout;
    csBindGroupId: number;
    get bindGroupCompute(): GPUBindGroup;
    vertexBufferId: number;
    get vertexBuffer(): GPUBuffer;
    indexBufferId?: number;
    get indexBuffer(): GPUBuffer;
    gosInstanceData: ArrayBuffer;
    gosInstanceBufferId: number;
    get gosInstanceBuffer(): GPUBuffer;
    gosIndexData: ArrayBuffer;
    gosIndexBufferId: number;
    get gosIndexBuffer(): GPUBuffer;
    gosIndirectArgsData: ArrayBuffer;
    gosIndexIndirectArgsData: ArrayBuffer;
    gosIndirectArgsBufferId?: number;
    gosIndexIndirectArgsBufferId?: number;
    get gosIndirectArgsBuffer(): GPUBuffer;
    get gosIndexIndirectArgsBuffer(): GPUBuffer;
    dispatchIndirectBufferId?: number;
    get dispatchIndirectBuffer(): GPUBuffer;
}
export declare class GobjInstanceIndex {
    static readonly byteSize: number;
    go: Gobj;
    constructor(go: Gobj);
    get gobjId(): number;
    set gobjId(value: number);
    get start(): number;
    set start(value: number);
    get count(): number;
    set count(value: number);
}
export declare class Mesh {
    scenery: scenery_mod.Scenery;
    buffer: Float32Array;
    indices?: Uint32Array;
    ref: MeshRef;
    gos: Gobj[];
    isIndex: boolean;
    vertexLayout: GPUVertexBufferLayout;
    usage: GPUPrimitiveTopology;
    constructor(scenery: scenery_mod.Scenery, usage?: GPUPrimitiveTopology);
    allocLocalBuffer(buffer: Float32Array, indices?: Uint32Array): void;
    private allocateBuffers;
    private setupView;
    private setGosBuffer;
    private setVsBindGroupLayout;
    private setVsBindGroup;
    private setCsBindGroupLayout;
    private setCsBindGroup;
    setBinding(csBindingNo: number, vsBindingNo: number): void;
    setVertexLayout(config: types_mod.VertexFormatHandler): void;
    addGobjFromVertex(index: number, count: number, isIndex: boolean, center?: gmath_mod.Vector3): Gobj;
    addGobjFromIndex(vertexIndex: number, vertexCount: number, indexIndex: number, indexCount: number, isIndex: boolean, center?: gmath_mod.Vector3): Gobj;
}
export declare class Gobj {
    mesh: Mesh;
    id: number;
    isIndex: boolean;
    materialId?: number;
    instanceData: InstanceData[];
    instanceIndex: GobjInstanceIndex;
    label?: string;
    vertexIndex: number;
    vertexCount: number;
    indexIndex: number;
    indexCount: number;
    firstInstance: number;
    baseVertex: number;
    parent?: Gobj;
    children: Gobj[];
    boundingBox?: {
        min: gmath_mod.Vector3;
        max: gmath_mod.Vector3;
    };
    center: gmath_mod.Vector3;
    get instanceCount(): number;
    drawIndirectArgs: DrawIndirectArgs;
    drawIndexIndirectArgs: DrawIndexIndirectArgs;
    constructor(id: number, mesh: Mesh, isIndex?: boolean, center?: gmath_mod.Vector3);
}
