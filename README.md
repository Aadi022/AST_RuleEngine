# AST_RuleEngine

## Overview

The **AST Manager Project** is a system that allows users to create, combine, and evaluate **Abstract Syntax Trees (ASTs)** based on logical rules. It is built using a **React frontend** and a **Node.js backend** with MongoDB as the database. The AST structure is **converted into JSON**, which is both returned to the user and stored in the MongoDB database. The project is built using a **React frontend** and a **Node.js backend** with MongoDB for data storage.

---

## Project Structure

- **Frontend**: React-based UI that allows users to input rules, combine ASTs, and evaluate them against datasets.
- **Backend**: Node.js/Express server handling requests for creating, combining, and evaluating ASTs. MongoDB is used to store ASTs.

---

## Frontend

### Installation

1. Navigate to the `frontend` directory.
2. Run:
    ```bash
    npm install
    npm start
    ```

### Routes

- `/`: Main page with navigation.
- `/create`: Create an AST from a rule.
- `/combine`: Combine two or more ASTs.
- `/evaluate`: Evaluate an AST against a dataset.

---

## Backend

### Installation

1. Navigate to the `backend` directory.
2. Run:
    ```bash
    npm install
    npm start
    ```

### API Routes

- **POST `/api/create_rule`**: Creates an AST from a logical rule and stores it.
- **POST `/api/combine_rules`**: Combines two or more ASTs into one and stores it.
- **POST `/api/evaluate_rule`**: Evaluates an AST against a dataset and returns the result.

---

## Database Schema

The **AST schema** defines how ASTs are stored in MongoDB:
- **Nodes**: Each node represents either an "operator" (e.g., AND, OR) or an "operand" (e.g., `age > 30`).
- **AST**: Each AST is composed of a root node and child nodes, representing the logical structure of the rule.

---

## Controllers Summary

1. **Create Rule Controller**: Parses a logical rule, constructs an AST, and stores it in the database.
2. **Combine Rules Controller**: Merges two or more ASTs and stores the combined result.
3. **Evaluate Rule Controller**: Evaluates an AST against a given dataset and returns whether the data satisfies the AST.

---

## Usage

1. **Create an AST** from a rule.
2. **Combine ASTs** to merge multiple conditions.
3. **Evaluate AST** to check if a dataset satisfies the rules represented by the AST.
