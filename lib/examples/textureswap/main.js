var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "view", "input", "./util"], function (require, exports, view_1, input_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const mapSize = util_1.paramInt("size", 96);
    const zoom = util_1.paramFloat("zoom", 25);
    function init() {
        return __awaiter(this, void 0, void 0, function* () {
            const mapView = yield view_1.initView(mapSize, zoom);
            input_1.initInput(mapView);
            // texture swap
            const containers = document.querySelectorAll("#textures div");
            console.log(containers);
            for (let i = 0; i < containers.length; i++) {
                const container = containers.item(i);
                const name = container.id;
                container.addEventListener("dragenter", noop, false);
                container.addEventListener("dragexit", noop, false);
                container.addEventListener("dragover", noop, false);
                container.addEventListener("drop", (e) => {
                    e.preventDefault();
                    replaceTexture(mapView, name, e.dataTransfer.files[0]);
                }, false);
            }
        });
    }
    function noop(e) {
        e.preventDefault();
    }
    function replaceTexture(mapView, name, image) {
        const img = document.createElement("img");
        img.onload = () => {
            console.log("Replacing texture " + name + "...");
            const texture = new THREE.Texture(img);
            mapView.mapMesh.replaceTextures({ [name]: texture });
        };
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(image);
    }
    init();
});
//# sourceMappingURL=main.js.map