
const mongoose = require("mongoose");

const playerSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true // bastaki ve sondaki boslukları alır
    },
    price:{
        type: Number,
        required: true,
        get: value => Math.round(value), //10.2 => 10 ,, 10.8=>11
        set: value => Math.round(value)
    },
    imageUrl: String,
    inTransfer: Boolean,
    inLoan: Boolean,
    positions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Position"
    }],
    team:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Team"
    }]
})
module.exports = mongoose.model("Player",playerSchema) 

// class Player {
//     constructor(name, price, imageUrl, team,position,inTransfer=false,inLoan=false,id) {
//         this.name = name;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.team = team;
//         this.position = position;
//         this.inTransfer = inTransfer;
//         this.inLoan = inLoan;
//         this._id =  id ? new mongodb.ObjectId(id) : null;

//     }

//     save() {
//         let db = getDb();
//         if (this._id) {
//             db = db.collection('players').updateOne({ _id: this._id }, { $set: this });
//         } else {
//             db = db.collection('players').insertOne(this);
//         }

//         return db
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => { console.log(err) });
//     }
//     static findAll(){
//         const db = getDb();

//         return db.collection("players")
//             .find()
//             .toArray()
//             .then(players => {
//                 return players;
//             })
//             .catch(err=>console.log(err));
//     }

//     static findById(player_id) {
//         const db = getDb();

//         return db.collection("players").findOne({ _id: new mongodb.ObjectId(player_id)})
//             .then(player=>{
//                 return player;
//             })
//             .catch(err=>{
//                 console.log(err);
//             })
//     }

//     static deleteById(player_id){
//         const db = getDb();

//         return db.collection("players").deleteOne({ _id: new mongodb.ObjectId(player_id)})
//             .then(()=>{
//                 console.log("Player deleted.");
//             })
//             .catch(err=>{
//                 console.log(err);
//             })
//     }
//     static findByCategoryId(positionid){
//             const db = getDb();
    
//             return db.collection("players")
//                 .find({positions:positionid})
//                 .toArray()
//                 .then(products=>{
//                     return products;
//                 })
//                 .catch(err=>{console.log(err)});
//         }
//     }




// module.exports = Player;