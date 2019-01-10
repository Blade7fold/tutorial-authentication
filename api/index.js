require('dotenv/config');
const express = require('express');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');
const movie = require('./routes/movie');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
  // Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myproject');

const { Schema } = mongoose
const movieSchema = new Schema({ title: String, vote_average: Number, release_date: Date })

// Create a new MongoClient
const client = new MongoClient(url);
  
  // Use connect method to connect to the Server
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
  
    const col = db.collection('find');
  
    db.collection('inserts').insertMany([{username:'admin'}, {password:'admin'}], function(err, r) {
      assert.equal(null, err);
      assert.equal(2, r.insertedCount);
    });
    client.close();
  });

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);
app.use('/movie', movie);
app.use(cors());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port}`);
});