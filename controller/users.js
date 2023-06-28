const Users = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const hasher = require('../middlewares/hashpassword')
const validation = require('../middlewares/errorMiddleware')

exports.signup_get = (req, res)=>{
    res.render('signup')
}

exports.signup_post = async(req, res)=>{
    try{
        const name = req.body.name
        const email = req.body.email
        const phone = req.body.phone
        const password = req.body.password
        const birthdate = req.body.birthdate
        const gender = req.body.gender
        const education = req.body.education
        const photo = req.file.filename
        const skill = req.body.skill
        

        if(!name || !phone || !email || !password){
            return res.status(400).json({
                message: 'Please provide all inputs'
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: 'invalid email address'
            })
        }
        const nameRegex = /^[a-zA-Z ]{2,}$/;
        if(!nameRegex.test(name)){
            return res.status(400).json({
                message: 'Provide a full name'
            })
        }
       
        User.findOne({ email: email})
            .then(user=>{
                if(user){
                    return res.status(400).json({
                        message: 'Email already register please login'
                    })
                }
            })
       
        const user = new User({
            name,
            email,
            phone,
            password,
            birthdate,
            gender,
            education,
            photo,
            skill
        })
        await user.save()
        res.render('success')
    }catch(err){
        console.log('Error creating user', err)
        res.render('error')
    }
}

// login to account
exports.login= async(req, res, next)=>{
    try{
        const{email, password} = req.body
        if(!email || !password){
            res.status(400).json({
                message: "Please provide all fields"
            })
        }
        const user = await User.findOne({email})
        if(!user){
            res.status(400).json({
                message: "Invalid email and password"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({
                message: "Invalid email and password"
            })
          }
          const token = user.createJWT()
          res.status(200).json({
            success: true,
            message: "Login SUccessfully",
            user,
            token,
          })
    }catch(error){
        res.status(500).json({error})
    }
}

exports.updateUser = async (req, res, next) => {
    const {name, username, email, password} = req.body
    if (!name || !username || !email || !password) {
      next("Please Provide All Fields");
    }
    const user = await userModel.findOne({ _id: req.user.userId });
    user.name = name;
    user.username = username;
    user.email = email;
    user.password = password;
  
    await user.save();
    const token = user.createJWT();
    res.status(200).json({
      user,
      token,
    });
  };
