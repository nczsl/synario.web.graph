import * as data_access_mod from './data-access';
import * as control_mod from './control';
import * as render_graph_mod from './render-graph';
export declare class Scenery {
    canvas: HTMLCanvasElement;
    context: GPUCanvasContext;
    device: GPUDevice;
    control: control_mod.Control;
    private isRunning;
    access: data_access_mod.DataAccess;
    major: render_graph_mod.RenderGraph;
    minor: render_graph_mod.RenderGraph;
    init(canvas: HTMLCanvasElement): Promise<void>;
    constructor();
    runMajor(): void;
    run(): void;
    stop(): void;
}
