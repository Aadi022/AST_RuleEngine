const express = require('express');
const router = express.Router();

const task1Controller = require('../controllers/task1Controller');
const task2Controller = require('../controllers/task2Controller');
const task3Controller = require('../controllers/task3Controller');

// Create Rule Route
router.use(task1Controller);

// Combine Rules Route
router.use(task2Controller);

// Evaluate Rule Route
router.use(task3Controller);

module.exports = router;
