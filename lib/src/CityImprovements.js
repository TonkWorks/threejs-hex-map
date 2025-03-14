define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WonderMap = exports.BuildingMap = void 0;
    const materialCache = new Map();
    exports.BuildingMap = {
        "granary": {
            name: "Granary",
            cost: 300,
            description: "Increases food +2",
            menu_image: "../../assets/ui/units/city.png",
            yields: {
                food: 2,
            },
        },
        "market": {
            name: "Market",
            cost: 300,
            description: "Increases gold +1",
            menu_image: "../../assets/ui/units/city.png",
            yields: {
                gold: 1,
            },
        },
        "watermill": {
            name: "Watermill",
            cost: 300,
            description: "Increases food +2 and production +1",
            menu_image: "../../assets/ui/units/city.png",
            yields: {
                food: 2,
                production: 1,
            },
        },
        "library": {
            name: "Library",
            cost: 300,
            description: "Increases research +2",
            menu_image: "../../assets/ui/units/city.png",
            yields: {
                research: 2,
            },
        },
    };
    exports.WonderMap = {};
});
//# sourceMappingURL=CityImprovements.js.map