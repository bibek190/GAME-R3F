import { Float, Text, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";

THREE.ColorManagement.legacyMode = false;

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

// floor1
const BlockStart = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          maxWidth={0.25}
          scale={0.3}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
          font="./bebas-neue-v9-latin-regular.woff"
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
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
          castShadow
        />
      </RigidBody>
      {/* obstacle */}
    </group>
  );
};
// floor2

// floor3
const BlockLimbo = ({ position = [0, 0, 0] }) => {
  // const [speed] = useState(
  //   () => Math.random() + 0.3 * (Math.random() < 0.5 ? -1 : 1)
  // );
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
          castShadow
        />
      </RigidBody>
      {/* obstacle */}
    </group>
  );
};
// floor3

// floor4
const BlockAxe = ({ position = [0, 0, 0] }) => {
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
          castShadow
        />
      </RigidBody>
      {/* obstacle */}
    </group>
  );
};
// floor4

// BlockEnd
const BlockEnd = ({ position = [0, 0, 0] }) => {
  const hamburger = useGLTF("./flag.glb");
  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <group position={position}>
      <Text
        font="./bebas-neue-v9-latin-regular.woff"
        scale={1}
        position={[0, 2, 0]}
      >
        Finish
        <meshBasicMaterial toneMapped={false} />
      </Text>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        restitution={0.2}
        friction={0}
        position={[0, 0.25, 0]}
      >
        <primitive object={hamburger.scene} scale={0.1} rotation-y={0.9} />
      </RigidBody>
    </group>
  );
};
// BlockEnd

// bounds
const Bounds = ({ length = 1 }) => {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          position={[2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          castShadow
        />
        <mesh
          position={[-2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          receiveShadow
        />
        <mesh
          position={[0, 0.75, -(length * 4) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
          receiveShadow
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
};
// bounds

const Level = ({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed,
}) => {
  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
};

export default Level;
export { BlockSpinner, BlockAxe, BlockEnd, BlockLimbo };
