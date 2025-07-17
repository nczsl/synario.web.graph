declare class DepthStencilAttachmentBuilder {
    private depthStencilAttachment;
    setView(view: GPUTextureView): this;
    setDepthClearValue(value: number): this;
    setDepthLoadOp(op: GPULoadOp): this;
    setDepthStoreOp(op: GPUStoreOp): this;
    setStencilClearValue(value: number): this;
    setStencilLoadOp(op: GPULoadOp): this;
    setStencilStoreOp(op: GPUStoreOp): this;
    build(): GPURenderPassDepthStencilAttachment;
}
declare class ColorAttachmentBuilder {
    private colorAttachment;
    private current;
    addView(view: GPUTextureView): this;
    setClearValue(clearValue: GPUColor): this;
    setLoadOp(loadOp: GPULoadOp): this;
    setStoreOp(storeOp: GPUStoreOp): this;
    build(): GPURenderPassColorAttachment[];
}

declare class ColorStateBuilder {
    private states;
    addState(format: GPUTextureFormat, colorblend?: GPUBlendComponent, alphablend?: GPUBlendComponent): this;
    build(): GPUColorTargetState[];
}
declare class BindGroupLayoutBuilder {
    private entries;
    private bindingSet;
    addBuffer(binding: number, visibility: GPUShaderStageFlags, options: {
        type: GPUBufferBindingType;
        dynamicOffset?: boolean;
        minSize?: number;
    }): this;
    addTexture(binding: number, visibility: GPUShaderStageFlags, sampleType: GPUTextureSampleType, viewDimension?: GPUTextureViewDimension): this;
    addSampler(binding: number, visibility: GPUShaderStageFlags, type?: GPUSamplerBindingType): this;
    addStorageTexture(binding: number, visibility: GPUShaderStageFlags, format: GPUTextureFormat, access?: GPUStorageTextureAccess, viewDimension?: GPUTextureViewDimension): this;
    addExternalTexture(binding: number, visibility: GPUShaderStageFlags): this;
    build(device: GPUDevice): GPUBindGroupLayout;
    private validateBinding;
}
declare class TextureDescriptorBuilder {
    private descriptor;
    setSize(width: number, height: number, depthOrArrayLayers?: number): this;
    setFormat(format: GPUTextureFormat): this;
    setUsage(usage: GPUTextureUsageFlags): this;
    setDimension(dimension?: GPUTextureDimension): this;
    setMipLevelCount(mipLevelCount?: number): this;
    setSampleCount(sampleCount: GPUIntegerCoordinate): this;
    setViewFormats(viewFormats: GPUTextureFormat[]): this;
    build(): GPUTextureDescriptor;
}
declare class SamplerDescriptorBuilder {
    private descriptor;
    setAddressMode(addressModeU: GPUAddressMode, addressModeV?: GPUAddressMode, addressModeW?: GPUAddressMode): this;
    setMagFilter(filter: GPUFilterMode): this;
    setMinFilter(filter: GPUFilterMode): this;
    setMipmapFilter(filter: GPUMipmapFilterMode): this;
    setLodMinClamp(lodMinClamp: number): this;
    setLodMaxClamp(lodMaxClamp: number): this;
    setCompare(compare: GPUCompareFunction): this;
    setMaxAnisotropy(maxAnisotropy: number): this;
    build(): GPUSamplerDescriptor;
}
declare class BindGroupBuilder {
    entries: GPUBindGroupEntry[];
    private bindingSet;
    addBuffer(binding: number, buffer: GPUBuffer): this;
    addTexture(binding: number, textureView: GPUTextureView): this;
    addSampler(binding: number, sampler: GPUSampler): this;
    build(device: GPUDevice, layout: GPUBindGroupLayout): GPUBindGroup;
    private validateBinding;
}
declare class PassEncoderDescriptorBuilder {
    private renderPassDesc;
    private colorAttachments;
    private computePassDesc;
    private isRenderPass;
    constructor();
    asRenderPass(): PassEncoderDescriptorBuilder;
    asComputePass(): PassEncoderDescriptorBuilder;
    addColorAttachment(attachment: GPURenderPassColorAttachment): PassEncoderDescriptorBuilder;
    setDepthStencilAttachment(depthStencilAttachment: GPURenderPassDepthStencilAttachment): PassEncoderDescriptorBuilder;
    setOcclusionQuerySet(querySet: GPUQuerySet): PassEncoderDescriptorBuilder;
    setLabel(label: string): PassEncoderDescriptorBuilder;
    build(): types_mod.PassDescriptor;
}

