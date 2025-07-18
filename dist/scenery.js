import { util_mod, engine_mod } from 'synario.base';
import * as camera_mod from './camera';
import * as signal_mod from './signal';
import * as builders_mod from './builders';
import * as types_mod from './types';
import * as data_access_mod from './data-access';
import * as control_mod from './control';
import * as render_graph_mod from './render-graph';
export class Scenery {
    canvas;
    context;
    device;
    control;
    format;
    isRunning = false;
    access;
    major;
    minor;
    async init(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('webgpu');
        let adapter = await navigator.gpu.requestAdapter();
        this.device = await adapter.requestDevice();
        this.format = 'bgra8unorm';
        this.context.configure({
            device: this.device,
            format: this.format,
        });
        this.access = new data_access_mod.DataAccess(this);
        let texture = this.device.createTexture({
            size: [canvas.width, canvas.height, 2],
            format: this.format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            viewFormats: [this.format],
        });
        let textureView = texture.createView();
        this.major = new render_graph_mod.RenderGraph(this);
        this.minor = new render_graph_mod.RenderGraph(this);
        this.control = new control_mod.Control(this.access);
    }
    constructor() {
    }
    runMajor() {
        if (!this.isRunning) {
            this.isRunning = true;
            engine_mod.Engine.start(tick => {
                this.control.update(tick);
                this.major.render();
            });
        }
    }
    run() {
        if (!this.isRunning) {
            this.isRunning = true;
            engine_mod.Engine.start(tick => {
                this.control.update(tick);
                this.major.render();
                this.minor.render();
            });
        }
    }
    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            engine_mod.Engine.stop();
        }
    }
}
