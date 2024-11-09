import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple home page created</p>
      <h2>Play a game now:</h2>
      <Link to="/play"><button>Play</button></Link>
    </div>
  );
};

export default Home;