const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    left: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    right: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    }
}, { _id: false });

const astSchema = new mongoose.Schema({
    root: nodeSchema,
    rule: {
        type: String,
        required: true
    }
}, { timestamps: true });

const AST = mongoose.model('AST', astSchema);

module.exports = AST;
