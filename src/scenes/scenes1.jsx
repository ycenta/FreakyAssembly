import { useState, useEffect } from 'react';
import { useMultiplayerState, usePlayerState, usePlayersList, myPlayer } from 'playroomkit';

import PropTypes from 'prop-types';

const Scene1 = ({ onSceneEnd }) => {

  // Debug purpose
  const [count, setCount] = usePlayerState(myPlayer(), "count", 0);

  // Submits
  const [countryName, setCountryName] = usePlayerState(myPlayer(), "countryName", "");
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [submittedPlayers, setSubmittedPlayers] = useMultiplayerState("submittedPlayers", []);
  const [everyoneSubmitted, setEveryoneSubmitted] = useState(false);

  // Votes
  const [votedPlayers, setVotedPlayers] = useMultiplayerState("votedPlayers", []);
  const [everyoneVoted, setEveryoneVoted] = useState(false);
  const [votes, setVotes] = useMultiplayerState("votes", {});
  const [hasVoted, setHasVoted] = useState(false);


  const players = usePlayersList();

  // handlers methods
  const handleInputChange = (event) => {
    setCountryName(event.target.value);
  };

  const handleSubmit = () => {
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
        setEveryoneSubmitted(true);
    }
    
    if (players.every(player => Object.keys(votes).includes(player.id))) {
        //FIN DU ROUND !!
        setEveryoneVoted(true);
        setTimeout(() => {
            onSceneEnd();
        }, 3000);
    }
  }, [submittedPlayers, votes, players, onSceneEnd]);

  const clearAllScenesStates = () => { //A APPELER QUAND FIN DU ROUND
    setSubmittedPlayers([]);
    setVotes({});
    setEveryoneSubmitted(false);
    setEveryoneVoted(false);
  }

  return (
    <div className="scene1">
    <h1>Scene 1</h1>
    <input 
      type="text" 
      value={countryName} 
      onChange={handleInputChange} 
      placeholder="Enter a country name" 
      disabled={isSubmitted}
    />
    <button onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
    <button onClick={() => setCount(count + 1)}>Increment</button>
    <p>Count: {count}</p>

    <p>Status de setEveryoneSubmitted:  {everyoneSubmitted ? "true" : "false"}</p>
    <p>Status de everyoneVoted:  {everyoneVoted ? "true" : "false"}</p>
    {everyoneSubmitted && (
        <div className="submitted-countries">
          <h2>Submitted Countries</h2>
          {everyoneVoted && (<h2>Everyone voted !! Next round loading... </h2>)}
          {players.map(player => {
            const playerCountryName = player.getState("countryName");
            return (
              <div key={player.id}>
                <span>{player.getProfile().name}: {playerCountryName}</span>
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
    <button onClick={() => {onSceneEnd(), (clearAllScenesStates())}}>End Scene 1</button>
  </div>
  );
  
};

Scene1.propTypes = {
  onSceneEnd: PropTypes.func.isRequired
};
export default Scene1;