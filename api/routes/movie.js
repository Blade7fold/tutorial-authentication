const express = require('express');

const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
  // Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Connection with database
const connection = mongoose.createConnection('mongodb://localhost:27017/myproject');

// Model for a movie
const moviesSchema = new Schema({
    title: String,
    vote_average: Number,
    release_date: Date }
    )
const findMovies = connection.model('findMovies', moviesSchema);

// Create a new MongoClient
const client = new MongoClient(url);
  
  // Use connect method to connect to the Server


const authentication = (req, res, next) => {
    return passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) { next(err) }
        req.user = user || null;
        next();
    })(req, res, next);
}

router.get('/movies', authentication, (req, res) => {
    const movies = req.user ? req.user.username : 'anonymous';
    
    client.connect(function(err) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
      
        const db = client.db(dbName);
      
        const col = db.collection('find');
      
        findMovies.where('vote_average').gt(3.0)
            .then(movie => console.log(movie));
    
        db.collection('inserts').insertMany([
          {username:'admin'},
          {password:'admin'}],
          function(err, r) {
          assert.equal(null, err);
          assert.equal(2, r.insertedCount);
        });
        client.close();
    });

    res.send({ message: `${movies}!` })
})

module.exports = router;