const Player = require('../models/player');
const Position = require("../models/position"); 
const Team = require("../models/team");
const Transfer = require("../models/transfers"); 



exports.getMain = (req, res, next) => {

    Player.find()
    .populate([{path:"team",select:"name"},{path:"positions",select:"name"}])
        .then(players=>{
            const eligibleForTransfer = players.filter(
                player=>player.inTransfer ===true || player.inLoan ===true);
            return eligibleForTransfer;
        })
        .then(players=>{
            Position.find()
            .then(positions=>{
                res.render("transfer_window/main",{
                    title:"Transfer Window",
                    players: players,
                    positions:positions,
                    path:"/"
                });
            })
        })
        .catch((err=>{console.log(err)}));
}

exports.getPlayers = (req, res, next) => {
    Player.find()
        .populate([{path:"team",select:"name"},{path:"positions",select:"name"}])
        .then(players=>{
            const eligibleForTransfer = players.filter(
                player=>player.inTransfer ===true || player.inLoan ===true);
            return eligibleForTransfer;
        })
        .then(players=>{
            Position.find()
            .then(positions=>{
                res.render('transfer_window/players', {
                    title: 'Players',
                    players: players,
                    positions:positions,
                    path: '/players'
                })
            })
        })
        .catch((err)=>{console.log(err)});
}
module.exports.getPlayerByPosition =(req, res, next) => {
    const positionbyid = req.params.positionid;
    let array = {};

    Position.find()
        .then(positions=>{
            array.positions = positions;
            return Player.find({
                positions: positionbyid,
                $or: [{inTransfer: true}, {inLoan: true}]
            }).populate([{path:"team",select:"name"},{path:"positions",select:"name"}]);
        })
        .then(players=>{        
            res.render('transfer_window/players',
            { 
            title: 'Players',
            players: players,
            path: '/players',
            positions: array.positions,
            selectedPosition: positionbyid
            });
        })
        .catch((err)=>{
            next(err);
        });
};


exports.getPlayerDetails = (req,res,next)=>{
    Player.findById(req.params.playerid)
        .populate([{path:"team",select:"name"},{path:"positions",select:"name"}])
        .then((PlayerObj)=>{
            res.render("transfer_window/player_details",{
                title:PlayerObj.name,
                player:PlayerObj,
                path:"/player_details"
            })
        })
        .catch(err=>{console.log(err)});
}

exports.getInterestedTransfer = (req, res, next) => {
    Player.find()
    .populate([{path:"team",select:"name"},{path:"positions",select:"name"}])
        .then(players=>{
            const transferPlayers = players.filter(
                player=>player.inTransfer ===true);
            return transferPlayers;
        })
        .then(transferPlayers=>{
            Position.find()
            .then(positions=>{
                res.render("transfer_window/in_transfer_list",{
                    title:"Interested in Transfer",
                    players: transferPlayers,
                    positions: positions,
                    path:"/in_transfer_list"
                });
            })
        })
        .catch(err=>{console.log(err)});
}

exports.getInterestedLoan = (req, res, next) => {
    Player.find()
    .populate([{path:"team",select:"name"},{path:"positions",select:"name"}])
        .then(players=>{
            const loanPlayers = players.filter(
                player=>player.inLoan ===true);
            return loanPlayers;
        })
        .then(loanPlayers=>{
            Position.find()
            .then(positions=>{
                res.render("transfer_window/in_loan_list",{
                    title:"Interested in Loan",
                    players: loanPlayers,
                    positions:positions,
                    path:"/in_loan_list"
                });
            })
        })
        .catch(err=>{console.log(err)});
}

