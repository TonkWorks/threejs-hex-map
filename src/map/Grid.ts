import { QR } from '../interfaces';
import {qrRange, range, isInteger, deepCopy} from '../util';
import { Vector3 } from 'three';

export default class Grid<T extends QR> {
    private data: T[][] = []
    private halfWidth = this._width / 2
    private halfHeight = this._height / 2

    get length(): number {
        return this._width * this._height
    }

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    constructor(private _width: number, private _height: number) {
        if (_width % 2 != 0 || _height % 2 != 0) {
            throw new Error("With and height of grid must be divisible by 2")
        }
        this.data = []
    }

    forEachQR(f: (q: number, r: number, existingItem?: T)=>void) {
        const {_width, _height} = this

        for (var i = -this.halfWidth; i < this.halfWidth; i++) {
            for (var j = -this.halfHeight; j < this.halfHeight; j++) {
                const q = i - j / 2 + ((-_height / 2 + j) % 2) / 2
                const r = j

                f(q, r, this.get(q, r))
            }
        }

        return this
    }

    /**
     * Iterates over the grid using the indices (i,j), where i = [0..width-1] and j = [0..height-1].
     * (0, 0) corresponds to the upper left corner, (width-1, height-1) to the bottom right corner.
     */
    forEachIJ(f: (i: number, j: number, q: number, r: number, item?: T)=>void) {
        const {_width, _height} = this

        for (var i = -this.halfWidth; i < this.halfWidth; i++) {
            for (var j = -this.halfHeight; j < this.halfHeight; j++) {
                const q = i - j / 2 + ((-_height / 2 + j) % 2) / 2
                const r = j

                f(i + this.halfWidth, j + this.halfHeight, q, r, this.get(q, r))
            }
        }

        return this
    }

    init(items: T[]) {
        items.forEach(item => {
            this.add(item.q, item.r, item)
        })
        return this
    }

    initQR(f: (q: number, r: number, existingItem?: T) => T) {
        return this.forEachQR((q,r,item) => this.add(q, r, f(q, r, item)))
    }

    mapQR<R extends QR>(f: (q: number, r: number, existingItem?: T) => R) {
        const mapped = new Grid<R>(this._width, this._height)
        this.forEachQR((q,r,item) => mapped.add(q, r, f(q, r, item)))
        return mapped
    }

    toArray(): T[] {
        const arr: T[] = new Array(this._width * this._height)
        var i = 0

        for (let q in this.data) {
            for (let r in this.data[q]) {
                arr[i++] = this.data[q][r]
            }
        }

        return arr
    }

    get(q: number, r: number): T | undefined {
        const col = this.data[q]    
        if (col) {
            return col[r]
        } else {
            return undefined
        }
    }

    getOrCreate(q: number, r: number, defaultValue: T): T {
        const col = this.data[q]
        if (!col) {
            this.data[q] = []
            this.data[q][r] = defaultValue
            return defaultValue
        }

        const cell = col[r]
        if (!cell) {
            this.data[q][r] = defaultValue
            return defaultValue
        }

        return cell
    }

    add(q: number, r: number, item: T) {
        if (q in this.data) {
            this.data[q][r] = item
        } else {
            const col: T[] = this.data[q] = []
            col[r] = item
        }
    }

    static NEIGHBOR_QRS = [
        { q: 1, r: -1 }, // NE
        { q: 1, r: 0 }, // E
        { q: 0, r: 1 }, // SE
        { q: -1, r: 1 }, // SW
        { q: -1, r: 0 }, // W
        { q: 0, r: -1 } // NW
    ]

    neighbors(q: number, r: number, range: number = 1): T[] {
        return (range == 1 ? Grid.NEIGHBOR_QRS : qrRange(range)).map(qr => {
            return this.get(q + qr.q, r + qr.r)
        }).filter(x => x !== undefined)
    }

