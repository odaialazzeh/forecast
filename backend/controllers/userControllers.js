import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const RegisterUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, phone, whatsapp, image } =
    req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    first_name,
    last_name,
    email,
    password,
    phone,
    whatsapp,
    image,
  });

  if (user) {
    generateToken(res, user._id); // Set token as HTTP-only cookie
    res.status(201).json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      whatsapp: user.whatsapp,
      image: user.image,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(401);
    throw new Error("No such user");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.first_name = req.body.firstname || user.first_name;
    user.last_name = req.body.lastname || user.last_name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.whatsapp = req.body.whatsapp || user.whatsapp;
    user.image = req.body.image || user.image;

    // Only update the password if it's provided and not empty
    if (req.body.password && req.body.password.trim() !== "") {
      user.password = req.body.password;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      whatsapp: updatedUser.whatsapp,
      image: updatedUser.image,
      isAdmin: updatedUser.isAdmin,
      message: "User updated successfully",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  RegisterUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  logoutUser,
};
