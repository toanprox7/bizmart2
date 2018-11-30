/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
var jwt = require('jsonwebtoken');
module.exports = {
	create:function(req,res,next){
    Usersapi.create(req.params.all(), function (err,data) {
      if (err) return next(err);
      if(data) return data;
  })
  },
  createFacebookApi:function (req,res,next) {
    Usersapi.findOrCreate({ id: req.params.all().id }, req.params.all())
.exec(async(err, user, wasCreated)=> {
  if (err) { return res.serverError(err); }

  if(wasCreated) {
    sails.log('Created a new user: ' + user.username);
  }
  else {
    return console.log(user.username,"Da ton tai");
  }
});
  },
  login:function(req,res,next){
    Usersapi.findOne(req.params.all(), function (err,user) {
      if (err) return next(err);
      if(!user){
        if(localStorage.getItem("tokenData")){
          localStorage.removeItem("tokenData")
          console.log("da xoa token vi ko ton tai user")
        }else{
          return console.log("Khong ton tai user");
        }

      }else if(user){
        console.log("ton tai",user);
        var tokenUserData = jwt.sign({ dataUser: user }, 'toanpro');
        localStorage.setItem("tokenData",tokenUserData);
       return user;
      }
    });
  },
  tokenUserLogin:function(req,res,next){
    if(localStorage.getItem("tokenData")){
      return res.send(localStorage.getItem("tokenData"));
    }else{
      return res.send("");
    }

  }
};

