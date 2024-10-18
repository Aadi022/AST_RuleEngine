const express = require('express');
const router = express.Router();

// Utility function to evaluate the AST
function evaluateAST(node, data) {
    if (node.type === 'operand') {
        const { attribute, operator, value } = node.value;
        switch (operator) {
            case '>':
                return data[attribute] > parseFloat(value);
            case '<':
                return data[attribute] < parseFloat(value);
            case '>=':
                return data[attribute] >= parseFloat(value);
            case '<=':
                return data[attribute] <= parseFloat(value);
            case '=':
                return data[attribute] === value.replace(/'/g, "");  // For string comparison
            default:
                return false;
        }
    }

    if (node.type === 'operator') {
        const leftResult = evaluateAST(node.left, data);
        const rightResult = evaluateAST(node.right, data);

        if (node.value === 'AND') {
            return leftResult && rightResult;
        } else if (node.value === 'OR') {
            return leftResult || rightResult;
        }
    }

    return false;
}

// POST /evaluate_rule - Evaluates the AST against provided data
router.post('/evaluate_rule', (req, res) => {
    const { ast, data } = req.body;  // AST and data provided in the request

    try {
        const result = evaluateAST(ast, data);  // Evaluate the AST
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
