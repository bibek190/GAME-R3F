import { GradientTexture, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const Player = () => {
  const [subscribeKey, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  // smooth camera
  const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit.timeOfImpact < 0.15)
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };
  useEffect(() => {
    const unsubscribeJump = subscribeKey(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );
    subscribeKey(() => {
      console.log("any key");
    });
    return () => {
      unsubscribeJump();
    };
  }, []);

  const body = useRef();

  useFrame((state, delta) => {
    // Controls
    const { forward, backward, rightward, leftward } = getKeys();
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current?.applyImpulse(impulse);
    body.current?.applyTorqueImpulse(torque);
    // Controls

    // Camera
    const bodyPosition = body.current?.translation();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.5;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    // Camera
  });

  return (
    <RigidBody
      ref={body}
      colliders="ball"
      restitution={0.2}
      friction={1}
      position={[0, 1, 0]}
      canSleep="false"
      angularDamping={0.5}
      linearDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color={"mediumpurple"} flatShading />
      </mesh>
    </RigidBody>
  );
};

export default Player;
