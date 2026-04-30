import Chat from "../model/chatModel.js";
import Message from '../model/messageModel.js';


import fs from "fs"
import path from 'path'
// dotenv.config()


// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const chatCtrl = {
    createChat: async (req, res) => {
        try {
            const {firstId, senderId} = req.params;
            const chat = await Chat.findOne({members: {$all: [firstId, senderId]}})

            if (chat) {
                return res.status(200).json({message: "Found Chat!", chat})
            }

            const newChat = await Chat.create({members: [firstId, senderId]})
            res.status(201).send({message: "Found Chat!", chat: newChat})
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    },

    //chat list
    userChats: async (req, res) => {
        try {
            const {_id} = req.user
            const chats = await Chat.find({members: {$in: [_id]}})

            res.status(200).json({message: "User's chats!", chats})
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    },

    deleteChat: async (req, res) => {
        try {
            const {id} = req.params
            const chat = await Chat.findByIdAndDelete(id)
    
            if (!chat) {
                return res.status(404).json({message: "Chat not found!"})                
            }

            const messages = await Message.deleteMany({chatId: id})

            messages.length >  0 && messages.forEach(message => {
                if (message.file !== '') {
                    fs.unlink(path.join('src', 'public', message.file), err => {
                        if (err) {
                            console.log(err);
                            throw err
                        }
                    })
                }
            });


            res.status(200).json({message: "Delete chat!", chat})
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    }
}

export default chatCtrl;