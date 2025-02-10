define(["require", "exports", "./constants.js", "../../../../build/three.module.js"], function (require, exports, constants_js_1, three_module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WebGPURenderPipelines {
        constructor(renderer, properties, device, glslang, sampleCount) {
            this.renderer = renderer;
            this.properties = properties;
            this.device = device;
            this.glslang = glslang;
            this.sampleCount = sampleCount;
            this.pipelines = new WeakMap();
            this.shaderAttributes = new WeakMap();
            this.shaderModules = {
                vertex: new WeakMap(),
                fragment: new WeakMap()
            };
        }
        get(object) {
            // @TODO: Avoid a 1:1 relationship between pipelines and objects. It's necessary
            // to check various conditions in order to request an appropriate pipeline.
            //
            // - material's version and node configuration
            // - environment map (material)
            // - fog and environment (scene)
            // - output encoding (renderer)
            // - light state
            // - clipping planes
            //
            // The renderer needs to manage multiple pipelines per object so
            // GPUDevice.createRenderPipeline() is only called when no pipeline exists for the
            // current configuration.
            let pipeline = this.pipelines.get(object);
            if (pipeline === undefined) {
                const device = this.device;
                const material = object.material;
                // shader source
                let shader;
                if (material.isMeshBasicMaterial) {
                    shader = ShaderLib.mesh_basic;
                }
                else if (material.isPointsMaterial) {
                    shader = ShaderLib.points_basic;
                }
                else if (material.isLineBasicMaterial) {
                    shader = ShaderLib.line_basic;
                }
                else {
                    console.error('THREE.WebGPURenderer: Unknwon shader type.');
                }
                // shader modules
                const glslang = this.glslang;
                let moduleVertex = this.shaderModules.vertex.get(shader);
                if (moduleVertex === undefined) {
                    const byteCodeVertex = glslang.compileGLSL(shader.vertexShader, 'vertex');
                    moduleVertex = {
                        module: device.createShaderModule({ code: byteCodeVertex }),
                        entryPoint: 'main'
                    };
                    this.shaderModules.vertex.set(shader, moduleVertex);
                }
                let moduleFragment = this.shaderModules.fragment.get(shader);
                if (moduleFragment === undefined) {
                    const byteCodeFragment = glslang.compileGLSL(shader.fragmentShader, 'fragment');
                    moduleFragment = {
                        module: device.createShaderModule({ code: byteCodeFragment }),
                        entryPoint: 'main'
                    };
                    this.shaderModules.fragment.set(shader, moduleFragment);
                }
                // determine shader attributes
                const shaderAttributes = this._parseShaderAttributes(shader.vertexShader);
                // vertex buffers
                const vertexBuffers = [];
                const geometry = object.geometry;
                for (const attribute of shaderAttributes) {
                    const name = attribute.name;
                    const geometryAttribute = geometry.getAttribute(name);
                    const stepMode = (geometryAttribute !== undefined && geometryAttribute.isInstancedBufferAttribute) ? constants_js_1.GPUInputStepMode.Instance : constants_js_1.GPUInputStepMode.Vertex;
                    vertexBuffers.push({
                        arrayStride: attribute.arrayStride,
                        attributes: [{ shaderLocation: attribute.slot, offset: 0, format: attribute.format }],
                        stepMode: stepMode
                    });
                }
                //
                let indexFormat;
                if (object.isLine) {
                    const count = (geometry.index) ? geometry.index.count : geometry.attributes.position.count;
                    indexFormat = (count > 65535) ? constants_js_1.GPUIndexFormat.Uint32 : constants_js_1.GPUIndexFormat.Uint16; // define data type for primitive restart value
                }
                //
                let alphaBlend = {};
                let colorBlend = {};
                if (material.transparent === true && material.blending !== three_module_js_1.NoBlending) {
                    alphaBlend = this._getAlphaBlend(material);
                    colorBlend = this._getColorBlend(material);
                }
                //
                let stencilFront = {};
                if (material.stencilWrite === true) {
                    stencilFront = {
                        compare: this._getStencilCompare(material),
                        failOp: this._getStencilOperation(material.stencilFail),
                        depthFailOp: this._getStencilOperation(material.stencilZFail),
                        passOp: this._getStencilOperation(material.stencilZPass)
                    };
                }
                // pipeline
                const primitiveTopology = this._getPrimitiveTopology(object);
                const rasterizationState = this._getRasterizationStateDescriptor(material);
                const colorWriteMask = this._getColorWriteMask(material);
                const depthCompare = this._getDepthCompare(material);
                const colorFormat = this._getColorFormat(this.renderer);
                const depthStencilFormat = this._getDepthStencilFormat(this.renderer);
                pipeline = device.createRenderPipeline({
                    vertexStage: moduleVertex,
                    fragmentStage: moduleFragment,
                    primitiveTopology: primitiveTopology,
                    rasterizationState: rasterizationState,
                    colorStates: [{
                            format: colorFormat,
                            alphaBlend: alphaBlend,
                            colorBlend: colorBlend,
                            writeMask: colorWriteMask
                        }],
                    depthStencilState: {
                        format: depthStencilFormat,
                        depthWriteEnabled: material.depthWrite,
                        depthCompare: depthCompare,
                        stencilFront: stencilFront,
                        stencilBack: {},
                        stencilReadMask: material.stencilFuncMask,
                        stencilWriteMask: material.stencilWriteMask
                    },
                    vertexState: {
                        indexFormat: indexFormat,
                        vertexBuffers: vertexBuffers
                    },
                    sampleCount: this.sampleCount
                });
                this.pipelines.set(object, pipeline);
                this.shaderAttributes.set(pipeline, shaderAttributes);
            }
            return pipeline;
        }
        getShaderAttributes(pipeline) {
            return this.shaderAttributes.get(pipeline);
        }
        dispose() {
            this.pipelines = new WeakMap();
            this.shaderAttributes = new WeakMap();
            this.shaderModules = {
                vertex: new WeakMap(),
                fragment: new WeakMap()
            };
        }
        _getArrayStride(type) {
            // @TODO: This code is GLSL specific. We need to update when we switch to WGSL.
            if (type === 'float')
                return 4;
            if (type === 'vec2')
                return 8;
            if (type === 'vec3')
                return 12;
            if (type === 'vec4')
                return 16;
            if (type === 'int')
                return 4;
            if (type === 'ivec2')
                return 8;
            if (type === 'ivec3')
                return 12;
            if (type === 'ivec4')
                return 16;
            if (type === 'uint')
                return 4;
            if (type === 'uvec2')
                return 8;
            if (type === 'uvec3')
                return 12;
            if (type === 'uvec4')
                return 16;
            console.error('THREE.WebGPURenderer: Shader variable type not supported yet.', type);
        }
        _getAlphaBlend(material) {
            const blending = material.blending;
            const premultipliedAlpha = material.premultipliedAlpha;
            let alphaBlend = undefined;
            switch (blending) {
                case three_module_js_1.NormalBlending:
                    if (premultipliedAlpha === false) {
                        alphaBlend = {
                            srcFactor: constants_js_1.GPUBlendFactor.One,
                            dstFactor: constants_js_1.GPUBlendFactor.OneMinusSrcAlpha,
                            operation: constants_js_1.GPUBlendOperation.Add
                        };
                    }
                    break;
                case three_module_js_1.AdditiveBlending:
                    // no alphaBlend settings
                    break;
                case three_module_js_1.SubtractiveBlending:
                    if (premultipliedAlpha === true) {
                        alphaBlend = {
                            srcFactor: constants_js_1.GPUBlendFactor.OneMinusSrcColor,
                            dstFactor: constants_js_1.GPUBlendFactor.OneMinusSrcAlpha,
                            operation: constants_js_1.GPUBlendOperation.Add
                        };
                    }
                    break;
                case three_module_js_1.MultiplyBlending:
                    if (premultipliedAlpha === true) {
                        alphaBlend = {
                            srcFactor: constants_js_1.GPUBlendFactor.Zero,
                            dstFactor: constants_js_1.GPUBlendFactor.SrcAlpha,
                            operation: constants_js_1.GPUBlendOperation.Add
                        };
                    }
                    break;
                case three_module_js_1.CustomBlending:
                    const blendSrcAlpha = material.blendSrcAlpha;
                    const blendDstAlpha = material.blendDstAlpha;
                    const blendEquationAlpha = material.blendEquationAlpha;
                    if (blendSrcAlpha !== null && blendDstAlpha !== null && blendEquationAlpha !== null) {
                        alphaBlend = {
                            srcFactor: this._getBlendFactor(blendSrcAlpha),
                            dstFactor: this._getBlendFactor(blendDstAlpha),
                            operation: this._getBlendOperation(blendEquationAlpha)
                        };
                    }
                    break;
                default:
                    console.error('THREE.WebGPURenderer: Blending not supported.', blending);
            }
            return alphaBlend;
        }
        _getBlendFactor(blend) {
            let blendFactor;
            switch (blend) {
                case three_module_js_1.ZeroFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.Zero;
                    break;
                case three_module_js_1.OneFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.One;
                    break;
                case three_module_js_1.SrcColorFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.SrcColor;
                    break;
                case three_module_js_1.OneMinusSrcColorFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.OneMinusSrcColor;
                    break;
                case three_module_js_1.SrcAlphaFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.SrcAlpha;
                    break;
                case three_module_js_1.OneMinusSrcAlphaFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.OneMinusSrcAlpha;
                    break;
                case three_module_js_1.DstColorFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.DstColor;
                    break;
                case three_module_js_1.OneMinusDstColorFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.OneMinusDstColor;
                    break;
                case three_module_js_1.DstAlphaFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.DstAlpha;
                    break;
                case three_module_js_1.OneMinusDstAlphaFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.OneMinusDstAlpha;
                    break;
                case three_module_js_1.SrcAlphaSaturateFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.SrcAlphaSaturated;
                    break;
                case constants_js_1.BlendColorFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.BlendColor;
                    break;
                case constants_js_1.OneMinusBlendColorFactor:
                    blendFactor = constants_js_1.GPUBlendFactor.OneMinusBlendColor;
                    break;
                default:
                    console.error('THREE.WebGPURenderer: Blend factor not supported.', blend);
            }
            return blendFactor;
        }
        _getBlendOperation(blendEquation) {
            let blendOperation;
            switch (blendEquation) {
                case three_module_js_1.AddEquation:
                    blendOperation = constants_js_1.GPUBlendOperation.Add;
                    break;
                case three_module_js_1.SubtractEquation:
                    blendOperation = constants_js_1.GPUBlendOperation.Subtract;
                    break;
                case three_module_js_1.ReverseSubtractEquation:
                    blendOperation = constants_js_1.GPUBlendOperation.ReverseSubtract;
                    break;
                case three_module_js_1.MinEquation:
                    blendOperation = constants_js_1.GPUBlendOperation.Min;
                    break;
                case three_module_js_1.MaxEquation:
                    blendOperation = constants_js_1.GPUBlendOperation.Max;
                    break;
                default:
                    console.error('THREE.WebGPURenderer: Blend equation not supported.', blendEquation);
            }
            return blendOperation;
        }
        _getColorBlend(material) {
            const blending = material.blending;
            const premultipliedAlpha = material.premultipliedAlpha;
            const colorBlend = {
                srcFactor: null,
                dstFactor: null,
                operation: null
            };
            switch (blending) {
                case three_module_js_1.NormalBlending:
                    colorBlend.srcFactor = (premultipliedAlpha === true) ? constants_js_1.GPUBlendFactor.One : constants_js_1.GPUBlendFactor.SrcAlpha;
                    colorBlend.dstFactor = constants_js_1.GPUBlendFactor.OneMinusSrcAlpha;
                    colorBlend.operation = constants_js_1.GPUBlendOperation.Add;
                    break;
                case three_module_js_1.AdditiveBlending:
                    colorBlend.srcFactor = (premultipliedAlpha === true) ? constants_js_1.GPUBlendFactor.One : constants_js_1.GPUBlendFactor.SrcAlpha;
                    colorBlend.operation = constants_js_1.GPUBlendOperation.Add;
                    break;
                case three_module_js_1.SubtractiveBlending:
                    colorBlend.srcFactor = constants_js_1.GPUBlendFactor.Zero;
                    colorBlend.dstFactor = (premultipliedAlpha === true) ? constants_js_1.GPUBlendFactor.Zero : constants_js_1.GPUBlendFactor.OneMinusSrcColor;
                    colorBlend.operation = constants_js_1.GPUBlendOperation.Add;
                    break;
                case three_module_js_1.MultiplyBlending:
                    colorBlend.srcFactor = constants_js_1.GPUBlendFactor.Zero;
                    colorBlend.dstFactor = constants_js_1.GPUBlendFactor.SrcColor;
                    colorBlend.operation = constants_js_1.GPUBlendOperation.Add;
                    break;
                case three_module_js_1.CustomBlending:
                    colorBlend.srcFactor = this._getBlendFactor(material.blendSrc);
                    colorBlend.dstFactor = this._getBlendFactor(material.blendDst);
                    colorBlend.operation = this._getBlendOperation(material.blendEquation);
                    break;
                default:
                    console.error('THREE.WebGPURenderer: Blending not supported.', blending);
            }
            return colorBlend;
        }
        _getColorFormat(renderer) {
            let format;
            const renderTarget = renderer.getRenderTarget();
            if (renderTarget !== null) {
                const renderTargetProperties = this.properties.get(renderTarget);
                format = renderTargetProperties.colorTextureFormat;
            }
            else {
                format = constants_js_1.GPUTextureFormat.BRGA8Unorm; // default swap chain format
            }
            return format;
        }
        _getColorWriteMask(material) {
            return (material.colorWrite === true) ? constants_js_1.GPUColorWriteFlags.All : constants_js_1.GPUColorWriteFlags.None;
        }
        _getDepthCompare(material) {
            let depthCompare;
            if (material.depthTest === false) {
                depthCompare = constants_js_1.GPUCompareFunction.Always;
            }
            else {
                const depthFunc = material.depthFunc;
                switch (depthFunc) {
                    case three_module_js_1.NeverDepth:
                        depthCompare = constants_js_1.GPUCompareFunction.Never;
                        break;
                    case three_module_js_1.AlwaysDepth:
                        depthCompare = constants_js_1.GPUCompareFunction.Always;
                        break;
                    case three_module_js_1.LessDepth:
                        depthCompare = constants_js_1.GPUCompareFunction.Less;
                        break;
                    case three_module_js_1.LessEqualDepth:
                        depthCompare = constants_js_1.GPUCompareFunction.LessEqual;
                        break;
                    case three_module_js_1.EqualDepth:
                        depthCompare = constants_js_1.GPUCompareFunction.Equal;
                        break;
                    case three_module_js_1.GreaterEqualDepth:
                        depthCompare = constants_js_1.GPUCompareFunction.GreaterEqual;
                        break;
                    case three_module_js_1.GreaterDepth:
                        depthCompare = constants_js_1.GPUCompareFunction.Greater;
                        break;
                    case three_module_js_1.NotEqualDepth:
                        depthCompare = constants_js_1.GPUCompareFunction.NotEqual;
                        break;
                    default:
                        console.error('THREE.WebGPURenderer: Invalid depth function.', depthFunc);
                }
            }
            return depthCompare;
        }
        _getDepthStencilFormat(renderer) {
            let format;
            const renderTarget = renderer.getRenderTarget();
            if (renderTarget !== null) {
                const renderTargetProperties = this.properties.get(renderTarget);
                format = renderTargetProperties.depthTextureFormat;
            }
            else {
                format = constants_js_1.GPUTextureFormat.Depth24PlusStencil8;
            }
            return format;
        }
        _getPrimitiveTopology(object) {
            if (object.isMesh)
                return constants_js_1.GPUPrimitiveTopology.TriangleList;
            else if (object.isPoints)
                return constants_js_1.GPUPrimitiveTopology.PointList;
            else if (object.isLine)
                return constants_js_1.GPUPrimitiveTopology.LineStrip;
            else if (object.isLineSegments)
                return constants_js_1.GPUPrimitiveTopology.LineList;
        }
        _getRasterizationStateDescriptor(material) {
            const descriptor = {};
            switch (material.side) {
                case three_module_js_1.FrontSide:
                    descriptor.frontFace = constants_js_1.GPUFrontFace.CCW;
                    descriptor.cullMode = constants_js_1.GPUCullMode.Back;
                    break;
                case three_module_js_1.BackSide:
                    descriptor.frontFace = constants_js_1.GPUFrontFace.CW;
                    descriptor.cullMode = constants_js_1.GPUCullMode.Back;
                    break;
                case three_module_js_1.DoubleSide:
                    descriptor.frontFace = constants_js_1.GPUFrontFace.CCW;
                    descriptor.cullMode = constants_js_1.GPUCullMode.None;
                    break;
                default:
                    console.error('THREE.WebGPURenderer: Unknown Material.side value.', material.side);
                    break;
            }
            return descriptor;
        }
        _getStencilCompare(material) {
            let stencilCompare;
            const stencilFunc = material.stencilFunc;
            switch (stencilFunc) {
                case three_module_js_1.NeverStencilFunc:
                    stencilCompare = constants_js_1.GPUCompareFunction.Never;
                    break;
                case three_module_js_1.AlwaysStencilFunc:
                    stencilCompare = constants_js_1.GPUCompareFunction.Always;
                    break;
                case three_module_js_1.LessStencilFunc:
                    stencilCompare = constants_js_1.GPUCompareFunction.Less;
                    break;
                case three_module_js_1.LessEqualStencilFunc:
                    stencilCompare = constants_js_1.GPUCompareFunction.LessEqual;
                    break;
                case three_module_js_1.EqualStencilFunc:
                    stencilCompare = constants_js_1.GPUCompareFunction.Equal;
                    break;
                case three_module_js_1.GreaterEqualStencilFunc:
                    stencilCompare = constants_js_1.GPUCompareFunction.GreaterEqual;
                    break;
                case three_module_js_1.GreaterStencilFunc:
                    stencilCompare = constants_js_1.GPUCompareFunction.Greater;
                    break;
                case three_module_js_1.NotEqualStencilFunc:
                    stencilCompare = constants_js_1.GPUCompareFunction.NotEqual;
                    break;
                default:
                    console.error('THREE.WebGPURenderer: Invalid stencil function.', stencilFunc);
            }
            return stencilCompare;
        }
        _getStencilOperation(op) {
            let stencilOperation;
            switch (op) {
                case three_module_js_1.KeepStencilOp:
                    stencilOperation = constants_js_1.GPUStencilOperation.Keep;
                    break;
                case three_module_js_1.ZeroStencilOp:
                    stencilOperation = constants_js_1.GPUStencilOperation.Zero;
                    break;
                case three_module_js_1.ReplaceStencilOp:
                    stencilOperation = constants_js_1.GPUStencilOperation.Replace;
                    break;
                case three_module_js_1.InvertStencilOp:
                    stencilOperation = constants_js_1.GPUStencilOperation.Invert;
                    break;
                case three_module_js_1.IncrementStencilOp:
                    stencilOperation = constants_js_1.GPUStencilOperation.IncrementClamp;
                    break;
                case three_module_js_1.DecrementStencilOp:
                    stencilOperation = constants_js_1.GPUStencilOperation.DecrementClamp;
                    break;
                case three_module_js_1.IncrementWrapStencilOp:
                    stencilOperation = constants_js_1.GPUStencilOperation.IncrementWrap;
                    break;
                case three_module_js_1.DecrementWrapStencilOp:
                    stencilOperation = constants_js_1.GPUStencilOperation.DecrementWrap;
                    break;
                default:
                    console.error('THREE.WebGPURenderer: Invalid stencil operation.', stencilOperation);
            }
            return stencilOperation;
        }
        _getVertexFormat(type) {
            // @TODO: This code is GLSL specific. We need to update when we switch to WGSL.
            if (type === 'float')
                return constants_js_1.GPUVertexFormat.Float;
            if (type === 'vec2')
                return constants_js_1.GPUVertexFormat.Float2;
            if (type === 'vec3')
                return constants_js_1.GPUVertexFormat.Float3;
            if (type === 'vec4')
                return constants_js_1.GPUVertexFormat.Float4;
            if (type === 'int')
                return constants_js_1.GPUVertexFormat.Int;
            if (type === 'ivec2')
                return constants_js_1.GPUVertexFormat.Int2;
            if (type === 'ivec3')
                return constants_js_1.GPUVertexFormat.Int3;
            if (type === 'ivec4')
                return constants_js_1.GPUVertexFormat.Int4;
            if (type === 'uint')
                return constants_js_1.GPUVertexFormat.UInt;
            if (type === 'uvec2')
                return constants_js_1.GPUVertexFormat.UInt2;
            if (type === 'uvec3')
                return constants_js_1.GPUVertexFormat.UInt3;
            if (type === 'uvec4')
                return constants_js_1.GPUVertexFormat.UInt4;
            console.error('THREE.WebGPURenderer: Shader variable type not supported yet.', type);
        }
        _parseShaderAttributes(shader) {
            // find "layout (location = num) in type name" in vertex shader
            const regex = /^\s*layout\s*\(\s*location\s*=\s*(?<location>[0-9]+)\s*\)\s*in\s+(?<type>\w+)\s+(?<name>\w+)\s*;/gmi;
            let shaderAttribute = null;
            const attributes = [];
            while (shaderAttribute = regex.exec(shader)) {
                const shaderLocation = parseInt(shaderAttribute.groups.location);
                const arrayStride = this._getArrayStride(shaderAttribute.groups.type);
                const vertexFormat = this._getVertexFormat(shaderAttribute.groups.type);
                attributes.push({
                    name: shaderAttribute.groups.name,
                    arrayStride: arrayStride,
                    slot: shaderLocation,
                    format: vertexFormat
                });
            }
            // the sort ensures to setup vertex buffers in the correct order
            return attributes.sort(function (a, b) {
                return a.slot - b.slot;
            });
        }
    }
    const ShaderLib = {
        mesh_basic: {
            vertexShader: `#version 450

		layout(location = 0) in vec3 position;
		layout(location = 1) in vec2 uv;

		layout(location = 0) out vec2 vUv;

		layout(set = 0, binding = 0) uniform ModelUniforms {
			mat4 modelMatrix;
			mat4 modelViewMatrix;
			mat3 normalMatrix;
		} modelUniforms;

		layout(set = 0, binding = 1) uniform CameraUniforms {
			mat4 projectionMatrix;
			mat4 viewMatrix;
		} cameraUniforms;

		void main(){
			vUv = uv;
			gl_Position = cameraUniforms.projectionMatrix * modelUniforms.modelViewMatrix * vec4( position, 1.0 );
		}`,
            fragmentShader: `#version 450
		layout(set = 0, binding = 2) uniform OpacityUniforms {
			float opacity;
		} opacityUniforms;

		layout(set = 0, binding = 3) uniform sampler mySampler;
		layout(set = 0, binding = 4) uniform texture2D myTexture;

		layout(location = 0) in vec2 vUv;
		layout(location = 0) out vec4 outColor;

		void main() {
			outColor = texture( sampler2D( myTexture, mySampler ), vUv );
			outColor.a *= opacityUniforms.opacity;
		}`
        },
        points_basic: {
            vertexShader: `#version 450

		layout(location = 0) in vec3 position;

		layout(set = 0, binding = 0) uniform ModelUniforms {
			mat4 modelMatrix;
			mat4 modelViewMatrix;
		} modelUniforms;

		layout(set = 0, binding = 1) uniform CameraUniforms {
			mat4 projectionMatrix;
			mat4 viewMatrix;
		} cameraUniforms;

		void main(){
			gl_Position = cameraUniforms.projectionMatrix * modelUniforms.modelViewMatrix * vec4( position, 1.0 );
		}`,
            fragmentShader: `#version 450

		layout(location = 0) out vec4 outColor;

		void main() {
			outColor = vec4( 1.0, 0.0, 0.0, 1.0 );
		}`
        },
        line_basic: {
            vertexShader: `#version 450

		layout(location = 0) in vec3 position;

		layout(set = 0, binding = 0) uniform ModelUniforms {
			mat4 modelMatrix;
			mat4 modelViewMatrix;
		} modelUniforms;

		layout(set = 0, binding = 1) uniform CameraUniforms {
			mat4 projectionMatrix;
			mat4 viewMatrix;
		} cameraUniforms;

		void main(){
			gl_Position = cameraUniforms.projectionMatrix * modelUniforms.modelViewMatrix * vec4( position, 1.0 );
		}`,
            fragmentShader: `#version 450

		layout(location = 0) out vec4 outColor;

		void main() {
			outColor = vec4( 1.0, 0.0, 0.0, 1.0 );
		}`
        }
    };
    exports.default = WebGPURenderPipelines;
});
//# sourceMappingURL=WebGPURenderPipelines.js.map