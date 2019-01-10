const express = require('express');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const { jwtOptions } = require('../config');
const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://localhost:27017/myproject');

// const USER = {
//   id: '123456789',
//   email: 'admin@example.com',
//   username: 'admin',
//   password: 'admin',
// }
//Model for a user
const userSchema = mongoose.Schema({
  id: Number,
  name: {
      firstName: String,
      lastName: String
  },
  username: String,
  password: String
});

let User = connection.model('User', userSchema);
//Creation of user
// const user = new User {
//   id: 7,
//   name: {
//     firstName: 'Nathan',
//     lastName: 'Gonzalez'
//   },
//   username: 'admin',
//   password:'admin'
// };

// user.save(function(err) {
//   if (err) throw err;
   
//   console.log('User successfully saved.');
// };

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
    // here you should make a database call
    if (username === user.username && password === user.password) {
      return done(null, USER);
    }
    return done(null, false);
  },
));

passport.use(new JWTStrategy(
  {
    secretOrKey: jwtOptions.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (jwtPayload, done) => {
    const { userId } = jwtPayload;
    if (userId !== USER.id) {
      return done(null, false);
    }
    return done(null, USER);
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