import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const avatarModelUrl = import.meta.env.VITE_AVATAR_MODEL_URL as string | undefined;
const Group = "group" as any;
const Mesh = "mesh" as any;
const SphereGeometry = "sphereGeometry" as any;
const CapsuleGeometry = "capsuleGeometry" as any;
const MeshStandardMaterial = "meshStandardMaterial" as any;
const Primitive = "primitive" as any;

const Model = ({ visemeStrength }: { visemeStrength: number }) => {
  const [scene, setScene] = useState<any>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const mouthMeshRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    if (!avatarModelUrl) {
      setLoadFailed(true);
      return () => {
        isMounted = false;
      };
    }

    const loader = new GLTFLoader();
    loader
      .loadAsync(avatarModelUrl)
      .then((gltf: any) => {
        if (!isMounted) return;
        setScene(gltf.scene);
        setLoadFailed(false);
      })
      .catch((error: unknown) => {
        console.error("Unable to load avatar model:", error);
        if (!isMounted) return;
        setScene(null);
        setLoadFailed(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!scene) {
      mouthMeshRef.current = null;
      return;
    }

    scene.traverse((child: any) => {
      if (child.isMesh && child.name === "Wolf3D_Head" && child.morphTargetDictionary) {
        mouthMeshRef.current = child;
      }
    });
  }, [scene]);

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

  if (loadFailed || !scene) {
    return (
      <Group position={[0, -0.3, 0]}>
        <Mesh position={[0, 0.9, 0]}>
          <SphereGeometry args={[0.6, 32, 32]} />
          <MeshStandardMaterial color="#f3d5b5" roughness={0.7} />
        </Mesh>
        <Mesh position={[0, -0.1, 0]}>
          <CapsuleGeometry args={[0.45, 1.2, 8, 16]} />
          <MeshStandardMaterial color="#2f4f4f" roughness={0.9} />
        </Mesh>
      </Group>
    );
  }

  return <Primitive object={scene} scale={[3, 1.8, 2]} />;
};

export default Model;