import Lights from "./Lights.jsx";
import { Perf } from "r3f-perf";
import Level, { BlockSpinner } from "./Level.js";
import { Physics } from "@react-three/rapier";
import Player from "./Player.js";
import useGame from "./stores/useGame.js";

export default function Experience() {
  const blockCount = useGame((state) => state.blockCount);

  return (
    <>
      <Physics>
        <Lights />
        <Level count={blockCount} />
        <Player />
      </Physics>
    </>
  );
}
