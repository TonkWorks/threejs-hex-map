import MapView from '../../src/MapView';
import { loadFile, loadJSON, loadTexture } from '../../src/util';
import { TextureAtlas, isMountain, isWater, TileData } from '../../src/interfaces';
import {generateRandomMap} from "../../src/map-generator"
import { varying } from './util';
import { TextureLoader, Color } from 'three';
import { MapMeshOptions } from '../../src/MapMesh';
import DefaultMapViewController from "../../src/DefaultMapViewController";
import { Grid } from '../../dist/threejs-hex-map';

function asset(relativePath: string): string {
    return "../../assets/" + relativePath
}

async function loadTextureAtlas() {
    return loadJSON<TextureAtlas>(asset("land-atlas.json"))
}

async function generateMap(mapSize: number) {
    function coldZone(q: number, r: number, height: number): string {
        if (Math.abs(r) > mapSize * (0.44 + Math.random() * 0.03)) return "snow"
        else return "tundra"
    }

    function warmZone(q: number, r: number, height: number): string {
        return varying("grass", "grass", "grass", "plains", "plains", "desert")
    }

    function terrainAt(q: number, r: number, height: number): string {
        if (height < 0.0) return "ocean"
        else if (height > 0.75) return "mountain"
        else if (Math.abs(r) > mapSize * 0.4) return coldZone(q, r, height)
        else return warmZone(q, r, height)
    }

    function treeAt(q: number, r: number, terrain: string): number | undefined {
        if (terrain == "snow") return 2
        else if (terrain == "tundra") return 1
        else return 0
    }

    return generateRandomMap(mapSize, (q, r, height): TileData => {
        const terrain = terrainAt(q, r, height)
        const trees = isMountain(height) || isWater(height) || terrain == "desert" ? undefined :
            (varying(true, false, false) ? treeAt(q, r, terrain) : undefined)
        return {q, r, height, terrain, treeIndex: trees, rivers: null, locked: false, fog: true, clouds: true }
    })
}

