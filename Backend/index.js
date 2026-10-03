const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt=require("bcrypt")
const nodemailer = require("nodemailer")
const otpgenerator=require("otp-generator")
const app = express()
const port = 2002

app.use(cors())
app.use(express.json())

// Gmail transporter
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chaturvedianuj025@gmail.com",
    pass: "puasmcbarhlojeqn"
  }
})

// MongoDB
mongoose.connect("mongodb://localhost:27017/hotolData")
  .then(() => console.log("database connected"))
  .catch((error) => console.log("database is not connect", error))

 
  const otpSchema=mongoose.Schema({
    email:{
      type:String,
      unique:true
    },
    otp:String,
    verified:{
      type:Boolean,
      default:false
    },
    expiresAt:Date
  });

// Schema
const userSchema = mongoose.Schema({
  name:String,
  email: {
    type: String,
    unique: true
  },
  password:String,
  gender:{
    type:String,
    enum:["male","female","other"]
  },
  address:String
})

// const otpSchema

const User = mongoose.model("User", userSchema)
const Otp=mongoose.model("Otp",otpSchema)

app.post("/get-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required"
      });
    }

    // Check email already registered hai ya nahi
    const verifyUser = await User.findOne({ email });

    if (verifyUser) {
      return res.status(400).send({
        success: false,
        message: "Email already exists"
      });
    }

    // OTP generate
    const token = otpgenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    // console.log("Generated OTP:", token);

    // OTP database me save
    await Otp.create({
  email,
  otp: token,
  verified: false,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000)
})

    //  Nodemailer se otp send
    await mailer.sendMail({
      from: "chaturvedianuj025@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your verification OTP is ${token}. This OTP is valid for 5 minutes.`
    });

    return res.status(200).send({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "OTP send failed"
    });
  }
});


//verify otp

app.post("/verify-otp", async (req, res) => {
  try {
    const { otp, email } = req.body;

    const verifyotp = await Otp.findOne({ email });

    if (!verifyotp) {
      return res.status(404).send({
        message: "Email not found"
      });
    }

    if (Number(verifyotp.otp) !== Number(otp)) {
      return res.status(400).send({
        message: "OTP is not match",
        success:false
      });
    }

    return res.status(200).send({
      message: "Email is verified",
      success:true
    });

  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "Server error"
    });
  }
});



//singp route 
app.post("/signup",async (req,res)=>{
  const {name,email,password,gender,address}=req.body

  const verifyUser=await User.findOne({email})
  const hasspassword = await bcrypt.hash(password, 9);
  console.log("hass");
  
  if(verifyUser)
  {
    res.status(404).send({message:"user are already exits"})
  }
  const createUser=await User.create({name,email,password:hasspassword,gender,address})

  res.send({message:"user is created successfully",
    user:createUser
  })
})



//login

app.post("/login",async (req,res)=>{
  const {email,password}=req.body
console.log("email is: ",email);
console.log("password is: ",password);

  const verifyEmail= await User.findOne({email})
  console.log("verifyEmail is : ",verifyEmail);
  
  if(!verifyEmail)
  {
    console.log("email is not match");
    
    return res.send({
      success:false,
      message:"email is not match"})
  }
  let newpassword=await bcrypt.compare(password,verifyEmail.password)
 if(!newpassword)
 {
  console.log("password is wrong");
  
  return res.send({
    success:false,
    message:"password is wrong"})
 }

 res.send({
  success:true,
  message:"login is successfully",
user:verifyEmail
})

})


// forget password 

app.post("/forget-pass",async (req,res)=>{
  const {email}=req.body
// console.log("email get it : ",email);

  const verifyEmail= await Otp.findOne({email})
  //  console.log("otp data is: ",verifyEmail);
  // OTP generate
    const token = otpgenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false
    });

    console.log("Generated OTP:", token);
    
   if(verifyEmail)
   {
    const email1=verifyEmail.email
    const createOtp=await Otp.updateOne({email:email1},{$set:{otp:token}})
   }
   //  Nodemailer se otp send
    await mailer.sendMail({
      from: "chaturvedianuj025@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your verification OTP is ${token}. This OTP is valid for 5 minutes.`
    });

   res.send({message:"update otp : ",
  success:true,
  otpdata:token  
  })

})

app.post("/verifyemail-forget",async(req,res)=>{
  const {email,otp}=req.body

if(!email)
{
  res.send({
    success:false,   
    message:"email is required"})
}

  const verifyemail=await Otp.findOne({email})
  if(!verifyemail)
  {
    res.send({
      message:"email is not exits",
      success:false
    })
  }
 if(Number(verifyemail.otp)!==Number(otp))
 {
  res.send({message:"otp is wrong",
    success:false
  })
 }
res.send({
  message:"email is verifed",
  success:true
})

})


//forget password 

app.post("/forget-password",async(req,res)=>{
  const {email,password}=req.body

  if(!password)
  {
    res.send({message:"please enter password",
      success:false
    })
  }
const hashpassword=await bcrypt.hash(password,9)
  const updatePassword=await User.updateOne({email:email},{$set:{password:hashpassword}})

  res.send({message:"password is updated successfully",
            success:true
          })
})

//reset password

app.post("/reset-password",async (req,res)=>{
  try{
  const {password,newPassword,email}=req.body
  
  const verifyPassword=await User.findOne({email})
  const hashpassword=await bcrypt.compare(password,verifyPassword.password)
  const hashNewpassword=await bcrypt.hash(newPassword,9)
   if(!hashpassword)
   {
    return res.send({
      message:"old password wrong!",
      success:false
    })
   }
  
   const updatePassword=await User.updateOne({email:email},{$set:{password:hashNewpassword}})

res.send({message:"password is updated",
  success:true
})


}
catch(err)
{
  return res.send({
    message:"error",
    success:false
  })
}


})
// Server
app.listen(port, () => {
  console.log("server is running", port)
})