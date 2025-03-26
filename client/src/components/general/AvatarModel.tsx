import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = ({ visemeStrength }: { visemeStrength: number }) => {
  const gltf = useLoader(GLTFLoader, "https://models.readyplayer.me/67b05852f9904b1648fe40fd.glb");
  const mouthMeshRef = useRef(null);

  useEffect(() => {

    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name === "Wolf3D_Head" && child.morphTargetDictionary) {
          console.log("✅ Morph Targets Found:", child.morphTargetDictionary);
          mouthMeshRef.current = child;
        }
      });
    }
  }, [gltf]);

  useFrame(() => {
    if (mouthMeshRef.current) {
      const morphTargets = mouthMeshRef.current.morphTargetDictionary;

      // Smooth transition (lerp) instead of instant switch
      if (morphTargets.mouthOpen !== undefined) {
        const index = morphTargets.mouthOpen;
        mouthMeshRef.current.morphTargetInfluences[index] += (visemeStrength - mouthMeshRef.current.morphTargetInfluences[index]) * 0.3;
      }
    }
  });

  return <primitive object={gltf.scene} scale={[3, 1.8, 2]} />;
};

export default Model;