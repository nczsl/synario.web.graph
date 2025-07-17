/**
 * Synario WebGPU Graphics Library
 * @file signal.ts
 * @description 信号和输入管理
 * @author Synario Team
 */
import * as types_mod from './types';

// --- MouseInfo ---
export class MouseInfo {
  static DATA_SIZE: number = 36; // 示例大小，确保与着色器端结构匹配

  x: number = 0;
  y: number = 0;
  prevX: number = 0;
  prevY: number = 0;
  buttons: number = 0; // bitmask for buttons
  gbufferId?: types_mod.Id;
  buffer?: ArrayBuffer;

  updateFromEvent(e: MouseEvent): void {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x = e.offsetX;
    this.y = e.offsetY;
    this.buttons = e.buttons;
    // 更新 buffer
    this.buffer = this.pack();
  }

  packInto(view: DataView, offset: number): void {
    view.setFloat32(offset + 0, this.x, true);
    view.setFloat32(offset + 4, this.y, true);
    view.setFloat32(offset + 8, this.prevX, true);
    view.setFloat32(offset + 12, this.prevY, true);
    view.setUint32(offset + 16, this.buttons, true);
  }

  pack(): ArrayBuffer {
    const buf = new ArrayBuffer(MouseInfo.DATA_SIZE);
    const view = new DataView(buf);
    this.packInto(view, 0);
    return buf;
  }
}

// --- KeyInfo ---
export class KeyInfo {
  static DATA_SIZE: number = 32; // 示例大小

  private keyStates = new Uint8Array(KeyInfo.DATA_SIZE);
  gbufferId?: types_mod.Id;
  buffer?: ArrayBuffer;

  updateFromEvent(e: KeyboardEvent): void {
    // 简单示例：只处理按下/松开
    this.setKeyState(e.keyCode, e.type === 'keydown');
    this.buffer = this.pack();
  }

  setKeyState(keyCode: number, isPressed: boolean): void {
    if (keyCode < KeyInfo.DATA_SIZE * 8) {
      const byteIndex = Math.floor(keyCode / 8);
      const bitIndex = keyCode % 8;
      if (isPressed) {
        this.keyStates[byteIndex] |= (1 << bitIndex);
      } else {
        this.keyStates[byteIndex] &= ~(1 << bitIndex);
      }
    }
  }

  packInto(view: DataView, offset: number): void {
    for (let i = 0; i < KeyInfo.DATA_SIZE; i++) {
      view.setUint8(offset + i, this.keyStates[i]);
    }
  }

  pack(): ArrayBuffer {
    const buf = new ArrayBuffer(KeyInfo.DATA_SIZE);
    const view = new DataView(buf);
    this.packInto(view, 0);
    return buf;
  }
}

// --- TickInfo ---
export class TickInfo {
  static DATA_SIZE: number = 8; // 示例大小

  frameCount: number = 0;
  deltaTime: number = 0.0;
  gbufferId?: types_mod.Id;
  buffer?: ArrayBuffer;

  nextFrame(tick: number): void {
    this.frameCount++;
    this.deltaTime = tick;
    this.buffer = this.pack();
  }

  packInto(view: DataView, offset: number): void {
    view.setUint32(offset + 0, this.frameCount, true);
    view.setFloat32(offset + 4, this.deltaTime, true);
  }

  pack(): ArrayBuffer {
    const buf = new ArrayBuffer(TickInfo.DATA_SIZE);
    const view = new DataView(buf);
    this.packInto(view, 0);
    return buf;
  }
}

// --- Signal ---
export class Signal {
  mouse: MouseInfo = new MouseInfo();
  key: KeyInfo = new KeyInfo();
  tick: TickInfo = new TickInfo();

  static MOUSE_OFFSET: number = 0;
  static KEY_OFFSET: number = Signal.MOUSE_OFFSET + MouseInfo.DATA_SIZE;
  static TICK_OFFSET: number = Signal.KEY_OFFSET + KeyInfo.DATA_SIZE;
  static COMBINED_BUFFER_SIZE: number = Signal.TICK_OFFSET + TickInfo.DATA_SIZE;

  gbufferId: types_mod.Id;
  bindGroupLayoutId_vs: types_mod.Id;
  bindGroupId_vs: types_mod.Id;
  bindGroupLayoutId_cs: types_mod.Id;
  bindGroupId_cs: types_mod.Id;

  constructor() {}

  getCombinedBufferData(): ArrayBuffer {
    const buffer = new ArrayBuffer(Signal.COMBINED_BUFFER_SIZE);
    const view = new DataView(buffer);

    this.mouse.packInto(view, Signal.MOUSE_OFFSET);
    this.key.packInto(view, Signal.KEY_OFFSET);
    this.tick.packInto(view, Signal.TICK_OFFSET);

    return buffer;
  }
}
