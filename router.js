// var express= require('express');
// // const { getMaxListeners } = require('process');
// var router = express.Router();

// const users = [
//     { id : 1 , email: 'test@gmail.com' , password: 'test'},
// ] 
// router.get('/login' , (req,res)=>{
//     res.render('login.ejs' , {title:'login'})
// })

// router.post('/login' , (req,res)=>{
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

// router.get('/signup' , (req,res)=>{
//     res.render('signup.ejs' , {title: 'Signup'})
// })

// router.post('/signup' , (req,res)=>{
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

// router.get('/home', (req,res)=>{
//     res.render('home.ejs', {title: 'Home'})
// })

// router.post('/logout',(req,res)=>{
//     req.session.destroy(err=>{
//         if(err){
//             return res.redirect('/home')
//         }
//         res.clearCookie('sId')
//         res.redirect('/login')
//     })
// })