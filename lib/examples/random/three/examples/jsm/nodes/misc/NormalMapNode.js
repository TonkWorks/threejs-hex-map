define(["require", "exports", "../../../../build/three.module.js", "../core/TempNode.js", "../inputs/Vector2Node.js", "../core/FunctionNode.js", "../accessors/UVNode.js", "../accessors/NormalNode.js", "../accessors/PositionNode.js"], function (require, exports, three_module_js_1, TempNode_js_1, Vector2Node_js_1, FunctionNode_js_1, UVNode_js_1, NormalNode_js_1, PositionNode_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function NormalMapNode(value, scale) {
        TempNode_js_1.TempNode.call(this, 'v3');
        this.value = value;
        this.scale = scale || new Vector2Node_js_1.Vector2Node(1, 1);
    }
    exports.NormalMapNode = NormalMapNode;
    NormalMapNode.Nodes = (function () {
        var perturbNormal2Arb = new FunctionNode_js_1.FunctionNode(
        // Per-Pixel Tangent Space Normal Mapping
        // http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html
        `vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 map, vec2 vUv, vec2 normalScale ) {

		// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988

		vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );
		vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );
		vec2 st0 = dFdx( vUv.st );
		vec2 st1 = dFdy( vUv.st );

		float scale = sign( st1.t * st0.s - st0.t * st1.s ); // we do not care about the magnitude

		vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );
		vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );
		vec3 N = normalize( surf_norm );

		vec3 mapN = map * 2.0 - 1.0;

		mapN.xy *= normalScale;

		#ifdef DOUBLE_SIDED

			// Workaround for Adreno GPUs gl_FrontFacing bug. See #15850 and #10331

			if ( dot( cross( S, T ), N ) < 0.0 ) mapN.xy *= - 1.0;

		#else

			mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );

		#endif

		mat3 tsn = mat3( S, T, N );
		return normalize( tsn * mapN );

	}`, null, { derivatives: true });
        return {
            perturbNormal2Arb: perturbNormal2Arb
        };
    })();
    NormalMapNode.prototype = Object.create(TempNode_js_1.TempNode.prototype);
    NormalMapNode.prototype.constructor = NormalMapNode;
    NormalMapNode.prototype.nodeType = "NormalMap";
    NormalMapNode.prototype.generate = function (builder, output) {
        if (builder.isShader('fragment')) {
            var perturbNormal2Arb = builder.include(NormalMapNode.Nodes.perturbNormal2Arb);
            this.normal = this.normal || new NormalNode_js_1.NormalNode();
            this.position = this.position || new PositionNode_js_1.PositionNode(PositionNode_js_1.PositionNode.VIEW);
            this.uv = this.uv || new UVNode_js_1.UVNode();
            var scale = this.scale.build(builder, 'v2');
            if (builder.material.side === three_module_js_1.BackSide) {
                scale = '-' + scale;
            }
            return builder.format(perturbNormal2Arb + '( -' + this.position.build(builder, 'v3') + ', ' +
                this.normal.build(builder, 'v3') + ', ' +
                this.value.build(builder, 'v3') + ', ' +
                this.uv.build(builder, 'v2') + ', ' +
                scale + ' )', this.getType(builder), output);
        }
        else {
            console.warn("THREE.NormalMapNode is not compatible with " + builder.shader + " shader.");
            return builder.format('vec3( 0.0 )', this.getType(builder), output);
        }
    };
    NormalMapNode.prototype.copy = function (source) {
        TempNode_js_1.TempNode.prototype.copy.call(this, source);
        this.value = source.value;
        this.scale = source.scale;
        return this;
    };
    NormalMapNode.prototype.toJSON = function (meta) {
        var data = this.getJSONNode(meta);
        if (!data) {
            data = this.createJSONNode(meta);
            data.value = this.value.toJSON(meta).uuid;
            data.scale = this.scale.toJSON(meta).uuid;
        }
        return data;
    };
});
//# sourceMappingURL=NormalMapNode.js.map