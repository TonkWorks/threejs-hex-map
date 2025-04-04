define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KEY_CODES = void 0;
    exports.paramString = paramString;
    exports.paramInt = paramInt;
    exports.paramFloat = paramFloat;
    exports.varying = varying;
    exports.KEY_CODES = {
        LEFT_ARROW: 41,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        SHIFT: 16,
        Q: 81,
        E: 69,
        G: 71
    };
    function paramString(name, defaultValue) {
        const queryMatch = document.location.href.match(new RegExp(name + "=([^&]+)"));
        if (queryMatch) {
            return (queryMatch[1]);
        }
        else {
            return defaultValue;
        }
    }
    function paramInt(name, defaultValue) {
        return parseInt(paramString(name, defaultValue + ""));
    }
    function paramFloat(name, defaultValue) {
        return parseFloat(paramString(name, defaultValue + ""));
    }
    function varying(...values) {
        return values[Math.round(Math.random() * (values.length - 1))];
    }
});
//# sourceMappingURL=util.js.map