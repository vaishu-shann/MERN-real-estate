import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';




export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};


export const signin = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body", req.body)
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  try {

    const userDoc = await User.findOne({ email });
    console.log("userDoc", userDoc)
    console.log("userDoc.doc", userDoc._doc)
    const passOk = bcryptjs.compareSync(password, userDoc.password);
    const { ...rest } = userDoc._doc;
    if (passOk) {
      jwt.sign({ id: userDoc._id }, "jwt_secretKey", {}, (err, token) => {
        if (err) throw err;
        res.cookie('access_token', token, { httpOnly: true }).status(200).json(rest);
      });
    } else {
      res.status(400).json('email or password is not valid');
    }
  } catch (e) {
    console.log("error in signin", e)
  }
};


export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, config.JWT_TOKEN);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, config.JWT_TOKEN);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