    /**
     * Returns a list of exactly 6 items for each of the surrounding tiles at (q,r).
     * Non-existing neighbors will occur as "undefined". The list is always returned
     * in the same order of NE [0], E [1], SE [2], SW [3], W [4], NW [5].
     * @param q
     * @param r
     * @returns {{q: number, r: number}[]}
     */
    surrounding(q: number, r: number): T[] {
        return Grid.NEIGHBOR_QRS.map(qr => {
            return this.get(q + qr.q, r + qr.r)
        })
    }


    // Add this method to your TileGrid class
    line(fromQ: number, fromR: number, toQ: number, toR: number): T[] {
        const result: T[] = [];
        
        // Calculate the distance between the points
        const distance = this.distance(fromQ, fromR, toQ, toR);
        
        // If the points are the same, return just that tile
        if (distance === 0) {
            const tile = this.get(fromQ, fromR);
            return tile ? [tile] : [];
        }
        
        // For each step along the line
        for (let i = 0; i <= distance; i++) {
            // Calculate the interpolated position
            const t = distance === 0 ? 0.0 : i / distance;
            
            // Linear interpolation between the two points
            const q = Math.round(fromQ + (toQ - fromQ) * t);
            const r = Math.round(fromR + (toR - fromR) * t);
            
            // Get the cube coordinates (q, r, s where q + r + s = 0)
            // In cube coordinates, s = -q - r
            const s = -q - r;
            
            // Get the tile at this position
            const tile = this.get(q, r);
            if (tile) {
                result.push(tile);
            }
        }
        
        return result;
    }

    // Helper method to calculate distance between two hex coordinates
    // Add this if you don't already have it
    distance(q1: number, r1: number, q2: number, r2: number): number {
        // In cube coordinates, s1 = -q1 - r1 and s2 = -q2 - r2
        const s1 = -q1 - r1;
        const s2 = -q2 - r2;
        
        // The distance is the maximum of the absolute differences
        return Math.max(
            Math.abs(q1 - q2),
            Math.abs(r1 - r2),
            Math.abs(s1 - s2)
        );
    }


    //
    exportData(excludedProperties: string[] = ["improvement", "improvementOverlay", "territoryOverlay", "unit", "civilian_unit", "locked"]): { width: number, height: number, items: T[] } {
        const items = this.toArray()
        .filter((item): item is T => item !== undefined)
        .map(item => {
          const copy: Partial<T> = {} as T;
          Object.keys(item).forEach((key: string) => {
            // Skip excluded properties.
            if (excludedProperties.includes(key)) {
              return;
            }
            if (key === "resource") {
              // Create a shallow copy of resource so modifications do not affect the original.
              (copy as any)[key] = { ...(item as any)[key] };
              delete (copy as any)[key].model;
              delete (copy as any)[key].mapModel;
              delete (copy as any)[key].map;
              delete (copy as any)[key].image;
            } else if (key === "worker_improvement") {
                // Create a shallow copy of resource so modifications do not affect the original.
                (copy as any)[key] = { ...(item as any)[key] };
                delete (copy as any)[key].model;
                delete (copy as any)[key].images;
                delete (copy as any)[key].yields;
            } 
            else if (key === "clouds" && (item as any)[key] === false) {
              // Omit this property.
            } else if (key === "fog" && (item as any)[key] === false) {
              // Omit this property.
            } else if (key === "rivers" && (item as any)[key] === null) {
              // Omit this property.
            } else {
              (copy as any)[key] = (item as any)[key];
            }
          });
          return copy as T;
        });

        return {
            width: this.width,
            height: this.height,
            items: items
        };
    }


    static fromJSON<T extends QR>(json: any): Grid<T> {
        const parsed: {
            grid: { width: number; height: number; items: T[] };
            units: any[]; 
        } = json;
        
        const grid = new Grid<T>(parsed.grid.width, parsed.grid.height);
        grid.init(parsed.grid.items);
        return grid;
    }
}