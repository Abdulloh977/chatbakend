import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {Server} from 'socket.io';



dotenv.config()

import http from 'http';
import path from 'path';
import { error } from 'console';

// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY


//routes
import authRouter from './src/router/authRouter.js'
import userRouter from './src/router/userRouter.js'
import chatRouter from './src/router/chatRouter.js'
import messageRouter from './src/router/messageRouter.js'



const app = express();
const PORT = process.env.PORT || 4001

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
            // method: ['GET', 'POST']
        }
})


// to save  files for public
app.use(express.static(path.join('src', 'public')));

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(cors());


//routers
app.use('/api', authRouter)
app.use('/api', userRouter)
app.use('/api', chatRouter)
app.use('/api', messageRouter)





//socket.io


const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL).then(() => {
    httpServer.listen(PORT, () => console.log(`Server running on port: ${PORT}`)
    )
}).catch(error => {
    console.log(error); 
})