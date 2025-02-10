define(["require", "exports", "../../../../build/three.module.js", "../materials/NodeMaterial.js", "../inputs/ScreenNode.js"], function (require, exports, three_module_js_1, NodeMaterial_js_1, ScreenNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function NodePostProcessing(renderer, renderTarget) {
        if (renderTarget === undefined) {
            var parameters = {
                minFilter: three_module_js_1.LinearFilter,
                magFilter: three_module_js_1.LinearFilter,
                format: three_module_js_1.RGBAFormat
            };
            var size = renderer.getDrawingBufferSize(new three_module_js_1.Vector2());
            renderTarget = new three_module_js_1.WebGLRenderTarget(size.width, size.height, parameters);
        }
        this.renderer = renderer;
        this.renderTarget = renderTarget;
        this.output = new ScreenNode_js_1.ScreenNode();
        this.material = new NodeMaterial_js_1.NodeMaterial();
        this.camera = new three_module_js_1.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new three_module_js_1.Scene();
        this.quad = new three_module_js_1.Mesh(new three_module_js_1.PlaneBufferGeometry(2, 2), this.material);
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.scene.add(this.quad);
        this.needsUpdate = true;
    }
    exports.NodePostProcessing = NodePostProcessing;
    NodePostProcessing.prototype = {
        constructor: NodePostProcessing,
        render: function (scene, camera, frame) {
            if (this.needsUpdate) {
                this.material.dispose();
                this.material.fragment.value = this.output;
                this.material.build();
                if (this.material.uniforms.renderTexture) {
                    this.material.uniforms.renderTexture.value = this.renderTarget.texture;
                }
                this.needsUpdate = false;
            }
            frame.setRenderer(this.renderer)
                .setRenderTexture(this.renderTarget.texture);
            this.renderer.setRenderTarget(this.renderTarget);
            this.renderer.render(scene, camera);
            frame.updateNode(this.material);
            this.renderer.setRenderTarget(null);
            this.renderer.render(this.scene, this.camera);
        },
        setPixelRatio: function (value) {
            this.renderer.setPixelRatio(value);
            var size = this.renderer.getSize(new three_module_js_1.Vector2());
            this.setSize(size.width, size.height);
        },
        setSize: function (width, height) {
            var pixelRatio = this.renderer.getPixelRatio();
            this.renderTarget.setSize(width * pixelRatio, height * pixelRatio);
            this.renderer.setSize(width, height);
        },
        copy: function (source) {
            this.output = source.output;
            return this;
        },
        toJSON: function (meta) {
            var isRootObject = (meta === undefined || typeof meta === 'string');
            if (isRootObject) {
                meta = {
                    nodes: {}
                };
            }
            if (meta && !meta.post)
                meta.post = {};
            if (!meta.post[this.uuid]) {
                var data = {};
                data.uuid = this.uuid;
                data.type = "NodePostProcessing";
                meta.post[this.uuid] = data;
                if (this.name !== "")
                    data.name = this.name;
                if (JSON.stringify(this.userData) !== '{}')
                    data.userData = this.userData;
                data.output = this.output.toJSON(meta).uuid;
            }
            meta.post = this.uuid;
            return meta;
        }
    };
});
//# sourceMappingURL=NodePostProcessing.js.map