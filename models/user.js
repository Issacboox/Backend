const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    employee_id: { type: String, required: true , unique: true},
    password: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    nickname: { type: String },
    age: { type: Number },
    graduated_from: { type: String },
    what_about_me: {
        hobby: { type: String },
        favorite_color: { type: String },
        favorite_food: { type: String },
        language_programming: { type: [String] },
        computer_skill: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
