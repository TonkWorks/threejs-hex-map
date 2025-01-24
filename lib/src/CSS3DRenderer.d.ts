import { Object3D, Camera, Scene } from 'three';
interface CSS3DParameters {
    element?: HTMLElement;
}
interface CSS3DRendererSize {
    width: number;
    height: number;
}
declare class CSS3DObject extends Object3D {
    element: HTMLElement;
    isCSS3DObject: boolean;
    constructor(element?: HTMLElement);
    copy(source: CSS3DObject, recursive?: boolean): this;
}
declare class CSS3DSprite extends CSS3DObject {
    isCSS3DSprite: boolean;
    rotation2D: number;
    constructor(element: HTMLElement);
    copy(source: CSS3DSprite, recursive?: boolean): this;
}
declare class CSS3DRenderer {
    domElement: HTMLElement;
    private readonly viewElement;
    private readonly cameraElement;
    private width;
    private height;
    private widthHalf;
    private heightHalf;
    private cache;
    constructor(parameters?: CSS3DParameters);
    getSize(): CSS3DRendererSize;
    setSize(width: number, height: number): void;
    render(scene: Scene, camera: Camera): void;
    private epsilon;
    private getCameraCSSMatrix;
    private getObjectCSSMatrix;
    private formatMatrix3d;
    private hideObject;
    private renderObject;
}
export { CSS3DObject, CSS3DSprite, CSS3DRenderer };
