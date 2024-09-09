import logger from "config/logger";
import { Request, Response } from "express";
import crypto from "crypto";
import User from "models/User";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:4000/auth/google/callback"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.error("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const confirmationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password,
      confirmationToken,
    });
    await newUser.save();

    /**
     * Implement sned email using sendmailer
     * but have got some errors
     */
    // const confirmationUrl = `http://localhost:3000/confirm?token=${confirmationToken}`;

    /*
    const accessToken = await oauth2Client.getAccessToken();


    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        accessToken: accessToken.token,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      } as any,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Please confirm your email",
      html: `<p>Click <a href="${confirmationUrl}">here</a> to confirm your email address.</p>`,
    });
    */

    logger.info(`Success register user: ${email}`);
    return res.status(200).json({ message: "Register your account." });
  } catch (error) {
    logger.error(`Error registering user: ${error}`);
    res.status(500).json({ message: "Error registering user" });
  }
};

const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/login");
  });
};

const confirm = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      logger.error("Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerifed = true;
    user.confirmationToken = undefined;
    await user.save();

    logger.info(`Confirm user: ${user.email}`);
    return res.status(201).json({ confirm: true });
  } catch (error) {
    logger.error(`Error confirming user: ${error}`);
    res.status(500).json({ message: "Error confirming email" });
  }
};

export default { register, logout, confirm };
