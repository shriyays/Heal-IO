const express = require('express');
const passport = require('passport');
const { register, logout, getMe } = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Login failed' });
    req.logIn(user, (err) => {
      if (err) return next(err);
      const { _id, name, email } = user;
      res.json({ _id, name, email });
    });
  })(req, res, next);
});

router.post('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, getMe);

module.exports = router;
