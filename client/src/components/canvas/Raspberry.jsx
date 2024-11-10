  import React, { Suspense, useEffect, useRef, useState } from "react"; 
  import { Canvas, useFrame, useLoader } from "@react-three/fiber";
  import { OrbitControls, Preload, useGLTF, useAnimations } from "@react-three/drei";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

  import CanvasLoader from "../Loader"

  const Raspberry = ({isMobile}) => {
    const raspberry = useLoader(GLTFLoader, "./textures/RASPBERRY/scene.gltf")

      const group = useRef();
      const {actions, names} = useAnimations(raspberry.animations, group);

      useEffect(() => {
        actions[names[0]].reset().setDuration(60).play();
      }, [actions, names]);

    return (
      <mesh>
        <hemisphereLight intensity={1} color="white" groundColor="white" />
        <ambientLight intensity={0.3} />
        <directionalLight intensity={0.2} position={[0, 10, 0]}/>
        <spotLight intensity={0.8} position={[0, 1, 0]}/>
        <rectAreaLight intensity={1} position={0, 0, 2.35} color="gray" groundColor="gray"/>
        <primitive 
        object={raspberry.scene} 
        scale={isMobile ? 55 : 70}
        position={isMobile ? [0, 0.3, 0] : [0, -0.1, 0]}
        rotation={[0, 1.3, 0]}
        ref={group}
        />
      </mesh>
    )
  };

  const RaspberrysCanvas = () => {
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
      camera={{ position: [20, 3, 5], fov:30 }}
      gl={{preserveDrawingBuffer: true}}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls 
          enableZoom={true}
          minDistance={isMobile ? 13 : 10}
          zoomSpeed={0.25}
          maxDistance={22}
          autoRotate={true}
          autoRotateSpeed={0.3}
          enableRotate={true}
          maxPolarAngle={Math.PI/2}
          minPolarAngle={Math.PI/2}
        />
        <Raspberry isMobile={isMobile}/>
      </Suspense>
      <Preload all />
    </Canvas>

    )
  }

  export default RaspberrysCanvas