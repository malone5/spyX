var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RoomSchema   = new Schema({
    roomcode: String,
    setting_time: Number,
    setting_spies: Number,
    setting_pack: String,
    playerlist: Array,
    game: {
        running: Boolean,
        spy: String,
        endtime: Date,
        location: String,
        roles: Array      
    }
});

module.exports = mongoose.model('Room', RoomSchema);