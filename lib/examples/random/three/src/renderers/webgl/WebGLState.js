define(["require", "exports", "../../constants.js", "../../math/Vector4.js"], function (require, exports, constants_js_1, Vector4_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGLState(gl, extensions, capabilities) {
        const isWebGL2 = capabilities.isWebGL2;
        function ColorBuffer() {
            let locked = false;
            const color = new Vector4_js_1.Vector4();
            let currentColorMask = null;
            const currentColorClear = new Vector4_js_1.Vector4(0, 0, 0, 0);
            return {
                setMask: function (colorMask) {
                    if (currentColorMask !== colorMask && !locked) {
                        gl.colorMask(colorMask, colorMask, colorMask, colorMask);
                        currentColorMask = colorMask;
                    }
                },
                setLocked: function (lock) {
                    locked = lock;
                },
                setClear: function (r, g, b, a, premultipliedAlpha) {
                    if (premultipliedAlpha === true) {
                        r *= a;
                        g *= a;
                        b *= a;
                    }
                    color.set(r, g, b, a);
                    if (currentColorClear.equals(color) === false) {
                        gl.clearColor(r, g, b, a);
                        currentColorClear.copy(color);
                    }
                },
                reset: function () {
                    locked = false;
                    currentColorMask = null;
                    currentColorClear.set(-1, 0, 0, 0); // set to invalid state
                }
            };
        }
        function DepthBuffer() {
            let locked = false;
            let currentDepthMask = null;
            let currentDepthFunc = null;
            let currentDepthClear = null;
            return {
                setTest: function (depthTest) {
                    if (depthTest) {
                        enable(gl.DEPTH_TEST);
                    }
                    else {
                        disable(gl.DEPTH_TEST);
                    }
                },
                setMask: function (depthMask) {
                    if (currentDepthMask !== depthMask && !locked) {
                        gl.depthMask(depthMask);
                        currentDepthMask = depthMask;
                    }
                },
                setFunc: function (depthFunc) {
                    if (currentDepthFunc !== depthFunc) {
                        if (depthFunc) {
                            switch (depthFunc) {
                                case constants_js_1.NeverDepth:
                                    gl.depthFunc(gl.NEVER);
                                    break;
                                case constants_js_1.AlwaysDepth:
                                    gl.depthFunc(gl.ALWAYS);
                                    break;
                                case constants_js_1.LessDepth:
                                    gl.depthFunc(gl.LESS);
                                    break;
                                case constants_js_1.LessEqualDepth:
                                    gl.depthFunc(gl.LEQUAL);
                                    break;
                                case constants_js_1.EqualDepth:
                                    gl.depthFunc(gl.EQUAL);
                                    break;
                                case constants_js_1.GreaterEqualDepth:
                                    gl.depthFunc(gl.GEQUAL);
                                    break;
                                case constants_js_1.GreaterDepth:
                                    gl.depthFunc(gl.GREATER);
                                    break;
                                case constants_js_1.NotEqualDepth:
                                    gl.depthFunc(gl.NOTEQUAL);
                                    break;
                                default:
                                    gl.depthFunc(gl.LEQUAL);
                            }
                        }
                        else {
                            gl.depthFunc(gl.LEQUAL);
                        }
                        currentDepthFunc = depthFunc;
                    }
                },
                setLocked: function (lock) {
                    locked = lock;
                },
                setClear: function (depth) {
                    if (currentDepthClear !== depth) {
                        gl.clearDepth(depth);
                        currentDepthClear = depth;
                    }
                },
                reset: function () {
                    locked = false;
                    currentDepthMask = null;
                    currentDepthFunc = null;
                    currentDepthClear = null;
                }
            };
        }
        function StencilBuffer() {
            let locked = false;
            let currentStencilMask = null;
            let currentStencilFunc = null;
            let currentStencilRef = null;
            let currentStencilFuncMask = null;
            let currentStencilFail = null;
            let currentStencilZFail = null;
            let currentStencilZPass = null;
            let currentStencilClear = null;
            return {
                setTest: function (stencilTest) {
                    if (!locked) {
                        if (stencilTest) {
                            enable(gl.STENCIL_TEST);
                        }
                        else {
                            disable(gl.STENCIL_TEST);
                        }
                    }
                },
                setMask: function (stencilMask) {
                    if (currentStencilMask !== stencilMask && !locked) {
                        gl.stencilMask(stencilMask);
                        currentStencilMask = stencilMask;
                    }
                },
                setFunc: function (stencilFunc, stencilRef, stencilMask) {
                    if (currentStencilFunc !== stencilFunc ||
                        currentStencilRef !== stencilRef ||
                        currentStencilFuncMask !== stencilMask) {
                        gl.stencilFunc(stencilFunc, stencilRef, stencilMask);
                        currentStencilFunc = stencilFunc;
                        currentStencilRef = stencilRef;
                        currentStencilFuncMask = stencilMask;
                    }
                },
                setOp: function (stencilFail, stencilZFail, stencilZPass) {
                    if (currentStencilFail !== stencilFail ||
                        currentStencilZFail !== stencilZFail ||
                        currentStencilZPass !== stencilZPass) {
                        gl.stencilOp(stencilFail, stencilZFail, stencilZPass);
                        currentStencilFail = stencilFail;
                        currentStencilZFail = stencilZFail;
                        currentStencilZPass = stencilZPass;
                    }
                },
                setLocked: function (lock) {
                    locked = lock;
                },
                setClear: function (stencil) {
                    if (currentStencilClear !== stencil) {
                        gl.clearStencil(stencil);
                        currentStencilClear = stencil;
                    }
                },
                reset: function () {
                    locked = false;
                    currentStencilMask = null;
                    currentStencilFunc = null;
                    currentStencilRef = null;
                    currentStencilFuncMask = null;
                    currentStencilFail = null;
                    currentStencilZFail = null;
                    currentStencilZPass = null;
                    currentStencilClear = null;
                }
            };
        }
        //
        const colorBuffer = new ColorBuffer();
        const depthBuffer = new DepthBuffer();
        const stencilBuffer = new StencilBuffer();
        let enabledCapabilities = {};
        let currentProgram = null;
        let currentBlendingEnabled = null;
        let currentBlending = null;
        let currentBlendEquation = null;
        let currentBlendSrc = null;
        let currentBlendDst = null;
        let currentBlendEquationAlpha = null;
        let currentBlendSrcAlpha = null;
        let currentBlendDstAlpha = null;
        let currentPremultipledAlpha = false;
        let currentFlipSided = null;
        let currentCullFace = null;
        let currentLineWidth = null;
        let currentPolygonOffsetFactor = null;
        let currentPolygonOffsetUnits = null;
        const maxTextures = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        let lineWidthAvailable = false;
        let version = 0;
        const glVersion = gl.getParameter(gl.VERSION);
        if (glVersion.indexOf('WebGL') !== -1) {
            version = parseFloat(/^WebGL\ ([0-9])/.exec(glVersion)[1]);
            lineWidthAvailable = (version >= 1.0);
        }
        else if (glVersion.indexOf('OpenGL ES') !== -1) {
            version = parseFloat(/^OpenGL\ ES\ ([0-9])/.exec(glVersion)[1]);
            lineWidthAvailable = (version >= 2.0);
        }
        let currentTextureSlot = null;
        let currentBoundTextures = {};
        const currentScissor = new Vector4_js_1.Vector4();
        const currentViewport = new Vector4_js_1.Vector4();
        function createTexture(type, target, count) {
            const data = new Uint8Array(4); // 4 is required to match default unpack alignment of 4.
            const texture = gl.createTexture();
            gl.bindTexture(type, texture);
            gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            for (let i = 0; i < count; i++) {
                gl.texImage2D(target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            }
            return texture;
        }
        const emptyTextures = {};
        emptyTextures[gl.TEXTURE_2D] = createTexture(gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
        emptyTextures[gl.TEXTURE_CUBE_MAP] = createTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);
        // init
        colorBuffer.setClear(0, 0, 0, 1);
        depthBuffer.setClear(1);
        stencilBuffer.setClear(0);
        enable(gl.DEPTH_TEST);
        depthBuffer.setFunc(constants_js_1.LessEqualDepth);
        setFlipSided(false);
        setCullFace(constants_js_1.CullFaceBack);
        enable(gl.CULL_FACE);
        setBlending(constants_js_1.NoBlending);
        //
        function enable(id) {
            if (enabledCapabilities[id] !== true) {
                gl.enable(id);
                enabledCapabilities[id] = true;
            }
        }
        function disable(id) {
            if (enabledCapabilities[id] !== false) {
                gl.disable(id);
                enabledCapabilities[id] = false;
            }
        }
        function useProgram(program) {
            if (currentProgram !== program) {
                gl.useProgram(program);
                currentProgram = program;
                return true;
            }
            return false;
        }
        const equationToGL = {
            [constants_js_1.AddEquation]: gl.FUNC_ADD,
            [constants_js_1.SubtractEquation]: gl.FUNC_SUBTRACT,
            [constants_js_1.ReverseSubtractEquation]: gl.FUNC_REVERSE_SUBTRACT
        };
        if (isWebGL2) {
            equationToGL[constants_js_1.MinEquation] = gl.MIN;
            equationToGL[constants_js_1.MaxEquation] = gl.MAX;
        }
        else {
            const extension = extensions.get('EXT_blend_minmax');
            if (extension !== null) {
                equationToGL[constants_js_1.MinEquation] = extension.MIN_EXT;
                equationToGL[constants_js_1.MaxEquation] = extension.MAX_EXT;
            }
        }
        const factorToGL = {
            [constants_js_1.ZeroFactor]: gl.ZERO,
            [constants_js_1.OneFactor]: gl.ONE,
            [constants_js_1.SrcColorFactor]: gl.SRC_COLOR,
            [constants_js_1.SrcAlphaFactor]: gl.SRC_ALPHA,
            [constants_js_1.SrcAlphaSaturateFactor]: gl.SRC_ALPHA_SATURATE,
            [constants_js_1.DstColorFactor]: gl.DST_COLOR,
            [constants_js_1.DstAlphaFactor]: gl.DST_ALPHA,
            [constants_js_1.OneMinusSrcColorFactor]: gl.ONE_MINUS_SRC_COLOR,
            [constants_js_1.OneMinusSrcAlphaFactor]: gl.ONE_MINUS_SRC_ALPHA,
            [constants_js_1.OneMinusDstColorFactor]: gl.ONE_MINUS_DST_COLOR,
            [constants_js_1.OneMinusDstAlphaFactor]: gl.ONE_MINUS_DST_ALPHA
        };
        function setBlending(blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha) {
            if (blending === constants_js_1.NoBlending) {
                if (currentBlendingEnabled) {
                    disable(gl.BLEND);
                    currentBlendingEnabled = false;
                }
                return;
            }
            if (!currentBlendingEnabled) {
                enable(gl.BLEND);
                currentBlendingEnabled = true;
            }
            if (blending !== constants_js_1.CustomBlending) {
                if (blending !== currentBlending || premultipliedAlpha !== currentPremultipledAlpha) {
                    if (currentBlendEquation !== constants_js_1.AddEquation || currentBlendEquationAlpha !== constants_js_1.AddEquation) {
                        gl.blendEquation(gl.FUNC_ADD);
                        currentBlendEquation = constants_js_1.AddEquation;
                        currentBlendEquationAlpha = constants_js_1.AddEquation;
                    }
                    if (premultipliedAlpha) {
                        switch (blending) {
                            case constants_js_1.NormalBlending:
                                gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                                break;
                            case constants_js_1.AdditiveBlending:
                                gl.blendFunc(gl.ONE, gl.ONE);
                                break;
                            case constants_js_1.SubtractiveBlending:
                                gl.blendFuncSeparate(gl.ZERO, gl.ZERO, gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                                break;
                            case constants_js_1.MultiplyBlending:
                                gl.blendFuncSeparate(gl.ZERO, gl.SRC_COLOR, gl.ZERO, gl.SRC_ALPHA);
                                break;
                            default:
                                console.error('THREE.WebGLState: Invalid blending: ', blending);
                                break;
                        }
                    }
                    else {
                        switch (blending) {
                            case constants_js_1.NormalBlending:
                                gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                                break;
                            case constants_js_1.AdditiveBlending:
                                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                                break;
                            case constants_js_1.SubtractiveBlending:
                                gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
                                break;
                            case constants_js_1.MultiplyBlending:
                                gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
                                break;
                            default:
                                console.error('THREE.WebGLState: Invalid blending: ', blending);
                                break;
                        }
                    }
                    currentBlendSrc = null;
                    currentBlendDst = null;
                    currentBlendSrcAlpha = null;
                    currentBlendDstAlpha = null;
                    currentBlending = blending;
                    currentPremultipledAlpha = premultipliedAlpha;
                }
                return;
            }
            // custom blending
            blendEquationAlpha = blendEquationAlpha || blendEquation;
            blendSrcAlpha = blendSrcAlpha || blendSrc;
            blendDstAlpha = blendDstAlpha || blendDst;
            if (blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha) {
                gl.blendEquationSeparate(equationToGL[blendEquation], equationToGL[blendEquationAlpha]);
                currentBlendEquation = blendEquation;
                currentBlendEquationAlpha = blendEquationAlpha;
            }
            if (blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha) {
                gl.blendFuncSeparate(factorToGL[blendSrc], factorToGL[blendDst], factorToGL[blendSrcAlpha], factorToGL[blendDstAlpha]);
                currentBlendSrc = blendSrc;
                currentBlendDst = blendDst;
                currentBlendSrcAlpha = blendSrcAlpha;
                currentBlendDstAlpha = blendDstAlpha;
            }
            currentBlending = blending;
            currentPremultipledAlpha = null;
        }
        function setMaterial(material, frontFaceCW) {
            material.side === constants_js_1.DoubleSide
                ? disable(gl.CULL_FACE)
                : enable(gl.CULL_FACE);
            let flipSided = (material.side === constants_js_1.BackSide);
            if (frontFaceCW)
                flipSided = !flipSided;
            setFlipSided(flipSided);
            (material.blending === constants_js_1.NormalBlending && material.transparent === false)
                ? setBlending(constants_js_1.NoBlending)
                : setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha);
            depthBuffer.setFunc(material.depthFunc);
            depthBuffer.setTest(material.depthTest);
            depthBuffer.setMask(material.depthWrite);
            colorBuffer.setMask(material.colorWrite);
            const stencilWrite = material.stencilWrite;
            stencilBuffer.setTest(stencilWrite);
            if (stencilWrite) {
                stencilBuffer.setMask(material.stencilWriteMask);
                stencilBuffer.setFunc(material.stencilFunc, material.stencilRef, material.stencilFuncMask);
                stencilBuffer.setOp(material.stencilFail, material.stencilZFail, material.stencilZPass);
            }
            setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
        }
        //
        function setFlipSided(flipSided) {
            if (currentFlipSided !== flipSided) {
                if (flipSided) {
                    gl.frontFace(gl.CW);
                }
                else {
                    gl.frontFace(gl.CCW);
                }
                currentFlipSided = flipSided;
            }
        }
        function setCullFace(cullFace) {
            if (cullFace !== constants_js_1.CullFaceNone) {
                enable(gl.CULL_FACE);
                if (cullFace !== currentCullFace) {
                    if (cullFace === constants_js_1.CullFaceBack) {
                        gl.cullFace(gl.BACK);
                    }
                    else if (cullFace === constants_js_1.CullFaceFront) {
                        gl.cullFace(gl.FRONT);
                    }
                    else {
                        gl.cullFace(gl.FRONT_AND_BACK);
                    }
                }
            }
            else {
                disable(gl.CULL_FACE);
            }
            currentCullFace = cullFace;
        }
        function setLineWidth(width) {
            if (width !== currentLineWidth) {
                if (lineWidthAvailable)
                    gl.lineWidth(width);
                currentLineWidth = width;
            }
        }
        function setPolygonOffset(polygonOffset, factor, units) {
            if (polygonOffset) {
                enable(gl.POLYGON_OFFSET_FILL);
                if (currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units) {
                    gl.polygonOffset(factor, units);
                    currentPolygonOffsetFactor = factor;
                    currentPolygonOffsetUnits = units;
                }
            }
            else {
                disable(gl.POLYGON_OFFSET_FILL);
            }
        }
        function setScissorTest(scissorTest) {
            if (scissorTest) {
                enable(gl.SCISSOR_TEST);
            }
            else {
                disable(gl.SCISSOR_TEST);
            }
        }
        // texture
        function activeTexture(webglSlot) {
            if (webglSlot === undefined)
                webglSlot = gl.TEXTURE0 + maxTextures - 1;
            if (currentTextureSlot !== webglSlot) {
                gl.activeTexture(webglSlot);
                currentTextureSlot = webglSlot;
            }
        }
        function bindTexture(webglType, webglTexture) {
            if (currentTextureSlot === null) {
                activeTexture();
            }
            let boundTexture = currentBoundTextures[currentTextureSlot];
            if (boundTexture === undefined) {
                boundTexture = { type: undefined, texture: undefined };
                currentBoundTextures[currentTextureSlot] = boundTexture;
            }
            if (boundTexture.type !== webglType || boundTexture.texture !== webglTexture) {
                gl.bindTexture(webglType, webglTexture || emptyTextures[webglType]);
                boundTexture.type = webglType;
                boundTexture.texture = webglTexture;
            }
        }
        function unbindTexture() {
            const boundTexture = currentBoundTextures[currentTextureSlot];
            if (boundTexture !== undefined && boundTexture.type !== undefined) {
                gl.bindTexture(boundTexture.type, null);
                boundTexture.type = undefined;
                boundTexture.texture = undefined;
            }
        }
        function compressedTexImage2D() {
            try {
                gl.compressedTexImage2D.apply(gl, arguments);
            }
            catch (error) {
                console.error('THREE.WebGLState:', error);
            }
        }
        function texImage2D() {
            try {
                gl.texImage2D.apply(gl, arguments);
            }
            catch (error) {
                console.error('THREE.WebGLState:', error);
            }
        }
        function texImage3D() {
            try {
                gl.texImage3D.apply(gl, arguments);
            }
            catch (error) {
                console.error('THREE.WebGLState:', error);
            }
        }
        //
        function scissor(scissor) {
            if (currentScissor.equals(scissor) === false) {
                gl.scissor(scissor.x, scissor.y, scissor.z, scissor.w);
                currentScissor.copy(scissor);
            }
        }
        function viewport(viewport) {
            if (currentViewport.equals(viewport) === false) {
                gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
                currentViewport.copy(viewport);
            }
        }
        //
        function reset() {
            enabledCapabilities = {};
            currentTextureSlot = null;
            currentBoundTextures = {};
            currentProgram = null;
            currentBlending = null;
            currentFlipSided = null;
            currentCullFace = null;
            colorBuffer.reset();
            depthBuffer.reset();
            stencilBuffer.reset();
        }
        return {
            buffers: {
                color: colorBuffer,
                depth: depthBuffer,
                stencil: stencilBuffer
            },
            enable: enable,
            disable: disable,
            useProgram: useProgram,
            setBlending: setBlending,
            setMaterial: setMaterial,
            setFlipSided: setFlipSided,
            setCullFace: setCullFace,
            setLineWidth: setLineWidth,
            setPolygonOffset: setPolygonOffset,
            setScissorTest: setScissorTest,
            activeTexture: activeTexture,
            bindTexture: bindTexture,
            unbindTexture: unbindTexture,
            compressedTexImage2D: compressedTexImage2D,
            texImage2D: texImage2D,
            texImage3D: texImage3D,
            scissor: scissor,
            viewport: viewport,
            reset: reset
        };
    }
    exports.WebGLState = WebGLState;
});
//# sourceMappingURL=WebGLState.js.map