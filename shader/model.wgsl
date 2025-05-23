// 所有常见顶点结构体缩写定义（仅结构体，无@group/@binding/var）

// 位置2D
struct VertexInputP2 {
    @location(0) position: vec2<f32>,
};
// 位置2D + objectID
struct VertexInputP2O1 {
    @location(0) position: vec2<f32>,
    @location(1) objectID: u32,
};
// 位置2D + objectID + materialID
struct VertexInputP2O1M1 {
    @location(0) position: vec2<f32>,
    @location(1) objectID: u32,
    @location(2) materialID: u32,
};

// 位置3D
struct VertexInputP3 {
    @location(0) position: vec3<f32>,
};
// 位置3D + objectID
struct VertexInputP3O1 {
    @location(0) position: vec3<f32>,
    @location(1) objectID: u32,
};
// 位置3D + objectID + materialID
struct VertexInputP3O1M1 {
    @location(0) position: vec3<f32>,
    @location(1) objectID: u32,
    @location(2) materialID: u32,
};

// 位置2D + 颜色u32
struct VertexInputP2C1 {
    @location(0) position: vec2<f32>,
    @location(1) color: u32,
};
// 位置2D + 颜色u32 + objectID
struct VertexInputP2C1O1 {
    @location(0) position: vec2<f32>,
    @location(1) color: u32,
    @location(2) objectID: u32,
};
// 位置2D + 颜色u32 + objectID + materialID
struct VertexInputP2C1O1M1 {
    @location(0) position: vec2<f32>,
    @location(1) color: u32,
    @location(2) objectID: u32,
    @location(3) materialID: u32,
};

// 位置3D + 颜色u32
struct VertexInputP3C1 {
    @location(0) position: vec3<f32>,
    @location(1) color: u32,
};
// 位置3D + 颜色u32 + objectID
struct VertexInputP3C1O1 {
    @location(0) position: vec3<f32>,
    @location(1) color: u32,
    @location(2) objectID: u32,
};
// 位置3D + 颜色u32 + objectID + materialID
struct VertexInputP3C1O1M1 {
    @location(0) position: vec3<f32>,
    @location(1) color: u32,
    @location(2) objectID: u32,
    @location(3) materialID: u32,
};

// 位置2D + 颜色vec4
struct VertexInputP2C4 {
    @location(0) position: vec2<f32>,
    @location(1) color: vec4<f32>,
};
// 位置2D + 颜色vec4 + objectID
struct VertexInputP2C4O1 {
    @location(0) position: vec2<f32>,
    @location(1) color: vec4<f32>,
    @location(2) objectID: u32,
};
// 位置2D + 颜色vec4 + objectID + materialID
struct VertexInputP2C4O1M1 {
    @location(0) position: vec2<f32>,
    @location(1) color: vec4<f32>,
    @location(2) objectID: u32,
    @location(3) materialID: u32,
};

// 位置3D + 颜色vec4
struct VertexInputP3C4 {
    @location(0) position: vec3<f32>,
    @location(1) color: vec4<f32>,
};
// 位置3D + 颜色vec4 + objectID
struct VertexInputP3C4O1 {
    @location(0) position: vec3<f32>,
    @location(1) color: vec4<f32>,
    @location(2) objectID: u32,
};
// 位置3D + 颜色vec4 + objectID + materialID
struct VertexInputP3C4O1M1 {
    @location(0) position: vec3<f32>,
    @location(1) color: vec4<f32>,
    @location(2) objectID: u32,
    @location(3) materialID: u32,
};

// 位置3D + 法线
struct VertexInputP3N1 {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
};
// 位置3D + 法线 + objectID
struct VertexInputP3N1O1 {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) objectID: u32,
};
// 位置3D + 法线 + objectID + materialID
struct VertexInputP3N1O1M1 {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) objectID: u32,
    @location(3) materialID: u32,
};

// 位置3D + 法线 + 切线
struct VertexInputP3N1T4 {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) tangent: vec4<f32>,
};
// 位置3D + 法线 + 切线 + uv
struct VertexInputP3N1T4U2 {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) tangent: vec4<f32>,
    @location(3) uv: vec2<f32>,
};
// 位置3D + uv
struct VertexInputP3U2 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
};
// 位置3D + uv + objectID
struct VertexInputP3U2O1 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) objectID: u32,
};
// 位置3D + uv + objectID + materialID
struct VertexInputP3U2O1M1 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) objectID: u32,
    @location(3) materialID: u32,
};
// 位置3D + uv + 颜色
struct VertexInputP3U2C1 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) color: u32,
};
// 位置3D + uv + 法线
struct VertexInputP3U2N1 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
};
// 位置3D + uv + 法线 + 切线
struct VertexInputP3U2N1T4 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) tangent: vec4<f32>,
};
// 位置3D + uv + 法线 + 切线 + 颜色
struct VertexInputP3U2N1T4C1 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) tangent: vec4<f32>,
    @location(4) color: u32,
};
// 位置3D + uv + 法线 + 切线 + 颜色vec4
struct VertexInputP3U2N1T4C4 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) tangent: vec4<f32>,
    @location(4) color: vec4<f32>,
};
// 位置3D + uv + 法线 + 切线 + 物体ID
struct VertexInputP3U2N1T4O1 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) tangent: vec4<f32>,
    @location(4) objectID: u32,
};
// 位置3D + uv + 法线 + 切线 + 物体ID + 材质ID
struct VertexInputP3U2N1T4O1M1 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) tangent: vec4<f32>,
    @location(4) objectID: u32,
    @location(5) materialID: u32,
};
// 位置3D + uv + 法线 + 切线 + 物体ID + 材质ID + 颜色
struct VertexInputP3U2N1T4O1M1C1 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) tangent: vec4<f32>,
    @location(4) objectID: u32,
    @location(5) materialID: u32,
    @location(6) color: u32,
};
// 位置3D + uv + 法线 + 切线 + 物体ID + 材质ID + 颜色vec4
struct VertexInputP3U2N1T4O1M1C4 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) tangent: vec4<f32>,
    @location(4) objectID: u32,
    @location(5) materialID: u32,
    @location(6) color: vec4<f32>,
};
// 位置3D + uv + 法线 + 切线 + 物体ID + 材质ID + 骨骼索引 + 骨骼权重
struct VertexInputP3U2N1T4O1M1BI4BW4 {
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) tangent: vec4<f32>,
    @location(4) objectID: u32,
    @location(5) materialID: u32,
    @location(6) boneIndices: vec4<u32>,
    @location(7) boneWeights: vec4<f32>,
};
// ...可继续扩展更多组合...

