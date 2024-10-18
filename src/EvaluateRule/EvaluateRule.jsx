import React, { useState } from "react";
import './EvaluateRule.css';
import axios from "axios";

const EvaluateRule = () => {
  const [ast, setAst] = useState("");
  const [data, setData] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedAST = JSON.parse(ast);
      const parsedData = JSON.parse(data);

      const res = await axios.post("http://localhost:3000/api/evaluate_rule", {
        ast: parsedAST,
        data: parsedData,
      });
      setResponse(res.data.result); // Extract the "result" (true/false)
      alert("AST evaluated successfully!");
    } catch (error) {
      console.error("Error evaluating AST:", error);
    }
  };

  return (
    <div className="evaluate-rule-container">
      <h2>Evaluate AST</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={ast}
          onChange={(e) => setAst(e.target.value)}
          placeholder='Enter AST JSON here (e.g., {"type": "operator", ...})'
          rows="5"
        />
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder='Enter Data JSON here (e.g., {"age": 35, "department": "Marketing", ...})'
          rows="5"
        />
        <button type="submit">Evaluate</button>
      </form>
      {response !== null && (
        <div>
          <h3>Answer:</h3>
          <input type="text" value={response ? "True" : "False"} readOnly />
        </div>
      )}
    </div>
  );
};

export default EvaluateRule;