export async function initView(mapSize: number, initialZoom: number): Promise<MapView> {
    const textureLoader = new TextureLoader()
    const loadTexture = (name: string) => {
        const texture = textureLoader.load(asset(name))
        texture.name = name
        return texture
    }
    const options: MapMeshOptions = {
        terrainAtlas: null,
        terrainAtlasTexture: loadTexture("terrain.png"),
        hillsNormalTexture: loadTexture("hills-normal.png"),
        coastAtlasTexture: loadTexture("coast-diffuse.png"),
        riverAtlasTexture: loadTexture("river-diffuse.png"),
        undiscoveredTexture: loadTexture("paper.jpg"),
        treeSpritesheet: loadTexture("trees.png"),
        treeSpritesheetSubdivisions: 4,
        transitionTexture: loadTexture("transitions.png"),
        treesPerForest: 50,
        gridWidth: 0.025,
        gridColor: new Color(0x42322b),
        gridOpacity: 0.25,

        // options per tree index, varying the different kinds of trees a little
        treeOptions: [
            undefined, // leave default options for trees with index 0 (temperate zone forests)
            { // tundra trees
                treesPerForest: 25
            },
            { // snowy trees
                treesPerForest: 10,
                scale: 0.85
            } // no options for tropical forests (index = 3)
        ]
    }


    const mapView = new MapView()
    mapView.zoom = initialZoom
    const controller = mapView.controller as DefaultMapViewController
    mapView.resourcePanel = document.getElementById("resource-info") as HTMLElement
    mapView.unitInfoPanel = document.getElementById("unit-info") as HTMLElement
    mapView.gameStatePanel = document.getElementById("game-info") as HTMLElement
    mapView.menuPanel = document.getElementById("menu") as HTMLElement
    mapView.actionPanel = document.getElementById("action") as HTMLElement


    // const url = '/assets/game_maps/random.json';
    // await fetch(url)
    // .then(response => {
    //   // Check if the request was successful
    //   if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //   }
    //   return response.json(); // Parse JSON from the response
    // })
    // .then(data => {
    //   console.log('JSON data:', data); // Handle the JSON data
    //   mapView.loadFromJSON(data)
    // })
    let makeNew = true;
    const savedGameName = localStorage.getItem('load_game');
    // console.log(localStorage);
    if (savedGameName) {
        const savedGame = localStorage.getItem(`${savedGameName}`);
        if (savedGame) {
            mapView.loadFromJSON(JSON.parse(savedGame));
            localStorage.removeItem('load_game');
            makeNew = false;
        } else {
            console.error('Failed to load saved game');
        }
    }
    if (makeNew) {
        const [map, atlas] = await Promise.all([generateMap(mapSize), loadTextureAtlas()])
        options.terrainAtlas = atlas
        mapView.load(map, options)
    }

    mapView.onLoaded = () => {
        // uncover tiles around initial selection
        //  setFogAround(mapView, mapView.selectedTile, 100, true, true)
        mapView.initGameSetup();
        mapView._selectedUnit = null;
        mapView.focus(mapView.selectedTile.q + 1, mapView.selectedTile.r -3)
        // setFogAround(mapView, mapView.selectedTile, 5, true, false)
        // setFogAround(mapView, mapView.selectedTile, 5, false, false)
        mapView.updateResourcePanel();
        mapView.updateGameStatePanel();
        mapView.showEndTurnInActionPanel();


        document.body.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target && target.classList.contains('player-negotiation')) {
                event.stopPropagation();
                const dataAttribute = target.getAttribute('data-name');
                mapView.playerNegotiation(dataAttribute);
            }
            if (target && target.classList.contains('player-diplomatic-menu')) {
                event.stopPropagation();
                const dataAttribute = target.getAttribute('data-name');
                const dataTarget = target.getAttribute('data-target');
                mapView.playerDiplmaticAction(dataAttribute, dataTarget);
            }
            if (target && target.classList.contains('main-menu')) {
                console.log('main-menu clicked');
                event.stopPropagation();
                mapView.mainMenu();
            }
            if (target && target.classList.contains('main-menu-option')) {
                event.stopPropagation();
                const dataAttribute = target.getAttribute('data-name');
                mapView.mainMenuOption(dataAttribute);
            }
            if (target && target.id === 'menu-modal') {
                mapView.CloseMenu();
            }
            if (target && target.classList.contains('city-menu')) {
                event.stopPropagation();
                const dataAttribute = target.getAttribute('data-name');
                const dataTarget = target.getAttribute('data-target');
                mapView.cityMenuAction(dataAttribute, dataTarget);
            }
            if (target && target.classList.contains('city-label')) {
                event.stopPropagation();
                const dataAttribute = target.getAttribute('data-target');
                mapView.cityLabelClick(dataAttribute);
            }
            if (target && target.classList.contains('action-menu')) {
                event.stopPropagation();
                const dataAttribute = target.getAttribute('data-name');
                mapView.actionPanelClicked(dataAttribute);
            }
            if (target && target.classList.contains('general-menu')) {
                event.stopPropagation();
                const dataAttribute = target.getAttribute('data-name');
                mapView.generalMenuClicked(dataAttribute);
            }
            if (target && target.classList.contains('menu-trade')) {
                event.stopPropagation();
                mapView.tradeMenuClicked(target);
            }
            if (target && target.classList.contains('research')) {
                event.stopPropagation();
                mapView.pickResearch();
            }
            if (target && target.classList.contains('taxes')) {
                event.stopPropagation();
                mapView.updateTaxes();
            }
        });

    }

    mapView.onTileSelected = (tile: TileData) => {
        // uncover tiles around selection
        setFogAround(mapView, tile,  2, false, false)
        // update unit window
    }

    return mapView
}

// function moveUnitToHex(q, r) {
//     const targetHex = hexMap.getHex(q, r); // Get the hex at q, r
//     if (targetHex) {
//         unit.position.set(targetHex.x, targetHex.y, targetHex.z + 0.5); // Adjust Z for height
//     } else {
//         console.warn("Target hex not found!");
//     }
// }

// // Example move to a hex at q = 2, r = -1
// moveUnitToHex(2, -1);

/**
 * @param fog whether there should be fog on this tile making it appear darker
 * @param clouds whether there should be "clouds", i.e. an opaque texture, hiding the tile
 * @param range number of tiles around the given tile that should be updated
 * @param tile tile around which fog should be updated
 */
function setFogAround(mapView: MapView, tile: TileData, range: number, fog: boolean, clouds: boolean) {
    const tiles = mapView.getTileGrid().neighbors(tile.q, tile.r, range)

    const updated = tiles.map(t => {
        t.fog = fog
        t.clouds = clouds
        return t
    })

    mapView.updateTiles(updated)
}