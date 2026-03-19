const bcrypt = require('bcrypt');
const { getDB } = require('../db');

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });

  try {
    const db = getDB();
    const existing = await db.collection('users').findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 12);
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashed,
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'User created', userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

function logout(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  });
}

function getMe(req, res) {
  const { _id, name, email } = req.user;
  res.json({ _id, name, email });
}

module.exports = { register, logout, getMe };
