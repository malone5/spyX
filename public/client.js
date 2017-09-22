$(function () {
/* Socket.io events. Linsten to server and react */
var socket = io.connect()

socket.on('packlist', function(_packs){
    app.packs = _packs;
})

socket.on('joined', function(_room){
    Cookies.set('room', _room)
    app.current_room = _room;
});

socket.on('playerlist', function(_playerlist, _msg){
    app.feed = _msg;
    app.player_list = _playerlist
});

socket.on('invalid room', function(){
    app.feed = "Invalid room"
});

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
        game: {
            running: false,
            location: null,
            roles: [],
            spies: [],
            endtime: null
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
        // setname
        setName: function(_name) {
            socket.emit("set name", _name)
            this.name = _name;
        },
        //makeroom
        makeRoom: function() {
            socket.emit('make room', this.settings);
            return false;
        },
        //joinroom
        joinRoom: (_room, _playername) =>  {
            this.current_room = _room;
            console.log("joining room")
            socket.emit('join room', _room, _playername)
        },
        //startgame
        startGame: function() {
            console.log("sending settings: ", this.settings)
            socket.emit('start game', this.current_room, this.settings);
        },
        
        //endgame

        //leave room
    },
}) // ./app instance



});
