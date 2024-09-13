const express = require("express");
const app = express();
const router = express.Router();
 
const {signup,login} = require("../controllers/Auth");
const{auth,isStudent,isAdmin} = require("../middleware/auth");

router.post("/login",login);
router.post("/signup",signup);

router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:'welcome to the route for test',
    });
});

router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:'welcome to the Route for Students'
    });
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
       success:true,
       message:'welcome to the route for Admin'
    });
});

module.exports = router