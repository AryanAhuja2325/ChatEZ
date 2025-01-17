const asyncHandler = require("express-async-handler");
const Chat = require('../models/chatModel');
const User = require("../Models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("User id not passed");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name, pic, email'
    })

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
})

const fetchChats = asyncHandler(async (req, res) => {
    try {
        const chats = Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                })
                res.status(200).send(results)
            })

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }

    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400)
            .json({ message: "More than 2 users required for the group chat" })
    }

    users.push(req.user._id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user._id
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName
            },
            {
                new: true
            }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(updatedChat)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const updatedChat = await Chat.findOneAndUpdate(
            { _id: chatId },
            { $push: { users: userId } },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404);
            throw new Error("Chat not found");
        }
        else {
            res.status(200).json(updatedChat)
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const updatedChat = await Chat.findOneAndUpdate(
            { _id: chatId },
            { $pull: { users: userId } },
            { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        if (!updatedChat) {
            res.status(404);
            throw new Error("Chat not found");
        }
        else {
            res.status(200).json(updatedChat)
        }
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }