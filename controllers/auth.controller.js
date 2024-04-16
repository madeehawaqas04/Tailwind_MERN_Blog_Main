import User from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import validator from "validator";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log("req body", req.body);
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const sendForgetPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const isEmailAlreadyReg = await User.findOne({ email });

    if (!email)
      return res
        .status(400)
        .json({ message: "email field is required", success: false });
    // in forget password route, user should be registered already
    if (!isEmailAlreadyReg)
      return res
        .status(400)
        .json({ message: `no user exist with email ${email}`, success: false });
    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({
          message: `email pattern failed. Please provide a valid email.`,
          success: false,
        });

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const hashedOTP = await bcryptjs.hash(otp, 12);
    const newOTP = await OTP.create({
      email,
      otp: hashedOTP,
      name: "forget_password_otp",
    });

    var transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verification",
      html: `<p>Your OTP code is ${otp}</p>`, // all data to be sent
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else return null; //console.log(info);
    });

    res
      .status(200)
      .json({
        result: newOTP,
        otp,
        message: "forget_password_otp send successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({
        message: "error in sendForgetPasswordOTP - controllers/user.js",
        error,
        success: false,
      });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("hi cpwd");
    console.log(req.body);
    const { email, password, otp } = req.body;
    if (!email || !password || !otp)
      return res
        .status(400)
        .json({
          message: "make sure to provide all the fieds ( email, password, otp)",
          success: false,
        });
    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({
          message: `email pattern failed. Please provide a valid email.`,
          success: false,
        });

    const findedUser = await User.findOne({ email });
    if (!findedUser)
      return res
        .status(400)
        .json({
          message: `user with email ${email} is not exist `,
          success: false,
        });

    const otpHolder = await OTP.find({ email });
    if (otpHolder.length == 0)
      return res
        .status(400)
        .json({ message: "you have entered an expired otp", success: false });

    const forg_pass_otps = otpHolder.filter(
      (otp) => otp.name == "forget_password_otp"
    ); // otp may be sent multiple times to user. So there may be multiple otps with user email stored in dbs. But we need only last one.
    const findedOTP = forg_pass_otps[forg_pass_otps.length - 1];

    const plainOTP = otp;
    const hashedOTP = findedOTP.otp;

    const isValidOTP = await bcryptjs.compare(plainOTP, hashedOTP);

    if (isValidOTP) {
      const hashedPassword = await bcryptjs.hash(password, 12);
      const result = await User.findByIdAndUpdate(
        findedUser._id,
        { name: findedUser.name, email, password: hashedPassword },
        { new: true }
      );

      await OTP.deleteMany({ email: findedOTP.email });

      return res
        .status(200)
        .json({
          result,
          message: "password changed successfully",
          success: true,
        });
    } else {
      return res.status(200).json({ message: "wrong otp", success: false });
    }
  } catch (error) {
    res
      .status(404)
      .json({
        message: "error in changePassword - controllers/user.js",
        error,
        success: false,
      });
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
