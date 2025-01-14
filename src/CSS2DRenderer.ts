import {
    Matrix4,
    Object3D,
    Vector2,
    Vector3,
    Scene,
    Camera,
    Layers
  } from 'three';
  
  interface CSS2DParameters {
    element?: HTMLElement;
  }
  
  interface CSS2DRendererSize {
    width: number;
    height: number;
  }
  
  class CSS2DObject extends Object3D {
    isCSS2DObject: boolean;
    element: HTMLElement;
    center: Vector2;
  
    constructor(element: HTMLElement = document.createElement('div')) {
      super();
  
      this.isCSS2DObject = true;
      this.element = element;
  
      this.element.style.position = 'absolute';
      this.element.style.userSelect = 'none';
      this.element.setAttribute('draggable', 'false');
  
      this.center = new Vector2(0.5, 0.5); // (0, 0) is the lower left; (1, 1) is the top right
  
      this.addEventListener('removed', function(this: CSS2DObject) {
        this.traverse((object: Object3D) => {
          const obj = object as CSS2DObject;
          if (
            obj.isCSS2DObject &&
            obj.element instanceof HTMLElement &&
            obj.element.parentNode !== null
          ) {
            obj.element.remove();
          }
        });
      });
    }
  
    copy(source: CSS2DObject, recursive = true): this {
      Object3D.prototype.copy.call(this, source, recursive);
  
      this.element = source.element.cloneNode(true) as HTMLElement;
      this.center = source.center.clone();
  
      return this;
    }
  }
  
  // Private variables with type definitions
  const _vector = new Vector3();
  const _viewMatrix = new Matrix4();
  const _viewProjectionMatrix = new Matrix4();
  const _a = new Vector3();
  const _b = new Vector3();
  
  interface CacheObject {
    distanceToCameraSquared: number;
  }
  
  class CSS2DRenderer {
    domElement: HTMLElement;
    private _width: number;
    private _height: number;
    private _widthHalf: number;
    private _heightHalf: number;
    private cache: {
      objects: WeakMap<CSS2DObject, CacheObject>;
    };
  
    constructor(parameters: CSS2DParameters = {}) {
      const domElement = parameters.element !== undefined ? parameters.element : document.createElement('div');
      domElement.style.overflow = 'hidden';
      this.domElement = domElement;
  
      this.cache = {
        objects: new WeakMap()
      };
  
      // Initialize private variables
      this._width = 0;
      this._height = 0;
      this._widthHalf = 0;
      this._heightHalf = 0;
    }
  
    getSize(): CSS2DRendererSize {
      return {
        width: this._width,
        height: this._height
      };
    }
  
    render(scene: Scene, camera: Camera): void {
      scene.updateMatrixWorld(true);
      if (camera.parent === null) camera.updateMatrixWorld(true);
  
      _viewMatrix.copy(camera.matrixWorldInverse);
      _viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, _viewMatrix);
  
      this.renderObject(scene, scene, camera);
      this.zOrder(scene);
    }
  
    setSize(width: number, height: number): void {
      this._width = width;
      this._height = height;
      this._widthHalf = this._width / 2;
      this._heightHalf = this._height / 2;
  
      this.domElement.style.width = width + 'px';
      this.domElement.style.height = height + 'px';
    }
  
    private hideObject(object: Object3D): void {
      const obj = object as CSS2DObject;
      if (obj.isCSS2DObject) {
        obj.element.style.display = 'none';
      }
  
      for (let i = 0, l = object.children.length; i < l; i++) {
        this.hideObject(object.children[i]);
      }
    }
  
    private renderObject(object: Object3D, scene: Scene, camera: Camera): void {
      if (object.visible === false) {
        this.hideObject(object);
        return;
      }
  
      const obj = object as CSS2DObject;
      if (obj.isCSS2DObject) {
        _vector.setFromMatrixPosition(obj.matrixWorld);
        _vector.applyMatrix4(_viewProjectionMatrix);
  
        const visible = (_vector.z >= -1 && _vector.z <= 1) && 
                       (obj.layers.test(camera.layers) === true);
  
        const element = obj.element;
        element.style.display = visible ? '' : 'none';
  
        if (visible) {
          element.style.transform = 
            `translate(${-100 * obj.center.x}%,${-100 * obj.center.y}%)` +
            `translate(${_vector.x * this._widthHalf + this._widthHalf}px,${-_vector.y * this._heightHalf + this._heightHalf}px)`;
  
          if (element.parentNode !== this.domElement) {
            this.domElement.appendChild(element);
          }
        }
  
        const objectData = {
          distanceToCameraSquared: this.getDistanceToSquared(camera, obj)
        };
  
        this.cache.objects.set(obj, objectData);
      }
  
      for (let i = 0, l = object.children.length; i < l; i++) {
        this.renderObject(object.children[i], scene, camera);
      }
    }
  
    private getDistanceToSquared(object1: Object3D, object2: Object3D): number {
      _a.setFromMatrixPosition(object1.matrixWorld);
      _b.setFromMatrixPosition(object2.matrixWorld);
      return _a.distanceToSquared(_b);
    }
  
    private filterAndFlatten(scene: Scene): CSS2DObject[] {
      const result: CSS2DObject[] = [];
  
      scene.traverseVisible((object: Object3D) => {
        const obj = object as CSS2DObject;
        if (obj.isCSS2DObject) {
          result.push(obj);
        }
      });
  
      return result;
    }
  
    private zOrder(scene: Scene): void {
      const sorted = this.filterAndFlatten(scene).sort((a, b) => {
        if (a.renderOrder !== b.renderOrder) {
          return b.renderOrder - a.renderOrder;
        }
  
        const distanceA = this.cache.objects.get(a)!.distanceToCameraSquared;
        const distanceB = this.cache.objects.get(b)!.distanceToCameraSquared;
  
        return distanceA - distanceB;
      });
  
      const zMax = sorted.length;
  
      for (let i = 0, l = sorted.length; i < l; i++) {
        sorted[i].element.style.zIndex = (zMax - i).toString();
      }
    }
  }
  
  export { CSS2DObject, CSS2DRenderer, CSS2DParameters };