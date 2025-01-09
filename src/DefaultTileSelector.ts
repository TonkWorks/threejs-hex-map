import { createHexagon } from './hexagon';
import { RingGeometry, RingBufferGeometry, MeshBasicMaterial, Mesh } from "three"

const selector = new Mesh(
    new RingBufferGeometry(0.85, 1, 6, 2), 
    new MeshBasicMaterial({
        color: 0xffff00
    }))
selector.rotateZ(Math.PI/2)

export default selector