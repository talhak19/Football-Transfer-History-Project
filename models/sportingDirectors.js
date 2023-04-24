const mongoose = require("mongoose");
const Player = require("./player");
const Team = require("./team");
const Position = require("./position");


const directorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    tel:{
        type:Number
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    inCharge:{
        type:Boolean,
        default:false
    },
    team:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }],
    transfer_list: {
        players: [
            {
                playerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Player',
                    required: true
                }
            }
        ]
    }    
});

directorSchema.methods.addToTransferList = function (player) {
    const index = this.transfer_list.players.findIndex(tlp => {
        return tlp.playerId.toString() === player._id.toString()
    });

    const updatedTransferList = [...this.transfer_list.players];


    if (index >= 0) {
        // Aynı oyuncu tekrar eklenmek istiyorsa
        throw new Error("Ayni oyuncu iki kere eklenemez.");
    }
    else if (player.team.toString() == this.team.toString()){
        throw new Error("Kendi oyuncunuzu transfer listesine ekleyemezsiniz.");
    } else {
        // updatedCartItems!a yeni bir eleman ekle
        updatedTransferList.push({
            playerId: player._id,
        });
    }

    this.transfer_list = {
        players: updatedTransferList
    };

    return this.save();
}

directorSchema.methods.getTransferList = function (player) {

    const ids = this.transfer_list.players.map(i => {
        return i.playerId;
    });

    return Player
        .find({
            _id: {
                $in: ids
            }
        })
        .populate('positions')
        .populate('team')
        .select('id name price team positions imageUrl inLoan inTransfer')
        .then(playersAll => {
            return playersAll.map(p => {
                return {
                    _id: p._id,
                    name: p.name,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    team:p.team,
                    inLoan:p.inLoan,
                    inTransfer:p.inTransfer,
                    positions:p.positions
                }
            });
        });

}

directorSchema.methods.deleteListItem = function (playerid) {
    const listPlayers = this.transfer_list.players.filter(player => {
        return player.playerId.toString() !== playerid.toString()
    });

    this.transfer_list.players = listPlayers;
    return this.save();
}

directorSchema.methods.clearTransferList = function(){
    this.transfer_list = {players:[]};
    return this.save();
}


module.exports = mongoose.model("Director", directorSchema);
