define(["require", "exports", "./util"], function (require, exports, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Grid {
        get length() {
            return this._width * this._height;
        }
        get width() {
            return this._width;
        }
        get height() {
            return this._height;
        }
        constructor(_width, _height) {
            this._width = _width;
            this._height = _height;
            this.data = [];
            this.halfWidth = this._width / 2;
            this.halfHeight = this._height / 2;
            if (_width % 2 != 0 || _height % 2 != 0) {
                throw new Error("With and height of grid must be divisible by 2");
            }
            this.data = [];
        }
        forEachQR(f) {
            const { _width, _height } = this;
            for (var i = -this.halfWidth; i < this.halfWidth; i++) {
                for (var j = -this.halfHeight; j < this.halfHeight; j++) {
                    const q = i - j / 2 + ((-_height / 2 + j) % 2) / 2;
                    const r = j;
                    f(q, r, this.get(q, r));
                }
            }
            return this;
        }
        /**
         * Iterates over the grid using the indices (i,j), where i = [0..width-1] and j = [0..height-1].
         * (0, 0) corresponds to the upper left corner, (width-1, height-1) to the bottom right corner.
         */
        forEachIJ(f) {
            const { _width, _height } = this;
            for (var i = -this.halfWidth; i < this.halfWidth; i++) {
                for (var j = -this.halfHeight; j < this.halfHeight; j++) {
                    const q = i - j / 2 + ((-_height / 2 + j) % 2) / 2;
                    const r = j;
                    f(i + this.halfWidth, j + this.halfHeight, q, r, this.get(q, r));
                }
            }
            return this;
        }
        init(items) {
            items.forEach(item => {
                this.add(item.q, item.r, item);
            });
            return this;
        }
        initQR(f) {
            return this.forEachQR((q, r, item) => this.add(q, r, f(q, r, item)));
        }
        mapQR(f) {
            const mapped = new Grid(this._width, this._height);
            this.forEachQR((q, r, item) => mapped.add(q, r, f(q, r, item)));
            return mapped;
        }
        toArray() {
            const arr = new Array(this._width * this._height);
            var i = 0;
            for (let q in this.data) {
                for (let r in this.data[q]) {
                    arr[i++] = this.data[q][r];
                }
            }
            return arr;
        }
        get(q, r) {
            const col = this.data[q];
            if (col) {
                return col[r];
            }
            else {
                return undefined;
            }
        }
        getOrCreate(q, r, defaultValue) {
            const col = this.data[q];
            if (!col) {
                this.data[q] = [];
                this.data[q][r] = defaultValue;
                return defaultValue;
            }
            const cell = col[r];
            if (!cell) {
                this.data[q][r] = defaultValue;
                return defaultValue;
            }
            return cell;
        }
        add(q, r, item) {
            if (q in this.data) {
                this.data[q][r] = item;
            }
            else {
                const col = this.data[q] = [];
                col[r] = item;
            }
        }
        neighbors(q, r, range = 1) {
            return (range == 1 ? Grid.NEIGHBOR_QRS : (0, util_1.qrRange)(range)).map(qr => {
                return this.get(q + qr.q, r + qr.r);
            }).filter(x => x !== undefined);
        }
        /**
         * Returns a list of exactly 6 items for each of the surrounding tiles at (q,r).
         * Non-existing neighbors will occur as "undefined". The list is always returned
         * in the same order of NE [0], E [1], SE [2], SW [3], W [4], NW [5].
         * @param q
         * @param r
         * @returns {{q: number, r: number}[]}
         */
        surrounding(q, r) {
            return Grid.NEIGHBOR_QRS.map(qr => {
                return this.get(q + qr.q, r + qr.r);
            });
        }
    }
    Grid.NEIGHBOR_QRS = [
        { q: 1, r: -1 }, // NE
        { q: 1, r: 0 }, // E
        { q: 0, r: 1 }, // SE
        { q: -1, r: 1 }, // SW
        { q: -1, r: 0 }, // W
        { q: 0, r: -1 } // NW
    ];
    exports.default = Grid;
});
//# sourceMappingURL=Grid.js.map