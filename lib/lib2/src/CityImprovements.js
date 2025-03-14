define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WonderMap = exports.BuildingMap = void 0;
    const materialCache = new Map();
    exports.BuildingMap = {
        "granary": {
            name: "Granary",
            cost: 300,
            description: "Increases food production by 10%",
            menu_image: "../../assets/ui/units/city.png",
        },
        "market": {
            name: "Market",
            cost: 300,
            description: "Increases gold production by 10%",
            menu_image: "../../assets/ui/units/city.png",
        },
        "watermill": {
            name: "Watermill",
            cost: 300,
            description: "Increases production by 20%",
            menu_image: "../../assets/ui/units/city.png",
        },
    };
    exports.WonderMap = {};
});
//# sourceMappingURL=CityImprovements.js.map
//# sourceMappingURL=CityImprovements.js.map