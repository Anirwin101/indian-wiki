const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔹 1️⃣ Middleware & Configurations
app.use(
    session({
        secret: "supersecretkey",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60, // 1-hour session
            httpOnly: true, // Prevents client-side JS from accessing it
            secure: false, // Set to true if using HTTPS
            sameSite: "lax" // Helps with cross-site requests
        }
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 2️⃣ Connect to MongoDB
dotenv.config(); // Load environment variables
const mongoURI = process.env.MONGODB_URI; // This will pull the value from Render's environment variables

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// 🔹 3️⃣ Middleware for Authentication
function isAuthenticated(req, res, next) {
    console.log("🔍 Session Data:", req.session); // Debugging session
    if (req.session.userId) {
        console.log("✅ User is logged in:", req.session.userId);
        return next();
    }
    console.log("❌ No user session, redirecting to /signup");
    res.redirect("/signup");
}

// 🔹 4️⃣ Authentication Routes
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
            console.log("✅ Session created:", req.session);
            res.redirect("/");
        });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
});

app.post("/submit-rating", (req, res) => {
    const { rating } = req.body;
    console.log(`User submitted rating: ${rating} stars`);
    res.json({ message: "Rating received!" });
});

// 🔹 5️⃣ Protected Routes
app.get("/", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.get("/bharatify", (req, res) => res.sendFile(path.join(__dirname, "public", "bharatify.html")));

app.get("/oops", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "oops.html")));

app.get('/states', (req, res) => {
    res.sendFile(__dirname + '/public/states.html'); 
});

app.get("/cities", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "cities.html")));

app.get("/cities/hyderabad", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "hyderabad.html")));

app.get("/cities/mumbai", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "mumbai.html")));

app.get("/cities/bangalore", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "bangalore.html")));

app.get("/cities/chennai", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "chennai.html")));

app.get("/cities/kolkata", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "kolkata.html")));

app.get("/cities/ahmedabad", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "ahmedabad.html")));

app.get("/cities/pune", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "pune.html")));

app.get("/cities/jaipur", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "jaipur.html")));

app.get("/cities/lucknow", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "lucknow.html")));

app.get("/cities/delhi", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "delhi.html")));

app.get("/cities/kochi", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "kochi.html")));

app.get("/cities/surat", isAuthenticated, (req, res) => res.sendFile(path.join(__dirname, "public", "surat.html")));

app.get("/states/andhra", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/andhra");
    res.sendFile(path.join(__dirname, "public", "andhra.html"));
});
app.get("/states/arunachal", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/arunachal");
    res.sendFile(path.join(__dirname, "public", "arunachal.html"));
});
app.get("/states/assam", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/assam");
    res.sendFile(path.join(__dirname, "public", "assam.html"));
});
app.get("/states/bihar", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/bihar");
    res.sendFile(path.join(__dirname, "public", "bihar.html"));
});
app.get("/states/chhattisgarh", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/chhattisgarh");
    res.sendFile(path.join(__dirname, "public", "chhattisgarh.html"));
});
app.get("/states/goa", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/goa");
    res.sendFile(path.join(__dirname, "public", "goa.html"));
});
app.get("/states/gujarat", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/gujarat");
    res.sendFile(path.join(__dirname, "public", "gujarat.html"));
});
app.get("/states/haryana", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/haryana");
    res.sendFile(path.join(__dirname, "public", "haryana.html"));
});
app.get("/states/himachal", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/himachal");
    res.sendFile(path.join(__dirname, "public", "himachal.html"));
});
app.get("/states/jharkhand", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/jharkhand");
    res.sendFile(path.join(__dirname, "public", "jharkhand.html"));
});
app.get("/states/karnataka", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/karnataka");
    res.sendFile(path.join(__dirname, "public", "karnataka.html"));
});
app.get("/states/kerala", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/kerala");
    res.sendFile(path.join(__dirname, "public", "kerala.html"));
});
app.get("/states/madhya", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/madhya");
    res.sendFile(path.join(__dirname, "public", "madhya.html"));
});
app.get("/states/maharashtra", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/maharashtra");
    res.sendFile(path.join(__dirname, "public", "maharashtra.html"));
});
app.get("/states/manipur", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/manipur");
    res.sendFile(path.join(__dirname, "public", "manipur.html"));
});
app.get("/states/meghalaya", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/meghalaya");
    res.sendFile(path.join(__dirname, "public", "meghalaya.html"));
});
app.get("/states/mizoram", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/mizoram");
    res.sendFile(path.join(__dirname, "public", "mizoram.html"));
});
app.get("/states/nagaland", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/nagaland");
    res.sendFile(path.join(__dirname, "public", "nagaland.html"));
});
app.get("/states/odisha", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/odisha");
    res.sendFile(path.join(__dirname, "public", "odisha.html"));
});
app.get("/states/punjab", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/punjab");
    res.sendFile(path.join(__dirname, "public", "punjab.html"));
});
app.get("/states/rajasthan", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/rajasthan");
    res.sendFile(path.join(__dirname, "public", "rajasthan.html"));
});
app.get("/states/sikkim", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/sikkim");
    res.sendFile(path.join(__dirname, "public", "sikkim.html"));
});
app.get("/states/tamilnadu", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/tamilnadu");
    res.sendFile(path.join(__dirname, "public", "tamilnadu.html"));
});
app.get("/states/telangana", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/telangana");
    res.sendFile(path.join(__dirname, "public", "telangana.html"));
});
app.get("/states/uttarakhand", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/uttarakhand");
    res.sendFile(path.join(__dirname, "public", "uttarakhand.html"));
});
app.get("/states/uttarpradesh", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/uttarpradesh");
    res.sendFile(path.join(__dirname, "public", "uttarpradesh.html"));
});
app.get("/states/westbengal", isAuthenticated, (req, res) => {
    console.log("✅ Accessing /states/westbengal");
    res.sendFile(path.join(__dirname, "public", "westbengal.html"));
});

// 🔹 6️⃣ Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
