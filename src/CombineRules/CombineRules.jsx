import React, { useState } from "react";
import './CombineRules.css';
import axios from "axios";

const CombineRules = () => {
  const [rule1, setRule1] = useState("");
  const [rule2, setRule2] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/combine_rules", {
        rules: [{ rule: rule1 }, { rule: rule2 }],
      });
      setResponse(res.data);
      alert("Rules combined successfully! Database has been updated.");
      setRule1("");
      setRule2("");
    } catch (error) {
      console.error("Error combining ASTs:", error);
    }
  };

  return (
    <div className="combine-rules-container">
      <h2>Combine ASTs from Rules</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={rule1}
          onChange={(e) => setRule1(e.target.value)}
          placeholder="Enter first rule"
        />
        <input
          type="text"
          value={rule2}
          onChange={(e) => setRule2(e.target.value)}
          placeholder="Enter second rule"
        />
        <button type="submit">Combine ASTs</button>
      </form>
      {response && (
        <div>
          <h3>Combined AST:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CombineRules;
