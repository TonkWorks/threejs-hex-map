define(["require", "exports", "three", "./CSS3DRenderer", "./Nations"], function (require, exports, three_1, CSS3DRenderer_1, Nations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createUnitModel(image) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'unit-model';
        labelDiv.innerHTML = `
        <img src="${image}" style="width: 100px; height: 100px;">
    `;
        const model = new CSS3DRenderer_1.CSS3DObject(labelDiv);
        model.position.set(0, 0, 0);
        model.rotateX(Math.PI / 6);
        model.scale.set(.01, .01, .01);
        return model;
    }
    exports.createUnitModel = createUnitModel;
    function AddUnitLabel(unitModel, unitID, icon, color) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'unit-label';
        labelDiv.id = `${unitID}-label`;
        labelDiv.innerHTML = `
    <div style="position: relative; display: inline-block;">
        <img src="${icon}" style="width: 90px; height: 100px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: ${color}; mix-blend-mode: color; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);"></div>
    </div>
    `;
        labelDiv.style.fontFamily = 'Arial, sans-serif';
        const unitLabel = new CSS3DRenderer_1.CSS3DObject(labelDiv);
        unitLabel.position.set(0, .9, 0);
        unitLabel.scale.set(.006, .006, .006);
        unitModel.add(unitLabel);
    }
    exports.AddUnitLabel = AddUnitLabel;
    function CreateRifleman(player) {
        const unitType = "rifleman";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/units/rifleman.png");
        // texture.magFilter = NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(2, 1, .001), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            // opacity: .95,
            transparent: true,
            side: three_1.FrontSide,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 6);
        // const unitModel = createUnitModel("/assets/unit_icons/rifleman.png");
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
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/units/cavalry.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(2.6, 1.3, .001), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 6);
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
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/units/artillary.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(1.1, 1.1, .001), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 6);
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
    function getRandomCity(cities) {
        const randomIndex = Math.floor(Math.random() * cities.length);
        return cities[randomIndex];
    }
    function getNextCity(player) {
        const nation = Nations_1.Nations[player.nation];
        if (player.cityIndex >= nation.cities.length) {
            player.cityIndex = 0;
        }
        return nation.cities[player.cityIndex];
    }
    function CreateCity(player) {
        const placeType = "city";
        const nation = Nations_1.Nations[player.nation];
        const cityName = getNextCity(player);
        player.cityIndex += 1;
        // const geom = new RingBufferGeometry(0.001, 1, 6, 1)
        // geom.rotateZ(Math.PI/2)
        // const model = new Mesh(
        //     geom,
        //     new MeshBasicMaterial({ 
        //         color: player.color,
        //         opacity: .65,
        //         transparent: true,
        //         side: FrontSide,
        //     })
        // );
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/units/city.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.RingBufferGeometry(0.001, 1.3, 6, .001), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 6);
        const unitID = `${player.name}_${placeType}_${unitModel.uuid}`;
        const population = 1;
        const labelDiv = document.createElement('div');
        labelDiv.className = 'city-label';
        labelDiv.id = unitID;
        const img = `<img src="${nation.flag_image}" style="padding-right:10px;" width="30px" height="25px"/>`;
        labelDiv.innerHTML = `<span class="city-label">${img} ${cityName} (${population}) </span>`;
        const cityLabel = new CSS3DRenderer_1.CSS3DObject(labelDiv);
        cityLabel.position.set(0, -.82, .3);
        // cityLabel.rotateX(Math.PI / 6);
        cityLabel.scale.set(.01, .01, .01);
        unitModel.add(cityLabel);
        unitModel.visible = false;
        // TODO get user input for city name
        let city = {
            id: unitID,
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
            model: unitModel,
        };
        updatePopulationAndProductionRates(player, city);
        return city;
    }
    exports.CreateCity = CreateCity;
    function updateLabel(domID, content) {
        const label = document.getElementById(domID);
        if (label) {
            label.innerHTML = content;
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
    exports.ResourceMap = {
        "box": {
            name: "box",
            image: "/assets/map/resources/box.png",
            gold: 5,
        },
        "coal": {
            name: "coal",
            image: "/assets/map/resources/coal.png",
            gold: 5,
        },
        "corn": {
            name: "corn",
            image: "/assets/map/resources/corn.png",
            gold: 5,
        },
        "gold": {
            name: "gold",
            image: "/assets/map/resources/gold.png",
            gold: 5,
        },
        "meat": {
            name: "meat",
            image: "/assets/map/resources/meat.png",
            gold: 5,
        },
        "sheep": {
            name: "sheep",
            image: "/assets/map/resources/sheep.png",
            gold: 5,
        },
        "wheat": {
            name: "wheat",
            image: "/assets/map/resources/wheat.png",
            gold: 5,
        },
        "wood": {
            name: "wood",
            image: "/assets/map/resources/wood.png",
            gold: 5,
        }
    };
    function CreateResourceModel(resource) {
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load(`../../${resource.image}`);
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(.6, .6, .001), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 6);
        return {
            name: resource.name,
            image: resource.image,
            gold: resource.gold,
            model: unitModel,
        };
    }
    exports.CreateResourceModel = CreateResourceModel;
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