define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WorkerImprovementMap = void 0;
    exports.CreateWorkerImprovement = CreateWorkerImprovement;
    exports.WorkerImprovementMap = {
        "farm": {
            type: "farm",
            description: "Increases food +2",
            images: ["../../assets/map/improvements/farm1.png", "../../assets/map/improvements/farm2.png"],
            yields: {
                food: 2,
            },
        },
        "mine": {
            type: "mine",
            description: "Increases production +2",
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
        if (index === -1) {
            index = Math.floor(Math.random() * improvement.images.length);
        }
        const texture = textureLoader.load(improvement.images[index]);
        texture.magFilter = three_1.NearestFilter;
        const unitModel = new three_1.Mesh(new three_1.PlaneBufferGeometry(1.5, 1.5), new three_1.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: three_1.FrontSide,
            alphaTest: .5,
        }));
        unitModel.castShadow = false;
        unitModel.receiveShadow = false;
        unitModel.visible = false;
        unitModel.rotateX(Math.PI / 9);
        let unitID = `${type}_${unitModel.uuid}`;
        return {
            id: unitID,
            type: type,
            model: unitModel,
            index: index,
            yields: improvement.yields,
        };
    }
});
//# sourceMappingURL=ImprovementsWorker.js.map