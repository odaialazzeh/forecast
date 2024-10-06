import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Record from "./recordModel.js"; // Import Record model

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    image: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash the password if it's modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Middleware to delete all records associated with the user when user is deleted
userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    await Record.deleteMany({ user: this._id }); // Delete all records linked to the user
    next();
  }
);

const User = mongoose.model("User", userSchema);

export default User;
