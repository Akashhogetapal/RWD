const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt=require('jsonwebtoken');
const OTP = require("../models/otp");
const {sendOTPEmail,welcome} = require("../utils/mailer");
const { date } = require('joi');
async function randomkey(){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    while (true) {
        let key = "";
        for (let i = 0; i < 8; i++) {
            key += chars[Math.floor(Math.random() * chars.length)];
        }

        const exists = await User.findOne({ key });
        if (!exists) return key;
    }
}


const signup2 = async (req, res) => {
  try {
    const { name, phone, usn, gender, email, password } = req.body;

    if (!name || !phone || !usn || !gender || !email || !password) {
      return res.status(400).json({
        success: false,
        type: "missing",
        message: "All fields are required"
      });
    }

    const alremail = await User.findOne({ email });
    if (alremail) {
      return res.status(409).json({
        success: false,
        type: "email",
        message: "Email already exists"
      });
    }

    const alrusn = await User.findOne({ usn });
    if (alrusn) {
      return res.status(409).json({
        success: false,
        type: "usn",
        message: "USN already exists"
      });
    }

    const hpass = await bcrypt.hash(password, 10);
    const key1 = await randomkey();

    const newuser = new User({
      name,
      phone,
      usn,
      gender,
      email,
      password: hpass,
      key: key1
    });

    await newuser.save();
    await welcome(name, phone, usn, gender, email, key1);

    return res.status(201).json({
      success: true,
      message: "Signup successful"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      type: "server",
      message: "Internal server error"
    });
  }
};


const login2 = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(409).json({
                type:"email",
                message: "User does not exist",
                success: false
            });
        }
        const key=user.key
        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(409).json({
                type:"pass",
                message: "Invalid password",
                success: false
            });
        }
        const jwtToke=jwt.sign({email:user.email,_id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'24h'}

        )
        return res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToke,
            email,
            key,
            user:user.name,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


const forget = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            });
        }

        const existing = await OTP.findOne({ email });

        if (existing && existing.expiresAt > Date.now()) {
            const wait = Math.ceil((existing.expiresAt - Date.now()) / 1000);

            return res.status(429).json({
                success: false,
                message: `OTP already sent. Try again in ${wait} seconds.`
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        try {
            await sendOTPEmail(email, otp);
        } catch (mailErr) {
            console.error("EMAIL SEND FAILED:", mailErr);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Try again later.",
                error:mailErr
            });
        }

        await OTP.updateOne(
            { email },
            {
                $set: {
                    otp,
                    expiresAt: Date.now() + 5 * 60 * 1000
                }
            },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
const verify=async (req,res)=>{
    try{
        const{email,otp}=req.body;
        if(!email||!otp){
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }
        const record=await OTP.findOne({email});

        if(!record){
            return res.status(400).json({
                success: false,
                message: "No OTP found. Request a new one."
            });
        }
        if(record.expiresAt<Date.now()){
            await OTP.deleteOne({ email }); 
            return res.status(400).json({
                success: false,
                message: "OTP expired. Request a new one."
            });
        }
        if (record.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        await OTP.deleteOne({ email });

        return res.status(200).json({
            success: true,
            email,
            message: "OTP verified successfully"
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
const reset = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { $set: { password: hash } });

    await OTP.deleteOne({ email });

    return res.status(200).json({
        success: true,
        message: "Password reset successfully"
    });
}

module.exports = {
    signup2,
    login2,
    forget,
    verify,
    reset
};
