var express = require('express');
var api = express.Router();
var Room = require('../models/room');


api.get('/somget', function(req, res) {
    res.send('some json');
});

// Rooms
api.route('/rooms')

    .get(function(req, res) {
        Room.find(function(err, rooms) {
            if (err)
                res.send(err);

            res.json(rooms);
        });
    })

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        console.log(req.body)
        var room = new Room({
            roomcode: req.body.roomcode,
            setting_time: 8,
            thisshoudlbreak: 123
        });      // create a new instance of the Bear model

        // save the bear and check for errors
        room.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Room created!' });
        });

    });


// Room Specific
api.route('/rooms/:roomcode')

    .get(function(req, res) {

        Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
            if (err) return handleError(err);
            console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
            })

        Room.findOne({ 'roomcode': req.params.roomcode }, 'roomcode setting_time', function(err, room) {
            if (err)
                res.send(err);

            res.json(rooms);
        });
    })

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        console.log(req.body)
        var room = new Room();      // create a new instance of the Bear model
        room.roomcode = req.body.roomcode;  // set the bears name (comes from the request)

        // save the bear and check for errors
        room.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Room created!' });
        });

    });

module.exports = api