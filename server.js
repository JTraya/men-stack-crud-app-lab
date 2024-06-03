const dotenv = require('dotenv')
dotenv.config();
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const methodOverride = require('method-override')
const path = require('path')


const app = express()

// =========== Import Models ============
const GameModel = require('./models/game');
const Game = require('./models/game');

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', function(){
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})

// =========== MiddleWare ============

app.use(express.urlencoded({extended: false})); 
app.use(methodOverride("_method"));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, "public")))


// =========== Index Route ============

app.get('/games', async function(req, res){

    const gameDoc = await GameModel.find({})

    res.render('games/index.ejs', {
        gameDoc: gameDoc,
        title: "Games List"
    })
})


// =========== Create Route ============

app.get('/games/new', function(req, res){
    res.render('games/new.ejs',{
        title: "Add Game!"
    })
})

app.post('/games', async function(req, res){
    req.body.isCompleted = !!req.body.isCompleted

    const game = await GameModel.create(req.body)

    res.redirect('games')
})

// =========== Show Route ============

app.get('/games/:gameId', async function(req, res){
    const id = req.params.gameId
    
    const gameDoc = await GameModel.findById(id)

    res.render('games/show.ejs', {
        gameDoc: gameDoc,
        title: gameDoc.name + 'Details'
    })
})

// =========== Edit Route ============

app.get('/games/:gameId/edit', async function(req, res){
    const id = req.params.gameId
    const gameDoc = await GameModel.findById(id);
    // console.log(gameDoc)

    res.render('games/edit.ejs', {
        gameDoc: gameDoc,
        title: "Edit Game!"
    })
})

app.put('/games/:gameId', async function(req, res){
    req.body.isCompleted = !!req.body.isCompleted

    await GameModel.findByIdAndUpdate(req.params.gameId, req.body)

    res.redirect('/games')
})

// =========== Delete Route ============

app.delete('/games/:gameId', async function(req, res){
    await GameModel.findByIdAndDelete(req.params.gameId)
    res.redirect('/games')
})


app.get("/", function(req, res){
    res.render('home/index.ejs', {
        title: "Games App"
    })
})

app.listen(3000, function(){
    console.log('Listening on port 3000')
})