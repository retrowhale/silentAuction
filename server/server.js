
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json()); 
app.use(cors());


const itemRoutes = require('./routes/Items');
app.use('/api/items', itemRoutes);



app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
