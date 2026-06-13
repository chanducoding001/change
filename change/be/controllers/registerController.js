const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signUpController = async (req,res)=>{
    try {
        if(!req.body)return res.status(400).json({
            message:"fields are empty"
        });
        const { name, email, mobile, password, confirmPassword, role } = req.body;
        if(!name||!email||!mobile||!password||!confirmPassword||!role)return res.status(400).json({
            message:"one of the field is missing"
        });
        if(password!==confirmPassword)return res.status(400).json({
            message:"password does not match"
        });

        const currentUserWithEmail = await User.findOne({email});
        
        if(currentUserWithEmail)return res.status(400).json({
            message:'User with this email already exists'
        });
        const currentUserWithMobile = await User.findOne({mobile});
        if(currentUserWithMobile)return res.status(400).json({
            message:'User with this phone number already exists'
        });
        // if(!currentUser)return res.status(400).json({
        //   success: false,
        //   message: "Email is not verified",
        // });
        // if(currrentUser.isOtpVerified!==isEmailVerified)return res.status(400).json({
        //   success: false,
        //   message: "Email is not verified",
        // });
        const hashedPwd = await bcrypt.hash(password, 10);

        const user = await User.create({
          name,
          email,
          mobile,
          password:hashedPwd, 
          role,
        });
        // isOtpVerified:isEmailVerified
    
        return res.status(201).json({
          success: true,
          data: user,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
}



const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const currentUserWithEmail = await User.findOne({ email });

    if (!currentUserWithEmail) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      currentUserWithEmail.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: currentUserWithEmail._id,
        email: currentUserWithEmail.email,
        role: currentUserWithEmail.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
   
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: currentUserWithEmail._id,
        name: currentUserWithEmail.name,
        email: currentUserWithEmail.email,
        role: currentUserWithEmail.role,
        mobile:currentUserWithEmail.mobile,
        address:currentUserWithEmail.address,
        profilePhoto:currentUserWithEmail.profilePhoto
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const loginController = async (req,res)=>{
//     try {
//         if(!req.body)return res.status(400).json({
//             message:"fields are empty"
//         });
//         const { email, password } = req.body;
//         if(!email || !password)return res.status(400).json({
//             message:"All fields are required!"
//         });
        
//         const currentUserWithEmail = await User.findOne({email});
        
//         if(!currentUserWithEmail)return res.status(400).json({
//             message:'User with this email does not exists'
//         });
        
//         const isMatch = await bcrypt.compare(
//     password,
//     currentUserWithEmail.password
//   );

//   if (!isMatch) {
//     return res.status(401).json({
//       message: "Invalid credentials",
//     });
//   }

//   res.status(200).json({
//     success: true,
//     message: "Login successful",
//   });

//       } catch (error) {
//         res.status(400).json({
//           success: false,
//           message: error.message,
//         });
//       }
// }




module.exports = {signUpController,loginController};