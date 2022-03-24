// create an schema
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  email: {
    type: String,
    index: true,
    unique: true,
  },
  country: String,
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
