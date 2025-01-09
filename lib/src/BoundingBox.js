define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class BoundingBox {
        constructor(center, halfDimension) {
            this.center = center;
            this.halfDimension = halfDimension;
        }
        containsPoint(point) {
            if (point.x < (this.center.x - this.halfDimension)) {
                return false;
            }
            if (point.y < (this.center.y - this.halfDimension)) {
                return false;
            }
            if (point.x > (this.center.x + this.halfDimension)) {
                return false;
            }
            if (point.y > (this.center.y + this.halfDimension)) {
                return false;
            }
            return true;
        }
        intersectsAABB(other) {
            if (other.center.x + other.halfDimension < this.center.x - this.halfDimension) {
                return false;
            }
            if (other.center.y + other.halfDimension < this.center.y - this.halfDimension) {
                return false;
            }
            if (other.center.x - other.halfDimension > this.center.x + this.halfDimension) {
                return false;
            }
            if (other.center.y - other.halfDimension > this.center.y + this.halfDimension) {
                return false;
            }
            return true;
        }
    }
    exports.BoundingBox = BoundingBox;
});
//# sourceMappingURL=BoundingBox.js.map