var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.loadTexture = loadTexture;
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
    exports.loadFile = loadFile;
    function loadJSON(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return loadFile(path).then(str => JSON.parse(str));
        });
    }
    exports.loadJSON = loadJSON;
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
    exports.qrRange = qrRange;
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
    exports.forEachRange = forEachRange;
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
    exports.shuffle = shuffle;
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
    exports.range = range;
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    exports.getRandomInt = getRandomInt;
    function flatMap(items, map) {
        return [].concat.apply([], items.map(map));
    }
    exports.flatMap = flatMap;
    function sum(numbers) {
        return numbers.reduce((sum, item) => sum + item, 0);
    }
    exports.sum = sum;
    function qrEquals(a, b) {
        return a.q == b.q && a.r == b.r;
    }
    exports.qrEquals = qrEquals;
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
    exports.minBy = minBy;
    function isInteger(value) {
        return Math.floor(value) == value;
    }
    exports.isInteger = isInteger;
    function flatten(items) {
        return [].concat.apply([], items);
    }
    exports.flatten = flatten;
    /// three.js and animations
    function updateMaterialColor(material, color) {
        if (material instanceof three_1.MeshBasicMaterial ||
            material instanceof three_1.MeshStandardMaterial) {
            material.color.set(color);
        }
        else {
            console.warn('Material does not support color property:', material);
        }
    }
    exports.updateMaterialColor = updateMaterialColor;
});
//# sourceMappingURL=util.js.map