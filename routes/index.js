var express = require('express');
var router = express.Router();
var passport = require('passport');
const localStrategy = require('passport-local');
const multer = require('multer');
var userModel = require('./users');
const productModel = require("./product");
const { use } = require('passport');
const { findOneAndUpdate, base } = require('./users');
const storage = require("../config/multer");
const product = require('./product');
passport.use(new localStrategy(userModel.authenticate()));
const userupload = multer({ storage: storage.userimagestorage })
const productupload = multer({ storage: storage.productimagestorage })







router.get('/', function (req, res, next) {
  res.render('index');
});

router.get("/read", function (req, res) {
  userModel.findOneAndDelete().then(function (data) {
    res.send(data);
  })
})


router.post("/register", function (req, res) {
  var newUser = new userModel({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
  });
  userModel.register(newUser, req.body.password).then(function (elem) {
    passport.authenticate('local')(req, res, function () {
      res.redirect("/profile");
    })
  })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: '/profile',
  failureRedirect: "/"
}), function (req, res) { })
router.get('/logged', function (req, res, next) {
  res.send("ho gya login");
});
router.get('/failed', function (req, res, next) {
  res.send("nhi hua");
});


router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  })
});

router.get("/profile", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user }).populate("productid");
  let verified = true;

  let ans = user.toJSON();
  // console.log(ans);
  var ignore = ["productid"]
  for (let i in ans) {
    if (ignore.indexOf(i) === -1 && ans[i].length === 0) {
      verified = false;
    } 
  }
 
  console.log(verified);
  res.render("profile", { user: user ,verified:verified});
})
// router.get("/log",function(req,res){
//   res.render("login");
// })
// secondary 



router.get("/verified", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  res.render("verify", { user: user })
});

router.post("/verified", isLoggedIn, async function (req, res) {
  let dets = {
    contactnumber: req.body.contactnumber,
    gstin: req.body.gstin,
    address: req.body.address,
  }
  let info = await userModel.findOneAndUpdate({ username: req.session.passport.user }, dets);
  res.redirect("/profile");
});
router.get("/upload", function (req, res) {
  res.render("userpic");
})
router.post("/upload", isLoggedIn, userupload.single("image"), function (req, res) {
  userModel.findOneAndUpdate({ username: req.session.passport.user }, { pic: req.file.filename }).then(function (data) {

  })
  res.redirect("/profile");

  //  res.redirect("/");

})


router.get("/create/product", function (req, res) {
  res.render("productform");
})

router.post("/create/product", isLoggedIn, productupload.array('image', 3), function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    productModel.create({
      sellerid: user._id,
      prodname: req.body.productname,
      image: req.files.map(elem => elem.filename),
      desc: req.body.desc,
      price: req.body.price,
      discount: req.body.discount
    }).then(function (created) {
      user.productid.push(created._id);
      user.save();
      res.redirect("/profile");
    })
  });
});

router.get("/showproducts", function (req, res) {
  productModel.find().then(function (use) {
    res.render("showproducts", { use: use });
  })
})



router.get('/edit/product/:id', isLoggedIn, function (req, res) {
  productModel.findOne({ _id: req.params.id }).then(function (product) {

  })

})


router.post('/edit/product/:id', isLoggedIn, function (req, res) {
  productModel.findOne({ _id: req.params.id }).then(function (product) {
    res.send(product);
  })
})


router.get("/delete/product/:id", isLoggedIn, function (req, res) {

  userModel.findOne({ username: req.session.passport.user }).then(function (user) {
    productModel.findOne({ _id: req.params.id }).populate('sellerid').then(function (product) {
      if (user.username === product.sellerid.username) {
        productModel.findOneAndDelete({ _id: req.params.id }).then(function (del) {
        });
        userModel.findOne({ username: req.session.passport.user }).then(function (current) {
          current.productid.splice(user.productid.indexOf(product._id, 1));
          current.save();
        })
        res.redirect("/showproducts");
      }
      else {
        res.send("you cannot delete");
      }
    });

  });

});




function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();

  }
  else {
    res.redirect("/");
  }
}
module.exports = router;
