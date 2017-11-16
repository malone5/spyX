var express = require('express');
var router = express.Router();

// Page that you Join/Create games
router.get('/', function(req, res){
    res.render('home')
    //res.sendFile(__basedir + '/public/spyfall.html');
});

// Page explaining the rules

router.get('/rules', function(req, res){
    res.render('rules')
});

// Page where players gather

router.get('/:room', function (req, res) {
    var room = req.params.room;
    res.render('game', {
        room: room
    })

});

module.exports = router