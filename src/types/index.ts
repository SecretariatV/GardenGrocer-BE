import { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  googleId?: string;
  confirmationToken: string | undefined;
  isVerifed: boolean;
  role: number;
}
