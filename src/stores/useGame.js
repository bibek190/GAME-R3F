import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      blockcount: 10,
      blockSeed: 0,
      startTime: 0,
      endTime: 0,

      // phase
      phase: "ready",
      start: () => {
        //   console.log("start");
        set((state) => {
          if (state.phase === "ready")
            return {
              phase: "playing",
              startTime: Date.now(),
            };
          // if the phase is not playing then we will return empty object
          return {};
        });
      },
      restart: () => {
        set((state) => {
          if (state.phase === "playing" || state.phase === "ended")
            return { phase: "ready", blockSeed: Math.random() };
          // if the phase is not playing then we will return empty object
          return {};
        });
      },
      end: () => {
        set((state) => {
          if (state.phase === "playing")
            return { phase: "ended", endTime: Date.now() };
          // if the phase is not playing then we will return empty object
          return {};
        });
      },
    };
  })
);
