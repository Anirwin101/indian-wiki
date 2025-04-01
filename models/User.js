const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, index: true },
});

UserSchema.index({ email: 1 });


module.exports = mongoose.model("User", UserSchema);
