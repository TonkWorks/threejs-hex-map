define(["require", "exports", "./util"], function (require, exports, util_1) {
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