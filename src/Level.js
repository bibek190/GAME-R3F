import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import React, { useRef, useState } from "react";
import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

// floor1
const BlockStart = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
};
// floor1

// floor2
const BlockSpinner = ({ position = [0, 0, 0] }) => {
  const [speed] = useState(
    () => Math.random() + 0.2 * (Math.random() < 0.5 ? -1 : 1)
  );
  const obstacle = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const eulerRotate = new THREE.Euler(0, time * speed, 0);
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(eulerRotate);
    obstacle.current?.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      {/* obstacle */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        restitution={0.2}
        friction={0}
        position={[0, 0.3, 0]}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3, 0.3, 0.3]}
        />
      </RigidBody>
      {/* obstacle */}
    </group>
  );
};
// floor2

// floor3
const BlockLimbo = ({ position = [0, 0, 0] }) => {
  const [speed] = useState(
    () => Math.random() + 0.2 * (Math.random() < 0.5 ? -1 : 1)
  );
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);
  const obstacle = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time * timeOffset) + 1.15;

    obstacle.current?.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      {/* obstacle */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        restitution={0.2}
        friction={0}
        position={[0, 0.3, 0]}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3, 0.3, 0.3]}
        />
      </RigidBody>
      {/* obstacle */}
    </group>
  );
};
// floor3

// floor4
const BlockAxe = ({ position = [0, 0, 0] }) => {
  const [speed] = useState(
    () => Math.random() + 0.2 * (Math.random() < 0.5 ? -1 : 1)
  );
  const [timeoffset] = useState(() => Math.random() * Math.PI * 2);
  const obstacle = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeoffset) * 1.25;

    obstacle.current?.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 1,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      {/* obstacle */}
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        restitution={0.2}
        friction={0}
        position={[0, 0.3, 0]}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
        />
      </RigidBody>
      {/* obstacle */}
    </group>
  );
};
// floor4

// BlockEnd
const BlockEnd = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
};
// BlockEnd

const Level = () => {
  return (
    <>
      <BlockStart position={[0, 0, 16]} />
      <BlockSpinner position={[0, 0, 12]} />
      <BlockLimbo position={[0, 0, 8]} />
      <BlockAxe position={[0, 0, 4]} />
      <BlockEnd position={[0, 0, 0]} />
    </>
  );
};

export default Level;
