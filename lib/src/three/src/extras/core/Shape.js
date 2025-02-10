define(["require", "exports", "./Path.js", "../../math/MathUtils.js"], function (require, exports, Path_js_1, MathUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function Shape(points) {
        Path_js_1.Path.call(this, points);
        this.uuid = MathUtils_js_1.MathUtils.generateUUID();
        this.type = 'Shape';
        this.holes = [];
    }
    exports.Shape = Shape;
    Shape.prototype = Object.assign(Object.create(Path_js_1.Path.prototype), {
        constructor: Shape,
        getPointsHoles: function (divisions) {
            const holesPts = [];
            for (let i = 0, l = this.holes.length; i < l; i++) {
                holesPts[i] = this.holes[i].getPoints(divisions);
            }
            return holesPts;
        },
        // get points of shape and holes (keypoints based on segments parameter)
        extractPoints: function (divisions) {
            return {
                shape: this.getPoints(divisions),
                holes: this.getPointsHoles(divisions)
            };
        },
        copy: function (source) {
            Path_js_1.Path.prototype.copy.call(this, source);
            this.holes = [];
            for (let i = 0, l = source.holes.length; i < l; i++) {
                const hole = source.holes[i];
                this.holes.push(hole.clone());
            }
            return this;
        },
        toJSON: function () {
            const data = Path_js_1.Path.prototype.toJSON.call(this);
            data.uuid = this.uuid;
            data.holes = [];
            for (let i = 0, l = this.holes.length; i < l; i++) {
                const hole = this.holes[i];
                data.holes.push(hole.toJSON());
            }
            return data;
        },
        fromJSON: function (json) {
            Path_js_1.Path.prototype.fromJSON.call(this, json);
            this.uuid = json.uuid;
            this.holes = [];
            for (let i = 0, l = json.holes.length; i < l; i++) {
                const hole = json.holes[i];
                this.holes.push(new Path_js_1.Path().fromJSON(hole));
            }
            return this;
        }
    });
});
//# sourceMappingURL=Shape.js.map