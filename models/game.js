const mongoose = require('mongoose')


const gameSchema = new mongoose.Schema({
    name: String,
    releaseYear: Number,
    isCompleted: Boolean
})


const Game = mongoose.model('Game', gameSchema)

module.exports = Game;