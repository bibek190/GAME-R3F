import {
  GradientTexture,
  useGLTF,
  useKeyboardControls,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import useGame from "./stores/useGame";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const Player = () => {
  const [subscribeKey, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  // smooth camera
  const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());

  // zustand
  const start = useGame((state) => state.start);
  const end = useGame((state) => state.end);
  const restart = useGame((state) => state.restart);
  const blockCount = useGame((state) => state.blockcount);

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    if (hit && hit.timeOfImpact < 0.15)
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 });
  };

  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    body.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === "ready") reset();
      }
    );

    const unsubscribeJump = subscribeKey(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );
    const unsubscribeAny = subscribeKey(() => {
      start();
    });
    return () => {
      unsubscribeJump();
      unsubscribeAny();
      unsubscribeReset();
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

    // phases
    if (bodyPosition.z < -(blockCount * 4 + 2)) {
      end();
    }
    if (bodyPosition.y < -4) {
      restart();
    }
    // phases
  });

  // gltf
  const ball = useGLTF("./shell_light_ball.glb");

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
      {/* <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color={"mediumpurple"} flatShading />
      </mesh> */}

      <primitive ref={body} object={ball.scene} scale={0.5} />
    </RigidBody>
  );
};

export default Player;
