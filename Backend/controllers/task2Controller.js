const express = require('express');
const router = express.Router();
const AST = require('../Models/astModel.js');

function combineASTs(ASTs) {
    if (ASTs.length === 0) return null;
    if (ASTs.length === 1) return ASTs[0];

    let combinedAST = ASTs[0];

    for (let i = 1; i < ASTs.length; i++) {
        combinedAST = mergeTwoASTs(combinedAST, ASTs[i]);
    }

    return combinedAST;
}

function mergeTwoASTs(ast1, ast2) {
    if (ast1.type === 'operand' && ast2.type === 'operand') {
        if (ast1.value.attribute === ast2.value.attribute && ast1.value.operator === ast2.value.operator) {
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

        if (JSON.stringify(ast1.value) === JSON.stringify(ast2.value)) {
            return ast1;
        }
    }

    if (ast1.type === 'operator' && ast2.type === 'operator' && ast1.value === ast2.value) {
        return {
            type: 'operator',
            value: ast1.value,
            left: mergeTwoASTs(ast1.left, ast2.left),
            right: mergeTwoASTs(ast1.right, ast2.right)
        };
    }

    return {
        type: 'operator',
        value: 'AND',
        left: ast1,
        right: ast2
    };
}

function relaxThreshold(operator, value1, value2) {
    if (operator === '>' || operator === '>=') {
        return Math.min(parseFloat(value1), parseFloat(value2)).toString();
    } else if (operator === '<' || operator === '<=') {
        return Math.max(parseFloat(value1), parseFloat(value2)).toString();
    }
    return value1;
}

router.post('/combine_rules', async (req, res) => {
    const { rules } = req.body;

    try {
        const asts = rules.map((r) => buildAST(r.rule));
        const combinedAST = combineASTs(asts);
        const createdAST = await AST.create({
            root: combinedAST,
            rule: rules.map(r => r.rule).join(' AND ')
        });

        res.status(201).json(createdAST);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

module.exports = router;
