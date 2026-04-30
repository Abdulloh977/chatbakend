import User from "../model/userModel.js";
import Message from '../model/messageModel.js';


import fs from "fs"
import path from 'path'
// dotenv.config()


// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const userCtrl = {
    getAll: async (req, res) => {
        try {
            const users = await User.find().select("-password")

            res.status(201).send({message: "Get all users!", users})
            
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    },

    getOne: async (req, res) => {
        try {
            const {id} = req.params
            const user = await User.findById(id).select("-password")

            if (!user) {
                return res.status(404).json({message: "User not found!"})                
            }
            res.status(200).json({message: "Found user!", user})
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    },

    deleteUser: async (req, res) => {
        try {
            const {id} = req.params
            if (id == req.user._id || req.userIsAdmin) {
                
                const user = await User.findByIdAndDelete(id)
    
                if (!user) {
                    return res.status(404).json({message: "User not found!"})                
                }

                if (user.profilePicture !== '') {
                    fs.unlink(path.join('src', 'public', user.profilePicture), err => {
                        if (err) {
                            console.log(err);
                            throw err
                        }
                    })
                }

                await Message.deleteMany({senderId: id})
            }
            res.status(200).json({message: "Found user!", user})
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    },

    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { firstname, lastname, email, password } = req.body;
            
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
            }

            if (req.file) {
                if (user.profilePicture && user.profilePicture !== '') {
                    const oldPath = path.join('src', 'public', user.profilePicture); 
                    
                    if (fs.existsSync(oldPath)) { 
                        fs.unlink(oldPath, (err) => {
                            if (err) console.error("Eski rasmni o'chirishda xatolik:", err);
                        });
                    }
                }
                user.profilePicture = req.file.filename; 
            }

            if (firstname) user.firstname = firstname;
            if (lastname) user.lastname = lastname;
            if (email) user.email = email;
            
            if (password) {
                user.password = await bcrypt.hash(password, 10);
            }

            const updatedUser = await user.save();

            res.status(200).json({ 
                message: "Foydalanuvchi ma'lumotlari yangilandi!", 
                user: updatedUser 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Serverda xatolik yuz berdi" });
        }
    }


}

export default userCtrl;