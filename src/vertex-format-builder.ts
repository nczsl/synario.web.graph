/**
 * Synario WebGPU Graphics Library
 * @file vertex-format-builder.ts
 * @description 顶点格式构建器 - 支持高度自定义、顺序无关、复杂顶点结构
 * @author Synario Team
 */

import { util_mod } from 'synario.base';
import * as types_mod from './types';

/**
 * 顶点属性配置接口
 */
export interface VertexAttributeConfig {
  format: GPUVertexFormat;
  offset: number;
  shaderLocation: number;
  size?: number;
}

/**
 * 顶点缓冲区布局构建器
 * 支持任意顺序、高度可组合的顶点格式定义
 */
export class VertexBufferBuilder {
  private attributes: VertexAttributeConfig[] = [];
  private offset = 0;
  private location = 0;
  private stride = 0;
  private stepMode: GPUVertexStepMode;
  constructor(stepMode: GPUVertexStepMode = 'vertex') {
    this.stepMode = stepMode;
  }
  /**
   * 添加通用属性
   */
  append(format: GPUVertexFormat) {
    const size = VertexBufferBuilder.getFormatSize(format);
    const attr: VertexAttributeConfig = {
      format,
      shaderLocation: this.location,
      offset: this.offset,
      size
    };
    this.attributes.push(attr);
    this.offset += size;
    this.location++;
    this.stride = this.offset;
    return this;
  }
  add(format: GPUVertexFormat, start: GPUIndex32) {
    const size = VertexBufferBuilder.getFormatSize(format);
    const attr: VertexAttributeConfig = {
      format,
      shaderLocation: this.location,
      offset: this.offset,
      size
    };
    this.attributes.push(attr);
    this.offset += size;
    this.location += start;
    this.stride = this.offset;
    return this;
  }
  /**
   * 构建 GPUVertexBufferLayout
   */
  build(): GPUVertexBufferLayout {
    const attributes: GPUVertexAttribute[] = this.attributes.map(attr => ({
      format: attr.format,
      offset: attr.offset,
      shaderLocation: attr.shaderLocation!,
    }));
    return {
      arrayStride: this.stride,
      stepMode: this.stepMode,
      attributes
    };
  }

  /**
   * 获取 GPUVertexFormat 对应的字节大小
   * type GPUVertexFormat =
   * | "uint8"        | "uint8x2"      | "uint8x4"      | "sint8"        | "sint8x2"      | "sint8x4"
   * | "unorm8"       | "unorm8x2"     | "unorm8x4"     | "snorm8"       | "snorm8x2"     | "snorm8x4"
   * | "uint16"       | "uint16x2"     | "uint16x4"     | "sint16"       | "sint16x2"     | "sint16x4"
   * | "unorm16"      | "unorm16x2"    | "unorm16x4"    | "snorm16"      | "snorm16x2"    | "snorm16x4"
   * | "float16"      | "float16x2"    | "float16x4"    | "float32"      | "float32x2"    | "float32x3"
   * | "float32x4"    | "uint32"       | "uint32x2"     | "uint32x3"     | "uint32x4"     | "sint32"
   * | "sint32x2"     | "sint32x3"     | "sint32x4"     | "unorm10-10-10-2" | "unorm8x4-bgra";
   */
  static getFormatSize(format: GPUVertexFormat): number {
    switch (format) {
      // 8-bit
      case "uint8": case "sint8": case "unorm8": case "snorm8":
        return 1;
      case "uint8x2": case "sint8x2": case "unorm8x2": case "snorm8x2":
        return 2;
      case "uint8x4": case "sint8x4": case "unorm8x4": case "snorm8x4": case "unorm8x4-bgra":
        return 4;

      // 16-bit
      case "uint16": case "sint16": case "unorm16": case "snorm16": case "float16":
        return 2;
      case "uint16x2": case "sint16x2": case "unorm16x2": case "snorm16x2": case "float16x2":
        return 4;
      case "uint16x4": case "sint16x4": case "unorm16x4": case "snorm16x4": case "float16x4":
        return 8;

      // 32-bit
      case "float32": case "uint32": case "sint32":
        return 4;
      case "float32x2": case "uint32x2": case "sint32x2":
        return 8;
      case "float32x3": case "uint32x3": case "sint32x3":
        return 12;
      case "float32x4": case "uint32x4": case "sint32x4":
        return 16;

      // packed
      case "unorm10-10-10-2":
        return 4;

      default:
        throw new Error(`Unknown GPUVertexFormat: ${format}`);
    }
  }
}
