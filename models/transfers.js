const mongoose = require("mongoose");

const TransferSchema = mongoose.Schema({
    director:{
        directorId:{
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Director"
        },
        name:{
            type:String,
            required:true
        },
        tel:{
            type:Number,
            required:true
        }
    },
    players:[{
        player:{
            type:Object,
            required:true
        },
        transfer_type:{type:String,
            enum: ["Loan", "Buy"]},
        newTeam: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Team'
            }
    }],
    date:{
        type:Date,
        default:Date.now
    },
    
})
module.exports= mongoose.model("Transfer",TransferSchema)