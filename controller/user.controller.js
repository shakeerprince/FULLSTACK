import { log } from "console";
import User from "../model/User.model.js";
import crypto from "crypto"
import nodemailer from 'nodemailer';

const registerUser = async(req, res)=>{

    /**
 * get data
 * validate
 * check if user already exists
 * create a user in database
 * create a verification token 
 * sava token in database
 * send token as email to user
 * send success status to user
 */
    const {name, email, password} = req.body
    if(!name || !email || !password){
       return res.status(400).json({
            message: "All fields are required"
        });
    }
   
    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                message: "User Already Exists"
            })
        }
        const user = await User.create({
            name,
            email,
            password
        })
        if(!user){
            return res.status(400).json({
                message: "User not registered"
            })
        }

        const token  = crypto.randomBytes(32).toString('hex')
        console.log(token);
        user.verificationToken = token

        await user.save()
        

        //send mail
        //im using node mailer
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_HOST,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.MAILTRAP_USERNAME,
              pass: process.env.MAILTRAP_PASSWORD,
            },
          });

          const mailOptions = {
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: "Verify your email ",
            text: `please click the following link:
            ${process.env.BASE_URL}/api/v1/users${token}`, // plain‑text body
            
          }
          
          await transporter.sendMail(mailOptions)

        return res.status(201).json({
            message: "User registered successfully",user
        })

       }catch(error){
        return res.status(500).json({
            message: "Internal Server error",
            error:error.message
        })
       }        
    }

    const verifyUser = async(req, res)=>{
        //get token from url
        //validate
        //find user based on token
        //if
        //set idVerified field to true
        //remove verification token
        //save
        //return response

        const {token} = req.params
        console.log(token);
        if(!token){
            return res.status(400).json({
                message: "Invalid token"
            })
        }
        const user = User.findOne({verificationToken : token})

        if(!user){
            return res.status(400).json({
                message: "Invalid token"
            })
        }
        user.isVerified = true
        user.verificationToken = undefined
        await user.save()
    }


export {registerUser, verifyUser}



