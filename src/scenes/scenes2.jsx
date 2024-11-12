import { useState, useEffect, useRef } from 'react';
import { useMultiplayerState, usePlayerState, usePlayersList, myPlayer } from 'playroomkit';
import CanvasDraw from "react-canvas-draw";


import PropTypes from 'prop-types';

const Scene2 = ({ onSceneEnd }) => {

  // Debug purpose
  const [count, setCount] = usePlayerState(myPlayer(), "count", 0);

  //Drawing 
  const canvasRef = useRef(null);

  // Submits
  const [drawingData, setDrawingData] = usePlayerState(myPlayer(), "drawingData", "");
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [submittedPlayers, setSubmittedPlayers] = useMultiplayerState("submittedPlayers", []);
  const [everyoneSubmittedDrawing, setEveryoneSubmittedDrawing] = useState(false);

  // Votes
  const [votedPlayers, setVotedPlayers] = useMultiplayerState("votedPlayers", []);
  const [everyoneVotedDrawing, setEveryoneVotedDrawing] = useState(false);
  const [votes, setVotes] = useMultiplayerState("votes", {});
  const [hasVoted, setHasVoted] = useState(false);


  const players = usePlayersList();

  const handleSubmit = () => {
    const dataUrl = canvasRef.current.getDataURL();
    setDrawingData(dataUrl);
    setIsSubmitted(true);
    setSubmittedPlayers([...submittedPlayers, myPlayer().id]);
  };

  const handleVote = (playerId) => {
    setVotes({
      ...votes,
      [playerId]: (votes[playerId] || 0) + 1
    });
    setHasVoted(true);
  };

  useEffect(() => {
    if (players.every(player => submittedPlayers.includes(player.id))) {
        setEveryoneSubmittedDrawing(true);
    }
    
    if (players.every(player => Object.keys(votes).includes(player.id))) {
        //FIN DU ROUND !!
        setEveryoneVotedDrawing(true);
        setTimeout(() => {
            onSceneEnd();
        }, 3000);
    }
  }, [submittedPlayers, votes, players, onSceneEnd]);

  const clearAllScenesStates = () => { //A APPELER QUAND FIN DU ROUND
    setSubmittedPlayers([]);
    setVotes({});
    setEveryoneSubmittedDrawing(false);
    setEveryoneVotedDrawing(false);
  }

  return (
    <div className="scene2">
    <h1>Scene 2</h1>
    <button
            onClick={() => {
              const dataUrl = canvasRef.current.getDataURL();
              console.log(dataUrl);
            }}
          >
            getdataUrl
    </button>
    <button 
      onClick={() => {
        canvasRef.current.eraseAll();
      }}
    >
      Clear
    </button>
    <CanvasDraw 
    ref={canvasRef}
    />
    <br/>
    <button onClick={handleSubmit} disabled={isSubmitted}>Submit drawing</button>
    <button onClick={() => setCount(count + 1)}>Increment</button>
    <p>Count: {count}</p>

    <p>Status de setEveryoneSubmitted:  {everyoneSubmittedDrawing ? "true" : "false"}</p>
    <p>Status de everyoneVoted:  {everyoneVotedDrawing ? "true" : "false"}</p>
    {everyoneSubmittedDrawing && (
        <div className="submitted-countries">
          <h2>Submitted Countries</h2>
          {everyoneVotedDrawing && (<h2>Everyone voted !! Next round loading... </h2>)}
          {players.map(player => {
            const playerDrawingData = player.getState("drawingData");
            return (
              <div key={player.id}>
                <span>{player.getProfile().name}</span>
                <CanvasDraw 
                imgSrc={playerDrawingData}
                disabled
                />
                <button 
                  onClick={() => handleVote(player.id)} 
                  disabled={hasVoted}
                >
                  Vote
                </button>
                <span>Votes: {votes[player.id] || 0}</span>
              </div>
            );
          })}
        </div>
      )}
    
    {/* debug button */}
    <button onClick={() => {onSceneEnd(), (clearAllScenesStates())}}>End Scene 2</button>
  </div>
  );
  
};

Scene2.propTypes = {
  onSceneEnd: PropTypes.func.isRequired
};
export default Scene2;