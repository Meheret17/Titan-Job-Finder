const express = require('express')
const { uploadProfilePicture } = require('../middlewares/multer')
const { uploadCV } = require('../middlewares/multer')
const profileRouter = express.Router()
const {
    handleProfilePicture,
    handleCVUpload,
    bioController
} = require('../controller/profile')

profileRouter.post('/upload-profile', uploadProfilePicture, handleProfilePicture )
profileRouter.post('/upload-cv', uploadCV, handleCVUpload)
// profileRouter.post('/update-bio', bioController)


module.exports = profileRouter