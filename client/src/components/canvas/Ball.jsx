import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Decal,Float, OrbitControls, Preload, useTexture } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Ball = (img) => {
  const [decal] = useTexture([img.imgUrl]);

  return (
    <Float speed={1} rotationIntensity={0} floatIntensity={0}>
      <ambientLight intensity={1} color="black" groundColor="red"/>
      <directionalLight position={[0, 0, 0.05]} />
      <hemisphereLight intensity={0.8} color="white" groundColor="gray"/>
      <rectAreaLight intensity={1} position={0, 0, 2.35} color="black" />
      <mesh castShadow receiveShadow scale={2}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color='#b0b9c2'
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        <Decal
          position={[0, 0, 1]}
          rotation={[2 * Math.PI, 0, 6.25]}
          scale={0.8}
          map={decal}
          flatShading
        />
      </mesh>
    </Float>
  );
};

const BallCanvas = ({ icon }) => {
  return (
    <Canvas
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball imgUrl={icon} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default BallCanvas;