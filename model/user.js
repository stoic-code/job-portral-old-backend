const mongoose = require("mongoose");

const schema = mongoose.Schema;

const UserSchema = new schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    //custom validator
    // validate: {
    //   validator: async function (value) {
    //     let oldUser = await mongoose.models.Users.findOne({ email: value });
    //     // console.log({ oldUser });
    //     if (oldUser) {
    //       return false; //if false it wont allow to make new user
    //     }

    //     return true;
    //   },
    //   message: "Email already used!",
    // },
  },
  password: {
    type: String,
    required: true,
  },
  repeat_password: {
    type: String,
    required: true,
  },
  website: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    set: function (value) {
      return value.toLowerCase();
    },
    enum: ["job-seeker", "company"],
  },
  image: {
    type: String,
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
