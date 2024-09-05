import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import connectDB from "config/db";
import requestLogger from "middlewares/requestLogger";
import passport from "passport";
import authRoutes from "routes/auth";
import "config/passport";

dotenv.config();

connectDB();

const corsOption = {
  origin: `http://localhost:`,
};

const app = express();

// Session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Logger middleware
app.use(requestLogger);

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.use("/auth", authRoutes);

// Home and Profile routes
app.get("/", (req, res) => res.send("Home Page"));
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login");
  }
  res.send("Profile Page");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
