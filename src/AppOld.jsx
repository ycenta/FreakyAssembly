import './App.css';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useMultiplayerState, insertCoin, myPlayer, usePlayersList } from 'playroomkit';

function App() {
  window._USETEMPSTORAGE = true;

  const randomNumBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const randomRotations = Array(20).fill(0).map(() => `rotate(${randomNumBetween(-5, 5)}deg) translateX(${randomNumBetween(-10, 10)}px)`);

  const players = usePlayersList();
  const [currentEmoji, setCurrentEmoji] = useMultiplayerState("emoji", []);
  const [currentVotes, setCurrentVotes] = useMultiplayerState("votes", []);
  const [timer, setTimer] = useState(null);
  const [displayedVote, setDisplayedVote] = useState(null);

  useEffect(() => {
    insertCoin({gameId: "vHiGJLpSksXKcgzjI3Yk"});
  }, []);

  const playerProfile = myPlayer()?.getProfile();

  if (!playerProfile) {
    return <div>Loading...</div>;
  }

  const upvoteCount = currentVotes.filter(vote => vote.emoji === "👍").length;
  const downvoteCount = currentVotes.filter(vote => vote.emoji === "👎").length;

  const addEmoji = (emoji) => {
    setCurrentEmoji([...currentEmoji, { emoji, id: myPlayer().id }]);
    setCurrentVotes([]); // Reset votes

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      const mostVotedEmoji = upvoteCount >= downvoteCount ? "👍" : "👎";
      setDisplayedVote(mostVotedEmoji);

      setTimeout(() => {
        setDisplayedVote(null);
      }, 3000); // Hide after 3 seconds
    }, 10000); // 10 seconds

    setTimer(newTimer);
  };

  return (
    <div className="App" style={{ backgroundColor: playerProfile.color.hexString }}>
      <div className="vote-count-bar">
        <span role="img">👍 {upvoteCount}</span>
        <span role="img">👎 {downvoteCount}</span>
      </div>
      {currentEmoji.map((emojiData, i) => {
        const player = players.find(p => p.id === emojiData.id);
        if (!player) return null;
        return (
          <div key={i} className="emoji-display">
            <span
              style={{ transform: randomRotations[i % randomRotations.length] }}
              className="card">
              <span className="avatar">
                <img src={player.getProfile().photo} />
              </span>
              {emojiData.emoji}
            </span>
          </div>
        );
      })}
      {currentVotes.map((voteData, i) => {
        const player = players.find(p => p.id === voteData.id);
        if (!player) return null;
        return (
          <div key={i} className="">
            {voteData.emoji}
          </div>
        );
      })}
      <div className="emoji-button-bar">
        <a className="emoji-button"
          onClick={() => addEmoji("🫶")}>
          <span role="img">🫶</span>
        </a>
        <a className="emoji-button"
          onClick={() => addEmoji("🥳")}>
          <span role="img">🥳</span>
        </a>
        <a className="emoji-button"
          onClick={() => addEmoji("👋")}>
          <span role="img">👋</span>
        </a>
      </div>

      <div className="vote-button-bar">
        <a className="vote-button"
          onClick={() =>
            setCurrentVotes([...currentVotes, { emoji: "👍", id: myPlayer().id }])
          }>
          <span role="img">👍</span>
        </a>
        <a className="vote-button"
          onClick={() =>
            setCurrentVotes([...currentVotes, { emoji: "👎", id: myPlayer().id }])
          }>
          <span role="img">👎</span>
        </a>
      </div>

      {displayedVote && (
        <div className="displayed-vote">
          <span role="img">{displayedVote}</span>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);

export default App;