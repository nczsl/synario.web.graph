// 信号相关结构体定义（无@group/@binding/var，仅结构体）

// 鼠标信息（与 signal.ts MouseInfo 对应，全部为 f32，15项）
struct MouseInfo {
    screenX: f32,
    screenY: f32,
    clientX: f32,
    clientY: f32,
    movementX: f32,
    movementY: f32,
    pageX: f32,
    pageY: f32,
    offsetX: f32,
    offsetY: f32,
    x: f32,
    y: f32,
    button: f32,
    buttons: f32,
    timestamp: f32,
};

// 键盘信息（与 signal.ts KeyInfo 对应，2 x f32 + 6 x u32）
struct KeyInfo {
    location: f32,
    timestamp: f32,
    repeat: u32,
    isComposing: u32,
    ctrlKey: u32,
    shiftKey: u32,
    altKey: u32,
    metaKey: u32,
};

// Tick信息（与 signal.ts TickInfo 对应，2 x u32 + 6 x f32）
// _pad0/_pad1 字段不是必须的，仅用于对齐或占位。由于 JS 侧 buffer 已保证 256 字节，WGSL 结构体无需强制保留 _padx 字段。
// 如果你不需要在 WGSL 侧用 _padx 字段，可以安全移除它们。
struct TickInfo {
    tick: u32,
    time: f32,
    deltaTime: f32,
    frameStart: f32,
    lastFrameStart: f32,
    fps: f32,
};

