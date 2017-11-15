var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.sendFile(__basedir + '/public/spyfall.html');
});


router.get('/:room', function (req, res) {
    var room = req.params.room;
    res.send(room);
});

module.exports = router