// 说明：
// p  = position
// n  = normal
// t  = tangent
// u  = uv
// c  = color (u32/vec4<f32>)
// o  = objectID
// m  = materialID
// bi = boneIndices
// bw = boneWeights

// ---------------------------
// Mesh/Instance/Indirect 相关结构体（用于@group/@binding/var<storage>）
// ---------------------------

// 实例数据（与 InstanceData 对应，最基础布局：instanceId + model matrix）
struct InstanceData {
    instanceId: u32,
    model: mat4x4<f32>,
    // 可扩展：color: vec4<f32>, materialId: u32, uv: vec2<f32>, normal: vec3<f32>
    // 具体扩展字段需与 JS/TS 侧一致
};

// instanceId + model + color
struct InstanceDataC4 {
    instanceId: u32,
    model: mat4x4<f32>,
    color: vec4<f32>,
};

// instanceId + model + materialId
struct InstanceDataM1 {
    instanceId: u32,
    model: mat4x4<f32>,
    materialId: u32,
};

// instanceId + model + uv
struct InstanceDataU2 {
    instanceId: u32,
    model: mat4x4<f32>,
    uv: vec2<f32>,
};

// instanceId + model + normal
struct InstanceDataN3 {
    instanceId: u32,
    model: mat4x4<f32>,
    normal: vec3<f32>,
};

// instanceId + model + color + materialId
struct InstanceDataC4M1 {
    instanceId: u32,
    model: mat4x4<f32>,
    color: vec4<f32>,
    materialId: u32,
};

// instanceId + model + color + uv
struct InstanceDataC4U2 {
    instanceId: u32,
    model: mat4x4<f32>,
    color: vec4<f32>,
    uv: vec2<f32>,
};

// instanceId + model + color + normal
struct InstanceDataC4N3 {
    instanceId: u32,
    model: mat4x4<f32>,
    color: vec4<f32>,
    normal: vec3<f32>,
};

// instanceId + model + materialId + uv
struct InstanceDataM1U2 {
    instanceId: u32,
    model: mat4x4<f32>,
    materialId: u32,
    uv: vec2<f32>,
};

// instanceId + model + materialId + normal
struct InstanceDataM1N3 {
    instanceId: u32,
    model: mat4x4<f32>,
    materialId: u32,
    normal: vec3<f32>,
};

// instanceId + model + uv + normal
struct InstanceDataU2N3 {
    instanceId: u32,
    model: mat4x4<f32>,
    uv: vec2<f32>,
    normal: vec3<f32>,
};

// instanceId + model + color + materialId + uv
struct InstanceDataC4M1U2 {
    instanceId: u32,
    model: mat4x4<f32>,
    color: vec4<f32>,
    materialId: u32,
    uv: vec2<f32>,
};

// instanceId + model + color + materialId + normal
struct InstanceDataC4M1N3 {
    instanceId: u32,
    model: mat4x4<f32>,
    color: vec4<f32>,
    materialId: u32,
    normal: vec3<f32>,
};

// instanceId + model + color + uv + normal
struct InstanceDataC4U2N3 {
    instanceId: u32,
    model: mat4x4<f32>,
    color: vec4<f32>,
    uv: vec2<f32>,
    normal: vec3<f32>,
};

// instanceId + model + materialId + uv + normal
struct InstanceDataM1U2N3 {
    instanceId: u32,
    model: mat4x4<f32>,
    materialId: u32,
    uv: vec2<f32>,
    normal: vec3<f32>,
};

// instanceId + model + color + materialId + uv + normal
struct InstanceDataC4M1U2N3 {
    instanceId: u32,
    model: mat4x4<f32>,
    color: vec4<f32>,
    materialId: u32,
    uv: vec2<f32>,
    normal: vec3<f32>,
};

// 实例索引（与 GobjInstanceIndex 对应）
struct GobjInstanceIndex {
    gobjId: u32,
    start: u32,
    count: u32,
};

// 非索引绘制参数（与 DrawIndirectArgs 对应）
struct DrawIndirectArgs {
    vertexCount: u32,
    instanceCount: u32,
    firstVertex: u32,
    firstInstance: u32,
};

// 索引绘制参数（与 DrawIndexIndirectArgs 对应）
struct DrawIndexIndirectArgs {
    indexCount: u32,
    instanceCount: u32,
    firstIndex: u32,
    baseVertex: u32,
    firstInstance: u32,
};

// ---------------------------
// Storage Buffer 结构体数组示例（仅结构体定义，实际变量由@group/@binding指定）
// ---------------------------
// struct InstanceDataArray { data: array<InstanceData>; };
// struct GobjInstanceIndexArray { data: array<GobjInstanceIndex>; };
// struct DrawIndirectArgsArray { data: array<DrawIndirectArgs>; };
// struct DrawIndexIndirectArgsArray { data: array<DrawIndexIndirectArgs>; };
