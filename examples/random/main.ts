import { initView } from "./view"
import { initInput } from "./input"
import { paramInt, paramFloat } from './util';
import { qrRange, range } from '../../src/util';

const mapSize = paramInt("size", 40)
const zoom = paramFloat("zoom", 20)
async function init() {
    const mapView = await initView(mapSize, zoom)
    initInput(mapView)
}

init()