declare class Camera {
    position: math_mod.Vector4;
    target: math_mod.Vector4;
    up: math_mod.Vector4;
    fov: number;
    aspect: number;
    near: number;
    far: number;
    viewMatrix: math_mod.Matrix4;
    projectionMatrix: math_mod.Matrix4;
    static readonly BUFFER_SIZE: number;
    buffer: ArrayBuffer;
    bindgrouplayoutId_vs: number;
    bindgroupId_vs: number;
    bindgrouplayoutId_cs: number;
    bindgroupId_cs: number;
    bufferId: number;
    constructor();
    updateViewMatrix(): void;
    updateProjectionMatrix(): void;
    updateViewProjectionMatrix(): void;
    setPerspective(fov: number, aspect: number, near: number, far: number): void;
    setPosition(x: number, y: number, z: number, w?: number): void;
    setTarget(x: number, y: number, z: number, w?: number): void;
    setUp(x: number, y: number, z: number, w?: number): void;
    updateBuffer(): void;
    get bindGroupLayoutId_vs(): number;
    get bindGroupId_vs(): number;
    get bindGroupLayoutId_cs(): number;
    get bindGroupId_cs(): number;
}



declare class Control {
    access: data_access_mod.DataAccess;
    camera: camera_mod.Camera;
    signal: signal_mod.Signal;
    samplers: {
        [key: string]: GPUSampler;
    };
    samplerBindGroupLayoutId: number;
    samplerBindGroupId: number;
    constructor(access: data_access_mod.DataAccess);
    registryEvent(): void;
    update(tick: number): void;
    initSamplers(device: GPUDevice): void;
    getSampler(name: string): GPUSampler;
    initSamplerBindGroup(device: GPUDevice): void;
    getSamplerBindGroup(): GPUBindGroup | null;
    getSamplerBindGroupLayout(): GPUBindGroupLayout | null;
}





