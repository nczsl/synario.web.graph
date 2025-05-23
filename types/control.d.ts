import * as data_access_mod from './data-access';
import * as camera_mod from './camera';
import * as signal_mod from './signal';
export declare class Control {
    access: data_access_mod.DataAccess;
    camera: camera_mod.Camera;
    signal: signal_mod.Signal;
    constructor(access: data_access_mod.DataAccess);
    registryEvent(): void;
    initSignal(): void;
    initCamera(): void;
    update(tick: number): void;
}
