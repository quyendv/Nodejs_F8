const express = require('express');

const router = express.Router();

const authenticationController = require('../app/controllers/AuthenticationController');

router.get('/login', authenticationController.login);
router.get('/register', authenticationController.register);
router.post('/login', authenticationController.loginAction);
router.post('/register', authenticationController.registerAction);
router.get('/:slug', authenticationController.show);

module.exports = router;
