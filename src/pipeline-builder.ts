/**
 * Synario WebGPU Graphics Library
 * @file pipeline-builder.ts
 * @description 渲染管线构建器
 * @author Synario Team
 */
import { util_mod, engine_mod } from 'synario.base';
import * as types_mod from './types';
import * as vertex_format_builder_mod from './vertex-format-builder';
import * as builders_mod from './builders';

/**
 *  renderpipeline 非常复杂 ，需要一个builder来构建 
 *  链式调用 动态组装 
 */
export class PipelineBuilder {
  private device: GPUDevice;
  descriptor: types_mod.PipelineDescriptor;
  pipelineLayout: GPUPipelineLayout;
  bindgrouupLayouts: GPUBindGroupLayout[];
  isRender: boolean;

  get renderDescriptor(): GPURenderPipelineDescriptor {
    return this.descriptor as GPURenderPipelineDescriptor;
  }

  set renderDescriptor(descriptor: GPURenderPipelineDescriptor) {
    this.descriptor = descriptor;
  }

  get computeDescriptor(): GPUComputePipelineDescriptor {
    return this.descriptor as GPUComputePipelineDescriptor
  }

  set computeDescriptor(descriptor: GPUComputePipelineDescriptor) {
    this.descriptor = descriptor;
  }

  constructor(device: GPUDevice, isRender: boolean) {
    this.device = device;
    this.isRender = isRender;
    this.bindgrouupLayouts = [];
    // 初始化descriptor
    if (isRender) {
      this.descriptor = {
        layout: 'auto',
        vertex: {
          module: null as unknown as GPUShaderModule,
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
      } as GPURenderPipelineDescriptor;
    } else {
      this.descriptor = {
        layout: 'auto',
        compute: {
          module: null as unknown as GPUShaderModule,
          entryPoint: 'main'
        }
      } as GPUComputePipelineDescriptor;
    }
  }
  // set label
  setLabel(label: string): PipelineBuilder {
    this.descriptor.label = label;
    return this;
  }
  //set vertex shader
  setVertexShader(code: string, fn: string = 'main'): PipelineBuilder {
    if (this.isRender) {
      const module = this.device.createShaderModule({
        code: code
      });
      this.renderDescriptor.vertex = {
        module,
        entryPoint: fn
      }
    }
    return this;
  }

  //set fragment shader
  setFragmentShader(code: string, colorstates: GPUColorTargetState[], fn: string = 'main'): PipelineBuilder {
    const module = this.device.createShaderModule({
      code: code
    });
    if (this.isRender) {
      this.renderDescriptor.fragment = {
        module,
        entryPoint: fn,
        targets: colorstates
      }
    }
    return this;
  }

  /**
   * 添加顶点状态
   * @param config 顶点缓冲区处理函数
   * @returns PipelineBuilder 实例，用于链式调用
   */
  addVertexStruct(config: types_mod.VertexFormatHandler): PipelineBuilder {
    if (!this.isRender) {
      throw new Error("Vertex state can only be set for render pipelines.");
    }

    // 创建顶点缓冲区布局构建器
    const vfb = new vertex_format_builder_mod.VertexBufferBuilder();

    // 调用配置函数让用户添加所需的顶点属性
    const vertexBufferLayout = config(vfb);

    // 设置到渲染管线描述符
    if (!this.renderDescriptor.vertex.buffers) {
      this.renderDescriptor.vertex.buffers = [];
    }

    this.renderDescriptor.vertex.buffers = [
      ...(Array.from(this.renderDescriptor.vertex.buffers)),
      vertexBufferLayout
    ];

    return this;
  }

  /**
   * 支持传入多个 vertex buffer layout，自动检查 shaderLocation 冲突
   */
  addVertexStructByExists(layouts: GPUVertexBufferLayout[]): PipelineBuilder {
    if (!this.isRender) {
      throw new Error("Vertex state can only be set for render pipelines.");
    }
    // this.vertexBufferLayouts = layouts;
    this.renderDescriptor.vertex.buffers = [
      ...(Array.from(this.renderDescriptor.vertex.buffers)),
    ]
    return this;
  }
  // add bindGroupLayout
  addBindGroupLayout(config: types_mod.BindGroupLayoutHandler): PipelineBuilder {
    let x = config(new builders_mod.BindGroupLayoutBuilder());
    this.bindgrouupLayouts.push(x);
    return this;
  }
  setBindGroupLayoutByExists(bindgroupLayouts: GPUBindGroupLayout[]): PipelineBuilder {
    // this.bindgrouupLayouts.push(...bindgroupLayouts);
    this.bindgrouupLayouts = bindgroupLayouts;
    return this;
  }
  // 创建管线布局
  private createPipelineLayout(): PipelineBuilder {
    this.pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: this.bindgrouupLayouts
    });
    return this;
  }

  /**
   * 设置计算着色器
   * @param module 计算着色器模块
   * @param fn 入口点函数名，默认为'main'
   */
  setComputeShader(code: string, fn: string = 'main'): PipelineBuilder {
    const module = this.device.createShaderModule({
      code: code
    });
    if (!this.isRender) {
      this.computeDescriptor.compute = {
        module,
        entryPoint: fn
      };
    } else {
      throw new Error("Cannot set compute shader on a render pipeline");
    }
    return this;
  }
  setRenderShader(code: string, fn: string, colorstates: GPUColorTargetState[]): PipelineBuilder {
    const module = this.device.createShaderModule({
      code: code
    });
    let fsfn = `${fn}_fs`;
    let vsfn = `${fn}_vs`;
    if (this.isRender) {
      this.renderDescriptor.vertex.module = module;
      this.renderDescriptor.vertex.entryPoint = vsfn;

      // 确保 fragment 对象存在
      if (!this.renderDescriptor.fragment) {
        this.renderDescriptor.fragment = {
          module: undefined as unknown as GPUShaderModule,
          entryPoint: '',
          targets: []
        };
      }

      this.renderDescriptor.fragment.module = module;
      this.renderDescriptor.fragment.entryPoint = fsfn;
      this.renderDescriptor.fragment.targets = colorstates;
    } else {
      throw new Error("Cannot set render shader on a compute pipeline");
    }
    return this;
  }

  /**
   * 设置深度/模板测试状态
   * @param format 深度/模板格式
   * @param depthWrite 是否写入深度值
   * @param depthCompare 深度比较函数
   */
  setDepthStencil(
    format: GPUTextureFormat,
    depthWrite: boolean = true,
    depthCompare: GPUCompareFunction = 'less'
  ): PipelineBuilder {
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

  /**
   * 设置图元拓扑
   * @param topology 图元拓扑类型
   * @param stripIndexFormat 使用strip时的索引格式
   */
  setPrimitiveTopology(
    topology: GPUPrimitiveTopology,
    stripIndexFormat?: GPUIndexFormat
  ): PipelineBuilder {
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

  /**
   * 设置背面剔除
   * @param cullMode 剔除模式
   * @param frontFace 前面定义
   */
  setCullMode(
    cullMode: GPUCullMode = 'back',
    frontFace: GPUFrontFace = 'ccw'
  ): PipelineBuilder {
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

  /**
   * 设置多重采样
   * @param count 采样数量
   * @param alphaToCoverage 是否启用alpha to coverage
   */
  setMultisample(
    count: number = 4, // 默认4倍抗锯齿
    alphaToCoverage: boolean = false
  ): PipelineBuilder {
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

  /**
   * 构建管线
   * @returns 创建好的管线对象
   */
  build(): types_mod.Pipeline {
    // 设置管线布局
    if (!this.pipelineLayout && this.bindgrouupLayouts.length > 0) {
      this.createPipelineLayout();
    }

    if (this.pipelineLayout) {
      this.descriptor.layout = this.pipelineLayout;
    }

    try {
      if (this.isRender) {
        // 检查必要属性
        if (!this.renderDescriptor.vertex?.module) {
          throw new Error("Vertex shader is required for render pipeline");
        }

        // 如果有fragmentShader并且fragment.targets未设置，添加默认值
        if (this.renderDescriptor.fragment?.module && !this.renderDescriptor.fragment.targets) {
          throw new Error("Fragment shader requires color targets");
        }

        return this.device.createRenderPipeline(this.renderDescriptor);

      } else {
        // 检查必要属性
        if (!this.computeDescriptor.compute?.module) {
          throw new Error("Compute shader is required for compute pipeline");
        }
        return this.device.createComputePipeline(this.computeDescriptor);

      }
    } catch (error) {
      console.error("Failed to create pipeline:", error);
      console.error("Pipeline descriptor:", JSON.stringify(this.descriptor, null, 2));
      throw error;
    }
  }

  /**
   * 异步构建管线
   * @returns Promise<管线对象>
   */
  async buildAsync(): Promise<types_mod.Pipeline> {
    // 设置管线布局
    if (!this.pipelineLayout && this.bindgrouupLayouts.length > 0) {
      this.createPipelineLayout();
    }
    if (this.pipelineLayout) {
      this.descriptor.layout = this.pipelineLayout;
    }
    try {
      if (this.isRender) {
        // 检查必要属性
        if (!this.renderDescriptor.vertex?.module) {
          throw new Error("Vertex shader is required for render pipeline");
        }

        // 如果有fragmentShader并且fragment.targets未设置，添加默认值
        if (this.renderDescriptor.fragment?.module && !this.renderDescriptor.fragment.targets) {
          throw new Error("Fragment shader requires color targets");
        }

        return this.device.createRenderPipeline(this.renderDescriptor);

      } else {
        // 检查必要属性
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
