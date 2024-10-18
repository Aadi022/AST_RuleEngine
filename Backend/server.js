const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db.js');
const routes = require('./Routes/route.js');
const cors= require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDB();

// Routes
app.use('/api', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
