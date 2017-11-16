var express = require('express');
var api = express.Router();
var Room = require('../models/room');

// Utility
function makeid(size){
    var text = "";
    var possible = "abcdefghijxlmnopqrstuvwxyz0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

// Tests
api.get('/somget', function(req, res) {
    res.send('some json');
})

// Rooms
api.route('/rooms')

    // Gets all availiable rooms

    .get(function(req, res) {
        Room.find(function(err, rooms) {
            if (err)
                res.send(err);

            res.json(rooms);
        });
    })

    // Creates a room
    // TODO: Check if room exists

    .post(function(req, res) {
        roomcode = makeid(4)
        var room = new Room({
            roomcode: roomcode,
            setting_time: 8,
            setting_spies: 123,
            setting_pack: 'Default'
        });      // create a new instance of the Bear model

        // save the bear and check for errors
        room.save(function(err) {
            if (err)
                res.send(err);

            res.json({ roomcode: roomcode });
        });

    });


// Room Specific
api.route('/rooms/:roomcode')

    // Gets the specific state of a room

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

    // posts a change to the rooms state

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