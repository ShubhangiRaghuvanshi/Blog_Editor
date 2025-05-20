const express = require('express');
const router = express.Router();
const { register, login} = require('../controllers/authController');


router.options('*', (req, res) => {
  res.sendStatus(200);
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;
