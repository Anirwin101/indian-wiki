require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const redis = require('redis');
const RedisStore = require('connect-redis').default;
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 1️⃣ Initialize Redis client
let redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

// 🔹 2️⃣ Session Configuration with Redis Store
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1-hour session
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax"
    }
  })
);

// 🔹 3️⃣ Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 4️⃣ MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://reachanirwin:secret13@indianwikicluster.4lfjbfc.mongodb.net/?retryWrites=true&w=majority&appName=IndianWikiCluster';

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 30000
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// 🔹 5️⃣ Authentication Middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/signup");
}

// 🔹 6️⃣ Routes
// Authentication Routes
app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "public", "signup.html")));

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).send("❌ User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ username, email, password: hashedPassword }).save();

    res.redirect("/login");
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("❌ Invalid email or password");
    }

    req.session.userId = user._id;
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session Save Error:", err);
        return res.status(500).send("Session Error");
      }
      res.redirect("/");
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send("Error logging out");
    res.redirect('/');
  });
});

// Protected Routes
app.get("/", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

// API Endpoint
app.post("/submit-rating", (req, res) => {
  const { rating } = req.body;
  console.log(`User submitted rating: ${rating} stars`);
  res.json({ message: "Rating received!" });
});

// State and City Routes (DRY - Don't Repeat Yourself version)
const states = [
  'andhra', 'arunachal', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat',
  'haryana', 'himachal', 'jharkhand', 'karnataka', 'kerala', 'madhya',
  'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha',
  'punjab', 'rajasthan', 'sikkim', 'tamilnadu', 'telangana', 'uttarakhand',
  'uttarpradesh', 'westbengal'
];

const cities = [
  'hyderabad', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'ahmedabad',
  'pune', 'jaipur', 'lucknow', 'delhi', 'kochi', 'surat'
];

// Generate state routes dynamically
states.forEach(state => {
  app.get(`/states/${state}`, isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public", `${state}.html`));
  });
});

// Generate city routes dynamically
cities.forEach(city => {
  app.get(`/cities/${city}`, isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public", `${city}.html`));
  });
});

// Additional static routes
app.get("/bharatify", (req, res) => res.sendFile(path.join(__dirname, "public", "bharatify.html")));
app.get("/oops", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "oops.html")));
app.get('/states', (req, res) => res.sendFile(__dirname + '/public/states.html'));

// 🔹 7️⃣ Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));