declare class DataAccess {
    store: store_mod.Store;
    scenery: scenery_mod.Scenery;
    colorTargetStateIds: {
        [key: string]: types_mod.Id;
    };
    constructor(scen: scenery_mod.Scenery);
    registryRenderPipeline(config: types_mod.PipelineHandler): types_mod.Id;
    registryComputePipeline(config: types_mod.PipelineHandler): types_mod.Id;
    registryBindGroupLayout(config: types_mod.BindGroupLayoutHandler): types_mod.Id;
    registryBindGroup(config: types_mod.BindGroupHandler): types_mod.Id;
    registryBuffer(size: GPUSize32, usage?: GPUBufferUsageFlags): types_mod.Id;
    updateBuffer(id: types_mod.Id, data: ArrayBufferLike): void;
    registryTexture(config: types_mod.TextureDescriptorHandler): types_mod.Id;
    updateTexture(id: types_mod.Id, data: ArrayBufferLike, options: {
        width: number;
        height: number;
        format: GPUTextureFormat;
        bytesPerRow?: number;
        rowsPerImage?: number;
        offset?: number;
        mipLevel?: number;
        depthOrArrayLayers?: number;
    }): void;
    initSignalCamera(signal: signal_mod.Signal, camera: camera_mod.Camera): void;
}
declare const PI: number;
declare const MATRIX4F_SIZE: number;
declare const MATRIX3F_SIZE: number;
declare class Vector {
    buffer: Float32Array;
    constructor(buffer: Float32Array);
    ToString(): string;
    get x(): number;
    get y(): number;
    get z(): number;
    get w(): number;
    set x(value: number);
    set y(value: number);
    set z(value: number);
    set w(value: number);
    get r(): number;
    get g(): number;
    get b(): number;
    get a(): number;
    set r(value: number);
    set g(value: number);
    set b(value: number);
    set a(value: number);
    Equals(v: Vector): boolean;
    Reset(...values: number[]): void;
    get len(): number;
    Length(): number;
    Normalize(): void;
    Clone<TVector extends Vector>(): TVector;
    static FromXY(x: number, y: number): Vector2;
    static FromXYZ(x: number, y: number, z: number): Vector3;
    static FromXYZW(x: number, y: number, z: number, w: number): Vector4;
    static FromRGB(r: number, g: number, b: number): Vector3;
    static FromRGBA(r: number, g: number, b: number, a: number): Vector4;
    static FromArray<TVector extends Vector>(arr: number[]): TVector;
    static Dot(a: Vector, b: Vector): number;
    EqualsTolerance(v: Vector, epsilon?: number): boolean;
    static Perpendicular(a: Vector2): Vector2;
    static Add(a: Vector, b: Vector): Vector;
    static Subtract(a: Vector, b: Vector): Vector;
    static Normalize(v: Vector): Vector;
}
declare class Vector2 extends Vector {
    constructor(buffer?: Float32Array);
    static len: number;
    static Zero(): Vector2;
    static One(): Vector2;
    Abs(): Vector2;
    Negate(): Vector2;
    Sum(): number;
    Average(): number;
    static Distance(a: Vector2, b: Vector2): number;
    static Lerp(a: Vector2, b: Vector2, t: number): Vector2;
    static MultiplyScalar(v: Vector2, scalar: number): Vector2;
    static Transform(left: Matrix3, x: Vector2): Vector2;
}
declare class Vector3 extends Vector {
    constructor(buffer?: Float32Array);
    static len: number;
    static Zero(): Vector3;
    static One(): Vector3;
    Abs(): Vector3;
    Negate(): Vector3;
    Sum(): number;
    Average(): number;
    static Cross(a: Vector3, b: Vector3): Vector3;
    static Distance(a: Vector3, b: Vector3): number;
    static Lerp(a: Vector3, b: Vector3, t: number): Vector3;
    static Transform(left: Matrix4, x: Vector3): Vector3;
    static GetForward(): Vector3;
    static GetBack(): Vector3;
    static GetUp(): Vector3;
    static GetDown(): Vector3;
    static GetRight(): Vector3;
    static GetLeft(): Vector3;
}
declare class Vector4 extends Vector {
    constructor(buffer?: Float32Array);
    static len: number;
    static Zero(): Vector4;
    static One(): Vector4;
    Abs(): Vector4;
    Negate(): Vector4;
    Sum(): number;
    Average(): number;
    static Distance(a: Vector4, b: Vector4): number;
    static Lerp(a: Vector4, b: Vector4, t: number): Vector4;
    static Transform(left: Matrix4, x: Vector4): Vector4;
}
declare class Matrix {
    buffer: Float32Array;
    row: number;
    col: number;
    static length: number;
    constructor(buffer: Float32Array);
    ToString(): string;
    GetByIndex(row: number, col: number): number;
    SetByIndex(row: number, col: number, value: number): void;
    GetRow(rowNo: number): Iterable<number>;
    GetCol(colNo: number): Iterable<number>;
    GetRowVector<TVector extends Vector>(rowNo: number): TVector;
    GetColVector<TVector extends Vector>(colNo: number): TVector;
    SetRow(rowNo: number, v: Vector): void;
    SetCol(colNo: number, v: Vector): void;
    Transpose<TMatrix extends Matrix>(): TMatrix;
    Clone<TMatrix extends Matrix>(): TMatrix;
    Invert<TMatrix extends Matrix>(): TMatrix;
}
declare class Matrix4 extends Matrix {
    constructor(buffer?: Float32Array);
    static readonly LENGTH: number;
    Invert<TMatrix extends Matrix>(): TMatrix;
    get Delta(): number;
    static FromArray(arr: number[]): Matrix4;
    static Multiply(left: Matrix4, right: Matrix4): Matrix4;
    Multiply(other: Matrix4): void;
    Add(other: Matrix4): void;
    Subtract(other: Matrix4): void;
    Scalar(scalar: number): void;
    static Identity(): Matrix4;
    static LookAt(eye: Vector3, center: Vector3, up: Vector3): Matrix4;
    static Perspective(angle: number, aspect: number, near: number, far: number): Matrix4;
    static Viewport(x: number, y: number, width: number, height: number, depth: number): Matrix4;
    static RotationX(angle: number): Matrix4;
    RotateX(angle: number): void;
    RotateY(angle: number): void;
    RotateZ(angle: number): void;
    RotateAxis(axis: Float32Array, angle: number): void;
    static RotationY(angle: number): Matrix4;
    static RotationZ(angle: number): Matrix4;
    static RotationAxis(axis: Float32Array, angle: number): Matrix4;
    static Translation(x: number, y: number, z: number): Matrix4;
    Translate(x: number, y: number, z: number): void;
    static MultiplyAll(matrices: Matrix4[]): Matrix4;
    MultiplyChain(other: Matrix4): this;
    static FromQuaternion(q: Quaternion): Matrix4;
}
declare class Matrix3 extends Matrix {
    constructor(buffer?: Float32Array);
    static readonly LENGTH: number;
    get Delta(): number;
    Invert<TMatrix extends Matrix>(): TMatrix;
    static FromArray(arr: number[]): Matrix3;
    static Identity(): Matrix3;
    static Multiply(left: Matrix3, right: Matrix3): Matrix3;
    Multiply(other: Matrix3): void;
    Add(other: Matrix3): void;
    Subtract(other: Matrix3): void;
    Scalar(scalar: number): void;
    Translate(x: number, y: number): void;
    RotateX(angle: number): void;
    RotateY(angle: number): void;
    RotateAxis(axis: Float32Array, angle: number): void;
    static RotationX(angle: number): Matrix3;
    static RotationY(angle: number): Matrix3;
    static RotationAxis(axis: Float32Array, angle: number): Matrix3;
    static Translation(x: number, y: number): Matrix3;
    static Scale(x: number, y: number): Matrix3;
    static MultiplyAll(matrices: Matrix3[]): Matrix3;
}
declare class Quaternion {
    buffer: Float32Array;
    constructor(x?: number | Float32Array, y?: number, z?: number, w?: number);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get w(): number;
    set w(value: number);
    static Identity(): Quaternion;
    static FromXYZW(x: number, y: number, z: number, w: number): Quaternion;
    static FromAxisAngle(axis: Vector3, angle: number): Quaternion;
    static FromEulerAngles(x: number, y: number, z: number): Quaternion;
    static Length(q: Quaternion): number;
    static Normalize(q: Quaternion): Quaternion;
    static Conjugate(q: Quaternion): Quaternion;
    static Inverse(q: Quaternion): Quaternion;
    static Multiply(a: Quaternion, b: Quaternion): Quaternion;
    static Slerp(a: Quaternion, b: Quaternion, t: number): Quaternion;
    static ToMatrix4(q: Quaternion): Matrix4;
    static FromMatrix4(m: Matrix4): Quaternion;
}



