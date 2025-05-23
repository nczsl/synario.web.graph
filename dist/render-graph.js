import { util_mod, engine_mod } from 'synario.base';
import * as builders_mod from './builders';
import * as pipeline_builder_mod from './pipeline-builder';
import * as scenery_mod from './scenery';
import * as types_mod from './types';
import * as model_mod from './model';
export class RenderGraph {
    scenery;
    nodes;
    nodeMaps = new Map();
    get count() {
        return this.nodes.length;
    }
    constructor(scenery) {
        this.scenery = scenery;
        this.nodes = [];
        this.nodeMaps = new Map();
    }
    addRenderNode(name, colorAttachmentOption) {
        let node = new Node(name, this, 'RenderPassDict', colorAttachmentOption);
        this.nodes.push(node);
        this.nodeMaps.set(name, node);
        return node;
    }
    addComputeNode(name) {
        let node = new Node(name, this, 'ComputePassDict');
        this.nodes.push(node);
        this.nodeMaps.set(name, node);
        return node;
    }
    sortByOrder() {
        this.nodes.sort((a, b) => a.order - b.order);
    }
    render() {
        const commandEncoder = this.scenery.device.createCommandEncoder();
        for (const node of this.nodes) {
            let pass;
            if (node.type === 'RenderPassDict') {
                pass = commandEncoder.beginRenderPass(node.createRenderPassDescriptor());
            }
            else {
                pass = commandEncoder.beginComputePass(node.createComputePassDescriptor());
            }
            node.frame(pass);
            pass.end();
        }
        const commandBuffer = commandEncoder.finish();
        this.scenery.device.queue.submit([commandBuffer]);
    }
}
class Node {
    name;
    order = 0;
    type;
    colorAttachmentId;
    passParamId;
    pipelineId;
    get renderPipeline() {
        return this.graph.scenery.access.store.get(types_mod.ResType.renderpipeline, this.pipelineId);
    }
    get computePipeline() {
        return this.graph.scenery.access.store.get(types_mod.ResType.computepipeline, this.pipelineId);
    }
    colorAttachment;
    passParam;
    mesh;
    graph;
    onframe;
    frame;
    constructor(name, graph, type, colorAttachmentOption, onframe) {
        this.graph = graph;
        this.type = type;
        this.name = name;
        if (colorAttachmentOption) {
            this.colorAttachmentId = this.graph.scenery.access.registryColorAttachment(colorAttachmentOption);
            this.colorAttachment = colorAttachmentOption;
        }
        this.passParamId = this.graph.scenery.access.registryPassParam();
        this.passParam = this.graph.scenery.access.store.get(types_mod.ResType.passParam, this.passParamId) || {};
        this.mesh = new model_mod.Mesh(this.graph.scenery);
        this.onframe = onframe;
        if (this.onframe === undefined) {
            if (this.type === 'RenderPassDict') {
                this.frame = this._renderFrame.bind(this);
            }
            else {
                this.frame = this._computeFrame.bind(this);
            }
        }
        else {
            this.frame = this._frame;
        }
    }
    setPipeline(isRender, isSignal, isCammera, codes) {
        let code = codes.join('\n');
        let lyaouts = [];
        if (isRender) {
            if (isSignal) {
                lyaouts.push(this.graph.scenery.access.store.get(types_mod.ResType.bindGroupLayout, this.graph.scenery.control.signal.bindgrouplayoutId_vs));
            }
            if (isCammera) {
                lyaouts.push(this.graph.scenery.access.store.get(types_mod.ResType.bindGroupLayout, this.graph.scenery.control.camera.bindgrouplayoutId_vs));
            }
            lyaouts.push(this.mesh.ref.renderBindGroupLayout);
            this.pipelineId = this.graph.scenery.access.registryRenderPipeline(builder => {
                builder.setBindGroupLayoutByExists(lyaouts);
                builder.addVertexStructByExists([this.mesh.vertexLayout]);
                builder.setRenderShader(code, 'main', [
                    this.graph.scenery.access.store.get(types_mod.ResType.colorTargetState, this.graph.scenery.access.colorTargetStateIds['bgra8unorm']),
                ]);
                builder.setPrimitiveTopology(this.mesh.usage);
                return builder.build();
            });
        }
        else {
            if (isSignal) {
                lyaouts.push(this.graph.scenery.access.store.get(types_mod.ResType.bindGroupLayout, this.graph.scenery.control.signal.bindgrouplayoutId_cs));
            }
            if (isCammera) {
                lyaouts.push(this.graph.scenery.access.store.get(types_mod.ResType.bindGroupLayout, this.graph.scenery.control.camera.bindgrouplayoutId_cs));
            }
            lyaouts.push(this.mesh.ref.computeBindGroupLayout);
            this.pipelineId = this.graph.scenery.access.registryComputePipeline(builder => {
                builder.setBindGroupLayoutByExists(lyaouts);
                builder.setComputeShader(code, 'main');
                return builder.build();
            });
        }
    }
    createRenderPassDescriptor() {
        const rpdb = new builders_mod.PassEncoderDescriptorBuilder();
        rpdb.setLabel(this.name);
        rpdb.addColorAttachment({
            loadOp: this.colorAttachment.loadOp,
            storeOp: this.colorAttachment.storeOp,
            clearValue: this.colorAttachment.clearValue,
            view: this.graph.scenery.context.getCurrentTexture().createView(),
        });
        rpdb.asRenderPass();
        return rpdb.build();
    }
    createComputePassDescriptor() {
        const rpdb = new builders_mod.PassEncoderDescriptorBuilder();
        rpdb.setLabel(this.name);
        rpdb.asComputePass();
        return rpdb.build();
    }
    loadRenderPassParam() {
        const _passParam = this.passParam;
        _passParam.setPipeline = [
            [this.renderPipeline],
        ];
        _passParam.setBindGroup = [
            [0, this.graph.scenery.access.store.get(types_mod.ResType.bindGroup, this.graph.scenery.control.signal.bindgroupId_vs), new Uint32Array(0), 0, 0],
            [1, this.graph.scenery.access.store.get(types_mod.ResType.bindGroup, this.graph.scenery.control.camera.bindgroupId_vs), new Uint32Array(0), 0, 0],
        ];
        _passParam.setVertexBuffer = [
            [0, this.mesh.ref.vertexBuffer],
        ];
        if (this.mesh.isIndex)
            _passParam.setIndexBuffer = [
                [this.mesh.ref.indexBuffer, 'uint32'],
            ];
        let draw = [];
        let drawIndirect = [];
        for (let go of this.mesh.gos) {
            if (this.mesh.isIndex) {
                draw.push([go.drawIndirectArgs.buffer, 0]);
            }
            else {
                drawIndirect.push([go.drawIndexIndirectArgs.buffer, 0]);
            }
        }
        if (this.mesh.isIndex) {
            _passParam.drawIndirect = draw;
        }
        else {
            _passParam.drawIndexedIndirect = drawIndirect;
        }
    }
    loadComputePassParam() {
        const _passParam = this.passParam;
        _passParam.setPipeline = [
            [this.computePipeline],
        ];
        _passParam.setBindGroup = [
            [0, this.graph.scenery.access.store.get(types_mod.ResType.bindGroup, this.graph.scenery.control.signal.bindgroupId_cs), new Uint32Array(0), 0, 0],
            [1, this.graph.scenery.access.store.get(types_mod.ResType.bindGroup, this.graph.scenery.control.camera.bindgroupId_cs), new Uint32Array(0), 0, 0],
            [2, this.mesh.ref.bindGroupCompute, new Uint32Array(0), 0, 0],
        ];
        _passParam.dispatchWorkgroupsIndirect = [
            [this.mesh.ref.dispatchIndirectBuffer, 0]
        ];
    }
    _renderFrame(pass) {
        const passParam = this.passParam;
        if (!passParam)
            return;
        for (const key in passParam) {
            let key2 = key;
            if (!key2)
                continue;
            const paramArrays = passParam[key2];
            for (let i of paramArrays) {
                pass[key2](...i);
            }
        }
    }
    _computeFrame(pass) {
        const passParam = this.passParam;
        if (!passParam)
            return;
        for (const key in passParam) {
            let key2 = key;
            if (!key2)
                continue;
            const paramArrays = passParam[key2];
            for (let i of paramArrays) {
                pass[key2](...i);
            }
        }
    }
    _frame(pass) {
        this.onframe(this, pass, this.graph.scenery.access);
    }
}
