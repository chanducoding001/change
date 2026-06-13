const express = require("express");
const { signUpController, loginController } = require("../controllers/registerController");

const router = express.Router();


router.post(process.env.SIGN_UP_TAIL_URL,signUpController);
router.post(process.env.LOGIN_TAIL_URL,loginController);



module.exports = router;