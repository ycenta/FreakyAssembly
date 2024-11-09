import { useMultiplayerState, usePlayerState, insertCoin, myPlayer, usePlayersList } from 'playroomkit';
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Scene1 from '../scenes/scenes1'; 

window._USETEMPSTORAGE = true;

const Game = () => {
  const players = usePlayersList();
  const [currentScene, setCurrentScene] = useMultiplayerState("scene", 1);
  const [submittedPlayers, setSubmittedPlayers] = useMultiplayerState("submittedPlayers", []);

  useEffect(() => {
    insertCoin({gameId: "vHiGJLpSksXKcgzjI3Yk"});
  }, []);

  const playerProfile = myPlayer()?.getProfile();
  if (!playerProfile) {
    return <div>Loading...</div>;
  }

  const handleSceneEnd = () => {
    //Reset all states of this component when debuging
    setCurrentScene(2);
  };

  return (
    <div className="game">
      <div className="player-list">
        <h2>Players, current player is {playerProfile.name}</h2>
        {players.map(player => (
          <span key={player.id}>{player.getProfile().name}
          {submittedPlayers.includes(player.id) && ' ✅'}
          </span>
        ))}
      </div>
      <button onClick={() => {setCurrentScene(1), setSubmittedPlayers([])}}>Set Scene 1</button>
      <span>Scene actuelle : {currentScene}</span>
      {currentScene === 1 && (
        <>
          <Scene1 onSceneEnd={handleSceneEnd}/>
        </>
      )}
    </div>
  );
};

export default Game;