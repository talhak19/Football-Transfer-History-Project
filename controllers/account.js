const Team = require("../models/team"); 
const SportingDirector = require("../models/sportingDirectors")
const bcrypt = require('bcrypt');

exports.getLogin = (req, res, next) => {

    res.render('account/login', {
        path: '/login',
        title: 'Login'
    });
}

exports.postLogin = (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    SportingDirector.findOne({email:email})
        .then(director=>{
            if (!director) {
                return res.redirect("/login");
            }

            bcrypt.compare(password, director.password)
                .then(isSuccess=>{
                    if (isSuccess) {
                        req.session.director = director;
                        req.session.isAuthenticated = true;
                    
                        return req.session.save(function(err){
                            var url = req.session.redirectTo || '/';
                            delete req.session.redirectTo;
                            return res.redirect(url);
                        })
                    }
                    res.redirect("/login");
                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch(err=>{
            console.log(err);
        })
}

//Register  get-post

exports.getRegister = (req,res,next)=>{
    Team.find()
    .then(teams=>{

        return teams;
    })
    .then(teams=>{
        res.render('account/register',{
            path:"/register",
            title:"Register",
            teams:teams
        })
    })
}

exports.postRegister = (req,res,next)=>{
    const name = req.body.name;
    const team = req.body.team;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const inCharge = req.body.inCharge || false;


    SportingDirector.findOne({email:email})
        .then(director=>{
            if (director) {
                return res.redirect("/register");
            }

            return bcrypt.hash(password,10);
        })
        .then(hashedPassword=>{
            console.log(hashedPassword);

            const newDirector = new SportingDirector({
                name:name,
                tel:phone,
                email:email,
                password:hashedPassword,
                team:team,
                inCharge:inCharge,
                transfer_list:{players:[]}
            });
            return newDirector.save();
        })
        .then(()=>{
            res.redirect("/login");
        })
        .catch(err=>{console.log(err)})
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}

