import logo from './logo.svg';
import './App.css';
import jsxRuntime from 'react/jsx-runtime';

function App() {
  var name = "React Learner";

  const handleClick = () => {
    name = "Matt Did this";
    alert('Button clicked!');
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h1>Hello {name}</h1>
        </a>
        <button onClick={handleClick}>Update Text</button>
      </header>
    </div>
  );
}

export default App;
