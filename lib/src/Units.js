define(["require", "exports", "three", "./CSS2DRenderer"], function (require, exports, three_1, CSS2DRenderer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function CreateSettler(player) {
        const unitType = "settler";
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(.8, 1, 1), new three_1.MeshBasicMaterial({
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        }));
        const name = "Settler " + toRoman(1);
        let unit = {
            id: `${player.name}_${unitType}_${unitModel.uuid}`,
            type: unitType,
            name: name,
            health: 1,
            health_max: 10,
            cost: 300,
            movement: 4,
            movement_max: 4,
            attack_range: 0,
            attack: 0,
            defence: 0,
            kills: 0,
            image: "/assets/rifleman.webp",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateSettler = CreateSettler;
    function AddUnitLabel(unitModel, unitID, icon, color) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'unit-label';
        labelDiv.id = unitID;
        labelDiv.innerHTML = `
    <div style="position: relative; display: inline-block;">
        <img src="${icon}" style="width: 90px; height: 100px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: ${color}; mix-blend-mode: color; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);"></div>
    </div>
    `;
        labelDiv.style.fontFamily = 'Arial, sans-serif';
        const unitLabel = new CSS2DRenderer_1.CSS2DObject(labelDiv);
        unitLabel.position.set(0, 0, 0);
        unitModel.add(unitLabel);
    }
    exports.AddUnitLabel = AddUnitLabel;
    function CreateRifleman(player) {
        const unitType = "rifleman";
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(.4, .4, .4), new three_1.MeshBasicMaterial({
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        }));
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        const name = "Rifleman Company " + toRoman(1);
        this.AddUnitLabel(unitModel, unitID, "/assets/map_icons/rifleman.png", player.color);
        let unit = {
            id: unitID,
            type: unitType,
            name: name,
            health: 10,
            health_max: 10,
            movement: 3,
            movement_max: 3,
            attack_range: 1,
            cost: 100,
            attack: 3,
            defence: 0,
            kills: 0,
            image: "/assets/rifleman.webp",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateRifleman = CreateRifleman;
    function CreateCavalry(player) {
        const unitType = "cavalry";
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(.4, .4, .4), new three_1.MeshBasicMaterial({
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        }));
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        this.AddUnitLabel(unitModel, unitID, "/assets/map_icons/horse.png", player.color);
        const name = "Cavalry " + toRoman(1);
        let unit = {
            id: unitID,
            type: unitType,
            name: name,
            health: 10,
            health_max: 10,
            movement: 6,
            movement_max: 6,
            attack_range: 1,
            cost: 200,
            attack: 3,
            defence: 0,
            kills: 0,
            image: "/assets/rifleman.webp",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateCavalry = CreateCavalry;
    function CreateArtillary(player) {
        const unitType = "artillary";
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(.4, .4, .4), new three_1.MeshBasicMaterial({
            color: player.color,
            opacity: .85,
            transparent: true,
            side: THREE.DoubleSide,
        }));
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        this.AddUnitLabel(unitModel, unitID, "/assets/map_icons/artillary.png", player.color);
        const name = "Artillary Company " + toRoman(1);
        let unit = {
            id: `${player.name}_${unitType}_${unitModel.uuid}`,
            type: unitType,
            name: name,
            health: 10,
            health_max: 10,
            cost: 300,
            movement: 2,
            movement_max: 2,
            attack_range: 3,
            attack: 3,
            defence: 0,
            kills: 0,
            image: "/assets/rifleman.webp",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateArtillary = CreateArtillary;
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
        cityLabel.position.set(0, -.82, 0);
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
        updatePopulationAndProductionRates(player, city);
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
    function updatePopulationAndProductionRates(player, improvement) {
        const maxPopulation = 25;
        const taxRateEffect = 1 - (player.taxRate / 1); // 0 makes it go fast, 100 makes it decrease slightly
        // Calculate the new population rate with logarithmic slowdown
        const growthFactor = 4; // Adjust this factor to control the growth rate
        improvement.population_rate = parseFloat((Math.log(maxPopulation - improvement.population + 1) / growthFactor).toFixed(2));
        improvement.population_rate *= taxRateEffect;
        if (player.taxRate === 1) {
            improvement.population_rate = 0;
        }
        improvement.population_rate = Math.round(improvement.population_rate * 100) / 100;
        // unused
        improvement.production_rate = improvement.population;
    }
    exports.updatePopulationAndProductionRates = updatePopulationAndProductionRates;
    // utilities
    function toRoman(num) {
        const romanNumerals = {
            1000: 'M', 900: 'CM', 500: 'D', 400: 'CD',
            100: 'C', 90: 'XC', 50: 'L', 40: 'XL',
            10: 'X', 9: 'IX', 5: 'V', 4: 'IV', 1: 'I'
        };
        let result = '';
        for (const value of Object.keys(romanNumerals).map(Number).sort((a, b) => b - a)) {
            while (num >= value) {
                result += romanNumerals[value];
                num -= value;
            }
        }
        return result;
    }
});
//# sourceMappingURL=Units.js.map