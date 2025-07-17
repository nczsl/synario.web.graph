import * as types_mod from './types';
export declare class MouseInfo {
    static DATA_SIZE: number;
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    buttons: number;
    gbufferId?: types_mod.Id;
    buffer?: ArrayBuffer;
    updateFromEvent(e: MouseEvent): void;
    packInto(view: DataView, offset: number): void;
    pack(): ArrayBuffer;
}
export declare class KeyInfo {
    static DATA_SIZE: number;
    private keyStates;
    gbufferId?: types_mod.Id;
    buffer?: ArrayBuffer;
    updateFromEvent(e: KeyboardEvent): void;
    setKeyState(keyCode: number, isPressed: boolean): void;
    packInto(view: DataView, offset: number): void;
    pack(): ArrayBuffer;
}
export declare class TickInfo {
    static DATA_SIZE: number;
    frameCount: number;
    deltaTime: number;
    gbufferId?: types_mod.Id;
    buffer?: ArrayBuffer;
    nextFrame(tick: number): void;
    packInto(view: DataView, offset: number): void;
    pack(): ArrayBuffer;
}
export declare class Signal {
    mouse: MouseInfo;
    key: KeyInfo;
    tick: TickInfo;
    static MOUSE_OFFSET: number;
    static KEY_OFFSET: number;
    static TICK_OFFSET: number;
    static COMBINED_BUFFER_SIZE: number;
    gbufferId: types_mod.Id;
    bindGroupLayoutId_vs: types_mod.Id;
    bindGroupId_vs: types_mod.Id;
    bindGroupLayoutId_cs: types_mod.Id;
    bindGroupId_cs: types_mod.Id;
    constructor();
    getCombinedBufferData(): ArrayBuffer;
}
