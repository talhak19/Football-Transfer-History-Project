const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    year: Number

})
module.exports = mongoose.model("Team",teamSchema)