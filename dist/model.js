import * as gmath_mod from "./gmath";
import * as types_mod from "./types";
import * as scenery_mod from './scenery';
import * as builders_mod from './builders';
import * as vertex_format_builder_mod from './vertex-format-builder';
export class DrawIndirectArgs {
    go;
    bufferId;
    constructor(go) {
        this.go = go;
        this.bufferId = this.go.mesh.scenery.access.registryBuffer(this.byteSize, GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST);
    }
    get byteSize() {
        return 4 * Uint32Array.BYTES_PER_ELEMENT;
    }
    get buffer() {
        return this.go.mesh.scenery.access.store.get(types_mod.ResType.buffer, this.bufferId);
    }
    get vertexCount() {
        let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndirectArgsView.getUint32(index, true);
    }
    set vertexCount(value) {
        let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndirectArgsView.setUint32(index, value, true);
    }
    get instanceCount() {
        let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndirectArgsView.getUint32(index, true);
    }
    set instanceCount(value) {
        let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndirectArgsView.setUint32(index, value, true);
    }
    get firstVertex() {
        let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndirectArgsView.getUint32(index, true);
    }
    set firstVertex(value) {
        let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndirectArgsView.setUint32(index, value, true);
    }
    get firstInstance() {
        let index = 3 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndirectArgsView.getUint32(index, true);
    }
    set firstInstance(value) {
        let index = 3 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndirectArgsView.setUint32(index, value, true);
    }
}
export class DrawIndexIndirectArgs {
    go;
    bufferId;
    constructor(go) {
        this.go = go;
        this.bufferId = this.go.mesh.scenery.access.registryBuffer(this.byteSize, GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST);
    }
    get byteSize() {
        return 5 * Uint32Array.BYTES_PER_ELEMENT;
    }
    get buffer() {
        return this.go.mesh.scenery.access.store.get(types_mod.ResType.buffer, this.bufferId);
    }
    get indexCount() {
        let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
    }
    set indexCount(value) {
        let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    }
    get instanceCount() {
        let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
    }
    set instanceCount(value) {
        let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    }
    get firstIndex() {
        let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
    }
    set firstIndex(value) {
        let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    }
    get baseVertex() {
        let index = 3 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
    }
    set baseVertex(value) {
        let index = 3 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    }
    get firstInstance() {
        let index = 4 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        return this.go.mesh.ref.drawIndexIndirectArgsView.getUint32(index, true);
    }
    set firstInstance(value) {
        let index = 4 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * DrawIndexIndirectArgs.prototype.byteSize;
        this.go.mesh.ref.drawIndexIndirectArgsView.setUint32(index, value, true);
    }
}
export class InstanceData {
    id;
    go;
    hasColor = false;
    hasMaterialId = false;
    hasUV = false;
    hasNormal = false;
    constructor(id, go) {
        this.id = id;
        this.go = go;
        this.model = gmath_mod.Matrix4.Identity();
    }
    get byteSize() {
        let size = 0;
        size += Uint32Array.BYTES_PER_ELEMENT;
        size += 16 * Float32Array.BYTES_PER_ELEMENT;
        if (this.hasColor)
            size += 4 * Float32Array.BYTES_PER_ELEMENT;
        if (this.hasMaterialId)
            size += Uint32Array.BYTES_PER_ELEMENT;
        if (this.hasUV)
            size += 2 * Float32Array.BYTES_PER_ELEMENT;
        if (this.hasNormal)
            size += 3 * Float32Array.BYTES_PER_ELEMENT;
        return size;
    }
    offset = 0;
    get instanceId() {
        return this.go.mesh.ref.instanceDataView.getUint32(this.offset, true);
    }
    set instanceId(value) {
        this.go.mesh.ref.instanceDataView.setUint32(this.offset, value, true);
    }
    get model() {
        let _model = new gmath_mod.Matrix4();
        for (let i = 0; i < 16; i++) {
            _model.buffer[i] = this.go.mesh.ref.instanceDataView.getFloat32(this.offset + 4 + i * Float32Array.BYTES_PER_ELEMENT, true);
        }
        return _model;
    }
    set model(value) {
        for (let i = 0; i < 16; i++) {
            this.go.mesh.ref.instanceDataView.setFloat32(this.offset + 4 + i * Float32Array.BYTES_PER_ELEMENT, value.buffer[i], true);
        }
    }
    get color() {
        if (!this.hasColor)
            return undefined;
        let color = new gmath_mod.Vector4();
        for (let i = 0; i < 4; i++) {
            color.buffer[i] = this.go.mesh.ref.instanceDataView.getFloat32(this.offset + 68 + i * Float32Array.BYTES_PER_ELEMENT, true);
        }
        return color;
    }
    set color(value) {
        if (!value || this.hasColor)
            return;
        for (let i = 0; i < 4; i++) {
            this.go.mesh.ref.instanceDataView.setFloat32(this.offset + 68 + i * Float32Array.BYTES_PER_ELEMENT, value.buffer[i], true);
        }
    }
    get materialId() {
        if (!this.hasMaterialId)
            return undefined;
        return this.go.mesh.ref.instanceDataView.getUint32(36, true);
    }
    set materialId(value) {
        if (value === undefined)
            return;
        this.go.mesh.ref.instanceDataView.setUint32(36, value, true);
        this.hasMaterialId = true;
    }
    get uv() {
        if (!this.hasUV)
            return undefined;
        let uv = new gmath_mod.Vector2();
        for (let i = 0; i < 2; i++) {
            uv.buffer[i] = this.go.mesh.ref.instanceDataView.getFloat32(40 + i * Float32Array.BYTES_PER_ELEMENT, true);
        }
        return uv;
    }
    set uv(value) {
        if (!value || this.hasUV)
            return;
        for (let i = 0; i < 2; i++) {
            this.go.mesh.ref.instanceDataView.setFloat32(40 + i * Float32Array.BYTES_PER_ELEMENT, value.buffer[i], true);
        }
        this.hasUV = true;
    }
    get normal() {
        if (!this.hasNormal)
            return undefined;
        let normal = new gmath_mod.Vector3();
        for (let i = 0; i < 3; i++) {
            normal.buffer[i] = this.go.mesh.ref.instanceDataView.getFloat32(48 + i * Float32Array.BYTES_PER_ELEMENT, true);
        }
        return normal;
    }
    set normal(value) {
        if (!value || this.hasNormal)
            return;
        for (let i = 0; i < 3; i++) {
            this.go.mesh.ref.instanceDataView.setFloat32(48 + i * Float32Array.BYTES_PER_ELEMENT, value.buffer[i], true);
        }
        this.hasNormal = true;
    }
}
export class MeshRef {
    scenery;
    drawIndirectArgsView;
    drawIndexIndirectArgsView;
    instanceDataView;
    instanceIndexView;
    constructor(scenery) {
        this.scenery = scenery;
    }
    vsBindGroupLayoutId;
    get renderBindGroupLayout() {
        return this.scenery.access.store.get(types_mod.ResType.bindGroupLayout, this.vsBindGroupLayoutId);
    }
    vsBindGroupId;
    get bindGroupLayout() {
        return this.scenery.access.store.get(types_mod.ResType.bindGroupLayout, this.vsBindGroupLayoutId);
    }
    csBindGroupLayoutId;
    get computeBindGroupLayout() {
        return this.scenery.access.store.get(types_mod.ResType.bindGroupLayout, this.csBindGroupLayoutId);
    }
    csBindGroupId;
    get bindGroupCompute() {
        return this.scenery.access.store.get(types_mod.ResType.bindGroup, this.csBindGroupId);
    }
    vertexBufferId;
    get vertexBuffer() {
        return this.scenery.access.store.get(types_mod.ResType.buffer, this.vertexBufferId);
    }
    indexBufferId;
    get indexBuffer() {
        return this.scenery.access.store.get(types_mod.ResType.buffer, this.indexBufferId);
    }
    gosInstanceData;
    gosInstanceBufferId;
    get gosInstanceBuffer() {
        return this.scenery.access.store.get(types_mod.ResType.buffer, this.gosInstanceBufferId);
    }
    gosIndexData;
    gosIndexBufferId;
    get gosIndexBuffer() {
        return this.scenery.access.store.get(types_mod.ResType.buffer, this.gosIndexBufferId);
    }
    gosIndirectArgsData;
    gosIndexIndirectArgsData;
    gosIndirectArgsBufferId;
    gosIndexIndirectArgsBufferId;
    get gosIndirectArgsBuffer() {
        return this.scenery.access.store.get(types_mod.ResType.buffer, this.gosIndirectArgsBufferId);
    }
    get gosIndexIndirectArgsBuffer() {
        return this.scenery.access.store.get(types_mod.ResType.buffer, this.gosIndexIndirectArgsBufferId);
    }
    dispatchIndirectBufferId;
    get dispatchIndirectBuffer() {
        return this.scenery.access.store.get(types_mod.ResType.buffer, this.dispatchIndirectBufferId);
    }
}
export class GobjInstanceIndex {
    static byteSize = 3 * Uint32Array.BYTES_PER_ELEMENT;
    go;
    constructor(go) {
        this.go = go;
    }
    get gobjId() {
        let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
        return this.go.mesh.ref.instanceIndexView.getUint32(index, true);
    }
    set gobjId(value) {
        let index = 0 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
        this.go.mesh.ref.instanceIndexView.setUint32(index, value, true);
    }
    get start() {
        let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
        return this.go.mesh.ref.instanceIndexView.getUint32(index, true);
    }
    set start(value) {
        let index = 1 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
        this.go.mesh.ref.instanceIndexView.setUint32(index, value, true);
    }
    get count() {
        let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
        return this.go.mesh.ref.instanceIndexView.getUint32(index, true);
    }
    set count(value) {
        let index = 2 * Uint32Array.BYTES_PER_ELEMENT + this.go.id * GobjInstanceIndex.byteSize;
        this.go.mesh.ref.instanceIndexView.setUint32(index, value, true);
    }
}
export class Mesh {
    scenery;
    buffer;
    indices;
    ref;
    gos;
    isIndex;
    vertexLayout;
    usage;
    constructor(scenery, usage = 'triangle-list') {
        this.scenery = scenery;
        this.gos = [];
        this.ref = new MeshRef(this.scenery);
        this.usage = usage;
    }
    allocLocalBuffer(buffer, indices) {
        let vertexBufferSize = buffer.byteLength < 256 ? 256 : buffer.byteLength;
        let vertexBuffer = new Float32Array(vertexBufferSize);
        this.buffer = vertexBuffer;
        this.ref.vertexBufferId = this.scenery.access.registryBuffer(vertexBufferSize, GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
        this.scenery.access.updateBuffer(this.ref.vertexBufferId, vertexBuffer.buffer);
        if (indices) {
            let indexBufferSize = indices.byteLength < 256 ? 256 : indices.byteLength;
            let indexBuffer = new Uint32Array(indexBufferSize);
            this.isIndex = true;
            this.indices = indices;
            this.ref.indexBufferId = this.scenery.access.registryBuffer(indexBufferSize, GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
            this.scenery.access.updateBuffer(this.ref.indexBufferId, indexBuffer.buffer);
        }
    }
    allocateBuffers() {
        const indirectArgsStride = 4 * Uint32Array.BYTES_PER_ELEMENT;
        this.ref.gosIndirectArgsData = new ArrayBuffer(this.gos.length * indirectArgsStride);
        const indexIndirectArgsStride = 5 * Uint32Array.BYTES_PER_ELEMENT;
        this.ref.gosIndexIndirectArgsData = new ArrayBuffer(this.gos.length * indexIndirectArgsStride);
        let totalInstanceBytes = 0;
        for (const go of this.gos) {
            for (const inst of go.instanceData) {
                totalInstanceBytes += inst.byteSize;
            }
        }
        this.ref.gosInstanceData = new ArrayBuffer(Math.max(totalInstanceBytes, 256));
        const instanceIndexStride = 3 * Uint32Array.BYTES_PER_ELEMENT;
        this.ref.gosIndexData = new ArrayBuffer(this.gos.length * instanceIndexStride);
    }
    setupView() {
        this.ref.drawIndirectArgsView = new DataView(this.ref.gosIndirectArgsData);
        this.ref.drawIndexIndirectArgsView = new DataView(this.ref.gosIndexIndirectArgsData);
        this.ref.instanceDataView = new DataView(this.ref.gosInstanceData);
        this.ref.instanceIndexView = new DataView(this.ref.gosIndexData);
    }
    setGosBuffer() {
        this.ref.gosIndirectArgsBufferId = this.scenery.access.registryBuffer(this.ref.gosIndirectArgsData.byteLength, GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST);
        this.ref.gosIndexIndirectArgsBufferId = this.scenery.access.registryBuffer(this.ref.gosIndexIndirectArgsData.byteLength, GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST);
        this.ref.gosInstanceBufferId = this.scenery.access.registryBuffer(this.ref.gosInstanceData.byteLength, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
        this.ref.gosIndexBufferId = this.scenery.access.registryBuffer(this.ref.gosIndexData.byteLength, GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST);
    }
    setVsBindGroupLayout(bindingNo) {
        this.ref.vsBindGroupLayoutId = this.scenery.access.registryBindGroupLayout(builder => {
            builder.addBuffer(bindingNo, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage' });
            builder.addBuffer(bindingNo, GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, { type: 'read-only-storage' });
            return builder.build(this.scenery.device);
        });
    }
    setVsBindGroup(bindingNo) {
        this.ref.vsBindGroupId = this.scenery.access.registryBindGroup(builder => {
            builder.addBuffer(0, this.ref.gosInstanceBuffer);
            builder.addBuffer(1, this.ref.gosIndexBuffer);
            return builder.build(this.scenery.device, this.ref.renderBindGroupLayout);
        });
    }
    setCsBindGroupLayout(bindingNo) {
        this.ref.csBindGroupLayoutId = this.scenery.access.registryBindGroupLayout(builder => {
            builder.addBuffer(bindingNo, GPUShaderStage.COMPUTE, { type: 'storage' });
            builder.addBuffer(bindingNo, GPUShaderStage.COMPUTE, { type: 'storage' });
            builder.addBuffer(bindingNo, GPUShaderStage.COMPUTE, { type: 'storage' });
            builder.addBuffer(bindingNo, GPUShaderStage.COMPUTE, { type: 'storage' });
            builder.addBuffer(bindingNo, GPUShaderStage.COMPUTE, { type: 'storage' });
            builder.addBuffer(bindingNo, GPUShaderStage.COMPUTE, { type: 'storage' });
            return builder.build(this.scenery.device);
        });
    }
    setCsBindGroup(bindingNo) {
        this.ref.csBindGroupId = this.scenery.access.registryBindGroup(builder => {
            builder.addBuffer(0, this.ref.gosInstanceBuffer);
            builder.addBuffer(1, this.ref.gosIndexBuffer);
            builder.addBuffer(2, this.ref.gosIndirectArgsBuffer);
            builder.addBuffer(3, this.ref.gosIndexIndirectArgsBuffer);
            builder.addBuffer(4, this.ref.dispatchIndirectBuffer);
            builder.addBuffer(bindingNo, this.ref.vertexBuffer);
            builder.addBuffer(bindingNo, this.ref.indexBuffer);
            return builder.build(this.scenery.device, this.ref.computeBindGroupLayout);
        });
    }
    setBinding(csBindingNo, vsBindingNo) {
        this.allocateBuffers();
        this.setupView();
        this.setGosBuffer();
        this.setCsBindGroupLayout(csBindingNo);
        this.setCsBindGroup(csBindingNo);
        this.setVsBindGroupLayout(vsBindingNo);
        this.setVsBindGroup(vsBindingNo);
    }
    setVertexLayout(config) {
        let builder = new vertex_format_builder_mod.VertexBufferBuilder();
        this.vertexLayout = config(builder);
        this.vertexLayout.stepMode = 'instance';
    }
    addGobjFromVertex(index, count, isIndex, center) {
        let gobj = new Gobj(this.gos.length, this, isIndex, center);
        gobj.vertexIndex = index;
        gobj.vertexCount = count;
        this.isIndex = false;
        this.gos.push(gobj);
        return gobj;
    }
    addGobjFromIndex(vertexIndex, vertexCount, indexIndex, indexCount, isIndex, center) {
        let gobj = new Gobj(this.gos.length, this, isIndex, center);
        gobj.vertexIndex = vertexIndex;
        gobj.vertexCount = vertexCount;
        gobj.indexIndex = indexIndex;
        gobj.indexCount = indexCount;
        this.isIndex = true;
        this.gos.push(gobj);
        return gobj;
    }
}
export class Gobj {
    mesh;
    id;
    isIndex;
    materialId;
    instanceData = [];
    instanceIndex;
    label;
    vertexIndex;
    vertexCount;
    indexIndex;
    indexCount;
    firstInstance = 0;
    baseVertex = 0;
    parent;
    children = [];
    boundingBox;
    center = gmath_mod.Vector3.Zero();
    get instanceCount() {
        return this.instanceData.length;
    }
    drawIndirectArgs;
    drawIndexIndirectArgs;
    constructor(id, mesh, isIndex = false, center) {
        this.id = id;
        this.mesh = mesh;
        this.isIndex = isIndex;
        this.materialId = 0;
        this.center = center || gmath_mod.Vector3.Zero();
        this.vertexIndex = -1;
        this.indexIndex = -1;
        this.boundingBox = undefined;
        this.instanceData = [];
        this.instanceIndex = new GobjInstanceIndex(this);
        this.drawIndirectArgs = new DrawIndirectArgs(this);
        this.drawIndexIndirectArgs = new DrawIndexIndirectArgs(this);
    }
}
