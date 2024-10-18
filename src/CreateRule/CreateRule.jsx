import React, { useState } from "react";
import './CreateRule.css';
import axios from "axios";

const CreateRule = () => {
  const [rule, setRule] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/create_rule", { rule });
      setResponse(res.data);
      alert("Rule created successfully! Database has been updated.");
      setRule("");
    } catch (error) {
      console.error("Error creating AST:", error);
    }
  };

  return (
    <div className="create-rule-container">
      <h2>Create AST from Rule</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="Enter rule"
        />
        <button type="submit">Create AST</button>
      </form>
      {response && (
        <div>
          <h3>Created AST:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateRule;
