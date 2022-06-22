const Schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const NotesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        default: "Genaral"
        
    },
    date:{
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
});

module.exports = mongoose.model("Note", NotesSchema);