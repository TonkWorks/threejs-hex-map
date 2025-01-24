define(["require", "exports", "./util", "../../src/Units"], function (require, exports, util_1, Units_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function initInput(mapView) {
        const keyActions = {
            [util_1.KEY_CODES.LEFT_ARROW]: {
                down: () => mapView.scrollDir.x = -1,
                up: () => mapView.scrollDir.x = 0
            },
            [util_1.KEY_CODES.RIGHT_ARROW]: {
                down: () => mapView.scrollDir.x = 1,
                up: () => mapView.scrollDir.x = 0
            },
            [util_1.KEY_CODES.UP_ARROW]: {
                down: () => mapView.scrollDir.y = 1,
                up: () => mapView.scrollDir.y = 0
            },
            [util_1.KEY_CODES.DOWN_ARROW]: {
                down: () => mapView.scrollDir.y = -1,
                up: () => mapView.scrollDir.y = 0
            },
            [util_1.KEY_CODES.E]: {
                down: () => mapView.setZoom(mapView.getZoom() * 0.9)
            },
            [util_1.KEY_CODES.Q]: {
                down: () => mapView.setZoom(mapView.getZoom() * 1.1)
            },
            [util_1.KEY_CODES.G]: {
                down: () => mapView.mapMesh.showGrid = !mapView.mapMesh.showGrid
            },
            // debug
            [util_1.KEY_CODES.A]: {
                down: () => {
                    const player = mapView.getPlayer("USA");
                    const unit = Units_1.CreateRifleman(player);
                    const tile = mapView.selectedTile;
                    mapView.addUnitToMap(unit, tile);
                    mapView.selectTile(tile);
                }
            },
            [util_1.KEY_CODES.S]: {
                down: () => {
                    const player = mapView.getPlayer("China");
                    const unit = Units_1.CreateRifleman(player);
                    const tile = mapView.selectedTile;
                    mapView.addUnitToMap(unit, tile);
                    mapView.selectTile(tile);
                }
            },
            [util_1.KEY_CODES.Z]: {
                down: () => {
                    const player = mapView.getPlayer("USA");
                    const improvement = Units_1.CreateCity(player);
                    const tile = mapView.selectedTile;
                    mapView.addImprovementToMap(improvement, tile);
                    mapView.selectTile(tile);
                }
            },
            [util_1.KEY_CODES.X]: {
                down: () => {
                    const player = mapView.getPlayer("China");
                    const improvement = Units_1.CreateCity(player);
                    const tile = mapView.selectedTile;
                    mapView.addImprovementToMap(improvement, tile);
                    mapView.selectTile(tile);
                }
            }
        };
        window.addEventListener("keydown", (event) => {
            const actions = keyActions[event.keyCode];
            if (actions && "down" in actions) {
                actions["down"]();
            }
        }, false);
        window.addEventListener("keyup", (event) => {
            const actions = keyActions[event.keyCode];
            if (actions && "up" in actions) {
                actions["up"]();
            }
        }, false);
        const scrollHandler = onMouseWheelHandler(mapView);
        mapView.canvas.addEventListener("wheel", scrollHandler, false);
        const rightClickHandler = onRightClickHandler(mapView);
        mapView.canvas.addEventListener("contextmenu", rightClickHandler, false);
        // no right click context menus
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        // prevent selections
        document.addEventListener('selectstart', (event) => {
            event.preventDefault();
        });
    }
    exports.initInput = initInput;
    function onMouseWheelHandler(mapView) {
        return (e) => {
            var delta = Math.max(-1, Math.min(1, e.deltaY));
            if (delta == 0)
                return;
            const zoom = Math.max(8.0, Math.min(500.0, mapView.getZoom() * (1.0 - delta * 0.025)));
            mapView.setZoom(zoom);
        };
    }
    function onRightClickHandler(mapView) {
        return (event) => {
            event.preventDefault(); // Prevent the default browser context menu
        };
    }
});
//# sourceMappingURL=input.js.map