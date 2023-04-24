const Player = require('../models/player');
const Position = require("../models/position");
const Team = require("../models/team"); 
const Director = require("../models/sportingDirectors");

exports.getPlayers = (req, res, next) => {
    req.director
        Director.findOne({_id: req.director._id})
        .populate({path:"team",select:"name"})
            .then((director=>{
                Player.find({team:director.team})
                .populate([{path:"team",select:"name"},{path:"positions",select:"name"}])
                .then((players)=>{
                    res.render('president/club_players', {
                        title: 'Club Players',
                        players: players,
                        path: '/president/club_players',
                        action: req.query.action

                    });
                })
                .catch((err)=>{console.log(err)});
            }))
            .catch((err)=>{console.log(err)});
}
// /admin/add-product=> GET
exports.getAddPlayer = (req, res, next) => {
    req.director
        Director.findOne({_id: req.director._id})
        .populate({path:"team",select:"name"})
        .then((director)=>{

            Team.findOne({name:director.team[0].name})
            .then(team=>{
                return team;
            })
            .then(team=>{
                Position.find()
                .then(positions=>{
                    res.render("president/add_player",{
                        title:"New Player",
                        team:team,
                        positions:positions,
                        path:"/president/add_player"
                })
            })
            })

        })
            
}

// /admin/add-product=> POST
exports.postAddPlayer = (req, res, next) => {
    const name = req.body.playerName;
    const price = req.body.price;
    const imageUrl = req.body.image;
    const team = req.body.team;
    const inTransfer = Boolean(req.body.inTransferList);
    const inLoan = Boolean(req.body.inLoanList);
    const position = req.body.position;


    const player = new Player({
        name:name,
        price:price,
        imageUrl: imageUrl,
        team: team,
        inTransfer: inTransfer,
        inLoan: inLoan,
        positions:position
    })

    player.save()
        .then(()=>{
            res.redirect('/president/club_players');
        })
        .catch(err=>{
            console.log(err);
        })

}


exports.getEditPlayer = async (req, res, next) => {
    try {
      const player = await Player.findOne({_id: req.params.playerid})
        .populate([{ path: "team", select: "name" }, { path: "positions", select: "name" }]);
  
      const teams = await Team.find();
      const positions = await Position.find();
  
      res.render("president/edit_player", {
        title: "Edit Player",
        path: "/president/club_players",
        player: player,
        teams: teams,
        positions: positions,
        isAuthenticated: req.session.isAuthenticated
      });
    } catch (err) {
      console.log(err);
    }
  };
  

exports.postEditPlayer = (req, res, next) => {

    const id = req.body.id;
    const name= req.body.name;
    const price= req.body.price;
    const imageUrl = req.body.imageUrl;
    const team = req.body.team;
    const positions = req.body.position;
    const inTransfer = Boolean(req.body.inTransferList);
    const inLoan = Boolean(req.body.inLoanList);
    
    Player.findOne({_id:id})
        .then(player=>{
            if(!player){
                return res.redirect("/");
            }
            player.name = name;
            player.price = price;
            player.imageUrl = imageUrl;
            player.team = team;
            player.inTransfer= inTransfer;
            player.inLoan = inLoan;
            player.positions = positions;

            return player.save();
        })
        .then(result=>{
            res.redirect('/president/club_players?action=edit');
        })
        .catch(err=>{
            console.log(err);
        })
}

exports.postDeletePlayer = (req,res,next)=>{
    const id = req.body.id;
    Player.deleteOne({_id:id})
        .then(()=>{
            console.log("Player deleted.")
            res.redirect("/president/club_players?action=delete")
        })
        .catch(err =>{
            console.log(err);
        })
}