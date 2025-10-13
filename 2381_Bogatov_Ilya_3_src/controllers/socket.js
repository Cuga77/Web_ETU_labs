import {chats} from "../models/collections.js";
import {messageSchema} from "../models/chatSchema.js";

export function socketHandler(io) {
    io.on('connection', (socket) => {
        socket.on('message', async (data) => {
            console.log(data);
            try {
                const value = await chats.findById(data.chatId);
                if (!value) {
                    return {error: "Chat not found"};
                }

                const messageValidation = messageSchema.validate(data.message, {stripUnknown: true, abortEarly: false, allowUnknown: true});
                if (messageValidation.error) {
                    return {error: messageValidation.error.message};
                }

                if (!value.participants.includes(messageValidation.value.senderId)) {
                    return {error: "Sender is not a participant of this chat."};
                }

                await chats.update({'_id': data.chatId},  {$push: {messages: messageValidation.value}}, true);

                io.emit('message', {chatId: data.chatId, message: messageValidation.value});
                return {chatId: data.chatId, message: messageValidation.value};
            } catch (error) {
                return {error: error.message};
            }
        });
    });
}