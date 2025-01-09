var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "three", "./MapMesh", "./interfaces", "./Grid", "./DefaultTileSelector", "./DefaultMapViewController", "./coords", "./ChunkedLazyMapMesh"], function (require, exports, three_1, MapMesh_1, interfaces_1, Grid_1, DefaultTileSelector_1, DefaultMapViewController_1, coords_1, ChunkedLazyMapMesh_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    MapMesh_1 = __importDefault(MapMesh_1);
    Grid_1 = __importDefault(Grid_1);
    DefaultTileSelector_1 = __importDefault(DefaultTileSelector_1);
    DefaultMapViewController_1 = __importDefault(DefaultMapViewController_1);
    ChunkedLazyMapMesh_1 = __importDefault(ChunkedLazyMapMesh_1);
    class MapView {
        constructor(canvasElementQuery = "canvas") {
            this._scrollDir = new three_1.Vector3(0, 0, 0);
            this._lastTimestamp = Date.now();
            this._zoom = 25;
            this._tileGrid = new Grid_1.default(0, 0);
            this._tileSelector = DefaultTileSelector_1.default;
            this._controller = new DefaultMapViewController_1.default();
            this._units_models = new three_1.Group();
            this._units = new Map();
            this._onAnimate = (dtS) => { };
            this.scrollSpeed = 10;
            this.animate = (timestamp) => {
                const dtS = (timestamp - this._lastTimestamp) / 1000.0;
                const camera = this._camera;
                const zoomRelative = camera.position.z / MapView.DEFAULT_ZOOM;
                const scroll = this._scrollDir.clone().normalize().multiplyScalar(this.scrollSpeed * zoomRelative * dtS);
                camera.position.add(scroll);
                if (this._chunkedMesh) {
                    this._chunkedMesh.updateVisibility(camera);
                }
                this._onAnimate(dtS);
                this._renderer.render(this._scene, camera);
                requestAnimationFrame(this.animate);
                this._lastTimestamp = timestamp;
            };
            const canvas = this._canvas = document.querySelector(canvasElementQuery);
            const camera = this._camera = new three_1.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 2, 10000);
            const scene = this._scene = new three_1.Scene();
            const renderer = this._renderer = new three_1.WebGLRenderer({
                canvas: canvas,
                devicePixelRatio: window.devicePixelRatio
            });
            if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
                throw new Error("Your browser is not supported (missing extension ANGLE_instanced_arrays)");
            }
            renderer.setClearColor(0x6495ED);
            renderer.setSize(window.innerWidth, window.innerHeight);
            window.addEventListener('resize', (e) => this.onWindowResize(e), false);
            // setup camera
            camera.rotation.x = Math.PI / 4.5;
            this.setZoom(MapView.DEFAULT_ZOOM);
            this.focus(0, 0);
            // tile selector
            this._tileSelector.position.setZ(0.01);
            this._scene.add(this._tileSelector);
            this._tileSelector.visible = true;
            // units
            this._scene.add(this._units_models);
            // start rendering loop
            this.animate(0);
            this._controller.init(this, canvas);
        }
        get controller() {
            return this._controller;
        }
        get canvas() {
            return this._canvas;
        }
        get zoom() {
            return this._zoom;
        }
        getZoom() {
            return this._zoom;
        }
        set zoom(value) {
            this.setZoom(value);
        }
        get selectedTile() {
            return this._selectedTile;
        }
        getTileGrid() {
            return this._tileGrid;
        }
        get mapMesh() {
            return this._mapMesh;
        }
        /**
         * Sets up the camera with the given Z position (height) and so that the view center (the point the camera is pointed at) doesn't change.
         */
        setZoom(z) {
            this._camera.updateMatrixWorld(false);
            // position the camera is currently centered at
            const lookAt = this.getViewCenter();
            // move camera along the Z axis to adjust the view distance
            this._zoom = z;
            this._camera.position.z = z;
            this._camera.updateMatrixWorld(true);
            if (lookAt != null) {
                // reposition camera so that the view center stays the same
                this._camera.position.copy(this.getCameraFocusPositionWorld(lookAt));
            }
            return this;
        }
        get scrollDir() {
            return this._scrollDir;
        }
        set onTileSelected(callback) {
            this._onTileSelected = callback;
        }
        set onLoaded(callback) {
            console.log("yo");
            this._onLoaded = callback;
        }
        set onAnimate(callback) {
            if (!callback) {
                throw new Error("Invalid onAnimate callback");
            }
            this._onAnimate = callback;
        }
        setOnAnimateCallback(callback) {
            this.onAnimate = callback;
        }
        load(tiles, options) {
            this._tileGrid = tiles;
            this._selectedTile = this._tileGrid.get(0, 0);
            if ((tiles.width * tiles.height) < Math.pow(512, 2)) {
                const mesh = this._mapMesh = new MapMesh_1.default(tiles.toArray(), options); //, tiles)
                this._scene.add(this._mapMesh);
                mesh.loaded.then(() => {
                    console.log("AW");
                    this._onLoaded();
                });
                console.info("using single MapMesh for " + (tiles.width * tiles.height) + " tiles");
            }
            else {
                const mesh = this._mapMesh = this._chunkedMesh = new ChunkedLazyMapMesh_1.default(tiles, options);
                this._scene.add(this._mapMesh);
                mesh.loaded.then(() => {
                    if (this._onLoaded)
                        this._onLoaded();
                });
                console.info("using ChunkedLazyMapMesh with " + mesh.numChunks + " chunks for " + (tiles.width * tiles.height) + " tiles");
            }
        }
        updateTiles(tiles) {
            this._mapMesh.updateTiles(tiles);
        }
        addUnitToTile(tile) {
            // Bad Cases
            if (tile.unit !== undefined) {
                console.log("cannot add unit; already occupied");
                return;
            }
            if (interfaces_1.isMountain(tile.height)) {
                console.log("cannot place on mountain");
                return;
            }
            if (interfaces_1.isWater(tile.height)) {
                console.log("cannot place in water");
                return;
            }
            const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(1, 1, 1), new three_1.MeshBasicMaterial({
                color: 0xf00000,
            }));
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            unitModel.position.set(worldPos.x, worldPos.y, 0.2);
            const owner = 1;
            const warrior = {
                id: `${owner}_${unitModel.uuid}`,
                type: "warrior",
                health: 100,
                movement: 2,
                owner: "player-1",
                model: unitModel,
            };
            this._units.set(warrior.id, warrior);
            tile.unit = warrior;
            console.log(this._units);
            this._units_models.add(unitModel);
        }
        getTile(q, r) {
            return this._mapMesh.getTile(q, r);
        }
        onWindowResize(event) {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        }
        //----- MapViewControls -----
        setScrollDir(x, y) {
            this._scrollDir.setX(x);
            this._scrollDir.setY(y);
            this._scrollDir.normalize();
        }
        getCamera() {
            return this._camera;
        }
        /**
         * Returns the world space position on the Z plane (the plane with the tiles) at the center of the view.
         */
        getViewCenter() {
            return coords_1.mouseToWorld({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, this._camera);
        }
        getCameraFocusPosition(pos) {
            return this.getCameraFocusPositionWorld(coords_1.qrToWorld(pos.q, pos.r));
        }
        getCameraFocusPositionWorld(pos) {
            const currentPos = this._camera.position.clone();
            const viewCenter = this.getViewCenter();
            const viewOffset = currentPos.sub(viewCenter);
            return pos.add(viewOffset);
        }
        focus(q, r) {
            this._camera.position.copy(this.getCameraFocusPosition({ q, r }));
        }
        focusWorldPos(v) {
            this._camera.position.copy(this.getCameraFocusPositionWorld(v));
        }
        selectTile(tile) {
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            this._tileSelector.position.set(worldPos.x, worldPos.y, 0.1);
            this._selectedTile = tile;
            if (this._onTileSelected) {
                this._onTileSelected(tile);
            }
        }
        actionTile(tile) {
            // Bad Cases
            if (tile.unit !== undefined) {
                console.log("cannot add unit; already occupied");
                return;
            }
            const selectedUnit = this.selectedTile.unit;
            if (selectedUnit === undefined) {
                console.log("no selected unit");
                return;
            }
            if (interfaces_1.isMountain(tile.height)) {
                console.log("cannot place on mountain");
                return;
            }
            if (interfaces_1.isWater(tile.height)) {
                console.log("cannot place in water");
                return;
            }
            selectedUnit.movementOrders = { q: tile.q, r: tile.r };
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            animateToPosition(selectedUnit.model, worldPos.x, worldPos.y, 0.2, easeOutQuad, () => {
                console.log("Reached hex (2, 2). Movement sequence complete.");
            });
            tile.unit = selectedUnit;
            this.selectedTile.unit = undefined;
            // make this the new selcted tile
            this.selectTile(tile);
        }
        pickTile(worldPos) {
            var x = worldPos.x;
            var y = worldPos.y;
            // convert from world coordinates into fractal axial coordinates
            var q = (1.0 / 3 * Math.sqrt(3) * x - 1.0 / 3 * y);
            var r = 2.0 / 3 * y;
            // now need to round the fractal axial coords into integer axial coords for the grid lookup
            var cubePos = coords_1.axialToCube(q, r);
            var roundedCubePos = coords_1.roundToHex(cubePos);
            var roundedAxialPos = coords_1.cubeToAxial(roundedCubePos.x, roundedCubePos.y, roundedCubePos.z);
            // just look up the coords in our grid
            return this._tileGrid.get(roundedAxialPos.q, roundedAxialPos.r);
        }
    }
    MapView.DEFAULT_ZOOM = 25;
    exports.default = MapView;
    // Tween Function
    function animateToPosition(object, targetX, targetY, duration, easing, onComplete // Callback function to run after movement
    ) {
        const startX = object.position.x;
        const startY = object.position.y;
        const startTime = performance.now();
        function animate() {
            const currentTime = performance.now();
            const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
            const t = Math.min(elapsed / duration, 1); // Normalize time to range [0, 1]
            const easedT = easing(t);
            // Interpolate x and y positions
            object.position.x = startX + (targetX - startX) * easedT;
            object.position.y = startY + (targetY - startY) * easedT;
            // Continue the animation if not complete
            if (t < 1) {
                requestAnimationFrame(animate);
            }
            else {
                if (onComplete) {
                    onComplete();
                }
            }
        }
        animate();
    }
    function easeOutQuad(t) {
        return t * (2 - t);
    }
});
//# sourceMappingURL=MapView.js.map