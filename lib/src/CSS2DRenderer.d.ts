import { Object3D, Vector2, Scene, Camera } from 'three';
interface CSS2DParameters {
    element?: HTMLElement;
}
interface CSS2DRendererSize {
    width: number;
    height: number;
}
declare class CSS2DObject extends Object3D {
    isCSS2DObject: boolean;
    element: HTMLElement;
    center: Vector2;
    constructor(element?: HTMLElement);
    copy(source: CSS2DObject, recursive?: boolean): this;
}
declare class CSS2DRenderer {
    domElement: HTMLElement;
    private _width;
    private _height;
    private _widthHalf;
    private _heightHalf;
    private cache;
    constructor(parameters?: CSS2DParameters);
    getSize(): CSS2DRendererSize;
    render(scene: Scene, camera: Camera): void;
    setSize(width: number, height: number): void;
    private hideObject;
    private renderObject;
    private getDistanceToSquared;
    private filterAndFlatten;
    private zOrder;
}
export { CSS2DObject, CSS2DRenderer, CSS2DParameters };
