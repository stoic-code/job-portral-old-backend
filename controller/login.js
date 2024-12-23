const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user");
const dotenv = require("dotenv");

dotenv.config();

//l,ogin schema only for the validation structure milya xa ki xaina .com xa kixaina check only
const loginScheme = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi
    .string()
    .min(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
});

const login = async (req, res, next) => {
  try {
    const value = loginScheme.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    // console.log(value);

    if (value.error) {
      const error = value.error.details;
      const errors = error?.map((err) => {
        return {
          msg: err.message,
          params: err.context.key,
        };
      });
      return res.status(400).send(errors);
    }

    //search for the user by its email using findOne
    let user = await UserModel.findOne({ email: req.body.email });

    console.log(user);
    console.log(req.body.password);
    // console.log(user.password);
    if (user) {
      const matched = await bcrypt.compare(req.body.password, user.password);
      user = user.toObject();
      delete user.password;
      delete user.repeat_password;

      if (matched) {
        let token = jwt.sign({ user }, process.env.JWT_SECRET);
        return res.status(200).send({ user, token });
      }
      console.log(matched);
    }
    // if (!user) {
    console.log("yo error hai tw");
    res.status(400).send({
      msg: "Invalid Credentials",
    });
    // }
  } catch (err) {
    next(err);
  }
};

module.exports = login;
