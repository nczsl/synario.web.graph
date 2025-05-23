// PCG 状态变量
var<private> _rng_state: vec4u;

// 初始化种子（需由宿主程序传入参数）
fn rseed(id: vec3u, frame: u32) {
    let off = id.x + id.y * 1000u + id.z * 1000000u + frame * 1000000000u;
    _rng_state = vec4u(
        0x12345678u ^ off,
        0x9ABCDEF0u ^ off,
        0x13579BDFu ^ off,
        0x2468ACE0u ^ off
    );
}

// PCG 随机数生成器
fn pcg_rand() -> u32 {
    _rng_state = _rng_state * 747796405u + 2891336453u;
    let word = ((_rng_state.x >> ((_rng_state.x >> 28u) + 4u)) ^ _rng_state.x) * 277803737u;
    return (word >> 22u) ^ word;
}

// 生成 [0,1) 范围内的随机浮点数
fn rand() -> f32 {
    return f32(pcg_rand()) / 4294967296.0; // 2^32 = 4294967296.0
}

// 生成 [min, max) 范围内的随机浮点数
fn rand_range(min: f32, max: f32) -> f32 {
    return min + (max - min) * rand();
}

// 生成随机 2D 向量
fn rand_vec2() -> vec2<f32> {
    return vec2<f32>(rand(), rand());
}

// 生成随机 3D 向量
fn rand_vec3() -> vec3<f32> {
    return vec3<f32>(rand(), rand(), rand());
}
