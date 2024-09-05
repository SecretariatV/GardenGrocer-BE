import { Request, Response } from "express";
import User from "models/User";

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/login");
  });
};

export default { register, logout };
