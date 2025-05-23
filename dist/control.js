import * as data_access_mod from './data-access';
import * as camera_mod from './camera';
import * as signal_mod from './signal';
import * as model_mod from './model';
export class Control {
    access;
    camera;
    signal;
    constructor(access) {
        this.access = access;
        this.camera = new camera_mod.Camera();
        this.signal = new signal_mod.Signal();
        this.initSignal();
        this.initCamera();
        this.access.initSignalCamera(this.signal, this.camera);
        this.registryEvent();
    }
    registryEvent() {
        const canvas = this.access.scen.canvas;
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
    initSignal() {
        this.signal.mouse.gbufferId = this.access.registryBuffer(Math.max(signal_mod.MouseInfo.BUFFER_SIZE, 256), GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE);
        this.signal.key.gbufferId = this.access.registryBuffer(Math.max(signal_mod.KeyInfo.BUFFER_SIZE, 256), GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE);
        this.signal.tick.gbufferId = this.access.registryBuffer(Math.max(signal_mod.TickInfo.BUFFER_SIZE, 256), GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE);
    }
    initCamera() {
        this.camera.bufferId = this.access.registryBuffer(camera_mod.Camera.BUFFER_SIZE, GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST);
    }
    update(tick) {
        this.signal.tick.nextFrame(tick);
        this.access.updateBuffer(this.signal.mouse.gbufferId, this.signal.mouse.buffer);
        this.access.updateBuffer(this.signal.key.gbufferId, this.signal.key.buffer);
        this.access.updateBuffer(this.signal.tick.gbufferId, this.signal.tick.buffer);
        this.camera.updateBuffer();
        this.access.updateBuffer(this.camera.bufferId, this.camera.buffer);
    }
}
