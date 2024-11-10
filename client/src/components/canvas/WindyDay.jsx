import React, { Suspense, useEffect, useRef, useState } from "react"; 
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import CanvasLoader from "../Loader"

const WindyDay = () => {
  const windyDay = useLoader(GLTFLoader, "./textures/WINDY_DAY/scene.gltf")

    /*const group = useRef();
    const {actions, names} = useAnimations(windyDay.animations, group);

    useEffect(() => {
      actions[names[0]].reset().play();
    }, [actions, names]);*/

  return (
    <mesh>
      <hemisphereLight 
      intensity={1} groundColor="black" />
      <ambientLight intensity={0.3} />
      <primitive 
      object={windyDay.scene} 
      scale={2.5}
      position={[0, 0, 0]}
      rotation={[0, +1.3, 0]}
      //ref={group}
      />
    </mesh>
  )
}

const WindyDayCanvas = () => {
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
        enableZoom={true}
        maxZoom={0.5}
        zoomSpeed={0.25}
        minZoom={0.5}
        autoRotate={true}
        autoRotateSpeed={1.5}
        enableRotate={true}
        /*maxPolarAngle={Math.PI/2}
        minPolarAngle={Math.PI/2}*/
      />
      <WindyDay />
    </Suspense>
    <Preload all />
  </Canvas>

  )
}

export default WindyDayCanvas