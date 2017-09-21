$(function () {



/* Socket.io events. Linsten to server and react */
var socket = io.connect()

socket.on('joined', function(_room){
    Cookies.set('room', _room)
    app.current_room = _room;
});

socket.on('playerlist change', function(_room, _msg){
    app.feed = _msg;
    socket.emit('req playerlist', _room)
});

socket.on('refresh playerlist', function(_playerlist){
    app.player_list = _playerlist
});

socket.on('invalid room', function(){
    app.feed = "Invalid room"

});

socket.on('send packs', function(_packs){
    app.packs = _packs;

})



/* Vuew Instance */
var app = new Vue({
el: '#app',
data : {
    new_name: null,
    settings: {
        time: 8,
        pack: 'Default',
        spies: 1
    },
    packs: null,
    room_code: null,
    name: null,
    feed: null,
    current_room: null,
    player_list: null,
    
    
},
created: function() {
    socket.emit('get packs')
},
methods : {

    setName: function(_name) {
        socket.emit("set name", _name)
        this.name = _name;
    },

    makeRoom: function() {
        socket.emit('make room', this.settings);
        return false;
    },

    joinRoom: (_room, _playername) =>  {
        this.current_room = _room;
        console.log("joining room")
        socket.emit('join room', _room, _playername)
    },
    startGame: function() {
        socket.emit('start game', this.current_room);
    },
},
}) // ./app instance



});
