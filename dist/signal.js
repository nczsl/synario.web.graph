import * as types_mod from './types';
export class MouseInfo {
    static DATA_SIZE = 36;
    x = 0;
    y = 0;
    prevX = 0;
    prevY = 0;
    buttons = 0;
    gbufferId;
    buffer;
    updateFromEvent(e) {
        this.prevX = this.x;
        this.prevY = this.y;
        this.x = e.offsetX;
        this.y = e.offsetY;
        this.buttons = e.buttons;
        this.buffer = this.pack();
    }
    packInto(view, offset) {
        view.setFloat32(offset + 0, this.x, true);
        view.setFloat32(offset + 4, this.y, true);
        view.setFloat32(offset + 8, this.prevX, true);
        view.setFloat32(offset + 12, this.prevY, true);
        view.setUint32(offset + 16, this.buttons, true);
    }
    pack() {
        const buf = new ArrayBuffer(MouseInfo.DATA_SIZE);
        const view = new DataView(buf);
        this.packInto(view, 0);
        return buf;
    }
}
export class KeyInfo {
    static DATA_SIZE = 32;
    keyStates = new Uint8Array(KeyInfo.DATA_SIZE);
    gbufferId;
    buffer;
    updateFromEvent(e) {
        this.setKeyState(e.keyCode, e.type === 'keydown');
        this.buffer = this.pack();
    }
    setKeyState(keyCode, isPressed) {
        if (keyCode < KeyInfo.DATA_SIZE * 8) {
            const byteIndex = Math.floor(keyCode / 8);
            const bitIndex = keyCode % 8;
            if (isPressed) {
                this.keyStates[byteIndex] |= (1 << bitIndex);
            }
            else {
                this.keyStates[byteIndex] &= ~(1 << bitIndex);
            }
        }
    }
    packInto(view, offset) {
        for (let i = 0; i < KeyInfo.DATA_SIZE; i++) {
            view.setUint8(offset + i, this.keyStates[i]);
        }
    }
    pack() {
        const buf = new ArrayBuffer(KeyInfo.DATA_SIZE);
        const view = new DataView(buf);
        this.packInto(view, 0);
        return buf;
    }
}
export class TickInfo {
    static DATA_SIZE = 8;
    frameCount = 0;
    deltaTime = 0.0;
    gbufferId;
    buffer;
    nextFrame(tick) {
        this.frameCount++;
        this.deltaTime = tick;
        this.buffer = this.pack();
    }
    packInto(view, offset) {
        view.setUint32(offset + 0, this.frameCount, true);
        view.setFloat32(offset + 4, this.deltaTime, true);
    }
    pack() {
        const buf = new ArrayBuffer(TickInfo.DATA_SIZE);
        const view = new DataView(buf);
        this.packInto(view, 0);
        return buf;
    }
}
export class Signal {
    mouse = new MouseInfo();
    key = new KeyInfo();
    tick = new TickInfo();
    static MOUSE_OFFSET = 0;
    static KEY_OFFSET = Signal.MOUSE_OFFSET + MouseInfo.DATA_SIZE;
    static TICK_OFFSET = Signal.KEY_OFFSET + KeyInfo.DATA_SIZE;
    static COMBINED_BUFFER_SIZE = Signal.TICK_OFFSET + TickInfo.DATA_SIZE;
    gbufferId;
    bindGroupLayoutId_vs;
    bindGroupId_vs;
    bindGroupLayoutId_cs;
    bindGroupId_cs;
    constructor() { }
    getCombinedBufferData() {
        const buffer = new ArrayBuffer(Signal.COMBINED_BUFFER_SIZE);
        const view = new DataView(buffer);
        this.mouse.packInto(view, Signal.MOUSE_OFFSET);
        this.key.packInto(view, Signal.KEY_OFFSET);
        this.tick.packInto(view, Signal.TICK_OFFSET);
        return buffer;
    }
}
