define(["require", "exports", "three", "./CSS2DRenderer"], function (require, exports, three_1, CSS2DRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function CreateUnit(player) {
        const unitType = "rifleman";
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(.8, 1, 1), new three_1.MeshBasicMaterial({
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        }));
        return {
            id: `${player.name}_${unitType}_${unitModel.uuid}`,
            type: unitType,
            health: 10,
            health_max: 10,
            movement: 2,
            movement_max: 2,
            attack: 3,
            defence: 0,
            image: "/assets/rifleman.webp",
            owner: player.name,
            model: unitModel,
        };
    }
    exports.CreateUnit = CreateUnit;
    // const loader = new THREE.GLTFLoader();
    // loader.load('/models/warrior.glb', (gltf) => {
    //     const model = gltf.scene;
    //     model.position.set(0, 0, 0); // Initial position
    //     scene.add(model);
    //     // Link the model to the unit
    //     warrior.model = model;
    // });
    const americanCities = [
        "Washington",
        "New York",
        "Boston",
        "Philadelphia",
        "Atlanta",
        "Chicago",
        "San Francisco",
        "Los Angeles",
        "Houston",
        "Miami",
        "Seattle",
        "Dallas",
        "Denver",
        "Detroit",
        "Phoenix",
        "San Diego",
        "San Antonio",
        "Las Vegas",
        "St. Louis",
        "Baltimore",
        "Cleveland",
        "Pittsburgh",
        "Minneapolis",
        "Kansas City",
        "New Orleans",
        "Austin",
        "Nashville",
        "Charlotte",
        "Salt Lake City",
        "Portland",
        "Indianapolis",
        "Cincinnati",
        "Buffalo",
        "Oklahoma City",
        "Albuquerque",
        "Tucson",
        "Memphis",
        "Milwaukee",
        "Orlando",
        "Tampa",
        "Sacramento",
        "Columbus",
        "Raleigh",
        "Richmond",
        "San Jose",
        "Birmingham",
        "Providence",
        "Anchorage",
        "Honolulu"
    ];
    function getRandomCity(cities) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        return cities[randomIndex];
    }
    function CreateCity(player) {
        const placeType = "city";
        const cityName = getRandomCity(americanCities);
        const geom = new three_1.RingBufferGeometry(0.001, 1, 6, 1);
        geom.rotateZ(Math.PI / 2);
        const model = new three_1.Mesh(geom, new three_1.MeshBasicMaterial({
            color: player.color,
            opacity: .65,
            transparent: true,
            side: THREE.DoubleSide,
        }));
        const unitID = `${player.name}_${placeType}_${model.uuid}`;
        const population = 1;
        const labelDiv = document.createElement('div');
        labelDiv.className = 'city-label';
        labelDiv.id = unitID;
        labelDiv.textContent = `${cityName} (${population})`;
        labelDiv.style.backgroundColor = 'rgba(84, 18, 138, 0.75)';
        labelDiv.style.color = 'white';
        labelDiv.style.padding = '5px 20px';
        labelDiv.style.borderRadius = '5px';
        labelDiv.style.fontFamily = 'Arial, sans-serif';
        const cityLabel = new CSS2DRenderer_1.CSS2DObject(labelDiv);
        cityLabel.position.set(0, 1.5, 0);
        model.add(cityLabel);
        // TODO get user input for city name
        let city = {
            id: `${player.name}_${placeType}_${model.uuid}`,
            type: placeType,
            image: "/assets/city.webp",
            health: 100,
            name: cityName,
            population: population,
            health_max: 100,
            population_rate: 0,
            production_rate: 0,
            defence: 0,
            owner: player.name,
            model: model,
        };
        updatePopulationAndProductionRates(city);
        return city;
    }
    exports.CreateCity = CreateCity;
    function updateLabel(domID, content) {
        const label = document.getElementById(domID);
        if (label) {
            label.textContent = content;
        }
    }
    exports.updateLabel = updateLabel;
    function updatePopulationAndProductionRates(improvement) {
        improvement.population_rate = parseFloat((0.5 / improvement.population).toFixed(2));
        improvement.production_rate = improvement.population;
    }
    exports.updatePopulationAndProductionRates = updatePopulationAndProductionRates;
});
//# sourceMappingURL=Units copy.js.map