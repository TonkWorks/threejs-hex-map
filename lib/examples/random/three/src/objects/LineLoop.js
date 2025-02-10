define(["require", "exports", "./Line.js"], function (require, exports, Line_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function LineLoop(geometry, material) {
        Line_js_1.Line.call(this, geometry, material);
        this.type = 'LineLoop';
    }
    exports.LineLoop = LineLoop;
    LineLoop.prototype = Object.assign(Object.create(Line_js_1.Line.prototype), {
        constructor: LineLoop,
        isLineLoop: true,
    });
});
//# sourceMappingURL=LineLoop.js.map