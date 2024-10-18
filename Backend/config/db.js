const mongoose = require('mongoose');

// MongoDB connection string (update this with your MongoDB URI)
const mongoURI = "mongodb+srv://aadmimta:am123@cluster0.mvjas.mongodb.net/";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);  // Options removed
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);  // Exit process with failure
    }
};

module.exports = connectDB;
