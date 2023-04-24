const mongoose = require("mongoose");

const positionSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,

})
module.exports = mongoose.model("Position",positionSchema) //positions olarak olusacak database'de products collection