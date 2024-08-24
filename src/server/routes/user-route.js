const express = require('express');

const router = express.Router();

const documentSchema = require('../schemas/document-schema');
const userSchema = require('../schemas/user-schema');
const {loginValidator, signupValidator} = require('../validators/auth-validators');
const {validate} = require('../middlewares/validate');
const {createToken} = require('../services/jwt-service');
const {AuthMiddleWare} = require('../middlewares/authmiddlerware');

router.get('/data',AuthMiddleWare ,async (req,res,next)=>{
    try{
        const user = await userSchema.findById(req.userId);
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        return res.status(200).json({user: {
            "username": user.username,
            "email": user.email,
            "id": user._id,
            "profileImage": user.profileImage
        }});
    } 
    catch(err){
        next(err);
    }
});

router.post('/login',validate(loginValidator),async (req,res,next) =>{
    try{
        const {email, password} = req.body;
        const user = await userSchema.matchPassword(email, password);
        const token = createToken(user);
        if(!token){
            const error = new Error('Failed to create token');
            error.statusCode = 500;
            throw error;
        }
        res.setHeader('authorization', `Bearer ${token}`);
        return res.status(200).json({message: 'User logged in successfully',token: token});
    }
    catch(err){
        next(err);
    }
})

router.post('/register',validate(signupValidator),async (req,res,next) =>{
    try{
        const {username, email, password} = req.body;
        const user = await userSchema.create({username, email, password});

        return res.status(201).json({message: 'User created successfully'});
    }catch(err){
        if (err.code === 11000) { // Duplicate key error, likely from a unique constraint in MongoDB
            return res.status(409).json({ error: "User already exists."});
        }
        next(err);
    }
})

module.exports = router;