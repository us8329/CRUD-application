const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

require("./db/connection");
const app = express();


const Register = require('./models/registers');
const ProductRegisters = require('./models/productRegisters');

const mongoose = require('mongoose')
const { Session } = require('inspector');
const PRegister = require('./models/registers');
const port = 5050;

app.set('view-engine' , 'ejs');
app.use(express.urlencoded({extended:false}))

app.use(express.json());

app.use(bodyParser.urlencoded({extended:true}))

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

const redirectLogin = (req,res,next)=>{
    if(!req.ssession.userId){
        res.redirect('/login')
    }else{
        next()
    }
}
app.get('/',(req,res)=>{
    // const userId = 1
    // const { userId } = req.session
    // console.log(userId);
    res.render('index.ejs' , {title : 'index page'})
})

app.get('/login' , (req,res)=>{
    res.render('login.ejs' , {title:'login'})
})

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

app.get('/signup' , (req,res)=>{
    res.render('signup.ejs' , {title: 'Signup'})
})

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

             //hash password using middleware 

             const registered = await userRegister.save();
            //  res.status(201).redirect(login);
            res.redirect('/login')
        }else{
            res.send('passwords do not match')
        }

    }catch (error){
        res.status(400).send(error);
    }
})


app.get('/home', (req,res)=>{
    res.render('home.ejs', {title:'Home'})
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
app.post('/home', async(req,res)=>{
    try{
        const productRegister  = new ProductRegisters({
            productName : req.body.productName,
            productType : re.body.productType,
            availibilityDate : req.body.availibilityDate,
            price : req.body.price
        })
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
app.listen(port ,() => console.log('app is listening'))