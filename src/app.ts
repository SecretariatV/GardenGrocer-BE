import express from "express";
import session from "express-session";
import requestLogger from "middlewares/requestLogger";
import passport from "passport";
import cors from "cors";
import authRoutes from "routes/auth";
import "config/passport";

const corsOption = {
  origin: `http://localhost:3000`,
  credentials: true,
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

// Cors middleware
app.use(cors(corsOption));

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.use("/auth", authRoutes);

// Home and Profile routes
app.get("/", (req, res) => res.send("Home Page"));

app.get("/confirm", (req, res) => {
  const user = req.user as any;
  if (!req.isAuthenticated()) {
    return res.redirect("http://localhost:3000/register");
  }

  const confirmationToken = user.confirmationToken;
  if (confirmationToken) {
    const confirmationUrl = `http://localhost:3000/confirm?token=${encodeURIComponent(
      confirmationToken
    )}`;
    return res.redirect(confirmationUrl);
  } else {
    return res.redirect("http://localhost:3000");
  }
});

app.get("/register", (req, res) => {
  return res.redirect("http://localhost:3000/register");
});

export default app;
