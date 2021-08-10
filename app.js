const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path');
const Register = require('./models/registers');
const PRegister = require('./models/productRegisters')
var Product = PRegister.find({});
const { Session } = require('inspector');
const port = 5050;
const two_hours = 7200000

require("./db/connection");
const app = express();

app.set('view-engine' , 'ejs');
app.use(express.urlencoded({extended:false}))

app.use(express.static(__dirname + "./public/"));

const storage = multer.diskStorage({
    destination:"./public/uploads",
    filename: (req,file,cb)=>{
        cb(null,file.fieldname + "_" + Date.now()+ path.extname(file.originalname)); 
    }
});
const upload = multer({ 
    storage: storage 
}) .single('productImage');


app.use(session({
    name :'sessionId',
    resave: false,
    saveUninitialized: false, 
    secret: 'it is a secret' , 
    cookie:{
        maxAge:two_hours,
        sameSite : true,
        secure: false,
    }
}))

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('index.ejs' , {title : 'index page'})
})
app.get('/login' , (req,res)=>{
    res.render('login.ejs' , {title:'login'})
})
app.get('/signup' , (req,res)=>{
    res.render('signup.ejs' , {title: 'Signup'})
})
app.get('/home', (req,res , next)=>{
    Product.exec(function(err , data){
        res.render('home.ejs', {title:'Home', records : data})
    });
    
})

app.post('/signup', async (req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
             const userRegister = new Register({
                 username : req.body.username,
                 password : password,
                 confirmpassword : cpassword,
             })

             const registered = await userRegister.save();
            res.redirect('/login')
        }else{
            res.send('passwords do not match')
        }

    }catch (error){
        res.status(400).send(error);
    }
})

app.post('/login' , async(req,res)=>{
    try{
        const username = req.body.username;
        const password = req.body.password;
        const username_check = await Register.findOne({username : username});

        const isMatch = await bcrypt.compare(password , username_check.password)
        if(isMatch){
            res.redirect('/home')
        }
        else{
            res.send("invalid login credentials")
        }

    }catch(error){
        res.status(400).send("Invalid user");
    }
})

app.post('/home',upload ,  async(req,res)=>{
    try{

        const pName = req.body.productName;
        const pType = req.body.productType;
        const avDate = req.body.availibilityDate;
        const price = req.body.price;
        const image = req.file.filename;
        if(pName){
        const productRegister = new PRegister({
            productName: pName,
            productType: pType,
            availibilityDate:avDate,
            price:price,
            image: image
        })
        const product_registered = await productRegister.save();
        res.redirect('/home')
    }else{
        res.status(400).send("please enter details");
    }
    }catch(error){
        res.status(400).send(error);
    }

})

app.post('/logout',(req,res)=>{
    // req.session.destroy(err=>{
        // if(err){
        //     return res.render('home')
        // }
        // res.clearCookie('sessionId')
        res.redirect('/login')
    // })
})


app.listen(port ,() => console.log('app is listening'))



// const redirectLogin = (req,res,next)=>{
//     if(!req.ssession.userId){
//         res.redirect('/login')
//     }else{
//         next()
//     }
// }


// app.use(session({
//     name :'sessionId',
//     resave: false,
//     saveUninitialized: false, 
//     secret: 'it is a secret' , 
//     cookie:{
//         maxAge:two_hours,
//         sameSite : true,
//         secure: false,
//     }
// }))


// app.post('/login' , (req,res)=>{
//     const {email , password} = req.body

//     if(email && password){
//         const user = users.find(
//             user => user.email === email && user.password === password)
//         if(user){
//             req.session.userId= user.id
//             return res.redirect('/home')
//         }
//     }
//     res.redirect('/login')
// })


// app.post('/signup' , (req,res)=>{
//     const {email , password} = req.body
//     if(email && password){
//         const exists = users.some(
//             user => user.email === email
//         )
//         if(!exists){
//             const user = {
//                 id: users.length  +1 , 
//                 email,
//                 password,
//             }
//             users.push(user)
//             req.session.userId = user.id

//             return res.redirect('/login')
//         }
//     }
//     res.redirect('/signup')
// })


// app.post('/home' , (req,res)=>{
//     const {userId} = req.session
//     const products= []
//     if(userId){
//         const {productName , productType , availibilityDate , price } = req.body
//         const product = {
//             productName,
//             productType,
//             availibilityDate,
//             price,
//         }
//         products.push(product)
//         for(let i =0 ; i,products.length ; i++){
//             console.log(product.productName)
//         }
//     }
    

//     // console.log(products)
// })

