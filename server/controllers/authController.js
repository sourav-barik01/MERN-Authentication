import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: "Missing Details"
        })
    }
    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({
                success: false,
                message: "User Already Exist"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashedPassword});
        await user.save();      // User is created & saved in Mongo DB

        // Next we will generate a token for authentication & send this token using cookies
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
            maxAge: 7*24*60*60*1000     // 7 Days in ms
        })

        // Welcome Email
        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to MERN Auth',
            html: `Welcome to <strong>MERN Auth!!</strong>. Your Account has been created with email id: <strong>${email}</strong>`,
        }
        await transporter.sendMail(mailOption);

        return res.json({
            success: true,
            message: "User Registered Successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.json({
            success: false,
            message: "Missing Details"
        });
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success: false,
                message: "Invalid Email, User Not Exist"
            });
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if(!isMatchPassword){
            return res.json({
                success: false,
                message: "Incorect Password"
            });
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
            maxAge: 7*24*60*60*1000     // 7 Days in ms
        })
        return res.json({
            success: true,
            message: "User Logged In Successfully"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "strict",
        });
        return res.json({
            success: true,
            message: "User Logged Out Successfully"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        // We will get userId from token & token is stored in cookies. Therefore we will develop middleware that will find cookie -> token -> userId
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({
                success: false,
                message: "Account Already Verified!!"
            });
        }
        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random()*900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24*60*60*1000;
        await user.save();

        const mailOption = {
            from : process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            html: `Your OTP is <strong>${otp}</strong>. Verify your account using this OTP.`,
        }
        await transporter.sendMail(mailOption);
        return res.json({
            success: true,
            message: "Verification OTP is sent successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const verifyEmail = async (req, res) => {
    const userId = req.userId;
    const {otp} = req.body;
    if(!userId || !otp){
        return res.json({
            success: false,
            message: "Missing Details"
        })
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({
                success: false,
                message: "User Not Found!!"
            })
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({
                success: false,
                message: "Invalid OTP!!"
            })
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({
                success: false,
                message: "OTP Expired!!"
            })
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({
            success: true,
            message: "Email Verified Successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User Authenticated Successfully!!"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }    
}

export const sendPasswordResetOtp = async (req, res) => {
    const {email} = req.body;
    if(!email){
        return res.json({
            success: false,
            message: "Please provide Email"
        })
    }
    try {
        const user = await userModel.findOne({email});
        if (user) {
            const otp = String(Math.floor(100000 + Math.random() * 900000));
            user.resetOtp = otp;
            user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
            await user.save();

            const mailOption = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Password Reset OTP',
                html: `Your Password reset OTP is <strong>${otp}</strong>. Reset your account password using this OTP.`,
            }
            await transporter.sendMail(mailOption);
            return res.status(200).json({
                success: true,
                message: "Reset Password OTP sent successfully"
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.status(400).json({
            success: false,
            message: "Missing Details"
        })
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({
                success: false,
                message: "User Not Found"
            })
        } 
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({
                success: false,
                message: "Invalid OTP"
            })
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({
                success: false,
                message: "OTP Expired"
            })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}