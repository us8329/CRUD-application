const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required: true
    } ,
    password :{
        type:String,
        required : true
    } ,
    confirmpassword :{
        type:String ,
        required:true
    }

})
userSchema.pre("save" , async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirmpassword = undefined;
    }
    next();
})
//creating collections 

const Register = new mongoose.model("User",userSchema);
module.exports = Register ;
