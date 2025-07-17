import * as data_access_mod from './data-access';
import * as camera_mod from './camera';
import * as signal_mod from './signal';
import * as scen_mod from './scene';
import * as types_mod from './types';
export class Control {
    access;
    camera;
    signal;
    samplers = {};
    samplerBindGroupLayoutId = -1;
    samplerBindGroupId = -1;
    constructor(access) {
        this.access = access;
        this.camera = new camera_mod.Camera();
        this.signal = new signal_mod.Signal();
        this.access.initSignalCamera(this.signal, this.camera);
        this.registryEvent();
        this.initSamplers(this.access.scenery.device);
        this.initSamplerBindGroup(this.access.scenery.device);
    }
    registryEvent() {
        const canvas = this.access.scenery.canvas;
        canvas.addEventListener('mousemove', (e) => {
            this.signal.mouse.updateFromEvent(e);
        });
        canvas.addEventListener('mousedown', (e) => {
            this.signal.mouse.updateFromEvent(e);
        });
        canvas.addEventListener('mouseup', (e) => {
            this.signal.mouse.updateFromEvent(e);
        });
        canvas.addEventListener('wheel', (e) => {
        });
        window.addEventListener('keydown', (e) => {
            this.signal.key.updateFromEvent(e);
        });
        window.addEventListener('keyup', (e) => {
            this.signal.key.updateFromEvent(e);
        });
        window.addEventListener('resize', () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.camera.updateViewProjectionMatrix();
        });
    }
    update(tick) {
        this.signal.tick.nextFrame(tick);
        const combinedBuffer = this.signal.getCombinedBufferData();
        this.access.updateBuffer(this.signal.gbufferId, combinedBuffer);
        this.camera.updateBuffer();
        this.access.updateBuffer(this.camera.bufferId, this.camera.buffer);
    }
    initSamplers(device) {
        this.samplers.linear = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            addressModeU: 'repeat',
            addressModeV: 'repeat',
        });
        this.samplers.nearest = device.createSampler({
            magFilter: 'nearest',
            minFilter: 'nearest',
            addressModeU: 'repeat',
            addressModeV: 'repeat',
        });
        this.samplers.linearClamp = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });
    }
    getSampler(name) {
        return this.samplers[name];
    }
    initSamplerBindGroup(device) {
        this.samplerBindGroupLayoutId = this.access.registryBindGroupLayout(builder => {
            let idx = 0;
            if (this.samplers.linear)
                builder.addSampler(idx++, GPUShaderStage.FRAGMENT);
            if (this.samplers.nearest)
                builder.addSampler(idx++, GPUShaderStage.FRAGMENT);
            if (this.samplers.linearClamp)
                builder.addSampler(idx++, GPUShaderStage.FRAGMENT);
            return builder.build(device);
        });
        this.samplerBindGroupId = this.access.registryBindGroup(builder => {
            let idx = 0;
            if (this.samplers.linear)
                builder.addSampler(idx++, this.samplers.linear);
            if (this.samplers.nearest)
                builder.addSampler(idx++, this.samplers.nearest);
            if (this.samplers.linearClamp)
                builder.addSampler(idx++, this.samplers.linearClamp);
            return builder.build(device, this.access.store.get(types_mod.ResType.bindGroupLayout, this.samplerBindGroupLayoutId));
        });
    }
    getSamplerBindGroup() {
        return this.access.store.get(types_mod.ResType.bindGroup, this.samplerBindGroupId);
    }
    getSamplerBindGroupLayout() {
        return this.access.store.get(types_mod.ResType.bindGroupLayout, this.samplerBindGroupLayoutId);
    }
}