exports.getNegotiations = (req, res, next) => {
    if (!req.director) {
        return res.status(500).send('Director bulunamadi.');
      }
    req.director
        .getTransferList()
        .then(players =>{
            res.render("transfer_window/negotiations",{
                title:"Transfer Window",
                path:"/negotiations",
                players: players
        })
    })
    .catch((err) => {
        res.status(500).send('An error occurred.');
    });
        
}
exports.postNegotiations = (req, res, next) => {

    const playerId = req.body.playerId;
    Player.findById(playerId)
        .then(player => {
            return req.director.addToTransferList(player);
        })
        .then(() => {
            res.redirect('/negotiations');
        })
        .catch(err => {
            if (err.message === "Ayni oyuncu iki kere eklenemez.") {
                req.director
                    .getTransferList()
                    .then(players =>{
                        res.render("transfer_window/negotiations",{
                            title:"Transfer Window",
                            path:"/negotiations",
                            hataMesaji:"Ayni oyuncu iki kere eklenemez.",
                            players: players,
                    })
                })
            }
            else if (err.message === "Kendi oyuncunuzu transfer listesine ekleyemezsiniz.") {
                req.director
                    .getTransferList()
                    .then(players =>{
                        res.render("transfer_window/negotiations",{
                            title:"Transfer Window",
                            path:"/negotiations",
                            hataMesaji:"Kendi oyuncunuzu transfer listesine ekleyemezsiniz.",
                            players: players,
                    })
                })
            } 
            else {
                next(err);
            }
        });
}


exports.postTransferListDelete = (req, res, next) => {
    const playerid = req.body.id;
    req.director
        .deleteListItem(playerid)
        .then(() => {
            res.redirect('/negotiations');
        });
}

exports.getAllTransfers = (req, res, next) => {
    Transfer.find({})
      .populate('director')
      .populate({
        path: 'players.player',
        select: 'name imageUrl positions price team',
        populate: { path: 'team', select: 'name' }
      })
      .populate({
        path: 'players.newTeam',
        select: '_id name' // Tüm takım özellikleri seçildi
      })
      .then(transfers => {
        res.render('transfer_window/all_transfers', {
          title: 'All Transfers',
          path: '/all_transfers',
          transfers: transfers,
        });
      })
      .catch(err => {
        next(err);
      });
  };
  

    //--------Bitmiş transferlerin bölümü---------//
exports.getDoneDeals = (req, res, next) => {
    req.director
        .populate('team')
        .then(director => {
            Transfer.find({"director.directorId": req.director._id})
                .then(transfers=>{
                    res.render("transfer_window/done_deals",{
                        title:"Transfers",
                        path:"/done_deals",
                        transfers:transfers,
                        yeniTakim: director.team[0].name
                    });
                })
                .catch(err=>{
                    next(err);
                })
        })
        .catch(err => {
            next(err);
        });
}


exports.postDeal = (req, res, next) => {
    const transferTypes = {};
    for (const key in req.body) {
      if (key.startsWith('transferType_')) {
        const playerId = key.replace('transferType_', '');
        transferTypes[playerId] = req.body[key];
      }
    }
  
    req.director
      .getTransferList()
      .then((director) => {
        const transferPlayers = director.map((p) => {
          const transferType = transferTypes[p._id];
          console.log(transferType);
          console.log(req.director.team.name);
          return {
            player: {
              _id: p._id,
              name: p.name,
              price: transferType === "Loan" ? p.price / 2 : p.price,
              positions: {
                name: p.positions[0].name,
              },
              team: {
                name:  p.team[0].name,
              },
              imageUrl: p.imageUrl,
            },

            transfer_type: transferType, // transfer_type oyuncu için ayrı olarak burada kaydediliyor
            newTeam:req.director.team
            
          };
        });
  
        const transfer = new Transfer({
          director: {
            directorId: req.director._id,
            name: req.director.name,
            tel: req.director.tel,
          },
          players: transferPlayers,
        });
  
        return transfer.save();
      })
      .then((savedTransfer) => {
        const playerIds = savedTransfer.players.map((tp) => tp.player._id);
        return Player.updateMany(
          { _id: { $in: playerIds } },
          { inTransfer: false, inLoan: false, team: req.director.team }
        );
      })
      .then(() => {
        return req.director.clearTransferList();
      })
      .then(() => {
        res.redirect("/done_deals");
      })
      .catch((err) => {
        next(err);
      });
  };
  