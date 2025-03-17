// make user controller as to how to create a user 
import User from "../models/user.model.js";
import bcrypt from 'bcrypt';

import { generateToken } from "../utils/generateToken.js";
//we can make this controller in indexedDB.js also but for readability and undeerstandability we made it Headers
export const register = async (req, res) => {
    try {
        const { name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        // checking if already exists 
        //check if user already exists 
        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        //fgfrk spkh
        // if not then create a new user
        await User.create({
            name,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully"
        })

    }catch (error) {
        return res.status(500).json({
            success: false,
            message: "Falied to register"
        
        })  
    }
}
//SIMILARLY CREATE FOR LOGIN 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            })
        }
        // check if user exists 
        const user = await User.findOne({ email }).select("+password");
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exists"
            })
        }
        // check if password is correct 
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        // create token 
        generateToken(user, res,'Welcome back ${user.name}');


    }catch (error) {
        return res.status(500).json({
            success: false,
            message: "Falied to login"
        
        })  
    }
}