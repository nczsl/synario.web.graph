export declare enum VertexAttributeType {
    Position2 = "position2",
    Position3 = "position3",
    Position4 = "position4",
    Normal = "normal",
    Tangent = "tangent",
    Bitangent = "bitangent",
    UV = "uv",
    UV2 = "uv2",
    ColorU32x1 = "coloru32x1",
    ColorF32x4 = "colorf32x4",
    VertexID = "vertexId",
    InstanceID = "instanceId",
    MaterialID = "materialId",
    ObjectID = "objectId",
    DrawID = "drawId",
    PrimitiveID = "primitiveId",
    BoneIndices = "boneIndices",
    BoneWeights = "boneWeights",
    MorphTarget = "morphTarget",
    MorphWeight = "morphWeight",
    ParticlePosition = "particlePosition",
    ParticleVelocity = "particleVelocity",
    ParticleAge = "particleAge",
    ParticleSize = "particleSize",
    ParticleRotation = "particleRotation",
    Occlusion = "occlusion",
    Metalness = "metalness",
    Roughness = "roughness",
    Emissive = "emissive",
    Custom = "custom"
}
export interface VertexAttributeConfig {
    type: VertexAttributeType | string;
    format: GPUVertexFormat;
    shaderLocation?: number;
    offset?: number;
    size?: number;
    semantic?: string;
    normalize?: boolean;
    customName?: string;
    required?: boolean;
}
export declare class VertexBufferBuilder {
    private attributes;
    private offset;
    private location;
    private stride;
    private addAttribute;
    withPosition2(format?: GPUVertexFormat): this;
    withPosition3(format?: GPUVertexFormat): this;
    withPosition4(format?: GPUVertexFormat): this;
    withNormal(format?: GPUVertexFormat): this;
    withTangent(format?: GPUVertexFormat): this;
    withBitangent(format?: GPUVertexFormat): this;
    withUV(format?: GPUVertexFormat): this;
    withUV2(format?: GPUVertexFormat): this;
    withColorU32x1(format?: GPUVertexFormat): this;
    withColorF32x4(format?: GPUVertexFormat): this;
    withObjectID(format?: GPUVertexFormat): this;
    withMaterialID(format?: GPUVertexFormat): this;
    withInstanceID(format?: GPUVertexFormat): this;
    withCustom(type: string, format: GPUVertexFormat): this;
    setLocation(location: number): this;
    setOffset(offset: number): this;
    setStride(stride: number): this;
    build(): GPUVertexBufferLayout;
    static getFormatSize(format: GPUVertexFormat): number;
}
