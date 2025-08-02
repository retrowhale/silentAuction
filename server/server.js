
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();


app.use(express.json());

const itemRoutes = require('./routes/Items');
app.use('/api/items', itemRoutes);

const authRoutes = require('./routes/Authorization');
app.use('/api/Authorization', authRoutes);


app.use('/uploads',express.static('uploads'))


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected');
    
    app.listen(5000, () => console.log(' Server running on port 5000'));
})
.catch(err => {
    console.error(' MongoDB connection error:', err);
});
