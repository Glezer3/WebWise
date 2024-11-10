import React, { Suspense, useEffect, useRef, useState } from "react"; 
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import CanvasLoader from "../Loader"

const Earth = ({isMobile}) => {
  const earth = useLoader(GLTFLoader, "./textures/EARTH/scene.gltf")

    const group = useRef();
    const {actions, names} = useAnimations(earth.animations, group);

    useEffect(() => {
      actions[names[0]].reset().play();
    }, [actions, names]);

  return (
    <mesh>
      <hemisphereLight intensity={1} color="white" groundColor="white" />
      <ambientLight intensity={1} />
      <directionalLight intensity={2} position={[0, 10, 0]}/>
      <spotLight intensity={1} position={[0, 1, 0]}/>
      <rectAreaLight intensity={1} position={0, -5, 2.35} color="" groundColor=""/>
      <primitive 
      object={earth.scene} 
      scale={isMobile ? 0.5 : 0.5}
      position={isMobile ? [0, 0, 0] : [0, 0, 0]}
      rotation={[0, 1.3, 0]}
      ref={group}
      />
    </mesh>
  )
};

const EarthCanvas = () => {
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
        minDistance={10}
        zoomSpeed={0.25}
        maxDistance={23}
        autoRotate={true}
        autoRotateSpeed={0.3}
        enableRotate={true}
        /*maxPolarAngle={Math.PI/2}
        minPolarAngle={Math.PI/2}*/
      />
      <Earth isMobile={isMobile}/>
    </Suspense>
    <Preload all />
  </Canvas>

  )
}

export default EarthCanvas