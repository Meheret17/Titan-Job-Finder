const express = require('express')
const {hashPassword} = require('../middlewares/hashpassword')
const {errorMiddleware} = require('../middlewares/errorMiddleware')
const {verifyToken} = require('../middlewares/authentication')
const{
    signup_post, 
    login, 
    updateUser,
    signup_get
} = require('../controller/users')
const userRouter = express.Router()

userRouter.post('/register', hashPassword, signup_post)
userRouter.post('/login', login)
userRouter.put('/updateuser', updateUser)

module.exports = userRouter