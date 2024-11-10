import React, { Suspense, useEffect, useRef } from "react"; 
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, useAnimations } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import CanvasLoader from "../Loader"

const StylizedPlanet = () => {
  const stylizedPlanet = useLoader(GLTFLoader, "./textures/STYLIZED_PLANET/scene.gltf")

    const group = useRef();
    const {actions, names} = useAnimations(stylizedPlanet.animations, group);

    useEffect(() => {
      actions[names[0]].reset().setDuration(50).play();
    }, [actions, names]);

  return (
    <mesh>
      <hemisphereLight 
      intensity={1} groundColor="black" />
      <ambientLight intensity={0.3} />
      <primitive 
      object={stylizedPlanet.scene} 
      scale={2.75}
      position={[0, 0, 0]}
      rotation={[0, 1.3, 0]}
      ref={group}
      />
    </mesh>
  )
};

const StylizedPlanetCanvas = () => {

  return (
  <Canvas
    frameloop="demand"
    shadows
    dpr={[1,2]}
    camera={{ position: [20, 3, 5], fov:25 }}
    gl={{preserveDrawingBuffer: true}}
  >
    <Suspense fallback={<CanvasLoader />}>
      <OrbitControls 
        enableZoom={false}
        maxDistance={50}
        zoomSpeed={0.25}
        minDistance={15}
        autoRotate={true}
        autoRotateSpeed={4}
        enableRotate={true}
        /*maxPolarAngle={Math.PI/2}
        minPolarAngle={Math.PI/2}*/
      />
      <StylizedPlanet />
    </Suspense>
    <Preload all />
  </Canvas>

  )
}

export default StylizedPlanetCanvas