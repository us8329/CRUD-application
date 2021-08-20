const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const { Session } = require('inspector');
const uuid  = require('uuid').v4; 
const port = 5050;
const two_hours = 7200000

require("./db/connection");
const app = express();


const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'/uploads');
    },
    filename: (req,file,cb)=>{
        // const ext = path.extname(file.originalname)
        // const filePath = '/Users/utkarshsinha/mongoosedemo/uploads/'
        cb(null,new Date.toISOString() + "-" + file.originalname)
    }
});

// app.use(cors)
app.set('view-engine' , 'ejs');
app.use(express.urlencoded({extended:false}))
app.use(express.static("uploads"))
app.use(""  , require("./routes/routes"))

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




app.use(multer({storage : storage}).single('productImage'))

app.use("/uploads",express.static(path.join(__dirname , "uploads")))


app.listen(port ,() => console.log('app is listening'))
