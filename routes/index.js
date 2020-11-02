var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const Product = require('../models/product');
const Cart = require('../models/cart');

const csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {

  // res.render('shop/index',{title:'Products'});

  Product.find((err,result)=>{
    
    // res.send(result);
  
    res.render('shop/index',{title:'Products',products:result});

  });

});

router.get('/add-to-cart/:id',(req,res)=>{
  let prodId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(prodId,(err,product)=>{
      if(err)
      {
          return res.redirect('/');
      }
      cart.add(product,product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');
  });

});

router.get('/shopping-cart/',(req,res)=>{
  res.render('shop/shopping-cart',{title:"Cart"});
})




module.exports = router;
