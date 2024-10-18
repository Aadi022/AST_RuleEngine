const mongoose = require('mongoose');

// Define the Node schema
const nodeSchema = new mongoose.Schema({
    type: {
        type: String,  // "operator" or "operand"
        required: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,  // Could be an operator or operand value
        required: true,
    },
    left: {
        type: mongoose.Schema.Types.Mixed,  // Could be null or another node
        default: null,
    },
    right: {
        type: mongoose.Schema.Types.Mixed,  // Could be null or another node
        default: null,
    }
}, { _id: false });  // Disable _id generation for child nodes

// Define the AST schema
const astSchema = new mongoose.Schema({
    root: nodeSchema,  // Root node of the AST
    rule: {
        type: String,  // Input rule as a string
        required: true
    }
}, { timestamps: true });  // Enable createdAt and updatedAt timestamps

// Create the AST model
const AST = mongoose.model('AST', astSchema);

module.exports = AST;
