require("dotenv").config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")

const app = express()

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser: true});

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

const secret = process.env.SECRET

userSchema.plugin(encrypt, {secret: secret,encryptedFields: ["password"]});

const User = new mongoose.model("User",userSchema)

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  })
  newUser.save()
  .then(function(){
    res.render("secrets");
  })
  .catch(function(err){
    console.log(err);
  });
});

app.post("/login",function(req,res){
  const email = req.body.username
  const password = req.body.password
  User.findOne({email : email})
  .then(function(userFound){
    if(userFound.password === password){
      res.render("secrets");
    }else{
      res.send("Password you have entered is incorrect");
    }
  })
  .catch(function(err){
    res.send("Please check the email you have entered");
  });
});

app.listen(3000,function(){
  console.log("server started on port 3000");
})
