const express = require('express');
const router = express.Router();
const AST = require('../Models/astModel.js');

// Function to combine multiple ASTs
function combineASTs(ASTs) {
    if (ASTs.length === 0) return null;
    if (ASTs.length === 1) return ASTs[0]; // If there's only one AST, no need to merge

    // Start with the first AST and merge the rest into it
    let combinedAST = ASTs[0];

    for (let i = 1; i < ASTs.length; i++) {
        combinedAST = mergeTwoASTs(combinedAST, ASTs[i]);
    }

    return combinedAST;
}

// Function to merge two ASTs dynamically
function mergeTwoASTs(ast1, ast2) {
    // If both nodes are operands and have the same attribute and operator, we perform relaxation
    if (ast1.type === 'operand' && ast2.type === 'operand') {
        if (ast1.value.attribute === ast2.value.attribute && ast1.value.operator === ast2.value.operator) {
            // Relax threshold by comparing values dynamically
            const relaxedValue = relaxThreshold(ast1.value.operator, ast1.value.value, ast2.value.value);
            return {
                type: 'operand',
                value: {
                    attribute: ast1.value.attribute,
                    operator: ast1.value.operator,
                    value: relaxedValue
                }
            };
        }

        // If operands are identical, return one of them (no need to duplicate)
        if (JSON.stringify(ast1.value) === JSON.stringify(ast2.value)) {
            return ast1;
        }
    }

    // If both nodes are operators and have the same operator, merge their children
    if (ast1.type === 'operator' && ast2.type === 'operator' && ast1.value === ast2.value) {
        return {
            type: 'operator',
            value: ast1.value,
            left: mergeTwoASTs(ast1.left, ast2.left),
            right: mergeTwoASTs(ast1.right, ast2.right)
        };
    }

    // If the root nodes are different or incompatible, combine them under an AND node
    return {
        type: 'operator',
        value: 'AND',
        left: ast1,
        right: ast2
    };
}

// Function to relax thresholds based on the operator and values
function relaxThreshold(operator, value1, value2) {
    if (operator === '>' || operator === '>=') {
        return Math.min(parseFloat(value1), parseFloat(value2)).toString();
    } else if (operator === '<' || operator === '<=') {
        return Math.max(parseFloat(value1), parseFloat(value2)).toString();
    }
    return value1;  // For equality or other operators
}

// POST /combine_rules - Combines multiple ASTs and stores the result in the database
router.post('/combine_rules', async (req, res) => {
    const { rules } = req.body;  // Array of rules in req.body (e.g., [{ rule: "..." }, { rule: "..."}])

    try {
        // Convert the input rules to ASTs using buildAST
        const asts = rules.map((r) => buildAST(r.rule));

        // Combine all the ASTs
        const combinedAST = combineASTs(asts);

        // Store the combined AST in the database
        const createdAST = await AST.create({
            root: combinedAST,
            rule: rules.map(r => r.rule).join(' AND ')  // Combine rules into a single string
        });

        res.status(201).json(createdAST);  // Respond with the created AST
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assuming buildAST is the same as in the first controller (or can be imported)
function buildAST(expression) {
    const st1 = []; // Stack for operators and parentheses
    const st2 = []; // Stack for operands (subtrees)

    const tokens = expression.match(/\(|\)|AND|OR|[a-zA-Z_][a-zA-Z0-9_]*\s*[<>=!]+\s*['"]?[a-zA-Z0-9]+['"]?/g);

    for (const token of tokens) {
        const trimmedToken = token.trim();

        if (trimmedToken === '(') {
            st1.push(trimmedToken);
        } else if (trimmedToken === ')') {
            while (st1.length > 0 && st1[st1.length - 1] !== '(') {
                const operator = st1.pop();
                const right = st2.pop();
                const left = st2.pop();
                const operatorNode = { type: 'operator', value: operator, left, right };
                st2.push(operatorNode);
            }
            st1.pop();
        } else if (trimmedToken === 'AND' || trimmedToken === 'OR') {
            st1.push(trimmedToken);
        } else {
            const [attribute, operator, value] = trimmedToken.split(/(\s*[<>=!]+\s*)/).filter(Boolean);
            const operandNode = {
                type: 'operand',
                value: { attribute: attribute.trim(), operator: operator.trim(), value: value.trim() }
            };
            st2.push(operandNode);
        }
    }

    while (st1.length > 0) {
        const operator = st1.pop();
        const right = st2.pop();
        const left = st2.pop();
        const operatorNode = { type: 'operator', value: operator, left, right };
        st2.push(operatorNode);
    }

    return st2.pop();
}

module.exports = router;
