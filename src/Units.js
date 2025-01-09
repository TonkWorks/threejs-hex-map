define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // const loader = new THREE.GLTFLoader();
    // loader.load('/models/warrior.glb', (gltf) => {
    //     const model = gltf.scene;
    //     model.position.set(0, 0, 0); // Initial position
    //     scene.add(model);
    //     // Link the model to the unit
    //     warrior.model = model;
    // });
    function moveUnit(unit, targetPosition) {
        if (unit.movement > 0) {
            // unit.position.copy(targetPosition);
            // if (unit.model) {
            //     unit.model.position.copy(targetPosition);
            // }
            unit.movement -= 1;
        }
    }
    function attack(attacker, defender) {
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
});
//# sourceMappingURL=Units.js.map