const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  hobbies: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  social: {
    twitter: {
      type: String,
    },
    youtube: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
