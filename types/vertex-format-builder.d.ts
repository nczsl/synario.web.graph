export interface VertexAttributeConfig {
    format: GPUVertexFormat;
    offset: number;
    shaderLocation: number;
    size?: number;
}
export declare class VertexBufferBuilder {
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
