const express=require('express');
const router=express.Router();
const { registerUser,loginUser,logoutUser } = require('../controllers/user.controller.js');
const verifyJWT=require('../middlewares/auth.middlewares.js');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT,logoutUser);

module.exports=router;