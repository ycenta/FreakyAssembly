import { useState, useEffect, useRef } from 'react';
import { useMultiplayerState, usePlayerState, usePlayersList, myPlayer } from 'playroomkit';
import { motion, useMotionValue, useTransform, useDragControls } from 'framer-motion';

import PropTypes from 'prop-types';

const Scene1 = ({ onSceneEnd }) => {
  // Debug purpose
  const [count, setCount] = usePlayerState(myPlayer(), "count", 0);
  const constraintsRef = useRef(null);


  // Submits
  const [countryName, setCountryName] = usePlayerState(myPlayer(), "countryName", "");
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [submittedPlayers, setSubmittedPlayers] = useMultiplayerState("submittedPlayers", []);
  const [everyoneSubmitted, setEveryoneSubmitted] = useState(false);

  // Votes
  // const [votedPlayers, setVotedPlayers] = useMultiplayerState("votedPlayers", []);
  const [everyoneVoted, setEveryoneVoted] = useState(false);
  const [votes, setVotes] = useMultiplayerState("votes", {});
  const [hasVoted, setHasVoted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [angle, setAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredBallot, setHoveredBallot] = useState(null);
  const [wasDragged, setWasDragged] = useState(false);


  const players = usePlayersList();

  // handlers methods
  const handleInputChange = (event) => {
    setCountryName(event.target.value);
  };

  const handleSubmit = () => {
    if (!countryName) {
      return;
    }
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

  useEffect(() => {
    if (players.every(player => Object.keys(votes).includes(player.id))) {
      setEveryoneVoted(true);
    }
  }, [votes, players]);


  useEffect(() => {
    const handleMouseMove = (event) => {
      if(isDragging) {
        setTimeout(() => {  
          setMousePosition({ x: event.clientX-50, y: event.clientY });

          if(event.movementX > 2) {
            if (angle + 10 <= 45) {
              setAngle(angle + 5);
            }
          }
          if(event.movementX < -2) {
            if (angle - 10 >= -45) {
              setAngle(angle - 5);
            }
          }
          if(event.movementX === 0) {
            //set 
            setAngle(0);
          }
        }, 10);
      }
    };


    if (everyoneSubmitted && !everyoneVoted) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [everyoneSubmitted, everyoneVoted, angle, isDragging]);


  const handleHoverStart = (ballotId) => {
    if(isDragging){
      setHoveredBallot(ballotId);
    }
  };

  const handleHoverEnd = () => {
    setHoveredBallot(null);
  };


  const checkCollision = (letterRect, ballotRect) => {
    return (
      letterRect.left < ballotRect.right &&
      letterRect.right > ballotRect.left &&
      letterRect.top < ballotRect.bottom &&
      letterRect.bottom > ballotRect.top
    );
  };

  useEffect(() => {
    if (isDragging) {
      const letterElement = document.querySelector('.letter');
      const ballotElements = document.querySelectorAll('.ballot');

      if (letterElement) {
        const letterRect = letterElement.getBoundingClientRect();

        ballotElements.forEach((ballotElement, index) => {
          const ballotRect = ballotElement.getBoundingClientRect();
          if (checkCollision(letterRect, ballotRect)) {
            setHoveredBallot(index + 1);
          } else if (hoveredBallot === index + 1) {
            setHoveredBallot(null);
          }
        });
      }
      setWasDragged(true);
    }else {
      if(!hasVoted && wasDragged){
        setHasVoted(true);
        setWasDragged(false);
        alert("You voted !");
      }
    }
  }, [mousePosition, isDragging, hoveredBallot, hasVoted, wasDragged]);

  const clearAllScenesStates = () => { //A APPELER QUAND FIN DU ROUND
    setSubmittedPlayers([]);
    setVotes({});
    setEveryoneSubmitted(false);
    setEveryoneVoted(false);
  }

  return (
    <div className="scene1">
      <h1>Scene 1</h1>

        {/* DEBUG
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Count: {count}</p> */}

      {/* PANEL 1 */}
      {!everyoneSubmitted && (
        <><div className="nes-field">
          <label htmlFor="name_field">Your proposal of a <br/>Country name</label>
          <input
            type="text"
            id="name_field"
            required
            value={countryName}
            className="nes-input"
            onChange={handleInputChange}
            placeholder="Enter a country name"
            disabled={isSubmitted} />
        </div><button className={`nes-btn ${isSubmitted ? 'is-disabled' : 'is-primary'}`} onClick={handleSubmit} disabled={isSubmitted}>Submit</button>
        </>
      )}

      {/* PANEL 2 */}
      {/* DEBUG
      <p>Status de setEveryoneSubmitted:  {everyoneSubmitted ? "true" : "false"}</p>
      <p>Status de everyoneVoted:  {everyoneVoted ? "true" : "false"}</p> */}

      {!everyoneSubmitted && isSubmitted && (
        <span>Waiting for other players to submit their countries...</span>
      )}

    {everyoneSubmitted && (
          <div className="submitted-countries">
            <h2>Submitted Country names</h2>
            {everyoneVoted && (<h2>Everyone voted !! Next round loading... </h2>)}
            <section className="nes-container">
              <section className="message-list">
                {players.map((player, index) => {
                  const playerCountryName = player.getState("countryName");
                    return (
                      <motion.div 
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 1.3 }}
                    >
                        <section className={`message ${player.id === myPlayer().id ? '-right' : '-left'}`}>
                          {player.id !== myPlayer().id && <i className="nes-bcrikko"></i>}
                          <div className={`nes-balloon from-${player.id === myPlayer().id ? 'right' : 'left'}`}>
                            <p>{player.getProfile().name}: {playerCountryName}</p>
                          </div>
                          {player.id === myPlayer().id && <i className="nes-bcrikko"></i>}
                        </section>
                      </motion.div>
                    );
                })}
              </section>
            </section>
          </div>
        )}
      {/* VOTES */}
      <motion.div style={{background: 'red', width: "100%"}} ref={constraintsRef} className="ballot-container">
      {everyoneSubmitted && (
          <div className="submitted-countries">
            <h2>Submitted Country names</h2>
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


    {everyoneSubmitted && !everyoneVoted && (
      <>
            {/* <img src="/assets/pixel/letter.png" alt="letter" className="letter" style={{ position: 'absolute',  top: mousePosition.y, left: mousePosition.x, transform: `rotate(${angle}deg)`, transition: 'transform 0.1s' }} /> */}
            <div>
              <motion.img 
                src="/assets/pixel/letter.png" 
                alt="letter" 
                className="letter" 
                drag 
                style={{ rotate: angle, transition: '0s ease-in-out', zIndex: 3, position: 'relative' }}  
                onHoverStart={() => console.log("hovered")}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                dragConstraints={constraintsRef}
              />
            </div>
          <div>
          <motion.img 
                width={250} 
                src="/assets/pixel/ballot.png" 
                alt="ballot" 
                className="ballot" 
                animate={{ scale: hoveredBallot === 1 ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onHoverStart={() => handleHoverStart(1)}
                onHoverEnd={handleHoverEnd}
              />
              <motion.img 
                width={250} 
                src="/assets/pixel/ballot.png" 
                alt="ballot" 
                className="ballot" 
                animate={{ scale: hoveredBallot === 2 ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ position:"relative", zIndex: 1 }}
                onHoverStart={() => handleHoverStart(2)}
                onHoverEnd={handleHoverEnd}
              />
          </div>
        </>
      )}
    </motion.div>
      {/* debug button */}
      <button onClick={() => {onSceneEnd(), (clearAllScenesStates())}}>End Scene 1</button>
  </div>
  );
  
};

Scene1.propTypes = {
  onSceneEnd: PropTypes.func.isRequired
};
export default Scene1;