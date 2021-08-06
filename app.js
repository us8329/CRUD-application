const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const bcrypt  = require('bcrypt')
// const router = require('./router');
const { Session } = require('inspector');
const port = 5050;
const two_hours = 1000*60*60*2;
const users = [
    { id : 1 , email: 'test@gmail.com' , password: 'test'},
] 
app.set('view-engine' , 'ejs');
app.use(express.urlencoded({extended:false}))

app.use(bodyParser.urlencoded({extended:true}))

app.use(session({
    name :'sId',
    resave: false,
    saveUninitialized: false, 
    secret: 'it is a secret' , 
    cookie:{
        maxAge:two_hours,
        sameSite : true,
        secure: false,
    }
}))

// app.use('/router' ,router);

const redirectLogin = (req,res,next)=>{
    if(!req.ssession.userId){
        res.redirect('/login')
    }else{
        next()
    }
}
app.get('/',(req,res)=>{
    // const userId = 1
    const { userId } = req.session
    console.log(userId);
    res.render('index.ejs' , {title : 'index page' , user : userId })
})

app.get('/login' , (req,res)=>{
    res.render('login.ejs' , {title:'login'})
})

app.post('/login' , (req,res)=>{
    const {email , password} = req.body

    if(email && password){
        const user = users.find(
            user => user.email === email && user.password === password)
        if(user){
            req.session.userId= user.id
            return res.redirect('/home')
        }
    }
    res.redirect('/login')
})

app.get('/signup' , (req,res)=>{
    res.render('signup.ejs' , {title: 'Signup'})
})

app.post('/signup' , (req,res)=>{
    const {email , password} = req.body
    if(email && password){
        const exists = users.some(
            user => user.email === email
        )
        if(!exists){
            const user = {
                id: users.length  +1 , 
                email,
                password,
            }
            users.push(user)
            req.session.userId = user.id

            return res.redirect('/login')
        }
    }
    res.redirect('/signup')
})

app.get('/home', (req,res)=>{
    res.render('home.ejs', {title:'Home'})
})

app.post('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.redirect('/home')
        }
        res.clearCookie('sId')
        res.redirect('/login')
    })
})

app.post('/home' , (req,res)=>{
    const products= []
    const {productName , productType , availibilityDate , price , image} = req.body
    const product = {
        productName,
        productType,
        availibilityDate,
        price,
        image,
    }
    products.push(product)
    console.log(products)
})
app.listen(port ,() => console.log('app is listening'))