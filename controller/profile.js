const express = require('express')
require('../middlewares/multer')

exports.handleProfilePicture = async(req, res)=>{
    try{
        res.status(200)
    }catch(error){
        res.status(500).json({
            message: 'Error uploading profile picture'
        })
    }
}

exports.handleCVUpload = async(req, res)=>{
    try{
        res.status(200)
    }catch(error){
        res.status(500).json({
        message: 'Error uploading profile picture'
    })}

}

// exports.bioController = async(req, res)=>{
//     fs.readFile[]
// }

