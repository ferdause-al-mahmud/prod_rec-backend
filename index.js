require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
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


    // jwt
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "5h" });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // Logout

    app.post("/logout", async (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

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

    //query limit
    app.get("/queries-limit", async (req, res) => {
      const limit = parseInt(req.query.limit) || 6;
      const cursor = queryCollection
        .find()
        .limit(limit)
        .sort({ "posted_by.posted_date": -1 });
      const result = await cursor.toArray();
      res.send(result);
    });

    //Get all queries sorted by posted_date
    app.get("/queries/sort", async (req, res) => {
      try {
        const cursor = queryCollection
          .find()
          .sort({ "posted_by.posted_date": -1 });
        const queries = await cursor.toArray();

        res.status(200).send(queries);
      } catch (error) {
        console.error("Error fetching queries:", error);
        res.status(500).send({ message: "Server error" });
      }
    });

    //Get query by id
    app.get("/query/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await queryCollection.findOne(query);
      res.send(result);
    });

    // Get all queries by email
    app.get("/queries/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { "posted_by.email": email };
      // const cursor = queryCollection.find(query);

      const cursor = queryCollection
        .find(query)
        .sort({ "posted_by.posted_date": -1 }); // Sort by posted_date descending

      // console.log(req.user.email, req.params.email);

      if (req.user.email !== req.params.email) {
        return res
          .status(403)
          .send({ message: "You are not authorized to view this job" });
      }
      // console.log("cookies", req.cookies);

      const results = await cursor.toArray();
      res.send(results);
    });

    //update query data
    app.put("/query/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const query = req.body;
      const updateQuery = {
        $set: {
          query_title: query.query_title,
          product_name: query.product_name,
          category: query.category,
          product_brand: query.product_brand,
          product_photo: query.product_photo,
          boycotting_reason: query.boycotting_reason,
        },

        // posted_by: {
        //   email: user.email,
        //   name: user.displayName,
        //   photo: user.photoURL,
        //   posted_date: currentDateTime,
        //   recommendationCount: 0,
        // },
      };
      const result = await queryCollection.updateOne(
        filter,
        updateQuery,
        options
      );
      res.send(result);
    });

    //delete a query
    app.delete("/queries/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await queryCollection.deleteOne(query);
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


    //update query recommendationCount
    app.put("/update-recommendation-count/:queryId", async (req, res) => {
      const queryId = req.params.queryId;

      try {
        // Increment the recommendationCount by 1
        const result = await queryCollection.updateOne(
          { _id: new ObjectId(queryId) },
          { $inc: { "posted_by.recommendationCount": 1 } }
        );

        if (result.modifiedCount > 0) {
          res
            .status(200)
            .send({ message: "Recommendation count updated successfully" });
        } else {
          res
            .status(404)
            .send({ message: "Query not found or no changes made" });
        }
      } catch (error) {
        console.error("Error updating recommendation count:", error);
        res.status(500).send({ message: "Server error" });
      }
    });

    //decrease query recommendationCount
    app.put("/decrease-recommendationCount/:queryId", async (req, res) => {
      const queryId = req.params.queryId;

      try {
        // Decrease the recommendationCount by 1
        const result = await queryCollection.updateOne(
          { _id: new ObjectId(queryId) },
          { $inc: { "posted_by.recommendationCount": -1 } }
        );

        if (result.modifiedCount > 0) {
          res
            .status(200)
            .send({ message: "Recommendation count updated successfully" });
        } else {
          res
            .status(404)
            .send({ message: "Query not found or no changes made" });
        }
      } catch (error) {
        console.error("Error updating recommendation count:", error);
        res.status(500).send({ message: "Server error" });
      }
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