import * as types_mod from './types';
export class Signal {
    mouse;
    key;
    tick;
    bindgrouplayoutId_vs = -1;
    bindgroupId_vs = -1;
    bindgrouplayoutId_cs = -1;
    bindgroupId_cs = -1;
    constructor() {
        this.mouse = new MouseInfo();
        this.key = new KeyInfo();
        this.tick = new TickInfo();
    }
}
export class MouseInfo {
    static FIELDS = 15;
    static BYTES_PER_FLOAT32 = 4;
    static BUFFER_SIZE = 256;
    buffer = new ArrayBuffer(MouseInfo.BUFFER_SIZE);
    floatView = new Float32Array(this.buffer);
    gbufferId = -1;
    static IDX = {
        screenX: 0,
        screenY: 1,
        clientX: 2,
        clientY: 3,
        movementX: 4,
        movementY: 5,
        pageX: 6,
        pageY: 7,
        offsetX: 8,
        offsetY: 9,
        x: 10,
        y: 11,
        button: 12,
        buttons: 13,
        timestamp: 14
    };
    get screenX() { return this.floatView[MouseInfo.IDX.screenX]; }
    set screenX(v) { this.floatView[MouseInfo.IDX.screenX] = v; }
    get screenY() { return this.floatView[MouseInfo.IDX.screenY]; }
    set screenY(v) { this.floatView[MouseInfo.IDX.screenY] = v; }
    get clientX() { return this.floatView[MouseInfo.IDX.clientX]; }
    set clientX(v) { this.floatView[MouseInfo.IDX.clientX] = v; }
    get clientY() { return this.floatView[MouseInfo.IDX.clientY]; }
    set clientY(v) { this.floatView[MouseInfo.IDX.clientY] = v; }
    get movementX() { return this.floatView[MouseInfo.IDX.movementX]; }
    set movementX(v) { this.floatView[MouseInfo.IDX.movementX] = v; }
    get movementY() { return this.floatView[MouseInfo.IDX.movementY]; }
    set movementY(v) { this.floatView[MouseInfo.IDX.movementY] = v; }
    get pageX() { return this.floatView[MouseInfo.IDX.pageX]; }
    set pageX(v) { this.floatView[MouseInfo.IDX.pageX] = v; }
    get pageY() { return this.floatView[MouseInfo.IDX.pageY]; }
    set pageY(v) { this.floatView[MouseInfo.IDX.pageY] = v; }
    get offsetX() { return this.floatView[MouseInfo.IDX.offsetX]; }
    set offsetX(v) { this.floatView[MouseInfo.IDX.offsetX] = v; }
    get offsetY() { return this.floatView[MouseInfo.IDX.offsetY]; }
    set offsetY(v) { this.floatView[MouseInfo.IDX.offsetY] = v; }
    get x() { return this.floatView[MouseInfo.IDX.x]; }
    set x(v) { this.floatView[MouseInfo.IDX.x] = v; }
    get y() { return this.floatView[MouseInfo.IDX.y]; }
    set y(v) { this.floatView[MouseInfo.IDX.y] = v; }
    get button() { return this.floatView[MouseInfo.IDX.button]; }
    set button(v) { this.floatView[MouseInfo.IDX.button] = v; }
    get buttons() { return this.floatView[MouseInfo.IDX.buttons]; }
    set buttons(v) { this.floatView[MouseInfo.IDX.buttons] = v; }
    get timestamp() { return this.floatView[MouseInfo.IDX.timestamp]; }
    set timestamp(v) { this.floatView[MouseInfo.IDX.timestamp] = v; }
    updateFromEvent(event) {
        this.screenX = event.screenX;
        this.screenY = event.screenY;
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.movementX = event.movementX;
        this.movementY = event.movementY;
        this.pageX = event.pageX;
        this.pageY = event.pageY;
        this.offsetX = event.offsetX ?? 0;
        this.offsetY = event.offsetY ?? 0;
        this.x = event.x;
        this.y = event.y;
        this.button = event.button;
        this.buttons = event.buttons;
        this.timestamp = performance.now();
    }
    reset() {
        this.floatView.fill(0);
    }
}
export class KeyInfo {
    static FLOAT_FIELDS = 2;
    static BOOL_FIELDS = 6;
    static BYTES_PER_FLOAT64 = 8;
    static BYTES_PER_BOOL = 1;
    static BUFFER_SIZE = 256;
    buffer = new ArrayBuffer(KeyInfo.BUFFER_SIZE);
    floatView = new Float64Array(this.buffer, 0, KeyInfo.FLOAT_FIELDS);
    boolView = new Uint8Array(this.buffer, KeyInfo.FLOAT_FIELDS * KeyInfo.BYTES_PER_FLOAT64, KeyInfo.BOOL_FIELDS);
    code = '';
    key = '';
    static IDX = {
        location: 0,
        timestamp: 1,
        repeat: 0,
        isComposing: 1,
        ctrlKey: 2,
        shiftKey: 3,
        altKey: 4,
        metaKey: 5
    };
    gbufferId = -1;
    get location() { return this.floatView[KeyInfo.IDX.location]; }
    set location(v) { this.floatView[KeyInfo.IDX.location] = v; }
    get timestamp() { return this.floatView[KeyInfo.IDX.timestamp]; }
    set timestamp(v) { this.floatView[KeyInfo.IDX.timestamp] = v; }
    get repeat() { return !!this.boolView[KeyInfo.IDX.repeat]; }
    set repeat(v) { this.boolView[KeyInfo.IDX.repeat] = v ? 1 : 0; }
    get isComposing() { return !!this.boolView[KeyInfo.IDX.isComposing]; }
    set isComposing(v) { this.boolView[KeyInfo.IDX.isComposing] = v ? 1 : 0; }
    get ctrlKey() { return !!this.boolView[KeyInfo.IDX.ctrlKey]; }
    set ctrlKey(v) { this.boolView[KeyInfo.IDX.ctrlKey] = v ? 1 : 0; }
    get shiftKey() { return !!this.boolView[KeyInfo.IDX.shiftKey]; }
    set shiftKey(v) { this.boolView[KeyInfo.IDX.shiftKey] = v ? 1 : 0; }
    get altKey() { return !!this.boolView[KeyInfo.IDX.altKey]; }
    set altKey(v) { this.boolView[KeyInfo.IDX.altKey] = v ? 1 : 0; }
    get metaKey() { return !!this.boolView[KeyInfo.IDX.metaKey]; }
    set metaKey(v) { this.boolView[KeyInfo.IDX.metaKey] = v ? 1 : 0; }
    updateFromEvent(event) {
        this.code = event.code;
        this.key = event.key;
        this.location = event.location;
        this.repeat = event.repeat;
        this.isComposing = event.isComposing;
        this.ctrlKey = event.ctrlKey;
        this.shiftKey = event.shiftKey;
        this.altKey = event.altKey;
        this.metaKey = event.metaKey;
        this.timestamp = performance.now();
    }
    reset() {
        this.code = '';
        this.key = '';
        this.floatView.fill(0);
        this.boolView.fill(0);
    }
}
export class TickInfo {
    static UINT_FIELDS = 2;
    static FLOAT_FIELDS = 6;
    static BYTES_PER_UINT32 = 4;
    static BYTES_PER_FLOAT32 = 4;
    static BUFFER_SIZE = 256;
    buffer = new ArrayBuffer(TickInfo.BUFFER_SIZE);
    uintView = new Uint32Array(this.buffer, 0, TickInfo.UINT_FIELDS);
    floatView = new Float32Array(this.buffer, TickInfo.UINT_FIELDS * TickInfo.BYTES_PER_UINT32, TickInfo.FLOAT_FIELDS);
    gbufferId = -1;
    static IDX = {
        tick: 0,
        _pad0: 1,
        time: 0,
        deltaTime: 1,
        frameStart: 2,
        lastFrameStart: 3,
        fps: 4,
        _pad1: 5
    };
    get tick() { return this.uintView[TickInfo.IDX.tick]; }
    set tick(v) { this.uintView[TickInfo.IDX.tick] = v >>> 0; }
    get time() { return this.floatView[TickInfo.IDX.time]; }
    set time(v) { this.floatView[TickInfo.IDX.time] = v; }
    get deltaTime() { return this.floatView[TickInfo.IDX.deltaTime]; }
    set deltaTime(v) { this.floatView[TickInfo.IDX.deltaTime] = v; }
    get frameStart() { return this.floatView[TickInfo.IDX.frameStart]; }
    set frameStart(v) { this.floatView[TickInfo.IDX.frameStart] = v; }
    get lastFrameStart() { return this.floatView[TickInfo.IDX.lastFrameStart]; }
    set lastFrameStart(v) { this.floatView[TickInfo.IDX.lastFrameStart] = v; }
    get fps() { return this.floatView[TickInfo.IDX.fps]; }
    set fps(v) { this.floatView[TickInfo.IDX.fps] = v; }
    nextFrame(tick) {
        this.tick = tick;
        this.lastFrameStart = this.frameStart;
        this.frameStart = performance.now() / 1000;
        this.deltaTime = this.frameStart - this.lastFrameStart;
        this.time += this.deltaTime;
    }
    reset() {
        this.uintView[0] = 0;
        this.uintView[1] = 0;
        this.floatView.fill(0);
    }
}
