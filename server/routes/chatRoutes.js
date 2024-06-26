const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatControllers');

const router = express.Router();

router.post('/access-chat', protect, accessChat)
router.get('/get-all-chats', protect, fetchChats)
router.post('/create-group', protect, createGroupChat)
router.put('/rename-group', protect, renameGroup)
router.put('/group-add', protect, addToGroup)
router.put('/group-remove', protect, removeFromGroup)

module.exports = router;