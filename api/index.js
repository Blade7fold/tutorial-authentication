require('dotenv/config');
const express = require('express');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');
const cors = require('cors');

var MongoClient = require('mongodb').MongoClient,
  test = require('assert');

MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
  test.equal(null, err);

  // Reference a different database sharing the same connections
  // for the data transfer
  var secondDb = db.db("integration_tests_2");

  // Fetch the collections
  var multipleColl1 = db.collection("multiple_db_instances");
  var multipleColl2 = secondDb.collection("multiple_db_instances");

  // Write a record into each and then count the records stored
  multipleColl1.insertOne({a:1}, {w:1}, function(err, result) {
    multipleColl2.insertOne({a:1}, {w:1}, function(err, result) {

      // Count over the results ensuring only on record in each collection
      multipleColl1.count(function(err, count) {
        test.equal(1, count);

        multipleColl2.count(function(err, count) {
          test.equal(1, count);

          db.close();
        });
      });
    });
  });
});

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);
app.use(cors());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Magic happens at http://localhost:${port}`);
});