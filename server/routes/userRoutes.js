const express = require('express');
const { registerUser, authUser, getUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register-user', registerUser);
router.post('/login', authUser)
router.get('/get-users', protect, getUsers);

module.exports = router