import dotenv from 'dotenv'
import JWT from 'jsonwebtoken'

dotenv.config() 

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const authMiddleware = (req, res, next) => {
    try {
        let token = req.headers.token
        if (!token) {
            return res.status(403).json({message: 'Token must be required!'})
        }
        const decodeUser = JWT.verify(token, JWT_SECRET_KEY);
        req.user = decodeUser

        if (decodeUser.role == 102) {
            req.userIsAdmin = true;
        }


        next()
    } catch (error) {
        res.status(503).json({message: error.message})
        console.log(error);
    }
}

export default authMiddleware;