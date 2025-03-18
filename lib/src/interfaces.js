define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isLand = isLand;
    exports.isWater = isWater;
    exports.isHill = isHill;
    exports.isForest = isForest;
    exports.isMountain = isMountain;
    function isLand(height) {
        return height >= 0.0 && height < 0.75;
    }
    function isWater(height) {
        return height < 0.0;
    }
    function isHill(height) {
        return height >= 0.375 && height < 0.75;
    }
    function isForest(t) {
        if (t.treeIndex !== undefined) {
            return true;
        }
    }
    function isMountain(height) {
        return height >= 0.75;
    }
});
//# sourceMappingURL=interfaces.js.map