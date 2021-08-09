const mongoose = require('mongoose')

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
// const productSchema = new mongoose.Schema({
//     productName :{
//         type:String,
//         required : true
//     },
//     productType :{
//         type:String , 
//         required:true,
//     },
//     availibilityDate :{
//         type:String , 
//         required:true,
//     },
//     price :{
//         type:String , 
//         required:true,
//     }
// })

//creating collections 

const Register = new mongoose.model("User",userSchema);
// const PRegister = new mongoose.model("Product" , productSchema);
module.exports = Register ;
// module.exports = PRegister;
