const express = require('express');
const router = express.Router();
const AST = require('../Models/astModel.js');  // Import AST model

// Utility function to build AST
function buildAST(expression) {
    const st1 = [];  // Stack for operators and parentheses
    const st2 = [];  // Stack for operands (subtrees)

    // Tokenize the expression
    const tokens = expression.match(/\(|\)|AND|OR|[a-zA-Z_][a-zA-Z0-9_]*\s*[<>=!]+\s*['"]?[a-zA-Z0-9]+['"]?/g);

    for (const token of tokens) {
        const trimmedToken = token.trim();

        if (trimmedToken === '(') {
            st1.push(trimmedToken);  // Push '(' onto stack
        } else if (trimmedToken === ')') {
            while (st1.length > 0 && st1[st1.length - 1] !== '(') {
                const operator = st1.pop();
                const right = st2.pop();
                const left = st2.pop();
                const operatorNode = { type: 'operator', value: operator, left, right };
                st2.push(operatorNode);  // Push the subtree back to the operand stack
            }
            st1.pop();  // Remove '('
        } else if (trimmedToken === 'AND' || trimmedToken === 'OR') {
            st1.push(trimmedToken);  // Push operator onto stack
        } else {
            const [attribute, operator, value] = trimmedToken.split(/(\s*[<>=!]+\s*)/).filter(Boolean);
            const operandNode = {
                type: 'operand',
                value: { attribute: attribute.trim(), operator: operator.trim(), value: value.trim() }
            };
            st2.push(operandNode);  // Push operand onto the stack
        }
    }

    // Process remaining operators in the stack
    while (st1.length > 0) {
        const operator = st1.pop();
        const right = st2.pop();
        const left = st2.pop();
        const operatorNode = { type: 'operator', value: operator, left, right };
        st2.push(operatorNode);
    }

    return st2.pop();  // Return the root of the AST
}

// POST /create_rule - Creates AST from rule and stores in the database
router.post('/create_rule', async (req, res) => {
    const { rule } = req.body;

    try {
        const astNode = buildAST(rule);  // Generate the AST from the input rule

        // Store the AST and rule in the database using Mongoose
        const createdAST = await AST.create({
            root: astNode,  // Root of the AST
            rule: rule      // Input rule
        });

        res.status(201).json(createdAST);  // Respond with the created AST document
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
