const express = require('express')
const userRouter = require('./users')
const profileRouter = require('./profile')
const jobRouter = require('./jobs')

const mainRouter = express.Router()
mainRouter.use('/api/user', userRouter)
mainRouter.use('/api/profile', profileRouter)
mainRouter.use('/api/job', jobRouter)

module.exports = mainRouter