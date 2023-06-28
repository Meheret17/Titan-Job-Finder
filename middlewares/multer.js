const express = require('express')
const multer = require('multer')
const profilePictureStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './upload/profile')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const profilePictureUpload = multer({storage: profilePictureStorage}).single('profilePicture')

const cvStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './upload/cv')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const cvUpload = multer({storage: cvStorage}).single('cvFile')

exports.uploadProfilePicture = profilePictureUpload
exports.uploadCV = cvUpload