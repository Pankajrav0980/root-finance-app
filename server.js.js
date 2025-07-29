const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const adminUser = {
  username: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASS
};

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (username === adminUser.username && password === adminUser.password) {
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;