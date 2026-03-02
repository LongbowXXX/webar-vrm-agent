import React, { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRM, VRMUtils } from "@pixiv/three-vrm";
import * as THREE from "three";

export interface VRMAvatarProps {
  url: string;
  expression?: string;
  motion?: string; // Optional motion placeholder
}

export const VRMAvatar: React.FC<VRMAvatarProps> = ({ url, expression }) => {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const vrmRef = useRef<VRM | null>(null);

  useEffect(() => {
    let currentVrm: VRM | null = null;
    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));

    loader.load(url, (gltf) => {
      currentVrm = gltf.userData.vrm;
      if (currentVrm) {
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.removeUnnecessaryJoints(gltf.scene);

        // Prevent frustum culling issues with VRM items outside camera
        currentVrm.scene.traverse((obj) => {
          obj.frustumCulled = false;
        });

        // Rotate character to face camera by default
        currentVrm.scene.rotation.y = Math.PI;

        vrmRef.current = currentVrm;
        setVrm(currentVrm);
      }
    });

    return () => {
      if (currentVrm) {
        currentVrm.scene.removeFromParent();
      }
    };
  }, [url]);

  useEffect(() => {
    const v = vrmRef.current;
    if (v && v.expressionManager) {
      // Reset all expressions to 0
      const expressionsMap = v.expressionManager.expressionMap;
      if (expressionsMap) {
        for (const key of Object.keys(expressionsMap)) {
          v.expressionManager.setValue(key, 0);
        }
      }

      if (expression) {
        v.expressionManager.setValue(expression, 1);
      }
    }
  }, [expression, vrm]);

  useFrame((state, delta) => {
    if (vrmRef.current) {
      vrmRef.current.update(delta);
    }
  });

  return vrm ? <primitive object={vrm.scene} /> : null;
};
