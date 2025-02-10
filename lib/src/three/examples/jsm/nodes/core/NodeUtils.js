define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NodeUtils = {
        elements: ['x', 'y', 'z', 'w'],
        addShortcuts: function () {
            function applyShortcut(proxy, property, subProperty) {
                if (subProperty) {
                    return {
                        get: function () {
                            return this[proxy][property][subProperty];
                        },
                        set: function (val) {
                            this[proxy][property][subProperty] = val;
                        }
                    };
                }
                else {
                    return {
                        get: function () {
                            return this[proxy][property];
                        },
                        set: function (val) {
                            this[proxy][property] = val;
                        }
                    };
                }
            }
            return function addShortcuts(proto, proxy, list) {
                var shortcuts = {};
                for (var i = 0; i < list.length; ++i) {
                    var data = list[i].split("."), property = data[0], subProperty = data[1];
                    shortcuts[property] = applyShortcut(proxy, property, subProperty);
                }
                Object.defineProperties(proto, shortcuts);
            };
        }()
    };
    exports.NodeUtils = NodeUtils;
});
//# sourceMappingURL=NodeUtils.js.map