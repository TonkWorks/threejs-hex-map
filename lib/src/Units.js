define(["require", "exports", "three", "./CSS3DRenderer", "./Nations", "./util"], function (require, exports, three_1, CSS3DRenderer_1, Nations_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UnitMap = {
        "rifleman": {
            create: CreateRifleman,
            cost: 100,
            moveSounds: [util_1.asset("sounds/units/rifelman.mp3")],
            attackSounds: [util_1.asset("sounds/units/rifelman_attack.mp3")],
        },
        "infantry": {
            create: CreateInfantry,
            cost: 200,
            moveSounds: [util_1.asset("sounds/units/rifelman.mp3")],
            attackSounds: [util_1.asset("sounds/units/rifelman_attack.mp3")],
        },
        "cavalry": {
            create: CreateCavalry,
            cost: 200,
            moveSounds: [util_1.asset("sounds/units/rifelman.mp3")],
            attackSounds: [util_1.asset("sounds/units/rifelman_attack.mp3")],
        },
        "tank": {
            create: CreateTank,
            cost: 200,
            moveSounds: [util_1.asset("sounds/units/tank.mp3")],
            attackSounds: [util_1.asset("sounds/units/cinematic_boom.mp3")],
        },
        "artillary": {
            create: CreateArtillary,
            cost: 300,
            moveSounds: [util_1.asset("sounds/units/artillary.mp3")],
            attackSounds: [util_1.asset("sounds/units/cinematic_boom.mp3")],
        },
        "boat": {
            create: CreateBoat,
            cost: 500,
            moveSounds: [util_1.asset("sounds/units/boat.mp3")],
            attackSounds: [util_1.asset("sounds/units/cinematic_boom.mp3")],
        },
        "destroyer": {
            create: CreateDestroyer,
            cost: 1000,
            moveSounds: [util_1.asset("sounds/units/destroyer.mp3")],
            attackSounds: [util_1.asset("sounds/units/cinematic_boom.mp3")],
        },
        "gunship": {
            create: CreateGunshp,
            cost: 1000,
            moveSounds: [util_1.asset("sounds/units/gunship.mp3")],
            attackSounds: [util_1.asset("sounds/units/cinematic_boom.mp3")],
        },
    };
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
    function AddUnitLabel(unitModel, unitID, icon, color, text = "") {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'unit-label';
        labelDiv.id = `${unitID}-label`;
        labelDiv.innerHTML = `
        <img src="${icon}" style="width: 90px; height: 100px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: ${color}; mix-blend-mode: color; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);">
    `;
        labelDiv.style.fontFamily = 'Arial, sans-serif';
        const unitLabel = new CSS3DRenderer_1.CSS3DObject(labelDiv);
        unitLabel.position.set(0, .5, 0);
        unitLabel.scale.set(.004, .004, .004);
        labelDiv.style.pointerEvents = 'none';
        unitModel.add(unitLabel);
    }
    exports.AddUnitLabel = AddUnitLabel;
    function CreateRifleman(player) {
        const unitType = "rifleman";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/rifleman.png");
        // texture.magFilter = NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(4 / 3, 2 / 3), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            // opacity: .95,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        // const unitModel = createUnitModel("/assets/ui/units/rifleman.png");
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        const name = "Rifleman Company " + toRoman(1);
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/rifleman.png", player.color);
        let unit = {
            id: unitID,
            type: unitType,
            name: name,
            health: 10,
            health_max: 10,
            movement: 3,
            movement_max: 3,
            attack_range: 1,
            attack: 3,
            defence: 0,
            kills: 0,
            land: true,
            water: false,
            offset: 0,
            image: "/assets/rifleman.webp",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateRifleman = CreateRifleman;
    function CreateInfantry(player) {
        const unitType = "infantry";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/infantry.png");
        // texture.magFilter = NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(4 / 3, 2 / 3), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            // opacity: .95,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        // const unitModel = createUnitModel("/assets/ui/units/rifleman.png");
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        const name = "Infantry Company " + toRoman(1);
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/infantry.png", player.color);
        let unit = {
            id: unitID,
            type: unitType,
            name: name,
            health: 20,
            health_max: 20,
            movement: 4,
            movement_max: 4,
            attack_range: 1,
            attack: 10,
            defence: 0,
            kills: 0,
            land: true,
            water: false,
            offset: 0,
            image: "/assets/rifleman.webp",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateInfantry = CreateInfantry;
    function CreateCavalry(player) {
        const unitType = "cavalry";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/cavalry.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(2.6 * 2 / 3, 1.3 * 2 / 3), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/horse.png", player.color);
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
            attack: 3,
            defence: 0,
            kills: 0,
            land: true,
            water: false,
            offset: .29,
            image: "/assets/map/icons/horse.png",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateCavalry = CreateCavalry;
    function CreateTank(player) {
        const unitType = "tank";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/tank.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(1, 1), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/tank.png", player.color);
        const name = "Column " + toRoman(1);
        let unit = {
            id: unitID,
            type: unitType,
            name: name,
            health: 10,
            health_max: 10,
            movement: 6,
            movement_max: 6,
            attack_range: 1,
            attack: 3,
            defence: 0,
            kills: 0,
            land: true,
            water: false,
            offset: .2,
            image: "/assets/map/icons/tank.png",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateTank = CreateTank;
    function CreateArtillary(player) {
        const unitType = "artillary";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/artillary.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(1.1 * 2 / 3, 1.1 * 2 / 3), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/artillary.png", player.color);
        const name = "Artillary Company " + toRoman(1);
        let unit = {
            id: `${player.name}_${unitType}_${unitModel.uuid}`,
            type: unitType,
            name: name,
            health: 10,
            health_max: 10,
            movement: 2,
            movement_max: 2,
            attack_range: 3,
            attack: 3,
            defence: 0,
            kills: 0,
            land: true,
            water: false,
            offset: .29,
            image: "/assets/map/icons/artillary.png",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateArtillary = CreateArtillary;
    function CreateBoat(player) {
        const unitType = "boat";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/boat.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(1.5, 1.5), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/boat.png", player.color);
        const name = "SS FAFO";
        let unit = {
            id: `${player.name}_${unitType}_${unitModel.uuid}`,
            type: unitType,
            name: name,
            health: 10,
            health_max: 10,
            movement: 10,
            movement_max: 10,
            attack_range: 6,
            attack: 10,
            defence: 0,
            kills: 0,
            land: false,
            water: true,
            offset: .5,
            image: "/assets/map/units/boat.png",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateBoat = CreateBoat;
    function CreateDestroyer(player) {
        const unitType = "destroyer";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/destroyer.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(1.5, 1.5), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        unitModel;
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        const name = "SS FAFO";
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/destroyer.png", player.color);
        let unit = {
            id: `${player.name}_${unitType}_${unitModel.uuid}`,
            type: unitType,
            name: name,
            health: 20,
            health_max: 20,
            movement: 18,
            movement_max: 18,
            attack_range: 10,
            attack: 20,
            defence: 0,
            kills: 0,
            land: false,
            water: true,
            offset: 0,
            image: "/assets/map/units/destroyer.png",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateDestroyer = CreateDestroyer;
    function CreateGunshp(player) {
        const unitType = "gunship";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/gunship.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(1.5, 1.5), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        unitModel;
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/gunship.png", player.color);
        const name = "Gunship";
        let unit = {
            id: `${player.name}_${unitType}_${unitModel.uuid}`,
            type: unitType,
            name: name,
            health: 10,
            health_max: 10,
            movement: 18,
            movement_max: 18,
            attack_range: 2,
            attack: 20,
            defence: 0,
            kills: 0,
            land: true,
            water: true,
            offset: .5,
            image: "/assets/map/units/gunship.png",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateGunshp = CreateGunshp;
    function CreateMissile(player) {
        const unitType = "missile";
        const textureLoader = new three_1.TextureLoader();
        const texture = textureLoader.load("../../assets/map/units/missile.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(1.5, 1.5), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        unitModel;
        const unitID = `${player.name}_${unitType}_${unitModel.uuid}`;
        AddUnitLabel(unitModel, unitID, "/assets/map/icons/missile.png", player.color);
        const name = "Missile";
        let unit = {
            id: `${player.name}_${unitType}_${unitModel.uuid}`,
            type: unitType,
            name: name,
            health: 1,
            health_max: 1,
            movement: 5,
            movement_max: 5,
            attack_range: 20,
            attack: 100,
            defence: 0,
            kills: 0,
            land: true,
            water: false,
            offset: .5,
            image: "/assets/map/units/missile.png",
            owner: player.name,
            model: unitModel,
        };
        return unit;
    }
    exports.CreateMissile = CreateMissile;
    function LoadSavedUnit(unit, player) {
        let newUnit = exports.UnitMap[unit.type].create(player);
        unit.model = newUnit.model;
        return unit;
    }
    exports.LoadSavedUnit = LoadSavedUnit;
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
    function getNextCityName(player) {
        const nation = Nations_1.Nations[player.nation];
        if (player.cityIndex >= nation.cities.length) {
            player.cityIndex = 0;
        }
        return nation.cities[player.cityIndex];
    }
    exports.getNextCityName = getNextCityName;
    function CreateCity(player, name = "") {
        const placeType = "city";
        const nation = Nations_1.Nations[player.nation];
        let cityName = name;
        if (cityName === "") {
            cityName = getNextCityName(player);
        }
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
        const texture = textureLoader.load("../../assets/map/units/city2.png");
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(1.5, 1.5), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        // unitModel.castShadow = false;
        // unitModel.receiveShadow = false;
        unitModel.rotateX(Math.PI / 4.5);
        const unitID = `${player.name}_${placeType}_${unitModel.uuid}`;
        const population = 1;
        const labelDiv = document.createElement('div');
        labelDiv.className = 'city-label';
        labelDiv.id = unitID;
        const img = `<img src="${nation.flag_image}" style="padding-right:10px;" height="25px"/>`;
        labelDiv.innerHTML = `<span class="city-label">${img} ${cityName} (${population}) </span>`;
        labelDiv.style.pointerEvents = 'none';
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
    function createTerritoryOverlayModel(player) {
        const geom = new three_1.RingBufferGeometry(0.001, 1, 6, 1);
        geom.rotateZ(Math.PI / 2);
        const model = new three_1.Mesh(geom, new three_1.MeshBasicMaterial({
            color: player.color,
            opacity: .35,
            transparent: true,
            side: three_1.FrontSide,
        }));
        model.visible = false;
        return model;
    }
    exports.createTerritoryOverlayModel = createTerritoryOverlayModel;
    function createCityOverlayModel() {
        const geom = new three_1.RingBufferGeometry(0.001, .4, 6, 1);
        geom.rotateZ(Math.PI / 2);
        const model = new three_1.Mesh(geom, new three_1.MeshBasicMaterial({
            color: "white",
            opacity: 1,
            transparent: true,
            side: three_1.FrontSide,
        }));
        model.visible = false;
        return model;
    }
    exports.createCityOverlayModel = createCityOverlayModel;
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
        const unitModel = new three_1.Mesh(new three_1.BoxBufferGeometry(.4, .4, .001), new three_1.MeshBasicMaterial({
            // color: player.color,
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
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