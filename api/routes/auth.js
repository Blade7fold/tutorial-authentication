const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');
const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://localhost:27017/myproject');

// Database Name
const dbName = 'myproject';

// const USER = {
//   id: '123456789',
//   email: 'admin@example.com',
//   username: 'admin',
//   password: 'admin',
// }
//Model for a user
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
      firstName: String,
      lastName: String
  },
  username: String,
  password: String
});

const User = connection.model('User', userSchema);

//Creation of user
const user = new User ({
  _id: new mongoose.Types.ObjectId(),
  name: {
    firstName: 'Nathan',
    lastName: 'Gonzalez'
  },
  username: 'admin',
  password:'admin'
});

// Saving user into database
user.save(function(err) {
  if (err) throw err;
   
  console.log('User successfully saved.');
});

const router = express.Router();
const LocalStrategy = passportLocal.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    client.connect(function(err) {
      assert.equal(null, err);
      console.log("Connected successfully to db server");

      const db = client.db(dbName);

      const col = db.collection('find');

      db.collection.findOne()
        .where('username')
        .equals(username)
        .then(res => { 
          return done(null, res);
        })
        .catch(err => {
          console.error(err);
          return done(null, false);
        });
      // here you should make a database call
      // if (username === user.username && password === user.password) {
      //   return done(null, USER);
      // }
      // return done(null, false);
    });
  },
));

passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    if (userId !== user._id) {
      return done(null, false);
    }
    return done(null, user);
  },
));

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const { password, ...user } = req.user;
  const token = jwt.sign({ userId: user.id }, jwtOptions.secret);
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Content-Type': 'text/plain;charset=utf-8'
  });
  res.send({ user, token });
});

module.exports = router;