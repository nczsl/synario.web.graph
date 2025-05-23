// 相机相关结构体定义（与 camera.ts Camera 类 buffer 完全一致）

struct Camera {
    viewMatrix : mat4x4<f32>,
    projectionMatrix : mat4x4<f32>,
    viewProjMatrix : mat4x4<f32>,
    position : vec4<f32>,
    cameraTarget : vec4<f32>,
    up : vec4<f32>,
    projParams : vec4<f32>,
};


