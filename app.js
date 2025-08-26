if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const bookingRouter = require("./routes/booking");
const userRouter = require("./routes/user.js");

// MongoDB URL from .env or config
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: "mysupersecretcode"
    },
    touchAfter: 24 * 3600, // time period in seconds
});

store.on("error", function (e) {
    console.log("Session store error", e);
});

const sessionOptions = {
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Global Middleware: set currUser and flash messages
app.use((req, res, next) => {
    res.locals.currUser = req.user || null;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// ✅ Routes
app.use("/listings", listingRouter);                // Listings router mounted at /listings
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

// Error Handler
app.use((err, req, res, next) => {
    let statusCode = err.statusCode;
    let message = err.message || "Something went wrong";

    if (!statusCode || typeof statusCode !== 'number') {
        statusCode = 500;
    }

    res.status(statusCode).render("error", { message });
});

// Start server
app.listen(9000, () => {
    console.log("Server is running on port 9000");
});
