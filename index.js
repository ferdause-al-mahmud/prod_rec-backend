require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';

const client = new MongoClient(mongoUri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to prodrec-server-site' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});