declare class NodeCS implements types_mod.INode {
    id: number;
    label: string;
    owner: RenderGraph;
    scene: scen_mod.Scene;
    pipeline: types_mod.Pipeline;
    onframe: types_mod.PassHandler;
    createPassDescriptor(): types_mod.PassDescriptor;
    constructor(owner: RenderGraph, mesh: scen_mod.Scene);
    passDescriptor: types_mod.PassDescriptor;
    init(codes: string[], topology: GPUPrimitiveTopology, mainName?: string): void;
    configureOnFrame(): void;
}



declare class NodeRS implements types_mod.INode {
    id: types_mod.Id;
    label: string;
    owner: RenderGraph;
    scene: scen_mod.Scene;
    pipeline: types_mod.Pipeline;
    passDescriptor: PassDescriptor;
    onframe: types_mod.PassHandler;
    constructor(owner: RenderGraph, mesh: scen_mod.Scene);
    init(codes: string[], topology: GPUPrimitiveTopology, mainName?: string): void;
    configureOnFrame(): void;
}

declare class PipelineBuilder {
    private device;
    descriptor: types_mod.PipelineDescriptor;
    pipelineLayout: GPUPipelineLayout;
    bindgrouupLayouts: GPUBindGroupLayout[];
    isRender: boolean;
    private overrideConstants;
    get renderDescriptor(): GPURenderPipelineDescriptor;
    set renderDescriptor(descriptor: GPURenderPipelineDescriptor);
    get computeDescriptor(): GPUComputePipelineDescriptor;
    set computeDescriptor(descriptor: GPUComputePipelineDescriptor);
    constructor(device: GPUDevice, isRender: boolean);
    setLabel(label: string): PipelineBuilder;
    setVertexShader(code: string, fn?: string): PipelineBuilder;
    setFragmentShader(code: string, colorstates: GPUColorTargetState[], fn?: string): PipelineBuilder;
    addVertexStruct(config: types_mod.VertexFormatHandler): PipelineBuilder;
    addVertexStructByExists(layouts: GPUVertexBufferLayout[]): PipelineBuilder;
    addBindGroupLayout(config: types_mod.BindGroupLayoutHandler): PipelineBuilder;
    setBindGroupLayoutByExists(bindgroupLayouts: GPUBindGroupLayout[]): PipelineBuilder;
    private createPipelineLayout;
    setComputeShader(code: string, fn?: string): PipelineBuilder;
    setRenderShader(code: string, fn: string, colorstates: GPUColorTargetState[]): PipelineBuilder;
    setDepthStencil(format: GPUTextureFormat, depthWrite?: boolean, depthCompare?: GPUCompareFunction): PipelineBuilder;
    setPrimitiveTopology(topology: GPUPrimitiveTopology, stripIndexFormat?: GPUIndexFormat): PipelineBuilder;
    setCullMode(cullMode?: GPUCullMode, frontFace?: GPUFrontFace): PipelineBuilder;
    setMultisample(count?: number, alphaToCoverage?: boolean): PipelineBuilder;
    setOverrideContentValue(key: string, value: number): PipelineBuilder;
    build(): types_mod.Pipeline;
    buildAsync(): Promise<types_mod.Pipeline>;
}


