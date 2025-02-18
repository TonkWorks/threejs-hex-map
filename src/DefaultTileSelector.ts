import { createHexagon } from './hexagon';
import { RingGeometry, RingBufferGeometry, MeshBasicMaterial, Mesh } from "three"

const selector = new Mesh(
    new RingBufferGeometry(0.90, 1, 6, 2), 
    new MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.5,
    }))
selector.rotateZ(Math.PI/2)

export default selector