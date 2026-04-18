import { useContext } from "react";
import { GameContext, type GameContextValue } from "../contexts/game-context";

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame debe usarse dentro de GameProvider");
  }

  return context;
};
