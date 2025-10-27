import { users, chats } from '../models/collections.js';
import { createChatSchema, messageSchema } from '../models/chatSchema.js';

export const createChat = async (req, res) => {
  const validation = createChatSchema.validate(req.body, { abortEarly: false, allowUnknown: true, stripUnknown: true });
  if (validation.error) {
    return res.status(422).json({ error: validation.error.message });
  }
  try {
    const chat = await chats.create(validation.value);
    // add chat id to each participant
    for (const pid of chat.participants) {
      await users.update({ _id: pid }, { $addToSet: { chats: chat._id } });
    }
    // populate participants
    const participants = await users.find({ _id: { $in: chat.participants } }, { firstName: 1, lastName: 1, avatar: 1 });
    return res.status(201).json({ ...chat, participants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserChats = async (req, res) => {
  const userId = req.params.id;
  const skip = Number(req.query.skip || 0);
  const limit = Number(req.query.limit || 20);
  try {
    const list = await chats.find({ participants: { $in: [userId] } }, {}, { updatedAt: -1, createdAt: -1 }, skip, limit);
    const userIds = new Set(list.flatMap(c => c.participants));
    const participants = await users.find({ _id: { $in: Array.from(userIds) } }, { firstName: 1, lastName: 1, avatar: 1 });
    const participantsMap = new Map(participants.map(u => [u._id, u]));
    const value = list.map(c => ({ ...c, participants: c.participants.map(id => participantsMap.get(id)).filter(Boolean) }));
    const totalCount = await chats.count({ participants: { $in: [userId] } });
    return res.status(200).json({ totalCount, value });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getChatById = async (req, res) => {
  try {
    const chat = await chats.findById(req.params.id);
    const participants = await users.find({ _id: { $in: chat.participants } }, { firstName: 1, lastName: 1, avatar: 1 });
    return res.status(200).json({ ...chat, participants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const chat = await chats.findById(req.params.id, { messages: 1 });
    return res.status(200).json(chat.messages || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const sendMessageToChat = async (req, res) => {
  const validation = messageSchema.validate(req.body, { abortEarly: false, allowUnknown: true, stripUnknown: true });
  if (validation.error) {
    return res.status(422).json({ error: validation.error.message });
  }
  try {
    const message = { ...validation.value, createdAt: Date.now() };
    await chats.update({ _id: req.params.id }, { $push: { messages: message } });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

