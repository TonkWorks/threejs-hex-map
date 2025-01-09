var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.loadTexture = loadTexture;
    exports.loadFile = loadFile;
    exports.loadJSON = loadJSON;
    exports.qrRange = qrRange;
    exports.forEachRange = forEachRange;
    exports.shuffle = shuffle;
    exports.range = range;
    exports.flatMap = flatMap;
    exports.sum = sum;
    exports.qrEquals = qrEquals;
    exports.minBy = minBy;
    exports.isInteger = isInteger;
    exports.flatten = flatten;
    const fileLoader = new three_1.XHRLoader();
    const textureLoader = new three_1.TextureLoader();
    function loadTexture(url, onProgress) {
        return new Promise((resolve, reject) => {
            const onLoad = (texture) => {
                resolve(texture);
            };
            const onProgressWrapper = (progress) => {
                if (onProgress) {
                    onProgress(100 * (progress.loaded / progress.total), progress.total, progress.loaded);
                }
            };
            const onError = (error) => {
                reject(error);
            };
            textureLoader.load(url, onLoad, onProgressWrapper, onError);
        });
    }
    function loadFile(path) {
        // TODO: Remove cache buster
        const url = path; // + "?cachebuster=" + Math.random() * 9999999
        return new Promise((resolve, reject) => {
            fileLoader.load(url, (result) => {
                resolve(result);
            }, undefined, (error) => {
                reject(error);
            });
        });
    }
    function loadJSON(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return loadFile(path).then(str => JSON.parse(str));
        });
    }
    function qrRange(qrRadius) {
        const coords = [];
        forEachRange(-qrRadius, qrRadius + 1, (dx) => {
            forEachRange(Math.max(-qrRadius, -dx - qrRadius), Math.min(qrRadius, -dx + qrRadius) + 1, (dy) => {
                var dz = -dx - dy;
                coords.push({ q: dx, r: dz });
            });
        });
        return coords;
    }
    function forEachRange(min, max, f) {
        if (!max) {
            return range(0, min);
        }
        else {
            for (var i = min; i < max; i++) {
                f(i);
            }
        }
    }
    function shuffle(a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        return a;
    }
    function range(minOrMax, max) {
        if (!max) {
            return this.range(0, minOrMax);
        }
        else {
            var values = [];
            for (var i = minOrMax; i < max; i++) {
                values.push(i);
            }
            return values;
        }
    }
    function flatMap(items, map) {
        return [].concat.apply([], items.map(map));
    }
    function sum(numbers) {
        return numbers.reduce((sum, item) => sum + item, 0);
    }
    function qrEquals(a, b) {
        return a.q == b.q && a.r == b.r;
    }
    function minBy(items, by) {
        if (items.length == 0) {
            return null;
        }
        else if (items.length == 1) {
            return items[0];
        }
        else {
            return items.reduce((min, cur) => by(cur) < by(min) ? cur : min, items[0]);
        }
    }
    function isInteger(value) {
        return Math.floor(value) == value;
    }
    function flatten(items) {
        return [].concat.apply([], items);
    }
});
//# sourceMappingURL=util.js.map