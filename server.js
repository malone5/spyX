//TODO: When player leaves room update list and feed

var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var port = process.env.PORT || 3000;

// Collections
var packs = require('./collections/packs.json')

// Config
app.use(express.static('public'))

// Utility
function makeid(size){
    var text = "";
    var possible = "abcdefghijxlmnopqrstuvwxyz0123456789";

    for( var i=0; i < size; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function genRoom(){
    while(true){
        var room = makeid(4);
        // TODO create check if room code exists
        return room
        //if(!rooms[room]) return room;
    }
}

function getPlayers(roomObj){
  return Object.keys(roomObj);
}


// Routes
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/spyfall.html');
});


// Socket.io
var io = require('socket.io')(server);

var sockets = {}; // socket.id: player_object
var roomsettings = {} // room#: settings_object

io.on('connection', function(socket){
  console.log("a user connected")
  socket.emit('send packs', Object.keys(packs))

  sockets[socket.id] = {
    playerid: socket.id,
    nickname: "UnkownPlayer"
  }

  /* socket methods */
  var leaveRooms = () => {
    for(room in socket.rooms){
      if(socket.id !== room) {
        socket.leave(room);
        io.in(room).emit("playerlist change", room,  "A player has left")
        console.log("left room:", room );
      }
    }
  }
  
  /* Set Name */
  socket.on('set name', function(_name){
    sockets[socket.id].nickname = _name
    console.log(sockets[socket.id].nickname)
  });

  /* Make Room */
  socket.on('make room', function(_settings){
    console.log("making room...", _settings)

    room = genRoom();
    roomsettings[room] = _settings

    socket.join(room, () => {
      socket.emit('joined', room);
      io.in(room).emit("playerlist change", room,  "A player has joined")
    })
    
  });

  /* Join Room */
  socket.on('join room', function(_room){
    if(!io.sockets.adapter.rooms[_room]) {
      console.log("THIS ROOM DOES NOT EXIST!")
      return  
    }

    leaveRooms()

    socket.join(_room, () => {
      console.log("adding player to room ", _room)
      socket.emit("joined", _room)
      io.in(_room).emit("playerlist change", _room,  "A player has joined")
    })
  });

  /* Get Room Updates */
  socket.on('req playerlist', function(_room){
    if(!io.sockets.adapter.rooms[_room]) {
      console.log("THIS ROOM DOES NOT EXIST!")
      return  
    }

    // Create of list of playher int he room
    io.of('/').in(_room).clients((error, clients) => {
      var playerlist = []
      if (error) throw error;
      clients.forEach(function(key){
        playerlist.push(sockets[key])
      })
      socket.emit("refresh playerlist", playerlist)
    });
  });

  /* Before Disconnect */
  socket.on('disconnecting', function(){
    leaveRooms()
  })

  /* On Disconnect */
  socket.on('disconnect', function(){
    delete sockets[socket.id];
    console.log('user disconnected. Deleted socket ', socket.id)
  })

});

server.listen(port, function(){
  console.log('listening on *:' + port);
});