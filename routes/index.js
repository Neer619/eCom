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

router.get('/shopping-cart',(req,res)=>{
  // res.render('shop/shopping-cart',{title:"Cart"});
  if(!req.session.cart)
  {
    return res.render('shop/shopping-cart',{products:null,title:'Cart'});
  }
  let cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart',{title:'Cart',products:cart.genArray(),totalPrice:cart.totalPrice,totalQty:cart.totalQty});

});

router.get('/checkout',(req,res)=>{
  if(!req.session.cart)
  {
    return res.redirect('/shopping-cart');
  }

  let cart = new Cart(req.session.cart);
  res.render('shop/checkout',{title:"Checkout",total:cart.totalPrice});

})

router.get('/admin',(req,res)=>{
    res.render('admin/index',{title:"Admin",layout:'layouts/adminLayout.ejs'});
})

module.exports = router;
