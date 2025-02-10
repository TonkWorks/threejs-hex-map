define(["require", "exports", "../../../../build/three.module.js", "../core/NodeBuilder.js", "../materials/NodeMaterial.js", "./TextureNode.js"], function (require, exports, three_module_js_1, NodeBuilder_js_1, NodeMaterial_js_1, TextureNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function RTTNode(width, height, input, options) {
        options = options || {};
        this.input = input;
        this.clear = options.clear !== undefined ? options.clear : true;
        this.renderTarget = new three_module_js_1.WebGLRenderTarget(width, height, options);
        this.material = new NodeMaterial_js_1.NodeMaterial();
        this.camera = new three_module_js_1.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.scene = new three_module_js_1.Scene();
        this.quad = new three_module_js_1.Mesh(new three_module_js_1.PlaneBufferGeometry(2, 2), this.material);
        this.quad.frustumCulled = false; // Avoid getting clipped
        this.scene.add(this.quad);
        this.render = true;
        TextureNode_js_1.TextureNode.call(this, this.renderTarget.texture);
    }
    exports.RTTNode = RTTNode;
    RTTNode.prototype = Object.create(TextureNode_js_1.TextureNode.prototype);
    RTTNode.prototype.constructor = RTTNode;
    RTTNode.prototype.nodeType = "RTT";
    RTTNode.prototype.build = function (builder, output, uuid) {
        var rttBuilder = new NodeBuilder_js_1.NodeBuilder();
        rttBuilder.nodes = builder.nodes;
        rttBuilder.updaters = builder.updaters;
        this.material.fragment.value = this.input;
        this.material.build({ builder: rttBuilder });
        return TextureNode_js_1.TextureNode.prototype.build.call(this, builder, output, uuid);
    };
    RTTNode.prototype.updateFramesaveTo = function (frame) {
        this.saveTo.render = false;
        if (this.saveTo !== this.saveToCurrent) {
            if (this.saveToMaterial)
                this.saveToMaterial.dispose();
            var material = new NodeMaterial_js_1.NodeMaterial();
            material.fragment.value = this;
            material.build();
            var scene = new three_module_js_1.Scene();
            var quad = new three_module_js_1.Mesh(new three_module_js_1.PlaneBufferGeometry(2, 2), material);
            quad.frustumCulled = false; // Avoid getting clipped
            scene.add(quad);
            this.saveToScene = scene;
            this.saveToMaterial = material;
        }
        this.saveToCurrent = this.saveTo;
        frame.renderer.setRenderTarget(this.saveTo.renderTarget);
        if (this.saveTo.clear)
            frame.renderer.clear();
        frame.renderer.render(this.saveToScene, this.camera);
    };
    RTTNode.prototype.updateFrame = function (frame) {
        if (frame.renderer) {
            // from the second frame
            if (this.saveTo && this.saveTo.render === false) {
                this.updateFramesaveTo(frame);
            }
            if (this.render) {
                if (this.material.uniforms.renderTexture) {
                    this.material.uniforms.renderTexture.value = frame.renderTexture;
                }
                frame.renderer.setRenderTarget(this.renderTarget);
                if (this.clear)
                    frame.renderer.clear();
                frame.renderer.render(this.scene, this.camera);
            }
            // first frame
            if (this.saveTo && this.saveTo.render === true) {
                this.updateFramesaveTo(frame);
            }
        }
        else {
            console.warn("RTTNode need a renderer in NodeFrame");
        }
    };
    RTTNode.prototype.copy = function (source) {
        TextureNode_js_1.TextureNode.prototype.copy.call(this, source);
        this.saveTo = source.saveTo;
        return this;
    };
    RTTNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = TextureNode_js_1.TextureNode.prototype.toJSON.call(this, meta);
            if (this.saveTo)
                data.saveTo = this.saveTo.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=RTTNode.js.map