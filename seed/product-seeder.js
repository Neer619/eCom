const mongoose = require('mongoose');
let Product = require('../models/product.js');


const dbURI = "mongodb+srv://user:user123@cluster0.nxt3y.mongodb.net/eCom?retryWrites=true&w=majority"
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
  console.log('Connected to DB for seeding');
}).catch((err)=>{
  console.log(err);
})

let products = [
    new Product({
        imagePath:'/images/rog.jpg',
        title:'Rog',
        description:'Awesome brand!!',
        price:10
    }),
    new Product({
        imagePath:'/images/rog.jpg',
        title:'ANti-hero',
        description:'lorem!!',
        price:10
    }),
    new Product({
        imagePath:'/images/rog.jpg',
        title:'Sand buster',
        description:'lorem ipsume',
        price:25
    }),
    new Product({
        imagePath:'/images/rog.jpg',
        title:'SideKnock',
        description:'Disewe neiys!!',
        price:19
    }),
   
];

let done=0;
for(let i=0;i<products.length;i++)
{
    products[i].save((err,result)=>{
        done++;
        if(done==products.length)
        {
            exitDB();
        }
    });
}

function exitDB()
{
    mongoose.disconnect();
}