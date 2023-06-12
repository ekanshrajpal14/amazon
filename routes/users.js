const mongoose = require("mongoose");
const db = require('dotenv').config();
mongoose.set("strictQuery",false)
// const DB = "mongodb+srv://Ekansh:ekansh@cluster0.njro97u.mongodb.net/mamazondb?retryWrites=true&w=majority" 
// mongoose.connect("mongodb://localhost/mamazon").then(function () {
//   console.log("connect");
// });
mongoose.connect(process.env.database).then(function(){
  console.log("connected");
}).catch(err=>{
  console.log("no connect");
})




const passportlm = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
  name: String,
  username: String,
  passport: String,
  email: String,
  birth: String,
  productid: [{

    type: mongoose.Schema.Types.ObjectId,
    ref:"products"
    
  }],
  address: String,
  seller: Boolean,
  contactnumber:String,
  pic:String,
  gstin:{
    type:Number,
    default:0
  }
});

userSchema.plugin(passportlm);
module.exports = mongoose.model("user", userSchema);

