import { util_mod } from 'synario.base';
import * as types_mod from './types';
export class VertexBufferBuilder {
    attributes = [];
    offset = 0;
    location = 0;
    stride = 0;
    stepMode;
    constructor(stepMode = 'vertex') {
        this.stepMode = stepMode;
    }
    append(format) {
        const size = VertexBufferBuilder.getFormatSize(format);
        const attr = {
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
    add(format, start) {
        const size = VertexBufferBuilder.getFormatSize(format);
        const attr = {
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
    build() {
        const attributes = this.attributes.map(attr => ({
            format: attr.format,
            offset: attr.offset,
            shaderLocation: attr.shaderLocation,
        }));
        return {
            arrayStride: this.stride,
            stepMode: this.stepMode,
            attributes
        };
    }
    static getFormatSize(format) {
        switch (format) {
            case "uint8":
            case "sint8":
            case "unorm8":
            case "snorm8":
                return 1;
            case "uint8x2":
            case "sint8x2":
            case "unorm8x2":
            case "snorm8x2":
                return 2;
            case "uint8x4":
            case "sint8x4":
            case "unorm8x4":
            case "snorm8x4":
            case "unorm8x4-bgra":
                return 4;
            case "uint16":
            case "sint16":
            case "unorm16":
            case "snorm16":
            case "float16":
                return 2;
            case "uint16x2":
            case "sint16x2":
            case "unorm16x2":
            case "snorm16x2":
            case "float16x2":
                return 4;
            case "uint16x4":
            case "sint16x4":
            case "unorm16x4":
            case "snorm16x4":
            case "float16x4":
                return 8;
            case "float32":
            case "uint32":
            case "sint32":
                return 4;
            case "float32x2":
            case "uint32x2":
            case "sint32x2":
                return 8;
            case "float32x3":
            case "uint32x3":
            case "sint32x3":
                return 12;
            case "float32x4":
            case "uint32x4":
            case "sint32x4":
                return 16;
            case "unorm10-10-10-2":
                return 4;
            default:
                throw new Error(`Unknown GPUVertexFormat: ${format}`);
        }
    }
}
