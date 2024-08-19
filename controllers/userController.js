const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const teacherModel = require("../models/teacherModel");
const studentModel = require("../models/studentModel");

 const jwtSecret = "Irshad123";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await teacherModel.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = {
  userLoginController: (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Error at login controller", success: false });
      }
      if (!user) {
        return res.status(403).json({ message: info.message, success: false });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign({ id: user._id }, jwtSecret);
        return res.status(200).json({
          message: "Login Successful",
          success: true,
          token,
          user,
        });
      });
    })(req, res, next);
  },
  teacherRegister: async (req, res) => {
    try {
      const data = req.body;
      const check = await teacherModel.findOne({ email: data.email });
      if (check) {
        return res
          .status(200)
          .send({ msg: "User already exists", success: false });
      }
      const password = data.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      data.password = hashedPassword;
      const newUser = new teacherModel(data);
      const token = jwt.sign({ id: newUser._id }, String(jwtSecret));
      await newUser.save();
      res
        .status(201)
        .send({ msg: "registered succesfully", success: true, token });
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: "error while registering", success: false });
    }
  },
  studentActions: async(req, res) => {
    try {
      const {name,subject,marks,action,studentId} = req.body;
      console.log(req.body)
        const check  = await studentModel.findOne({name:name,subject:subject})
        console.log(check)
      if(action ==='Add Student'){
        const check  = await studentModel.findOne({name:name,subject:subject})
        if(check){
          check.marks = marks
          check.save()
          return res.status(200).send({msg:'The combination already exists mark updated',added:false,success:true})
        }
        const newStudent = new studentModel({name,subject,marks})
        await newStudent.save()
        return res.status(200).send({msg:'Student added succesfully',added:true,success:true})
      }else if(action === 'Edit Student'){
        const updatedStudent = await studentModel.findByIdAndUpdate(
          studentId, 
          { 
            marks: marks, 
            subject: subject, 
            name: name 
          }, 
          { new: true }
        );
        return res.status(200).send({msg:'Student updated successfully',updated:true,success:true})
      } else if(action === 'Delete Student'){
        const deletedStudent = await studentModel.findByIdAndDelete(studentId);
        return res.status(200).send({msg:'Student deleted successfully',deleted:true,success:true})
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ msg: "error while addding student", success: false });
    }
  },
  getStudents:async(req,res)=>{
    try{
      const students = await studentModel.find({})
      res.status(200).send({students,success:true})
    }catch(err){
      console.log(err)
      res.status(500).send({msg:'There was an error while fetching students',success:false})
    }
  },
  getUserData:async(req,res)=>{
    const {userId} = req.body
    try{
const teacher = await teacherModel.findById(userId)
if(teacher){
  return res.status(200).send({msg:'Teacher fetch succesful',success:true,teacher})
}
 res.status(200).send({msg:'Teacher nit found',success:false})

    }catch(err){
      console.log(err)
      res.status(500).send({msg:'There was an error while fetching the user'})
    }
  }
};
