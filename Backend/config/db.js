const mongoose = require('mongoose');


const mongoURI = "mongodb+srv://aadmimta:am123@cluster0.mvjas.mongodb.net/";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);  
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);  
    }
};

module.exports = connectDB;
