import { Vector3, Camera } from 'three';
import MapMesh from "./MapMesh";
import { TileData, TileDataSource, QR } from './interfaces';
import Grid from './Grid';
import MapViewController from './MapViewController';
import { MapViewControls } from './MapViewController';
import { MapMeshOptions } from './MapMesh';
export default class MapView implements MapViewControls, TileDataSource {
    private static DEFAULT_ZOOM;
    private _camera;
    private _scene;
    private _renderer;
    private _scrollDir;
    private _lastTimestamp;
    private _zoom;
    private _canvas;
    private _mapMesh;
    private _chunkedMesh;
    private _tileGrid;
    private _tileSelector;
    private _controller;
    private _selectedTile;
    private _units_models;
    private _units;
    private _onTileSelected;
    private _onLoaded;
    private _onAnimate;
    get controller(): MapViewController;
    get canvas(): HTMLCanvasElement;
    get zoom(): number;
    getZoom(): number;
    set zoom(value: number);
    get selectedTile(): TileData;
    getTileGrid(): Grid<TileData>;
    get mapMesh(): MapMesh;
    /**
     * Sets up the camera with the given Z position (height) and so that the view center (the point the camera is pointed at) doesn't change.
     */
    setZoom(z: number): this;
    get scrollDir(): Vector3;
    set onTileSelected(callback: (tile: TileData) => void);
    set onLoaded(callback: () => void);
    set onAnimate(callback: (dtS: number) => void);
    setOnAnimateCallback(callback: (dtS: number) => void): void;
    scrollSpeed: number;
    constructor(canvasElementQuery?: string);
    load(tiles: Grid<TileData>, options: MapMeshOptions): void;
    updateTiles(tiles: TileData[]): void;
    addUnitToTile(tile: TileData): void;
    getTile(q: number, r: number): TileData;
    private animate;
    onWindowResize(event: Event): void;
    setScrollDir(x: number, y: number): void;
    getCamera(): Camera;
    /**
     * Returns the world space position on the Z plane (the plane with the tiles) at the center of the view.
     */
    getViewCenter(): Vector3;
    getCameraFocusPosition(pos: QR): Vector3;
    getCameraFocusPositionWorld(pos: Vector3): Vector3;
    focus(q: number, r: number): void;
    focusWorldPos(v: Vector3): void;
    selectTile(tile: TileData): void;
    actionTile(tile: TileData): void;
    pickTile(worldPos: Vector3): TileData | null;
}
