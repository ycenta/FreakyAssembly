import './App.css';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useMultiplayerState, insertCoin, myPlayer, usePlayersList } from 'playroomkit';

function App() {
  window._USETEMPSTORAGE = true;
  const players = usePlayersList();

  useEffect(() => {
    insertCoin({gameId: "vHiGJLpSksXKcgzjI3Yk"});
  }, []);

  const playerProfile = myPlayer()?.getProfile();

  if (!playerProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App" style={{ backgroundColor: playerProfile.color.hexString }}>
      <div className="">
        <h2>Hello world</h2>
      </div>

    </div>
  );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);

export default App;