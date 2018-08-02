var mongoose = require("mongoose");
var transitionSchema = mongoose.Schema({
    description: String,
    category: String,
    positive: Boolean,
    track: Boolean,
    amount: Number,
    date: Date,
    position: {
        location: String,
        latitude: Number,
        longitude: Number
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    createdAt: { 
        type: Date,
        default: Date.now 
    },
});
module.exports = mongoose.model("transition", transitionSchema);