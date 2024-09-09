import mongoose, { CallbackError, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "types";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  confirmationToken: { type: String },
  isVerifed: { type: Boolean, default: false },
  role: { type: Number, required: true, default: 1 },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as CallbackError);
  }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
