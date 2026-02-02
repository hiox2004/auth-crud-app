const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('./models/User');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({message:'API is running...'});
});

// API versioning
app.use("/api/v1/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-crud-app';
mongoose.connect(MONGO_URI).then(() => {
    console.log('Connection to MongoDB successful');
    
/* TESTING USER MODEL - WORKS FINE
    User.findOne().then(anyUser => {
        console.log("sample user",anyUser);
    }); 
*/
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

module.exports = app;