define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CSS2DObject extends three_1.Object3D {
        constructor(element = document.createElement('div')) {
            super();
            this.isCSS2DObject = true;
            this.element = element;
            this.element.style.position = 'absolute';
            this.element.style.userSelect = 'none';
            this.element.setAttribute('draggable', 'false');
            this.center = new three_1.Vector2(0.5, 0.5); // (0, 0) is the lower left; (1, 1) is the top right
            this.addEventListener('removed', function () {
                this.traverse((object) => {
                    const obj = object;
                    if (obj.isCSS2DObject &&
                        obj.element instanceof HTMLElement &&
                        obj.element.parentNode !== null) {
                        obj.element.remove();
                    }
                });
            });
        }
        copy(source, recursive = true) {
            three_1.Object3D.prototype.copy.call(this, source, recursive);
            this.element = source.element.cloneNode(true);
            this.center = source.center.clone();
            return this;
        }
    }
    exports.CSS2DObject = CSS2DObject;
    // Private variables with type definitions
    const _vector = new three_1.Vector3();
    const _viewMatrix = new three_1.Matrix4();
    const _viewProjectionMatrix = new three_1.Matrix4();
    const _a = new three_1.Vector3();
    const _b = new three_1.Vector3();
    class CSS2DRenderer {
        constructor(parameters = {}) {
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
        getSize() {
            return {
                width: this._width,
                height: this._height
            };
        }
        render(scene, camera) {
            scene.updateMatrixWorld(true);
            if (camera.parent === null)
                camera.updateMatrixWorld(true);
            _viewMatrix.copy(camera.matrixWorldInverse);
            _viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, _viewMatrix);
            this.renderObject(scene, scene, camera);
            this.zOrder(scene);
        }
        setSize(width, height) {
            this._width = width;
            this._height = height;
            this._widthHalf = this._width / 2;
            this._heightHalf = this._height / 2;
            this.domElement.style.width = width + 'px';
            this.domElement.style.height = height + 'px';
        }
        hideObject(object) {
            const obj = object;
            if (obj.isCSS2DObject) {
                obj.element.style.display = 'none';
            }
            for (let i = 0, l = object.children.length; i < l; i++) {
                this.hideObject(object.children[i]);
            }
        }
        renderObject(object, scene, camera) {
            if (object.visible === false) {
                this.hideObject(object);
                return;
            }
            const obj = object;
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
        getDistanceToSquared(object1, object2) {
            _a.setFromMatrixPosition(object1.matrixWorld);
            _b.setFromMatrixPosition(object2.matrixWorld);
            return _a.distanceToSquared(_b);
        }
        filterAndFlatten(scene) {
            const result = [];
            scene.traverseVisible((object) => {
                const obj = object;
                if (obj.isCSS2DObject) {
                    result.push(obj);
                }
            });
            return result;
        }
        zOrder(scene) {
            const sorted = this.filterAndFlatten(scene).sort((a, b) => {
                if (a.renderOrder !== b.renderOrder) {
                    return b.renderOrder - a.renderOrder;
                }
                const distanceA = this.cache.objects.get(a).distanceToCameraSquared;
                const distanceB = this.cache.objects.get(b).distanceToCameraSquared;
                return distanceA - distanceB;
            });
            const zMax = sorted.length;
            for (let i = 0, l = sorted.length; i < l; i++) {
                sorted[i].element.style.zIndex = (zMax - i).toString();
            }
        }
    }
    exports.CSS2DRenderer = CSS2DRenderer;
});
//# sourceMappingURL=CSS2DRenderer copy.js.map