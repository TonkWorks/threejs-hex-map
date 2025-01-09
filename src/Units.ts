import {Object3D, Texture, Points, PointsMaterial, BufferAttribute, BufferGeometry, Vector3, Mesh, Color,
    ShaderMaterial, RawShaderMaterial} from "three"


      
export interface Unit {
    id: string; // Unique identifier
    type: string; // Unit type (e.g., "warrior", "archer", "settler")
    health: number; // Health points
    movement: number; // Remaining movement points
    movementOrders?: {
        q: number;
        r: number;
    };
    owner: string; // Player or faction ID
    model?: Mesh; // Reference to the 3D model in the scene
}

// const loader = new THREE.GLTFLoader();
// loader.load('/models/warrior.glb', (gltf) => {
//     const model = gltf.scene;
//     model.position.set(0, 0, 0); // Initial position
//     scene.add(model);

//     // Link the model to the unit
//     warrior.model = model;
// });


function moveUnit(unit: Unit, targetPosition: THREE.Vector3) {
    if (unit.movement > 0) {
        // unit.position.copy(targetPosition);
        // if (unit.model) {
        //     unit.model.position.copy(targetPosition);
        // }
        unit.movement -= 1;
    }
}
function attack(attacker: Unit, defender: Unit) {
    const damage = 10; // Example damage calculation
    defender.health -= damage;
    if (defender.health <= 0) {
        console.log(`${defender.type} is defeated!`);
        // if (defender.model) {
        //     scene.remove(defender.model); // Remove from scene
        // }
        // Units.delete(defender.id); // Remove from game state
    }
}

export default Unit;
