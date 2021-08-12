const { Console } = require('console');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/mongoosedemo" ,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
    useFindAndModify: false,
}).then(()=>{
    console.log('connection with mongoDB successfull');
}).catch((e)=>{
    console.log('connection failed');
})