import User from "../model/userModel.js";
import bcrypt from "bcrypt"
import JWT from 'jsonwebtoken'
import { v4 } from "uuid";
import dotenv from 'dotenv'

dotenv.config()


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authCtrl = {
    signup: async (req, res) => {
        try {
            const {firstname, lastname, email} = req.body
            if(!firstname || !lastname || !email || !req.body.password) {
                return res.status(401).json({message: "Please fill all fields!"})
            }

            const oldUser = await User.findOne({email})

            if(oldUser) {
                return res.status(403).json({message: "This is email already!"})
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            req.body.password = hashedPassword;

            const user = await User.create(req.body);
            let {password, ...otherDatiels} = user._doc

            const token = JWT.sign({}, JWT_SECRET_KEY, {expiresIn: "8h"})

            res.status(201).json({message: "Signup success!", user: otherDatiels, token})
            
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    },

    login: async (req, res) => {
        try {
            const {email} = req.body;

            if (!email || !req.body.password) {
                return res.status(401).json({message: "Please fill all fields!"})
            }

            const user = await User.findOne({email})

            if(!user) {
                return res.status(403).json({message: "Login or password is worng!"})
            }

            const verifyPassword = await bcrypt.compare(req.body.password, user.password)

            if (!verifyPassword) {
                return res.status(403).json({message: "Login or password is worng!"})
            }

            let {password, ...otherDatiels} = user._doc

            const token = JWT.sign({}, JWT_SECRET_KEY, {expiresIn: "8h"})

            res.status(200).json({message: "Login success!", user: otherDatiels, token})
        } catch (error) {
            res.status(503).json({message: error.message})
            console.log(error);
        }
    }
}

export default authCtrl;