declare class RenderGraph {
    owner: scenery_mod.Scenery;
    nodes: types_mod.INode[];
    constructor(owner: scenery_mod.Scenery);
    render(): void;
}




declare class MeshRes {
    caseBufferId: types_mod.Id;
    vertexBufferId: types_mod.Id;
    indexBufferId: types_mod.Id;
    indirectDrawBufferId: types_mod.Id;
    indirectIndexDrawBufferId: types_mod.Id;
    indirectWorkdispatchBufferId: types_mod.Id;
    targetTextureId: types_mod.Id;
    gosTextureId: types_mod.Id;
    OutBufferId: types_mod.Id;
    gosBufferId: types_mod.Id;
    rsBindGroupId: types_mod.Id;
    rsBindGroupLayoutId: types_mod.Id;
    csBindGroupId1: types_mod.Id;
    csBindGroupLayoutId1: types_mod.Id;
    csBindGroupId2: types_mod.Id;
    csBindGroupLayoutId2: types_mod.Id;
    csBindGroupId3: types_mod.Id;
    csBindGroupLayoutId3: types_mod.Id;
    get caseBuffer(): GPUBuffer | undefined;
    get vertexBuffer(): GPUBuffer | undefined;
    get indexBuffer(): GPUBuffer | undefined;
    get indirectDrawBuffer(): GPUBuffer | undefined;
    get indirectIndexDrawBuffer(): GPUBuffer | undefined;
    get indirectWorkdispatchBuffer(): GPUBuffer | undefined;
    get targetTexture(): GPUTexture | undefined;
    get gosTexture(): GPUTexture | undefined;
    get OutBuffer(): GPUBuffer | undefined;
    get gosBuffer(): GPUBuffer | undefined;
    get rsBindGroup(): GPUBindGroup | undefined;
    get rsBindGroupLayout(): GPUBindGroupLayout | undefined;
    get csBindGroup1(): GPUBindGroup | undefined;
    get csBindGroupLayout1(): GPUBindGroupLayout | undefined;
    get csBindGroup2(): GPUBindGroup | undefined;
    get csBindGroupLayout2(): GPUBindGroupLayout | undefined;
    get csBindGroup3(): GPUBindGroup | undefined;
    get csBindGroupLayout3(): GPUBindGroupLayout | undefined;
    colorTargetStates: GPUColorTargetState[];
    colorAttachments: GPURenderPassColorAttachment[];
    depthStencilAttachment: GPURenderPassDepthStencilAttachment;
    get activeRenderViews(): GPUTextureView[];
    caseData: ArrayBuffer;
    vertexData: Float32Array;
    indexData: Uint32Array;
    indirectDrawData: Uint32Array;
    indirectIndexDrawData: Uint32Array;
    indirectWorkdispatchData: Uint32Array;
    gosData: ArrayBuffer;
    vertexLayout: GPUVertexBufferLayout | null;
    instanceLayout: GPUVertexBufferLayout | null;
    gosTextureSize: gmath_mod.Vector2;
    store: store_mod.Store;
    constructor(store: store_mod.Store);
}
declare class Gobj {
    id: types_mod.Id;
    parentId: types_mod.Id;
    label: string;
    modelMatrix: gmath_mod.Matrix4;
    localMatrix: gmath_mod.Matrix4;
    position: gmath_mod.Vector3;
    rotation: gmath_mod.Quaternion;
    scale: gmath_mod.Vector3;
    center: gmath_mod.Vector3;
    redius: GPUSize32;
    vertexLocation: GPUIndex32;
    vertexCount: GPUSize32;
    indexLocation: GPUIndex32;
    indexCount: GPUSize32;
    instanceLocation: GPUIndex32;
    instanceCount: GPUSize32;
    materialId: types_mod.Id;
    childen: Gobj[];
    static get BYTESIZE(): GPUSize32;
    constructor(id?: types_mod.Id, label?: string);
}
declare class Scene {
    id: types_mod.Id;
    label: string;
    meshRes: MeshRes | null;
    gobjs: Gobj[];
    owner: scenery_mod.Scenery | null;
    private _resourceFlags;
    private _attachmentFlags;
    private drawMode;
    get resourceFlags(): number;
    get attachmentFlags(): number;
    constructor(owner: scenery_mod.Scenery, vertexLayout?: GPUVertexBufferLayout | null);
    private _appendInstance;
    private _appendIndirectDrawData;
    private _appendIndirectIndexDrawData;
    add10(vertexData: Float32Array, instanceCount?: GPUSize32): Gobj;
    add11(vertexData: Float32Array, modelmatrix: gmath_mod.Matrix4, instanceCount?: GPUSize32): Gobj;
    add12(vertexData: Float32Array, modelmatrix: gmath_mod.Matrix4, center: gmath_mod.Vector4, redius: GPUSize32, instanceCount?: GPUSize32): Gobj;
    add13(vertexData: Float32Array, modelmatrix: gmath_mod.Matrix4, materialId: types_mod.Id, instanceCount?: GPUSize32): Gobj;
    add14(vertexData: Float32Array, modelmatrix: gmath_mod.Matrix4, center: gmath_mod.Vector4, redius: GPUSize32, materialId: types_mod.Id, instanceCount?: GPUSize32): Gobj;
    add20(vertexData: Float32Array, indexData: Uint32Array, instanceCount?: GPUSize32): Gobj;
    add21(vertexData: Float32Array, indexData: Uint32Array, modelmatrix: gmath_mod.Matrix4, instanceCount?: GPUSize32): Gobj;
    add22(vertexData: Float32Array, indexData: Uint32Array, modelmatrix: gmath_mod.Matrix4, center: gmath_mod.Vector4, redius: GPUSize32, instanceCount?: GPUSize32): Gobj;
    add23(vertexData: Float32Array, indexData: Uint32Array, modelmatrix: gmath_mod.Matrix4, materialId: types_mod.Id, instanceCount?: GPUSize32): Gobj;
    add24(vertexData: Float32Array, indexData: Uint32Array, modelmatrix: gmath_mod.Matrix4, center: gmath_mod.Vector4, redius: GPUSize32, materialId: types_mod.Id, instanceCount?: GPUSize32): Gobj;
    private setResource;
    hasResource(flag: types_mod.ScenResource): boolean;
    private setAttachment;
    hasAttachment(flag: types_mod.ScenAttachment): boolean;
    getEnabledResourceFlags(): types_mod.ScenResource[];
    getEnabledAttachmentFlags(): types_mod.ScenAttachment[];
    registerResources(): void;
    createCsVertexIndexBindGroup(vertexType?: 'read-only-storage' | 'storage', indexType?: 'read-only-storage' | 'storage'): void;
    createCsGosTextureBindGroup(sampleType?: GPUTextureSampleType, viewType?: GPUTextureViewDimension): void;
    createCsExtraBindGroup(caseType?: 'read-only-storage' | 'storage', indirectDrawType?: 'storage', indirectIndexType?: 'storage', indirectWorkType?: 'storage', outBufferType?: 'storage'): void;
    createRsBindGroup(sampleType?: GPUTextureSampleType, viewType?: GPUTextureViewDimension): void;
    setcaseData(data: ArrayBuffer): void;
    setGosTexture(images: ImageBitmap[], format?: GPUTextureFormat): void;
    setGosTexture2(width: number, height: number, layers: number, format?: GPUTextureFormat): void;
    setOutBuffer(size?: number): void;
    setTargetTexture(width: GPUSize32, height: GPUSize32, colorTargetStatesHandler: types_mod.ColorStateHandler, colorAttachmentParamSettingHandler?: types_mod.ColorAttachmentParamSettingHandler, depthStencilAttachmentParamSettingHandler?: types_mod.DepthStencilAttachmentParamSettingHandler): void;
    setIndirectWorkdispatchData(data: number[] | Uint32Array): void;
}



