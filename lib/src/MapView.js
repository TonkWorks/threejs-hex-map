var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "three", "./MapMesh", "./interfaces", "./util", "./Grid", "./DefaultTileSelector", "./Units", "./DefaultMapViewController", "./coords", "./ChunkedLazyMapMesh", "./GameState", "./CSS2DRenderer", "./AI"], function (require, exports, three_1, MapMesh_1, interfaces_1, util_1, Grid_1, DefaultTileSelector_1, Units_1, DefaultMapViewController_1, coords_1, ChunkedLazyMapMesh_1, GameState_1, CSS2DRenderer_1, AI_1) {
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
            this._gameState = GameState_1.InitGameState();
            this._onAnimate = (dtS) => { };
            this.unitInfoPanel = null;
            this.unitInfoCache = "";
            this.gameStatePanel = null;
            this.menuPanel = null;
            this.actionPanel = null;
            this.resourcePanel = null;
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
                this._labelRenderer.render(this._scene, camera);
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
            const labelRenderer = new CSS2DRenderer_1.CSS2DRenderer();
            labelRenderer.setSize(window.innerWidth, window.innerHeight);
            labelRenderer.domElement.style.position = 'absolute';
            labelRenderer.domElement.style.top = '0px';
            labelRenderer.domElement.style.pointerEvents = 'none';
            console.log(labelRenderer);
            this._labelRenderer = labelRenderer;
            document.body.appendChild(labelRenderer.domElement);
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
        addUnitToMap(unit, tile) {
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
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            unit.model.position.set(worldPos.x, worldPos.y, 0.2);
            let player = this.getPlayer(unit.owner);
            player.units[unit.id] = unit;
            tile.unit = unit;
            this._units_models.add(unit.model);
            this.updateResourcePanel();
            this.updateGameStatePanel();
        }
        addImprovementToMap(improvement, tile) {
            // Bad Cases
            if (tile.improvement !== undefined) {
                console.log("cannot add improvement; already occupied");
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
            let player = this.getPlayer(improvement.owner);
            player.improvements[improvement.id] = improvement;
            const worldPos = coords_1.qrToWorld(tile.q, tile.r);
            improvement.model.position.set(worldPos.x, worldPos.y, 0.05);
            tile.improvement = improvement;
            this._units_models.add(improvement.model);
            this.updateResourcePanel();
            this.updateGameStatePanel();
        }
        initGameSetup() {
            // set up players initial locations
            // for (const [key, player] of Object.entries(this._gameState.players)) {
            //     const startTile = this.getRandomTile(true);
            //     const improvement = CreateCity(player)
            //     this.addImprovementToMap(improvement, startTile);
            // }
        }
        getPlayer(name) {
            return this._gameState.players[name];
        }
        getTile(q, r) {
            return this._mapMesh.getTile(q, r);
        }
        onWindowResize(event) {
            this._camera.aspect = window.innerWidth / window.innerHeight;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(window.innerWidth, window.innerHeight);
            this._labelRenderer.setSize(window.innerWidth, window.innerHeight);
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
            this.showUnitInfoForTile(tile);
            if (this._onTileSelected) {
                this._onTileSelected(tile);
            }
        }
        actionTile(tile) {
            // Bad Cases
            if (this.selectedTile.q === tile.q && this.selectedTile.r === tile.r) {
                return;
            }
            let selectedUnit = this.selectedTile.unit;
            if (selectedUnit === undefined) {
                console.log("no selected unit");
                return;
            }
            if (!tile.clouds && (interfaces_1.isMountain(tile.height) || interfaces_1.isWater(tile.height))) {
                console.log("cannot move to mountain/water");
                return;
            }
            this.moveUnit(this.selectedTile, tile);
        }
        moveUnit(currentTile, targetTile) {
            if (currentTile === targetTile) {
                return;
            }
            if (currentTile.locked || targetTile.locked) {
                return;
            }
            const nextMovementTile = this.getNextMovementTile(currentTile, targetTile);
            // check for battling a unit
            if (nextMovementTile.unit !== undefined &&
                currentTile.unit !== undefined &&
                currentTile.unit.owner !== nextMovementTile.unit.owner) {
                console.log("battle");
                this.battle(currentTile, nextMovementTile);
                return;
            }
            // check for battling a city
            if (nextMovementTile.improvement !== undefined &&
                currentTile.unit.owner !== nextMovementTile.improvement.owner) {
                console.log("urban combat");
                this.battleCity(currentTile, nextMovementTile);
                return;
            }
            nextMovementTile.unit = currentTile.unit;
            currentTile.unit = undefined;
            if (nextMovementTile.unit === undefined) {
                return;
            }
            // keep selected on this unit unless clicked away
            if (this.selectedTile == currentTile) {
                this.selectTile(nextMovementTile);
            }
            const worldPos = coords_1.qrToWorld(nextMovementTile.q, nextMovementTile.r);
            animateToPosition(nextMovementTile.unit.model, worldPos.x, worldPos.y, 0.2, easeOutQuad, () => {
                this.moveUnit(nextMovementTile, targetTile);
            });
        }
        battle(currentTile, targetTile) {
            // have attacker move forward 2/3 of the way
            const worldPosCur = coords_1.qrToWorld(currentTile.q, currentTile.r);
            const worldPosTarget = coords_1.qrToWorld(targetTile.q, targetTile.r);
            const twoThirdsX = worldPosCur.x + (worldPosTarget.x - worldPosCur.x) * (1 / 3);
            const twoThirdsY = worldPosCur.y + (worldPosTarget.y - worldPosCur.y) * (1 / 3);
            const defenderBackX = worldPosTarget.x + (worldPosTarget.x - worldPosCur.x) * (1 / 12);
            const defenderBackY = worldPosTarget.y + (worldPosTarget.y - worldPosCur.y) * (1 / 12);
            currentTile.locked = true;
            targetTile.locked = true;
            const battleDuration = .3;
            // have attacker move foward and defender move back
            animateToPosition(targetTile.unit.model, defenderBackX, defenderBackY, battleDuration, easeOutQuad, () => { });
            animateToPosition(currentTile.unit.model, twoThirdsX, twoThirdsY, battleDuration, easeOutQuad, () => {
                const outcome = util_1.getRandomInt(1, 2);
                // fall back to original positions
                animateToPosition(currentTile.unit.model, worldPosCur.x, worldPosCur.y, battleDuration, easeOutQuad, () => { });
                if (outcome === 1) {
                    // defender dies
                    const defenderBackX = worldPosTarget.x + (worldPosTarget.x - worldPosCur.x) * (1 / 3);
                    const defenderBackY = worldPosTarget.y + (worldPosTarget.y - worldPosCur.y) * (1 / 3);
                    animateFall(targetTile.unit.model, defenderBackX, defenderBackY, .2, easeOutQuad, () => {
                        let player = this.getPlayer(targetTile.unit.owner);
                        delete player.units[targetTile.unit.id];
                        this.updateResourcePanel();
                        this.updateGameStatePanel();
                        targetTile.unit.model.parent.remove(targetTile.unit.model);
                        targetTile.unit = undefined;
                        this.moveUnit(currentTile, targetTile);
                        currentTile.locked = false;
                        targetTile.locked = false;
                    });
                }
                else {
                    // defender falls back
                    animateToPosition(targetTile.unit.model, worldPosTarget.x, worldPosTarget.y, battleDuration, easeOutQuad, () => { });
                    currentTile.locked = false;
                    targetTile.locked = false;
                }
            });
        }
        battleCity(currentTile, targetTile) {
            // have attacker move forward 2/3 of the way
            const worldPosCur = coords_1.qrToWorld(currentTile.q, currentTile.r);
            const worldPosTarget = coords_1.qrToWorld(targetTile.q, targetTile.r);
            const twoThirdsX = worldPosCur.x + (worldPosTarget.x - worldPosCur.x) * (1 / 3);
            const twoThirdsY = worldPosCur.y + (worldPosTarget.y - worldPosCur.y) * (1 / 3);
            currentTile.locked = true;
            targetTile.locked = true;
            const battleDuration = .3;
            // have attacker move foward
            animateToPosition(currentTile.unit.model, twoThirdsX, twoThirdsY, battleDuration, easeOutQuad, () => {
                const outcome = util_1.getRandomInt(1, 2);
                // fall back to original positions
                animateToPosition(currentTile.unit.model, worldPosCur.x, worldPosCur.y, battleDuration, easeOutQuad, () => { });
                animateToPosition(targetTile.improvement.model, worldPosTarget.x, worldPosTarget.y, battleDuration, easeOutQuad, () => {
                    if (outcome === 1) {
                        console.log("won city battle!");
                        let p = this.getPlayer(targetTile.improvement.owner);
                        delete p.improvements[targetTile.improvement.id];
                        let p2 = this.getPlayer(currentTile.unit.owner);
                        targetTile.improvement.owner = currentTile.unit.owner;
                        p2.improvements[targetTile.improvement.id] = targetTile.improvement;
                        util_1.updateMaterialColor(targetTile.improvement.model.material, p2.color);
                        this.updateResourcePanel();
                        this.updateGameStatePanel();
                        currentTile.locked = false;
                        targetTile.locked = false;
                        this.moveUnit(currentTile, targetTile);
                        this.checkVictoryConditions();
                    }
                    console.log("lost city battle!");
                    currentTile.locked = false;
                    targetTile.locked = false;
                });
            });
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
        getRandomTile(isStartingPoint) {
            if (isStartingPoint) {
                while (true) {
                    console.log(this._tileGrid);
                    console.log(util_1.getRandomInt(0, this._tileGrid.width / 2 - 1));
                    const q = util_1.getRandomInt(0, this._tileGrid.width / 2);
                    const r = util_1.getRandomInt(0, this._tileGrid.height / 2);
                    console.log(`${q} ${r}`);
                    const randomTile = this._tileGrid.get(q, r);
                    console.log(randomTile);
                    if (interfaces_1.isMountain(randomTile.height) || interfaces_1.isWater(randomTile.height)) {
                        continue;
                    }
                    return randomTile;
                }
            }
            const randomTile = this._tileGrid.get(util_1.getRandomInt(0, this._tileGrid.width), util_1.getRandomInt(0, this._tileGrid.height));
            return randomTile;
        }
        getNextMovementTile(current, target) {
            // Define all possible neighbors in axial coordinates
            const neighbors = [
                { q: current.q + 1, r: current.r },
                { q: current.q - 1, r: current.r },
                { q: current.q, r: current.r + 1 },
                { q: current.q, r: current.r - 1 },
                { q: current.q + 1, r: current.r - 1 },
                { q: current.q - 1, r: current.r + 1 },
            ];
            // Find the neighbor closest to the target
            let bestNeighbor = current;
            let shortestDistance = Infinity;
            for (const neighbor of neighbors) {
                let tt = this._tileGrid.get(neighbor.q, neighbor.r);
                if (interfaces_1.isMountain(tt.height) || interfaces_1.isWater(tt.height)) {
                    continue;
                }
                if (tt.unit !== undefined && current.unit !== undefined && tt.unit.owner === current.unit.owner) {
                    // cant occupy what we already have a unit on
                    continue;
                }
                const distance = getHexDistance(tt, target);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    bestNeighbor = tt;
                }
            }
            return bestNeighbor;
        }
        setActionPanel(action) {
            if (this.actionPanel == null) {
                return;
            }
            this.actionPanel.innerHTML = action;
        }
        actionPanelClicked() {
            if (this._gameState.playersTurn !== this._gameState.currentPlayer) {
                return;
            }
            console.log("ACTIONNN");
            this.endTurn();
        }
        endTurn() {
            // determine next player
            const currentPlayerIndex = this._gameState.playerOrder.indexOf(this._gameState.playersTurn);
            const nextIndex = (currentPlayerIndex + 1) % (this._gameState.playerOrder.length);
            this._gameState.playersTurn = this._gameState.playerOrder[nextIndex];
            if (nextIndex === 0) {
                this._gameState.turn += 1;
            }
            if (this._gameState.playersTurn === this._gameState.currentPlayer) {
                this.setActionPanel("End Turn");
            }
            else {
                this.setActionPanel(`<div class="grey">Waiting for ${this._gameState.playersTurn}..<div>`);
            }
            // calculate new resources for player
            const player = this._gameState.players[this._gameState.playersTurn];
            for (const [key, improvement] of Object.entries(player.improvements)) {
                Units_1.updatePopulationAndProductionRates(improvement);
                improvement.population += improvement.population_rate;
                const roundedPopulation = Math.floor(improvement.population);
                Units_1.updateLabel(improvement.id, `${improvement.name} (${roundedPopulation})`);
            }
            // refresh units movement / health if in city/terittories (todo)
            for (const [key, unit] of Object.entries(player.units)) {
                unit.movement = unit.movement_max;
                // unit.health = unit.health_max;
            }
            this.updateResourcePanel();
            this.updateGameStatePanel();
            if (this._gameState.playersTurn !== this._gameState.currentPlayer) {
                AI_1.takeTurn(this, player);
            }
        }
        updateResourcePanel() {
            if (this.resourcePanel == null) {
                return;
            }
            const player = this._gameState.players[this._gameState.currentPlayer];
            const units = Object.keys(player.units).length;
            const cities = Object.keys(player.improvements).length;
            let population = 0;
            let populationPerTurn = 0;
            let goldPerTurn = 0;
            for (const [key, improvement] of Object.entries(player.improvements)) {
                population += Math.floor(improvement.population);
                populationPerTurn += improvement.population_rate;
            }
            let info = `population: ${population} (+${populationPerTurn}) | gold: ${player.gold} (+${goldPerTurn}) | units: ${units} | cities: ${cities}`;
            this.resourcePanel.innerHTML = info;
        }
        showUnitInfoForTile(tile) {
            if (this.unitInfoPanel == null) {
                return;
            }
            if (tile.unit === undefined && tile.improvement === undefined) {
                this.unitInfoPanel.innerHTML = "";
                this.unitInfoCache = "";
                return;
            }
            if (tile.unit) {
                let info = `<div>
                        <div style="text-align: left;" class="bold">${tile.unit.name}</div>
                        <div style="display: flex; align-items: left;">
                            <img src="${tile.unit.image}" alt="${tile.unit.type}" width="200px" height="200px">
                                
                                <table style="margin-right: 10px; text-align: left;">
                                    <tr>
                                        <th>Health</th>
                                        <td>${tile.unit.health}/${tile.unit.health_max}</td>
                                    </tr>
                                    <tr>
                                        <th>Move</th>
                                        <td>${tile.unit.movement}/${tile.unit.movement_max}</td>
                                    </tr>
                                    <th>Attack</th>
                                        <td>${tile.unit.attack}</td>
                                    </tr>
                                    <th>Defence</th>
                                        <td>${tile.unit.defence}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>`;
                if (this.unitInfoCache != info) {
                    this.unitInfoCache = info;
                    this.unitInfoPanel.innerHTML = info;
                }
                return;
            }
            if (tile.improvement) {
                let info = `<div>
                        <div style="text-align: left;" class="bold">${tile.improvement.name}</div>
                        <div style="display: flex; align-items: left;">
                            <img src="${tile.improvement.image}" alt="${tile.improvement.type}" width="200px" height="200px">
                                
                                <table style="margin-right: 10px; text-align: left;">
                                    <tr><td>Population</td><td>${tile.improvement.population} (+${tile.improvement.population_rate})</td></tr>
                                    <tr><td>Production</td><td>${tile.improvement.production_rate}</td></tr>
                                    <tr><td>Health</td><td>${tile.improvement.health}/${tile.improvement.health_max}</td></tr>
                                    <tr><td>Defence</td><td>${tile.improvement.defence}</td></tr>
                                </table>
                            </div>
                        </div>`;
                if (this.unitInfoCache != info) {
                    this.unitInfoCache = info;
                    this.unitInfoPanel.innerHTML = info;
                }
                return;
            }
        }
        updateGameStatePanel() {
            if (this.gameStatePanel == null) {
                return;
            }
            let info = ``;
            for (const [key, player] of Object.entries(this._gameState.players)) {
                // const units = Object.keys(player.units).length;
                // const cities = Object.keys(player.improvements).length;
                info += `${player.name} | `;
            }
            info += `turn: ${this._gameState.turn}`;
            this.gameStatePanel.innerHTML = info;
        }
        checkVictoryConditions() {
            if (this.menuPanel == null) {
                return;
            }
            let playersWithCities = "";
            for (const [key, player] of Object.entries(this._gameState.players)) {
                if (Object.keys(player.improvements).length > 0) {
                    if (playersWithCities != "") {
                        return;
                    }
                    playersWithCities = player.name;
                }
            }
            if (playersWithCities === "") {
                return;
            }
            if (playersWithCities === this._gameState.currentPlayer) {
                console.log("Winner!");
                this.menuPanel.innerHTML = `<h1 class="text-info">Victory!</h1>`;
                this.menuPanel.style.visibility = "visible";
            }
            else {
                console.log("Lost!");
                this.menuPanel.innerHTML = `<h1 class="text-info">Defeat!</h1>`;
                this.menuPanel.style.visibility = "visible";
            }
        }
    }
    MapView.DEFAULT_ZOOM = 25;
    exports.default = MapView;
    // Calculate the distance between two hexes (Manhattan distance in axial coordinates)
    function getHexDistance(a, b) {
        return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
    }
    // Tween Function
    function animateToPosition(object, targetX, targetY, duration, easing, onComplete) {
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
    function animateFall(object, targetX, targetY, duration, easing, onComplete) {
        const peakZ = object.position.z + .3; // Peak height in Z-axis
        const startTime = performance.now();
        const startRotation = object.rotation.x;
        const startX = object.position.x;
        const startY = object.position.y;
        const startZ = object.position.z;
        function animate() {
            const currentTime = performance.now();
            const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
            const t = Math.min(elapsed / duration, 1); // Normalize time to range [0, 1]
            const easedT = easing(t);
            // Parabolic motion for Z-axis
            const z = startZ + (peakZ - startZ) * (1 - Math.pow(2 * t - 1, 2));
            // object.rotation.x = startRotation + (Math.PI / 2) * easedT;
            object.position.x = startX + (targetX - startX) * easedT;
            object.position.y = startY + (targetY - startY) * easedT;
            object.position.z = z;
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