const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ Logging to debug
console.log("Listings router loaded");

router.use((req, res, next) => {
    console.log(`[Listing Router] ${req.method} ${req.originalUrl}`);
    next();
});

// ✅ Search route - must come before /:id
router.get("/search", wrapAsync(listingController.searchListings));

// ✅ Listings routes
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// ✅ New listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);



// ✅ Render fake payment page
router.get("/:id/payment", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    res.render("listings/payment", { listing });
}));




router.post("/:id/pay", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // This is where you'd normally process the payment logic

    req.flash("success", "Payment successful! Your booking is confirmed.");
    res.redirect(`/listings/${id}`);
}));




// ✅ Detail, Update, Delete
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// ✅ Edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// ✅ Book Now route (added inside listingRouter)
router.post("/:id/book", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    req.flash("success", "Booking successful!");
    res.redirect(`/listings/${id}`);
}));




// New route: listings by category filter
router.get("/category/:category", catchAsync(async (req, res) => {
  const { category } = req.params;

  // Validate category against enum (optional, for safety)
  const categories = [
    "Trending",
    "Rooms",
    "Iconic cities",
    "Mountains",
    "Castles",
    "Amazing pools",
    "Camping",
    "Farms",
    "Arctic Pools",
  ];

  if (!categories.includes(category)) {
    req.flash("error", "Invalid category");
    return res.redirect("/listings");
  }

  const listings = await Listing.find({ category });

  res.render("listings/index", { allListings: listings, filterCategory: category });
}));



module.exports = router;