declare class Scenery {
    canvas: HTMLCanvasElement;
    context: GPUCanvasContext;
    device: GPUDevice;
    control: control_mod.Control;
    format: GPUTextureFormat;
    private isRunning;
    access: data_access_mod.DataAccess;
    major: render_graph_mod.RenderGraph;
    minor: render_graph_mod.RenderGraph;
    init(canvas: HTMLCanvasElement): Promise<void>;
    constructor();
    runMajor(): void;
    run(): void;
    stop(): void;
}

declare class MouseInfo {
    static DATA_SIZE: number;
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    buttons: number;
    gbufferId?: types_mod.Id;
    buffer?: ArrayBuffer;
    updateFromEvent(e: MouseEvent): void;
    packInto(view: DataView, offset: number): void;
    pack(): ArrayBuffer;
}
declare class KeyInfo {
    static DATA_SIZE: number;
    private keyStates;
    gbufferId?: types_mod.Id;
    buffer?: ArrayBuffer;
    updateFromEvent(e: KeyboardEvent): void;
    setKeyState(keyCode: number, isPressed: boolean): void;
    packInto(view: DataView, offset: number): void;
    pack(): ArrayBuffer;
}
declare class TickInfo {
    static DATA_SIZE: number;
    frameCount: number;
    deltaTime: number;
    gbufferId?: types_mod.Id;
    buffer?: ArrayBuffer;
    nextFrame(tick: number): void;
    packInto(view: DataView, offset: number): void;
    pack(): ArrayBuffer;
}
declare class Signal {
    mouse: MouseInfo;
    key: KeyInfo;
    tick: TickInfo;
    static MOUSE_OFFSET: number;
    static KEY_OFFSET: number;
    static TICK_OFFSET: number;
    static COMBINED_BUFFER_SIZE: number;
    gbufferId: types_mod.Id;
    bindGroupLayoutId_vs: types_mod.Id;
    bindGroupId_vs: types_mod.Id;
    bindGroupLayoutId_cs: types_mod.Id;
    bindGroupId_cs: types_mod.Id;
    constructor();
    getCombinedBufferData(): ArrayBuffer;
}

