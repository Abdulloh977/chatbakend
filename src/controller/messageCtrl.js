import Chat from "../model/chatModel.js";
import Message from '../model/messageModel.js';


import fs from "fs"
import path from 'path'
import { create } from "domain";
import { v4 } from "uuid";
// dotenv.config()


// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const messageCtrl = {
    createMessage: async (req, res) => {
        try {
            const {chatId, senderId, text} = req.body;
            
            if (!chatId || !senderId || !text) {
                return res.status(403).json({message: "Please fill all fieds!"})
            }
            if (req.files) {
                const {image} = req.files
                const format = path.extname(image.name)

                if (format != '.png' && format != 'jpeg') {
                    return res.status(403).json({message: 'File format is worng!'})
                }

                const nameImg = v4() + format

                image.mv(path.join('src', 'public', nameImg), err => {
                    if(err) throw err
                })

                req.body.file = nameImg
            }
            const message = await Message.create(req.body)

            res.status(201).send({message: "Message is created!", message})
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    },

    //chat list
    getMessage: async (req, res) => {
        try {
            const {_id} = req.user
            const messages = await Message.find({chatId: id})

            res.status(200).json({message: "User's chats!", messages})
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    },

   deleteMessage: async (req, res) => {
        try {
            const { id } = req.params; 

            const message = await Message.findByIdAndDelete(id);

            if (!message) {
                return res.status(404).json({ message: "Xabar topilmadi!" });
            }

            if (message.file && message.file !== '') {
                const filePath = path.join('src', 'public', message.file);
                
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Faylni o'chirishda xatolik:", err);
                    }
                });
            }

            res.status(200).json({ message: "Xabar muvaffaqiyatli o'chirildi!", message });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default messageCtrl;