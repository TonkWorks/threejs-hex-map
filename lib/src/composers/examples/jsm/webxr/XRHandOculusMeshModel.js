define(["require", "exports", "../loaders/FBXLoader.js"], function (require, exports, FBXLoader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class XRHandOculusMeshModel {
        constructor(handModel, controller, path, handedness, options) {
            this.controller = controller;
            this.handModel = handModel;
            this.bones = [];
            const loader = new FBXLoader_js_1.FBXLoader();
            const low = options && options.model === 'lowpoly' ? '_low' : '';
            loader.setPath(path);
            loader.load(`OculusHand_${handedness === 'right' ? 'R' : 'L'}${low}.fbx`, object => {
                this.handModel.add(object);
                // Hack because of the scale of the skinnedmesh
                object.scale.setScalar(0.01);
                const mesh = object.getObjectByProperty('type', 'SkinnedMesh');
                mesh.frustumCulled = false;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                const bonesMapping = [
                    'b_%_wrist',
                    'b_%_thumb1',
                    'b_%_thumb2',
                    'b_%_thumb3',
                    'b_%_thumb_null',
                    null,
                    'b_%_index1',
                    'b_%_index2',
                    'b_%_index3',
                    'b_%_index_null',
                    null,
                    'b_%_middle1',
                    'b_%_middle2',
                    'b_%_middle3',
                    'b_%_middlenull',
                    null,
                    'b_%_ring1',
                    'b_%_ring2',
                    'b_%_ring3',
                    'b_%_ring_inull',
                    'b_%_pinky0',
                    'b_%_pinky1',
                    'b_%_pinky2',
                    'b_%_pinky3',
                    'b_%_pinkynull',
                ];
                bonesMapping.forEach(boneName => {
                    if (boneName) {
                        const bone = object.getObjectByName(boneName.replace(/%/g, handedness === 'right' ? 'r' : 'l'));
                        this.bones.push(bone);
                    }
                    else {
                        this.bones.push(null);
                    }
                });
            });
        }
        updateMesh() {
            // XR Joints
            const XRJoints = this.controller.joints;
            for (let i = 0; i < this.bones.length; i++) {
                const bone = this.bones[i];
                const XRJoint = XRJoints[i];
                if (XRJoint) {
                    if (XRJoint.visible) {
                        const position = XRJoint.position;
                        if (bone) {
                            bone.position.copy(position.clone().multiplyScalar(100));
                            bone.quaternion.copy(XRJoint.quaternion);
                            // bone.scale.setScalar( XRJoint.jointRadius || defaultRadius );
                        }
                    }
                }
            }
        }
    }
    exports.XRHandOculusMeshModel = XRHandOculusMeshModel;
});
//# sourceMappingURL=XRHandOculusMeshModel.js.map