declare class Store {
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





declare enum ResType {
    buffer = 0,
    texture = 1,
    sampler = 2,
    bindGroup = 3,
    bindGroupLayout = 4,
    renderpipeline = 5,
    computepipeline = 6
}
type ScenAttachmentValue = number;
declare enum ScenAttachment {
    None = 0,
    RequiresColorAttachment0 = 1,
    RequiresColorAttachment1 = 2,
    RequiresColorAttachment2 = 4,
    RequiresColorAttachment3 = 8,
    RequiresDepthStencilAttachment = 16
}
type ScenResourceValue = number;
declare enum ScenResource {
    None = 0,
    RequiresVertexBuffer = 1,
    RequiresIndexBuffer = 2,
    RequiresGOSBuffer = 4,
    RequiresIndirectDrawBuffer = 8,
    RequiresIndirectIndexDrawBuffer = 16,
    RequiresIndirectWorkdispatchBuffer = 32,
    RequiresGOSTexture = 64,
    RequiresCaseBuffer = 128,
    RequiresTargetTexture = 256,
    RequiresOutBuffer = 512
}
type StoreResource = GPUBuffer | GPUTexture | GPUSampler | GPUBindGroup | GPUBindGroupLayout | GPURenderPipeline | GPUComputePipeline;
type Id = number;
type Pipeline = GPURenderPipeline | GPUComputePipeline;
type PassEncoder = GPURenderPassEncoder | GPUComputePassEncoder | GPURenderBundleEncoder;
type PassDescriptor = GPURenderPassDescriptor | GPUComputePassDescriptor | GPURenderBundleDescriptor;
type PassHandler = (sender: INode, pass: PassEncoder) => unknown;
interface INode {
    id: Id;
    label: string;
    owner: render_graph_mod.RenderGraph;
    scene: scen_mod.Scene;
    pipeline: Pipeline;
    passDescriptor: PassDescriptor;
    init(codes: string[], topology: GPUPrimitiveTopology, mainName: string): void;
    onframe: PassHandler;
    configureOnFrame(): void;
}
type ColorAttachmentBuilder = (builder: builders_mod.ColorAttachmentBuilder) => GPURenderPassColorAttachment[];
type DepthStencilAttachmentBuilder = (builder: builders_mod.DepthStencilAttachmentBuilder) => GPURenderPassDepthStencilAttachment;
type ColorAttachmentParamSettingHandler = (colorAttachments: GPURenderPassColorAttachment[]) => GPURenderPassColorAttachment[];
type DepthStencilAttachmentParamSettingHandler = (depthStencilAttachment: GPURenderPassDepthStencilAttachment) => GPURenderPassDepthStencilAttachment;
type ColorStateHandler = (builder: builders_mod.ColorStateBuilder) => GPUColorTargetState[];
type BindGroupLayoutHandler = (builder: builders_mod.BindGroupLayoutBuilder) => GPUBindGroupLayout;
type BindGroupHandler = (builder: builders_mod.BindGroupBuilder) => GPUBindGroup;
type PipelineHandler = (pipe: pipeline_builder_mod.PipelineBuilder) => Pipeline;
type VertexFormatHandler = (builder: vertex_format_builder_mod.VertexBufferBuilder) => GPUVertexBufferLayout;
type SamplerDescriptorHandler = (builder: builders_mod.SamplerDescriptorBuilder) => GPUSamplerDescriptor;
type TextureDescriptorHandler = (builder: builders_mod.TextureDescriptorBuilder) => GPUTextureDescriptor;
type PassDescriptorHandler = (builder: builders_mod.PassEncoderDescriptorBuilder) => PassDescriptor;
type PipelineDescriptor = GPURenderPipelineDescriptor | GPUComputePipelineDescriptor;
type ResDic = {
    [key: string]: {
        id0: number;
        id1: number;
    };
};
interface VertexAttributeConfig {
    format: GPUVertexFormat;
    offset: number;
    shaderLocation: number;
    size?: number;
}
declare class VertexBufferBuilder {
    private attributes;
    private offset;
    private location;
    private stride;
    private stepMode;
    constructor(stepMode?: GPUVertexStepMode);
    append(format: GPUVertexFormat): this;
    add(format: GPUVertexFormat, start: GPUIndex32): this;
    build(): GPUVertexBufferLayout;
    static getFormatSize(format: GPUVertexFormat): number;
}
