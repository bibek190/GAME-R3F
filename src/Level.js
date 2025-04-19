import React from "react";
import * as THREE from "three";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const Blockchain = ({ position = [0, 0, 0] }) => {
  return (
    <mesh position={position} geometry={boxGeometry} scale={[4, 0.2, 4]}>
      <meshStandardMaterial color={"limegreen"} />
    </mesh>
  );
};

const Level = () => {
  return (
    <>
      <Blockchain position={[2, 2, 2]} />
      <Blockchain />
    </>
  );
};

export default Level;
