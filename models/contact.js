const mongoose = require("mongoose");

const { Schema } = mongoose;

const contactSchema = new Schema({
  fullName: { type: String, default: "John Doe" },
  email: { type: String },
  phone: Number,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
