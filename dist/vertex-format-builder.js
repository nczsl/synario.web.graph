import { util_mod } from 'synario.base';
import * as types_mod from './types';
export var VertexAttributeType;
(function (VertexAttributeType) {
    VertexAttributeType["Position2"] = "position2";
    VertexAttributeType["Position3"] = "position3";
    VertexAttributeType["Position4"] = "position4";
    VertexAttributeType["Normal"] = "normal";
    VertexAttributeType["Tangent"] = "tangent";
    VertexAttributeType["Bitangent"] = "bitangent";
    VertexAttributeType["UV"] = "uv";
    VertexAttributeType["UV2"] = "uv2";
    VertexAttributeType["ColorU32x1"] = "coloru32x1";
    VertexAttributeType["ColorF32x4"] = "colorf32x4";
    VertexAttributeType["VertexID"] = "vertexId";
    VertexAttributeType["InstanceID"] = "instanceId";
    VertexAttributeType["MaterialID"] = "materialId";
    VertexAttributeType["ObjectID"] = "objectId";
    VertexAttributeType["DrawID"] = "drawId";
    VertexAttributeType["PrimitiveID"] = "primitiveId";
    VertexAttributeType["BoneIndices"] = "boneIndices";
    VertexAttributeType["BoneWeights"] = "boneWeights";
    VertexAttributeType["MorphTarget"] = "morphTarget";
    VertexAttributeType["MorphWeight"] = "morphWeight";
    VertexAttributeType["ParticlePosition"] = "particlePosition";
    VertexAttributeType["ParticleVelocity"] = "particleVelocity";
    VertexAttributeType["ParticleAge"] = "particleAge";
    VertexAttributeType["ParticleSize"] = "particleSize";
    VertexAttributeType["ParticleRotation"] = "particleRotation";
    VertexAttributeType["Occlusion"] = "occlusion";
    VertexAttributeType["Metalness"] = "metalness";
    VertexAttributeType["Roughness"] = "roughness";
    VertexAttributeType["Emissive"] = "emissive";
    VertexAttributeType["Custom"] = "custom";
})(VertexAttributeType || (VertexAttributeType = {}));
export class VertexBufferBuilder {
    attributes = [];
    offset = 0;
    location = 0;
    stride = 0;
    addAttribute(type, format, opts) {
        const size = VertexBufferBuilder.getFormatSize(format);
        const attr = {
            type,
            format,
            shaderLocation: this.location,
            offset: this.offset,
            size,
            ...opts
        };
        this.attributes.push(attr);
        this.offset += size;
        this.location++;
        this.stride = this.offset;
        return this;
    }
    withPosition2(format = 'float32x2') {
        return this.addAttribute(VertexAttributeType.Position2, format);
    }
    withPosition3(format = 'float32x3') {
        return this.addAttribute(VertexAttributeType.Position3, format);
    }
    withPosition4(format = 'float32x4') {
        return this.addAttribute(VertexAttributeType.Position4, format);
    }
    withNormal(format = 'float32x3') {
        return this.addAttribute(VertexAttributeType.Normal, format);
    }
    withTangent(format = 'float32x4') {
        return this.addAttribute(VertexAttributeType.Tangent, format);
    }
    withBitangent(format = 'float32x3') {
        return this.addAttribute(VertexAttributeType.Bitangent, format);
    }
    withUV(format = 'float32x2') {
        return this.addAttribute(VertexAttributeType.UV, format);
    }
    withUV2(format = 'float32x2') {
        return this.addAttribute(VertexAttributeType.UV2, format);
    }
    withColorU32x1(format = 'uint32') {
        return this.addAttribute(VertexAttributeType.ColorU32x1, format);
    }
    withColorF32x4(format = 'float32x4') {
        return this.addAttribute(VertexAttributeType.ColorF32x4, format);
    }
    withObjectID(format = 'uint32') {
        return this.addAttribute(VertexAttributeType.ObjectID, format);
    }
    withMaterialID(format = 'uint32') {
        return this.addAttribute(VertexAttributeType.MaterialID, format);
    }
    withInstanceID(format = 'uint32') {
        return this.addAttribute(VertexAttributeType.InstanceID, format);
    }
    withCustom(type, format) {
        return this.addAttribute(type, format);
    }
    setLocation(location) {
        this.location = location;
        return this;
    }
    setOffset(offset) {
        this.offset = offset;
        return this;
    }
    setStride(stride) {
        this.stride = stride;
        return this;
    }
    build() {
        const attributes = this.attributes.map(attr => ({
            shaderLocation: attr.shaderLocation,
            offset: attr.offset,
            format: attr.format
        }));
        return {
            arrayStride: this.stride,
            stepMode: 'vertex',
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
