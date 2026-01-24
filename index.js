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

const verifyToken = (req, res, next) => {
  console.log("inside the verifyToken middleware", req.cookies);
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoUri);

async function connectDB() {
  try {
    await client.connect();
    const database = client.db("ProdRec");
    const queryCollection = database.collection("queries");
    const recommendationCollection = database.collection("recommendations");

    //-----------------------
    //Query Api's
    //------------------------

    // Create a new query
    app.post("/queries", async (req, res) => {
      const query = req.body;
      const result = await queryCollection.insertOne(query);
      res.send(result);
    });

    // Get all queries
    app.get("/queries", async (req, res) => {
      const search = req.query?.search;
      let query = {};
      if (search) {
        query = { product_name: { $regex: search, $options: "i" } }; // Case-insensitive search
      }
      const cursor = queryCollection
        .find(query)
        .sort({ "posted_by.posted_date": -1 });
      const results = await cursor.toArray();
      res.send(results);
    });

    app.get("/queries-limit", async (req, res) => {
      const limit = parseInt(req.query.limit) || 6;
      const cursor = queryCollection
        .find()
        .limit(limit)
        .sort({ "posted_by.posted_date": -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    //recommendation API
    app.post("/recommendations", async (req, res) => {
      const recommendations = req.body;
      const result = await recommendationCollection.insertOne(recommendations);
      res.send(result);
    });

    app.get("/recommendations", async (req, res) => {
      const cursor = recommendationCollection.find();
      const results = await cursor.toArray();
      res.send(results);
    });

    app.get("/recommendations/:query_id", async (req, res) => {
      const query_id = req.params.query_id;
      const cursor = recommendationCollection
        .find({
          "queryInfo.query_id": query_id,
        })
        .sort({ "recommended_by.posted_date": -1 });
      const results = await cursor.toArray();
      res.send(results);
    });

    app.get("/recommendations/user/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { "recommended_by.email": email };
      const cursor = recommendationCollection.find(query);
      if (req.user.email !== req.params.email) {
        return res
          .status(403)
          .send({ message: "You are not authorized to view this" });
      }
      const results = await cursor.toArray();
      res.send(results);
    });


    app.delete("/recommendations/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await recommendationCollection.deleteOne(query);
      res.send(result);
    });

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