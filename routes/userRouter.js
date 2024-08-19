const express = require("express");
const { userLoginController, teacherRegister, studentActions, getStudents, getUserData } = require("../controllers/userController");
const authMiddleWare = require("../middlewares/authMiddleWare");
const router = express.Router();

router.post("/login", userLoginController);
router.post("/register", teacherRegister);
router.post("/student-actions", studentActions);
router.get('/get-students',getStudents)
router.get('/getUserData',authMiddleWare,getUserData)


module.exports = router;