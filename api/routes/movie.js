const express = require('express');

const router = express.Router();

const authentication = (req, res, next) => {
    return passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) { next(err) }
        req.user = user || null;
        next();
    })(req, res, next);
}

router.get('/movies', authentication, (req, res) => {
    const movies = req.user ? req.user.username : 'anonymous';
    res.send({ message: `Hello ${movies}, this message is public!` })
})

module.exports = router;