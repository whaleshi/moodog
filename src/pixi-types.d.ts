declare module 'pixi.js' {
  namespace PIXI {
    class Texture {
      static EMPTY: Texture;
      static from(source: any): Texture;
      constructor(baseTexture?: BaseTexture);
    }
    class BaseTexture {
      constructor(source?: any);
    }
    class Sprite {
      texture: Texture;
      x: number;
      y: number;
      width: number;
      height: number;
      alpha: number;
      visible: boolean;
      anchor: any;
      scale: any;
      angle: number;
    }
    class Container {
      children: any[];
      x: number;
      y: number;
      width: number;
      height: number;
      alpha: number;
      visible: boolean;
      position: any;
    }
    class Application {
      constructor(options?: any);
      stage: Container;
      renderer: any;
      ticker: any;
    }
    class Point {
      x: number;
      y: number;
      constructor(x?: number, y?: number);
      set(x: number, y: number): void;
    }
    class ObservablePoint {
      x: number;
      y: number;
      constructor(cb?: Function, scope?: any, x?: number, y?: number);
      set(x: number, y: number): void;
      copyFrom(point: any): void;
    }
    class Ticker {
      start(): void;
      stop(): void;
      add(fn: Function, context?: any): void;
      remove(fn: Function, context?: any): void;
    }
    const ticker: {
      shared: Ticker;
    };
  }
  export = PIXI;
}