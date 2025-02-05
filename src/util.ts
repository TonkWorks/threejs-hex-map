import {FileLoader, TextureLoader, Texture, MeshBasicMaterial, MeshStandardMaterial} from "three"
import {QR, TextureAtlas} from "./interfaces"

const fileLoader = new FileLoader()
const textureLoader = new TextureLoader()

export function loadTexture(url: string, onProgress?: (percent: number, totalBytes: number, loadedBytes: number) => void): Promise<Texture> {
    return new Promise((resolve, reject) => {
        const onLoad = (texture: Texture) => {
            resolve(texture)
        }

        const onProgressWrapper = (progress: {total: number, loaded: number}) => {
            if (onProgress) {
                onProgress(100 * (progress.loaded / progress.total), progress.total, progress.loaded)
            }            
        }

        const onError = (error: Error) => {
            reject(error)
        }

        (textureLoader.load as any)(url, onLoad, onProgressWrapper, onError)
    })
}

export async function loadFile(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fileLoader.load(
            url,
            (result) => resolve(result),
            undefined,
            (error) => reject(error)
        );
    });
}

export async function loadJSON<T>(path: string): Promise<T> {
    return loadFile(path).then(str => JSON.parse(str) as T)
}

export function qrRange(qrRadius: number): QR[] {
    const coords: QR[] = [];

    forEachRange(-qrRadius, qrRadius + 1, (dx) => {
        forEachRange(Math.max(-qrRadius, -dx - qrRadius), Math.min(qrRadius, -dx + qrRadius) + 1, (dy) => {
            var dz = -dx - dy;
            coords.push({q: dx, r: dz});
        })
    })

    return coords;
}

export function forEachRange(min: number, max: number, f: (n: number) => void) {
    if (!max) {
        return range(0, min);
    } else {
        for (var i = min; i < max; i++) {
            f(i);
        }
    }
}

export function capitalize(str: string): string {
    if (!str) return str; // Handle empty string case
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function shuffle<T>(a: T[]): T[] {
    var j: number, x: T, i: number;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
    return a
}

export function range(minOrMax: number, max?: number): number[] {
    if (!max) {
        return this.range(0, minOrMax);
    } else {
        var values: number[] = [];
        for (var i = minOrMax; i < max; i++) {
            values.push(i);
        }
        return values;
    }
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



export function flatMap<T, R>(items: T[], map: (item: T, index?: number) => R[]): R[] {
    return [].concat.apply([], items.map(map))
}

export function sum(numbers: number[]): number {
    return numbers.reduce((sum, item) => sum + item, 0)
}

export function qrEquals(a: QR, b: QR): boolean {
    return a.q == b.q && a.r == b.r
}

export function minBy<T>(items: T[], by: (item: T)=>number): T | null {
    if (items.length == 0) {
        return null
    } else if (items.length == 1) {
        return items[0]
    } else {
        return items.reduce((min: T, cur: T) => by(cur) < by(min) ? cur : min, items[0])
    }
}

export function isInteger(value: number): boolean {
    return Math.floor(value) == value
}

export function flatten<T>(items: T[][]): T[] {
    return [].concat.apply([], items)
}

export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}


export async function loadTextureAtlas() {
    return loadJSON<TextureAtlas>("../../assets/land-atlas.json")
}


export function asset(relativePath: string): string {
    return "../../assets/" + relativePath
}

/// three.js and animations
export function updateMaterialColor(material: THREE.Material, color: string) {
    if (material instanceof MeshBasicMaterial ||
        material instanceof MeshStandardMaterial) {
        material.color.set(color);
    } else {
        console.warn('Material does not support color property:', material);
    }
}