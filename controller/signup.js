const joi = require("joi");
const bcrypt = require("bcrypt");
const UserModel = require("../model/user");
const cloudinary = require("../cloudinary/cloudinary");
const multer = require("multer");
const upload = require("../multer/multer");
//signup Schema for validation
const signupSchema = joi.object({
  username: joi.string().alphanum().min(4).max(30).required(),
  password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .required(),
  repeat_password: joi.ref("password"),
  image: joi.string().alphanum(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
});

const signup = async (req, res, next) => {
  try {
    //cloudinary

    // const fileStr = req.files.image;
    // const uploadedResponse = await cloudinary.uploader.upload(
    //   fileStr.tempFilePath,
    //   (error, result) => {
    //     console.log({ result });
    //     console.log({ error });
    //   }
    // );
    // console.log(uploadedResponse);
    // console.log("bruhh");

    console.log("req.body hai", req.body);
    console.log("req.file hai ", req.file);
    // if (req.body.image === "null") {
    //   throw new Error("please add a image");
    // }

    const value = signupSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (value.error) {
      let error = value.error.details; //it is returning array so we do map method for each error types
      let errors = error?.map((Err) => {
        return {
          msg: Err.message,
          params: Err.context.key,
        };
      });
      //   console.log(errors);
      return res.status(400).send({ errors });
    }

    let oldUser = await UserModel.findOne({ email: req.body.email });
    if (oldUser) {
      return res.status(400).send({ msg: "User Already Exist" });
    }

    //password encryption
    const encryptedPw = await bcrypt.hash(req.body.password, 10);

    // console.log(value);
    // console.log(req.body);

    const user = await UserModel.create({
      ...req.body,
      image: req.file.filename,
      password: encryptedPw,
      repeat_password: encryptedPw,
    });

    let userInfoWithoutPW = user.toObject();
    delete userInfoWithoutPW.password;
    delete userInfoWithoutPW.repeat_password;
    user.save();

    await res.status(200).send(userInfoWithoutPW);
  } catch (err) {
    next(err);
  }
};
module.exports = signup;
