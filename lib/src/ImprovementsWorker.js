define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkerImprovementMap = void 0;
    exports.CreateWorkerImprovement = CreateWorkerImprovement;
    exports.WorkerImprovementMap = {
        "farm": {
            type: "farm",
            description: "Increases food +2",
            flatten: true,
            images: ["../../assets/map/improvements/farm8.png"],
            // images: ["../../assets/map/improvements/farm1.png", "../../assets/map/improvements/farm2.png","../../assets/map/improvements/farm3.png", "../../assets/map/improvements/farm4.png","../../assets/map/improvements/farm5.png"],
            research_needed: "agriculture",
            yields: {
                food: 2,
            },
        },
        "ranch": {
            type: "ranch",
            description: "Increases food +2; develops resource",
            flatten: true,
            research_needed: "animal_husbandry",
            images: ["../../assets/map/improvements/farm8.png"],
            yields: {
                food: 2,
            },
        },
        "mine": {
            type: "mine",
            description: "Increases production +2",
            research_needed: "mining",
            images: ["../../assets/map/improvements/mine.png"],
            yields: {
                production: 2,
            },
        },
        "quarry": {
            type: "quarry",
            description: "Increases production +2; develops resource",
            research_needed: "advanced_mining",
            images: ["../../assets/map/improvements/mine.png"],
            yields: {
                production: 2,
            },
        },
        // barbarian
        "encampent": {
            type: "encampent",
            barbarian: true,
            description: "",
            images: ["../../assets/map/improvements/mine.png"],
            yields: {},
        },
        "goodie_hut": {
            type: "goodie_hut",
            barbarian: true,
            description: "",
            images: ["../../assets/map/units/goodie_hut.png"],
            yields: {},
        },
    };
    function CreateWorkerImprovement(type, index = -1) {
        const textureLoader = new three_1.TextureLoader();
        let improvement = exports.WorkerImprovementMap[type];
        if (!improvement) {
            console.error(`Improvement type "${type}" not found.`);
            return null;
        }
        if (index === -1) {
            index = Math.floor(Math.random() * improvement.images.length);
        }
        const texture = textureLoader.load(improvement.images[index]);
        texture.magFilter = three_1.NearestFilter;
        let geom = null;
        if (improvement.flatten) {
            texture.magFilter = three_1.LinearFilter;
            geom = new three_1.RingBufferGeometry(0.001, .95, 6, 1);
            texture.wrapS = texture.wrapT = three_1.RepeatWrapping;
            const randomRotationAngle = Math.floor(Math.random() * 6) * (Math.PI / 3);
            texture.rotation = randomRotationAngle;
            texture.offset.set(Math.random(), Math.random());
            texture.repeat.set(2, 2);
        }
        else {
            geom = new three_1.PlaneBufferGeometry(1, 1);
        }
        const unitModel = new three_1.Mesh(geom, new three_1.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.visible = false;
        if (improvement.flatten) {
            unitModel.rotateZ(Math.PI / 2);
        }
        else {
            unitModel.rotateX(Math.PI / 9);
        }
        let unitID = `${type}_${unitModel.uuid}`;
        return {
            id: unitID,
            type: type,
            completion: 1,
            flatten: improvement.flatten,
            model: unitModel,
            index: index,
            yields: improvement.yields,
        };
    }
});
//# sourceMappingURL=ImprovementsWorker.js.map