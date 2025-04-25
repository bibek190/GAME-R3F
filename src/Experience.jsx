import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights.jsx";
import { Perf } from "r3f-perf";
import Level, { BlockSpinner } from "./Level.js";
import { Physics } from "@react-three/rapier";
import Player from "./Player.js";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />
      <Physics>
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}
