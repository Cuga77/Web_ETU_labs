import {chats, users} from '../models/collections.js';
import {createChatSchema, messageSchema} from "../models/chatSchema.js";

const createChat = async (req, res) => {
    const {error, value} = createChatSchema.validate(req.body, {stripUnknown: true, abortEarly: false, allowUnknown: true});
    if (error) {
        return res.status(422).json({error: error.message});
    }

    const chat = await chats.create(value);
    await users.update({'_id': {$in: chat.participants}}, {$addToSet: {chats: chat._id}}, true);

    return res.status(201).json(chat);
}

const getChatById = async (req, res) => {
    try {
        let value = await chats.findById(req.params.id, {messages: 0});
        if (!value) {
            return res.status(404).json({error: "Chat not found"});
        }
        value.participants = await users.find({'_id': {$in: value.participants}}, {avatar: 1, firstName: 1, lastName: 1});
        return res.status(200).json(value);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const sendMessageToChat = async (req, res) => {
    try {
        const value = await chats.findById(req.params.id);
        if (!value) {
            return res.status(404).json({error: "Chat not found"});
        }

        const messageValidation = messageSchema.validate(req.body, {stripUnknown: true, abortEarly: false, allowUnknown: true});
        if (messageValidation.error) {
            return res.status(422).json({error: messageValidation.error.message});
        }

        if (!value.participants.includes(messageValidation.value.senderId)) {
            return res.status(401).json({error: "Sender is not a participant of this chat."});
        }

        await chats.update({'_id': req.params.id},  {$push: {messages: messageValidation.value}}, true);

        return res.status(200).json(messageValidation.value);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

const getChatMessages = async (req, res) => {
    try {
        const chat = await chats.findById(req.params.id, {participants: 1, messages: 1});
        if (!chat)
            return res.status(404).json({error: "Chat not found"});

        // let participants = await users.find({'_id': {$in: chat.participants}}, {avatar: 1, firstName: 1, lastName: 1});
        let messages = chat.messages.sort((a, b) => new Date(b.date) - new Date(a.date));

        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export {createChat, getChatById, sendMessageToChat, getChatMessages};