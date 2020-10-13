const User = require('../models/User')

exports.homepage = function(req, res){
    res.send("<h1> home page </h1>")
}

exports.newRegister = function(req, res){
    res.render("register")
}

exports.register = function(req, res){

    let newUser =  new User(req.body);
    newUser.register().then(()=>{
        res.render('profile', {user: newUser})
    }).catch((error)=>{
        console.log(error)

    })
    


    
}


