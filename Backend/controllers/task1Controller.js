const express = require('express');
const router = express.Router();
const AST = require('../Models/astModel.js');

function buildAST(expression) {
    const st1 = [];
    const st2 = [];

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

router.post('/create_rule', async (req, res) => {
    const { rule } = req.body;

    try {
        const astNode = buildAST(rule);

        const createdAST = await AST.create({
            root: astNode,
            rule: rule
        });

        res.status(201).json(createdAST);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
