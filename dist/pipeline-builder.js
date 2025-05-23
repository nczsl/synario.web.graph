import { util_mod, engine_mod } from 'synario.base';
import * as types_mod from './types';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as builders_mod from './builders';
export class PipelineBuilder {
    device;
    descriptor;
    pipelineLayout;
    bindgrouupLayouts;
    isRender;
    get renderDescriptor() {
        return this.descriptor;
    }
    set renderDescriptor(descriptor) {
        this.descriptor = descriptor;
    }
    get computeDescriptor() {
        return this.descriptor;
    }
    set computeDescriptor(descriptor) {
        this.descriptor = descriptor;
    }
    constructor(device, isRender) {
        this.device = device;
        this.isRender = isRender;
        this.bindgrouupLayouts = [];
        if (isRender) {
            this.descriptor = {
                layout: 'auto',
                vertex: {
                    module: null,
                    entryPoint: 'main',
                    buffers: []
                },
                fragment: undefined,
                primitive: {
                    topology: 'triangle-list',
                    cullMode: 'none',
                    frontFace: 'ccw'
                },
                depthStencil: undefined,
                multisample: {
                    count: 1,
                    mask: 0xFFFFFFFF,
                    alphaToCoverageEnabled: false
                }
            };
        }
        else {
            this.descriptor = {
                layout: 'auto',
                compute: {
                    module: null,
                    entryPoint: 'main'
                }
            };
        }
    }
    setLabel(label) {
        this.descriptor.label = label;
        return this;
    }
    setVertexShader(code, fn = 'main') {
        if (this.isRender) {
            const module = this.device.createShaderModule({
                code: code
            });
            this.renderDescriptor.vertex = {
                module,
                entryPoint: fn
            };
        }
        return this;
    }
    setFragmentShader(code, colorstates, fn = 'main') {
        const module = this.device.createShaderModule({
            code: code
        });
        if (this.isRender) {
            this.renderDescriptor.fragment = {
                module,
                entryPoint: fn,
                targets: colorstates
            };
        }
        return this;
    }
    addVertexStruct(config) {
        if (!this.isRender) {
            throw new Error("Vertex state can only be set for render pipelines.");
        }
        const vfb = new vertex_format_builder_mod.VertexBufferBuilder();
        const vertexBufferLayout = config(vfb);
        if (!this.renderDescriptor.vertex.buffers) {
            this.renderDescriptor.vertex.buffers = [];
        }
        this.renderDescriptor.vertex.buffers = [
            ...(Array.from(this.renderDescriptor.vertex.buffers)),
            vertexBufferLayout
        ];
        return this;
    }
    addVertexStructByExists(vertexBufferLayouts) {
        if (!this.isRender) {
            throw new Error("Vertex state can only be set for render pipelines.");
        }
        if (!this.renderDescriptor.vertex.buffers) {
            this.renderDescriptor.vertex.buffers = [];
        }
        this.renderDescriptor.vertex.buffers = [
            ...(Array.from(this.renderDescriptor.vertex.buffers)),
            ...vertexBufferLayouts
        ];
        return this;
    }
    addBindGroupLayout(config) {
        let x = config(new builders_mod.BindGroupLayoutBuilder());
        this.bindgrouupLayouts.push(x);
        return this;
    }
    setBindGroupLayoutByExists(bindgroupLayouts) {
        this.bindgrouupLayouts = bindgroupLayouts;
        return this;
    }
    createPipelineLayout() {
        this.pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: this.bindgrouupLayouts
        });
        return this;
    }
    setComputeShader(code, fn = 'main') {
        const module = this.device.createShaderModule({
            code: code
        });
        if (!this.isRender) {
            this.computeDescriptor.compute = {
                module,
                entryPoint: fn
            };
        }
        else {
            throw new Error("Cannot set compute shader on a render pipeline");
        }
        return this;
    }
    setRenderShader(code, fn, colorstates) {
        const module = this.device.createShaderModule({
            code: code
        });
        let fsfn = `${fn}_fs`;
        let vsfn = `${fn}_vs`;
        if (this.isRender) {
            this.renderDescriptor.vertex.module = module;
            this.renderDescriptor.vertex.entryPoint = vsfn;
            if (!this.renderDescriptor.fragment) {
                this.renderDescriptor.fragment = {
                    module: undefined,
                    entryPoint: '',
                    targets: []
                };
            }
            this.renderDescriptor.fragment.module = module;
            this.renderDescriptor.fragment.entryPoint = fsfn;
            this.renderDescriptor.fragment.targets = colorstates;
        }
        else {
            throw new Error("Cannot set render shader on a compute pipeline");
        }
        return this;
    }
    setDepthStencil(format, depthWrite = true, depthCompare = 'less') {
        if (!this.isRender) {
            throw new Error("Depth stencil can only be set for render pipelines");
        }
        this.renderDescriptor.depthStencil = {
            format: format,
            depthWriteEnabled: depthWrite,
            depthCompare: depthCompare
        };
        return this;
    }
    setPrimitiveTopology(topology, stripIndexFormat) {
        if (!this.isRender) {
            throw new Error("Primitive topology can only be set for render pipelines");
        }
        if (!this.renderDescriptor.primitive) {
            this.renderDescriptor.primitive = {
                cullMode: 'none',
                frontFace: 'ccw'
            };
        }
        this.renderDescriptor.primitive.topology = topology;
        if (topology === 'line-strip' || topology === 'triangle-strip') {
            this.renderDescriptor.primitive.stripIndexFormat = stripIndexFormat;
        }
        return this;
    }
    setCullMode(cullMode = 'back', frontFace = 'ccw') {
        if (!this.isRender) {
            throw new Error("Cull mode can only be set for render pipelines");
        }
        if (!this.renderDescriptor.primitive) {
            this.renderDescriptor.primitive = {
                topology: 'triangle-list'
            };
        }
        this.renderDescriptor.primitive.cullMode = cullMode;
        this.renderDescriptor.primitive.frontFace = frontFace;
        return this;
    }
    setMultisample(count = 4, alphaToCoverage = false) {
        if (!this.isRender) {
            throw new Error("Multisample can only be set for render pipelines.");
        }
        this.renderDescriptor.multisample = {
            count: count,
            mask: 0xFFFFFFFF,
            alphaToCoverageEnabled: alphaToCoverage
        };
        return this;
    }
    build() {
        if (!this.pipelineLayout && this.bindgrouupLayouts.length > 0) {
            this.createPipelineLayout();
        }
        if (this.pipelineLayout) {
            this.descriptor.layout = this.pipelineLayout;
        }
        try {
            if (this.isRender) {
                if (!this.renderDescriptor.vertex?.module) {
                    throw new Error("Vertex shader is required for render pipeline");
                }
                if (this.renderDescriptor.fragment?.module && !this.renderDescriptor.fragment.targets) {
                    throw new Error("Fragment shader requires color targets");
                }
                return this.device.createRenderPipeline(this.renderDescriptor);
            }
            else {
                if (!this.computeDescriptor.compute?.module) {
                    throw new Error("Compute shader is required for compute pipeline");
                }
                return this.device.createComputePipeline(this.computeDescriptor);
            }
        }
        catch (error) {
            console.error("Failed to create pipeline:", error);
            console.error("Pipeline descriptor:", JSON.stringify(this.descriptor, null, 2));
            throw error;
        }
    }
    async buildAsync() {
        if (!this.pipelineLayout && this.bindgrouupLayouts.length > 0) {
            this.createPipelineLayout();
        }
        if (this.pipelineLayout) {
            this.descriptor.layout = this.pipelineLayout;
        }
        try {
            if (this.isRender) {
                if (!this.renderDescriptor.vertex?.module) {
                    throw new Error("Vertex shader is required for render pipeline");
                }
                if (this.renderDescriptor.fragment?.module && !this.renderDescriptor.fragment.targets) {
                    throw new Error("Fragment shader requires color targets");
                }
                return this.device.createRenderPipeline(this.renderDescriptor);
            }
            else {
                if (!this.computeDescriptor.compute?.module) {
                    throw new Error("Compute shader is required for compute pipeline");
                }
                return this.device.createComputePipeline(this.computeDescriptor);
            }
        }
        catch (error) {
            console.error("Failed to create pipeline:", error);
            console.error("Pipeline descriptor:", JSON.stringify(this.descriptor, null, 2));
            throw error;
        }
    }
}
