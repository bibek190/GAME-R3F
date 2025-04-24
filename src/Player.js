import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";

const Player = () => {
  const moveBall = useRef();

  useFrame(() => {
    moveBall.current.applyImpulse({ x: 0, y: 0, z: -0.001 });
  });
  return (
    <>
      <RigidBody
        ref={moveBall}
        position={[0, 1, 0]}
        colliders="ball"
        restitution={0.2}
        friction={1}
        canSleep={false}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial flatShading color={"mediumpurple"} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Player;
