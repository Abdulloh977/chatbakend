import mongoose from "mongoose";


const chatSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
            required: true,
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('Chat', chatSchema);