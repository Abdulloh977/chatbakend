import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            minlength: 3
        },
        lastname: {
            type: String,
            required: true,
            minlength: 3
        },
        email: {
            type: String,
            required: true,
            minlength: 10
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            default: 100,
            enum: [100, 101, 102]
        },
        profilePicture: {
            type: String,
            default: "",
        }
    },
    {
        timestamps: true
    }
)

export default mongoose.model('User', userSchema);