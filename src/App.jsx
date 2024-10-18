import React, { useState } from "react";
import CreateRule from "./CreateRule/CreateRule.jsx";
import CombineRules from "./CombineRules/CombineRules.jsx";
import EvaluateRule from "./EvaluateRule/EvaluateRule.jsx";
import './Mainpage.css';

function App() {
  const [view, setView] = useState("create");

  return (
    <div className="App">
      <h1>AST Manager</h1>
      <div className="navbar">
        <button className="navbar-button" onClick={() => setView("create")}>Create Rule</button>
        <button className="navbar-button" onClick={() => setView("combine")}>Combine Rules</button>
        <button className="navbar-button" onClick={() => setView("evaluate")}>Evaluate Rule</button>
      </div>

      {view === "create" && <CreateRule />}
      {view === "combine" && <CombineRules />}
      {view === "evaluate" && <EvaluateRule />}
    </div>
  );
}

export default App;
