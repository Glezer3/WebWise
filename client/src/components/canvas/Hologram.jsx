import React, { Suspense, useEffect, useRef, useState } from "react"; 
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import CanvasLoader from "../Loader"

const Hologram = ({isMobile}) => {
  const hologram = useLoader(GLTFLoader, "./textures/HOLOGRAM/scene.gltf")

    const group = useRef();
    const {actions, names} = useAnimations(hologram.animations, group);

    useEffect(() => {
      actions[names[0]].reset().play(); //setDuration()
    }, [actions, names]);

  return (
    <mesh>
      <hemisphereLight 
      intensity={1} groundColor="black" />
      <ambientLight intensity={0.3} />
      <primitive 
      object={hologram.scene} 
      scale={isMobile ? 0.5 : 0.5}
      position={isMobile ? [0, 0.65, 0] : [0, 0, 0]}
      rotation={[0, 1.3, 0]}
      ref={group}
      />
    </mesh>
  )
};

const HologramCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {

    const mediaQuery = window.matchMedia("(max-width: 1000px)");

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

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
        autoRotateSpeed={0.3}
        enableRotate={true}
        maxPolarAngle={Math.PI/2}
        minPolarAngle={Math.PI/2}
      />
      <Hologram isMobile={isMobile}/>
    </Suspense>
    <Preload all />
  </Canvas>

  )
}

export default HologramCanvas