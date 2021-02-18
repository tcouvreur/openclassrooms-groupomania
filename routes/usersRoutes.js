const router = require('express').Router();
const usersController = require('../controllers/usersController');

router.get('/login', usersController.login);
router.post('/register', usersController.register);

module.exports = router;