const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const Register = require('../models/registers');
const PRegister = require('../models/productRegisters')
const multer = require('multer')
var Product = PRegister.find({});
const router = express.Router();
const two_hours = 7200000


router.use(session({
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
const storage = multer.diskStorage({
    // destination:"./public/uploads",
    destination:(req,res,cb)=>{
        // cb(null,'/Users/utkarshsinha/mongoosedemo/public/uploads/')
        cb(null,'');
    },
    filename: (req,file,cb)=>{
        const ext = path.extname(file.originalname)
        // const { originalname } = file;
        const filePath = '/Users/utkarshsinha/mongoosedemo/public/uploads/'
        cb(null,filePath + Date.now()+"_"+file.originalname)
        // cb(null,Date.now()+"_"+file.originalname)
    }
});


const upload = multer({  
    storage: storage 
}) .single('productImage');


router.get('/',(req,res)=>{
    res.render('index.ejs' , {title : 'index page'})
})

router.get('/login' , (req,res)=>{
    res.render('login.ejs' , {title:'login'})
})
router.get('/signup' , (req,res)=>{
    res.render('signup.ejs' , {title: 'Signup'})
})
router.get('/home', (req,res , next)=>{
    Product.exec(function(err , data){
        if(err){
            res.json({message:err.message});
        }else{
        res.render('home.ejs', {title:'Home', records : data})
        }
    });
    
})
// router.get('/editProduct/:id' , (req,res)=>{
//     let id = req.params.id;
//     PRegister.findById(id,(err,productRegister)=>{
//         console.log(err);
//         if(error){
//             res.redirect('/home');
//         }
//         else{
//             if(productRegister == null)
//                 res.redirect('/home')
//             else{
//                 res.render('/editProduct',{
//                     title:'Edit Product',
//                     records : productRegister
//                 })
//             }
//         }
//     })
// })
router.get('/editProduct/:id' , (req,res , next)=>{
    let id = req.params.id;
    Product.exec(function(err , data){
        res.render('editProduct.ejs' , {title: 'Edit User' , records : data , id:id})
    });
})

router.post('/signup', async (req,res)=>{
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


router.post('/login' , async(req,res)=>{
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
        console.log(error)
        res.status(400).send(error);
    }
})

router.post('/home',upload ,  async(req,res)=>{
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

router.post('/update/:id' ,upload , (req,res)=>{
    let id = req.params.id
    // console.log(id)
    let new_image ='';
    // console.log(new_image)
    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync(req.body.image);
        }catch(error){
            console.log(error);
        }
    }else{
        new_image = req.body.image;
    }
    PRegister.findByIdAndUpdate(id , {
        productName: req.body.productName,
        productType: req.body.productType,
        availibilityDate:req.body.availibilityDate,
        price:req.body.price,
        image:new_image
    },(err,result)=>{
        if(err){
            res.json({message : err.message , type:'danger'}); 
        }
        else{
            res.redirect('/home')
        }
    })
    
}) 
router.get('/delete/:id' , upload,(req,res)=>{
    let id = req.params.id;
    PRegister.findByIdAndRemove(id,(err,result)=>{
        if(result.image!=''){
            try{

                fs.unlinkSync(result.image);
            }catch(error){
                console.log(error);
            }
        }
        // if(err){
        //     res.json({message:error.message});
        // }
        // else{
        //     req.session.message={
        //         type:'success',
        //         message :"product deleted successfully"
        //     }
        // }
        res.redirect("/home")
    })
})
router.post('/logout',(req,res)=>{
    req.session.destroy(err=>{
        if(err){
            return res.render('home')
        }
        res.clearCookie('sessionId')
        res.redirect('/login')
    })
})



module.exports = router;