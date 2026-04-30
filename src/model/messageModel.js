import mongoose from "mongoose";


const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        file: {
            type: String,
            default: ""
        },
        isRead: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Message', messageSchema);